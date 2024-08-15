import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

// Schemas
import { Modulo } from '../modulo/schemas/modulo.schema';
import { Formulario } from '../formulario/schemas/formulario.schema';
import { Seccion } from '../seccion/schemas/seccion.schema';
import { ElementoPersonalizado } from '../elemento_personalizado/schemas/elemento_personalizado.schema';
import { ElementoHtml } from '../elemento-html/schemas/elemento-html.schema';

// DTOs
import { FormularioDto } from '../formulario/dto/formulario.dto';
import { SeccionDto } from '../seccion/dto/seccion.dto';
import { ElementoPersonalizadoDto } from '../elemento_personalizado/dto/elemento_personalizado.dto';

// Services
import { FormularioService } from '../formulario/formulario.service';
import { SeccionService } from '../seccion/seccion.service';
import { ElementoPersonalizadoService } from '../elemento_personalizado/elemento_personalizado.service';

@Injectable()
export class PlantillaService {
  constructor(
    @InjectModel(Modulo.name)
    private readonly ModuloModel: Model<Modulo>,
    @InjectModel(Formulario.name)
    private readonly formularioModel: Model<Formulario>,
    private readonly formularioService: FormularioService,
    @InjectModel(Seccion.name) private readonly seccionModel: Model<Seccion>,
    private readonly seccionService: SeccionService,
    @InjectModel(ElementoPersonalizado.name)
    private readonly elementoPersonalizadoModel: Model<ElementoPersonalizado>,
    private readonly elementoPersonalizadoService: ElementoPersonalizadoService,
    @InjectModel(ElementoHtml.name)
    private readonly elementoHtmlModel: Model<ElementoHtml>,
  ) {}

  async createTemplate(template: any): Promise<any> {
    if (typeof template !== 'object' || template === null) {
      throw new TypeError('Expected an object for template');
    }

    const { modulo_id, formulario } = template;
    let newFormulario;
    const seccionIds = [];
    const elementoIds = [];
    let version;

    try {
      const modulo = await this.findModulo(modulo_id);

      // Validación de todos los elementos HTML antes de crear el formulario
      await this.validateElementosHtml(formulario.seccion);

      const formularioDto: FormularioDto = {
        ...formulario,
        version_actual: false,
        activo: true,
        modulo_id: modulo._id,
        version: 0,
      };

      newFormulario = await this.formularioService.post(formularioDto);

      // Crear secciones y elementos personalizados asociados al nuevo formulario
      await this.createSections(
        formulario.seccion,
        newFormulario._id,
        null,
        seccionIds,
        elementoIds,
      );

      version = await this.updateExistingFormularios(modulo._id);

      // Asignar la nueva versión y marcar como versión actual
      await this.formularioModel.findByIdAndUpdate(newFormulario._id, {
        version_actual: true,
        version,
      });

      return { message: 'Template created successfully', version };
    } catch (error) {
      // Rollback, eliminar registros incompletos
      if (newFormulario) {
        await this.formularioModel.findByIdAndDelete(newFormulario._id);
      }

      if (seccionIds.length > 0) {
        await this.seccionModel.deleteMany({ _id: { $in: seccionIds } });
      }

      if (elementoIds.length > 0) {
        await this.elementoPersonalizadoModel.deleteMany({
          _id: { $in: elementoIds },
        });
      }

      throw new Error(`Error creating the form: ${error.message}`);
    }
  }

  private async validateElementosHtml(secciones: any[]) {
    for (const seccionData of secciones) {
      const { elemento_personalizado, seccion } = seccionData;

      if (elemento_personalizado && elemento_personalizado.length > 0) {
        for (const elementoData of elemento_personalizado) {
          const { elemento_html_id } = elementoData;

          // Validar existencia de elemento_html
          const elementoHtml = await this.elementoHtmlModel
            .findById(elemento_html_id)
            .exec();
          if (!elementoHtml) {
            throw new NotFoundException(
              `ElementoHtml with id ${elemento_html_id} not found`,
            );
          }
        }
      }

      // Validar sub-secciones recursivamente
      if (seccion && seccion.length > 0) {
        await this.validateElementosHtml(seccion);
      }
    }
  }

