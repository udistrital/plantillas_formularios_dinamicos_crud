import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';

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
      throw new TypeError('Se esperaba un objeto para la plantilla');
    }

    const { modulo_id, formulario } = template;
    const seccionIds = [];
    const elementoIds = [];
    let newFormulario: Formulario;
    let previousVersion: number | null = null;

    try {
      // Encuentra el módulo y valida los elementos HTML
      const modulo = await this.findModulo(modulo_id);
      await this.validateElementosHtml(formulario.seccion);

      // Actualizar versiones anteriores y obtener la nueva versión
      const versionInfo = await this.updateExistingFormularios(modulo._id);
      previousVersion = versionInfo.previousVersion;
      const newVersion = versionInfo.newVersion;

      // Crear el nuevo formulario
      const formularioDto: FormularioDto = {
        ...formulario,
        version_actual: true,
        activo: true,
        modulo_id: modulo._id,
        version: newVersion,
      };

      newFormulario = await this.formularioService.post(formularioDto);

      // Crear secciones y elementos personalizados
      await this.createSections(
        formulario.seccion,
        newFormulario._id,
        null,
        seccionIds,
        elementoIds,
      );

      // Devuelve el mensaje de éxito
      return { message: 'Plantilla creada exitosamente', version: newVersion };
    } catch (error) {
      // Manejar errores y restaurar estado si es necesario
      if (newFormulario) {
        await this.deleteFormularioBD(newFormulario._id);
      }

      if (seccionIds.length > 0) {
        await this.deleteSeccionesBD(seccionIds);
      }

      if (elementoIds.length > 0) {
        await this.deleteElementosPersonalizadosBD(elementoIds);
      }

      // Restaurar la versión anterior si se había establecido
      if (previousVersion !== null) {
        await this.formularioModel.updateMany(
          { modulo_id, version: previousVersion },
          { version_actual: true },
        );
      }

      throw new Error(`Error al crear el formulario: ${error.message}`);
    }
  }

  // Funciones de eliminacion en BD por su ID
  private async deleteFormularioBD(formularioId: ObjectId) {
    if (formularioId) {
      await this.formularioModel.findByIdAndDelete(formularioId);
    }
  }

  // Función para eliminar secciones por sus IDs
  private async deleteSeccionesBD(seccionIds: Array<ObjectId>) {
    if (seccionIds.length > 0) {
      await this.seccionModel.deleteMany({ _id: { $in: seccionIds } });
    }
  }

  // Función para eliminar elementos personalizados por sus IDs
  private async deleteElementosPersonalizadosBD(elementoIds: Array<ObjectId>) {
    if (elementoIds.length > 0) {
      await this.elementoPersonalizadoModel.deleteMany({
        _id: { $in: elementoIds },
      });
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
              `ElementoHtml con id ${elemento_html_id} no encontrado`,
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
      throw new NotFoundException(`Módulo con id ${modulo_id} no encontrado`);
    }
    return modulo;
  }

  private async updateExistingFormularios(
    modulo_id: Types.ObjectId,
  ): Promise<{ previousVersion: number | null; newVersion: number }> {
    // Encuentra la versión máxima actual para el módulo
    const maxVersionDoc = await this.formularioModel
      .findOne({ modulo_id })
      .sort({ version: -1 })
      .exec();

    const previousVersion = maxVersionDoc ? maxVersionDoc.version : null;
    const newVersion = (previousVersion ?? 0) + 1;

    // Desactivar versiones actuales para el módulo
    await this.formularioModel.updateMany(
      { modulo_id, version_actual: true },
      { version_actual: false },
    );

    return { previousVersion, newVersion };
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
        `Formulario con modulo_id ${modulo_id} y versión ${version} no encontrado`,
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

  //Realiza la eliminacion logica de todos los elementos relacionados a una plantilla
  async deleteTemplate(modulo_id: string, version: number): Promise<string> {
    // Encontrar el formulario a eliminar basado en el modulo_id y la versión
    const formulario = await this.formularioModel
      .findOne({ modulo_id: new Types.ObjectId(modulo_id), version })
      .exec();

    if (!formulario) {
      throw new NotFoundException(
        `Formulario con modulo_id ${modulo_id} y versión ${version} no encontrado`,
      );
    }

    const isCurrentVersion = formulario.version_actual;

    // Eliminación lógica del formulario 
    if (formulario) {
      await this.disableFormulario(formulario._id);
    }

    // Obtener los IDs de las secciones asociadas al formulario
    const seccionIds = await this.seccionModel
      .find({ formulario_id: formulario._id })
      .distinct('_id')
      .exec();

    if (seccionIds.length > 0) {
      // Eliminación lógica de los elementos personalizados asociados a las secciones
      await this.elementoPersonalizadoModel.updateMany(
        { seccion_id: { $in: seccionIds } },
        { activo: false },
      );

      // Eliminación lógica de las secciones
      await this.seccionModel.updateMany(
        { formulario_id: formulario._id },
        { activo: false },
      );
    }

    let responseMessage = `Plantilla con modulo_id ${modulo_id} y versión ${version} eliminada exitosamente`;

    // Si el formulario es la versión actual, cambia a false y actualiza la nueva versión actual
    if (isCurrentVersion) {
      const lastActiveFormulario = await this.changeCurrentVersion(
        modulo_id,
        formulario._id,
      );

      if (lastActiveFormulario) {
        responseMessage += `, la versión actual ha sido actualizada a la versión ${lastActiveFormulario.version}.`;
      } else {
        responseMessage += `. La última versión activa ha sido eliminada, y no quedan versiones activas.`;
      }
    }

    return responseMessage;
  }

  private async disableFormulario(formularioId : ObjectId) {
    await this.formularioService.delete(formularioId.toString());
  }

  private async changeCurrentVersion(
    modulo_id: string,
    formulario_id: Types.ObjectId,
  ): Promise<any> {
    await this.formularioModel.updateOne(
      { _id: formulario_id },
      { version_actual: false },
    );

    // Buscar y establecer la última versión activa
    return this.findAndSetLastActiveFormulario(modulo_id);
  }

  private async findAndSetLastActiveFormulario(
    modulo_id: string,
  ): Promise<any> {
    return this.formularioModel
      .findOneAndUpdate(
        { modulo_id: new Types.ObjectId(modulo_id), activo: true },
        { version_actual: true },
        { sort: { version: -1 } },
      )
      .exec();
  }
}