  private async createSections(
    secciones: any[],
    formulario_id: Types.ObjectId,
    parent_id: Types.ObjectId | null,
    seccionIds: Types.ObjectId[],
    elementoIds: Types.ObjectId[],
  ) {
    for (const seccionData of secciones) {
      const { elemento_personalizado, seccion } = seccionData;
      const seccionDto: SeccionDto = {
        ...seccionData,
        activo: true,
        formulario_id,
        padre_id: parent_id,
      };
      const newSeccion = await this.seccionService.post(seccionDto);
      seccionIds.push(newSeccion._id);

      // Crear elementos personalizados para esta sección
      if (elemento_personalizado && elemento_personalizado.length > 0) {
        await this.createElementosPersonalizados(
          elemento_personalizado,
          newSeccion._id,
          elementoIds,
        );
      }

      // Crear sub-secciones recursivamente
      if (seccion && seccion.length > 0) {
        await this.createSections(
          seccion,
          formulario_id,
          newSeccion._id,
          seccionIds,
          elementoIds,
        );
      }
    }
  }

  private async createElementosPersonalizados(
    elementos: any[],
    seccion_id: Types.ObjectId,
    elementoIds: Types.ObjectId[],
  ) {
    for (const elementoData of elementos) {
      const elementoPersonalizadoDto: ElementoPersonalizadoDto = {
        ...elementoData,
        activo: true,
        seccion_id,
        elemento_html_id: elementoData.elemento_html_id,
      };

      const newElementoPersonalizado =
        await this.elementoPersonalizadoService.post(elementoPersonalizadoDto);
      elementoIds.push(newElementoPersonalizado._id);
    }
  }

  private async findModulo(modulo_id: string): Promise<Modulo> {
    const modulo = await this.ModuloModel.findOne({ _id: modulo_id }).exec();
    if (!modulo) {
      throw new NotFoundException(`Module with id ${modulo_id} not found`);
    }
    return modulo;
  }

  private async updateExistingFormularios(
    modulo_id: Types.ObjectId,
  ): Promise<number> {
    const existingFormularios = await this.formularioModel
      .find({ modulo_id })
      .exec();
    const version = existingFormularios.length + 1;

    await this.formularioModel.updateMany(
      { modulo_id, version_actual: true },
      { version_actual: false },
    );

    return version;
  }

  async getTemplate(modulo_id: string, version?: number): Promise<any> {
    // Convertir modulo_id a ObjectId si es válido
    const moduloIdQuery = Types.ObjectId.isValid(modulo_id)
      ? new Types.ObjectId(modulo_id)
      : modulo_id;

    // Obtener el formulario basado en el módulo y la versión
    const formulario = await this.formularioModel
      .findOne(
        version !== undefined
          ? { modulo_id: moduloIdQuery, version }
          : { modulo_id: moduloIdQuery, version_actual: true },
      )
      .exec();

    if (!formulario) {
      throw new NotFoundException(
        `Form with modulo_id ${modulo_id} and version ${version} not found`,
      );
    }

    // Obtener las secciones del formulario
    const secciones = await this.seccionModel
      .find({ formulario_id: formulario._id })
      .exec();

    // Obtener los elementos personalizados de cada sección con populate de elemento_html_id
    const elementosPersonalizados = await this.elementoPersonalizadoModel
      .find({ seccion_id: { $in: secciones.map((seccion) => seccion._id) } })
      .populate('elemento_html_id')
      .exec();

    // Construir la estructura jerárquica
    const seccionesMap = new Map();
    secciones.forEach((seccion) => {
      seccionesMap.set(seccion._id.toString(), seccion);
    });

    const buildHierarchy = (seccionId: string) => {
      const seccion = seccionesMap.get(seccionId);
      if (!seccion) return null;

      const elementos = elementosPersonalizados
        .filter((elemento) => elemento.seccion_id.toString() === seccionId)
        .map((elemento) => ({
          _id: elemento._id,
          nombre: elemento.nombre,
          descripcion: elemento.descripcion,
          elemento_html: elemento.elemento_html_id, // Elemento HTML poblado
          label: elemento.label,
          deshabilitado: elemento.deshabilitado,
          solo_lectura: elemento.solo_lectura,
          requerido: elemento.requerido,
          validadores_personalizados: elemento.validadores_personalizados,
          parametros_personalizados: elemento.parametros_personalizados,
          dependencia: elemento.dependencia,
        }));

      const subSecciones = secciones
        .filter((subSeccion) => subSeccion.padre_id?.toString() === seccionId)
        .map((subSeccion) => buildHierarchy(subSeccion._id.toString()))
        .filter((subSeccion) => subSeccion !== null);

      return {
        _id: seccion._id,
        nombre: seccion.nombre,
        descripcion: seccion.descripcion,
        label: seccion.label,
        activo: seccion.activo,
        fecha_creacion: seccion.fecha_creacion,
        fecha_modificacion: seccion.fecha_modificacion,
        ...(elementos.length > 0 && { elemento_personalizado: elementos }),
        ...(subSecciones.length > 0 && { seccion: subSecciones }),
      };
    };

    const formularioJson = {
      modulo_id: modulo_id,
      formulario: {
        _id: formulario._id,
        nombre: formulario.nombre,
        descripcion: formulario.descripcion,
        version: formulario.version,
        creado_por_id: formulario.creado_por_id,
        traduccion: formulario.traduccion,
        label: formulario.label,
        activo: formulario.activo,
        fecha_creacion: formulario.fecha_creacion,
        fecha_modificacion: formulario.fecha_modificacion,
        seccion: secciones
          .filter((seccion) => !seccion.padre_id) // Filtrar secciones sin padre
          .map((seccion) => buildHierarchy(seccion._id.toString()))
          .filter((seccion) => seccion !== null),
      },
    };

    return formularioJson;
  }

  async deleteTemplate(modulo_id: string, version: number): Promise<string> {
    // Encontrar el formulario a eliminar basado en el modulo_id y la versión
    const formulario = await this.formularioModel
      .findOne({ modulo_id: new Types.ObjectId(modulo_id), version })
      .exec();

    if (!formulario) {
      throw new NotFoundException(
        `Form with modulo_id ${modulo_id} and version ${version} not found`,
      );
    }

    const isCurrentVersion = formulario.version_actual;

    // Eliminación lógica del formulario
    await this.formularioService.delete(formulario._id.toString());

    // Secciones asociadas al formulario
    const secciones = await this.seccionModel
      .find({ formulario_id: formulario._id })
      .exec();

    for (const seccion of secciones) {
      // Eliminación lógica de cada sección
      await this.seccionService.delete(seccion._id.toString());

      //Elementos personalizados asociados a la sección
      const elementosPersonalizados = await this.elementoPersonalizadoModel
        .find({ seccion_id: seccion._id })
        .exec();

      for (const elemento of elementosPersonalizados) {
        // Eliminación lógica de cada elemento personalizado
        await this.elementoPersonalizadoService.delete(elemento._id.toString());
      }

      console.log(isCurrentVersion);
      // Si el formulario es la versión actual, cambia a false y actualiza la nueva versión actual
      if (isCurrentVersion) {
        await this.changeCurrentVersion(modulo_id, formulario._id);
      }
    }

    return `Template with modulo_id ${modulo_id} and version ${version} deleted successfully`;
  }

  private async changeCurrentVersion(
    modulo_id: string,
    formulario_id: Types.ObjectId,
  ) {
    await this.formularioModel.updateOne(
      { _id: formulario_id },
      { version_actual: false },
    );

    // Buscar la última versión activa disponible
    const lastActiveFormulario = await this.formularioModel
      .findOne({ modulo_id: new Types.ObjectId(modulo_id), activo: true })
      .sort({ version: -1 }) // Ordenar por versión descendente para obtener la última versión
      .exec();

    if (lastActiveFormulario) {
      await this.formularioModel.updateOne(
        { _id: lastActiveFormulario._id },
        { version_actual: true },
      );
    }
  }
}
