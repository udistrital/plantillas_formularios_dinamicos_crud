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

  async almacenarFormulario(template: any): Promise<any> {
    if (typeof template !== 'object' || template === null) {
      throw new TypeError('Expected an object for template');
    }

    const { modulo_id, formulario } = template;

    const modulo = await this.findModulo(modulo_id);

    const version = await this.updateExistingFormularios(modulo._id);

    const formularioDto: FormularioDto = {
      ...formulario,
      version_actual: true,
      activo: true,
      modulo_id: modulo._id,
      version,
    };

    try {
      // Crear nuevo formulario
      const newFormulario = await this.formularioService.post(formularioDto);

      // Crear secciones y elementos personalizados asociados al nuevo formulario
      await this.createSections(formulario.seccion, newFormulario._id, null);

      return { message: 'Template created successfully', version };
    } catch (error) {
      throw new Error(`Error creating the form: ${error.message}`);
    }
  }

  // Encuentra el modulo relacionado al formulario por su nombre
  private async findModulo(modulo_id: string): Promise<Modulo> {
    const modulo = await this.ModuloModel.findOne({
      _id: modulo_id,
    }).exec();
    if (!modulo) {
      throw new NotFoundException(`Module with id ${modulo_id} not found`);
    }
    return modulo;
  }

  // Actualiza el número de versión y las versiones anteriores del formulario
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

  // Crea las secciones especificadas en la plantilla
  private async createSections(
    secciones: any[],
    formulario_id: Types.ObjectId,
    parent_id: Types.ObjectId | null,
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

      // Crear elementos personalizados para esta sección
      if (elemento_personalizado && elemento_personalizado.length > 0) {
        await this.createElementosPersonalizados(
          elemento_personalizado,
          newSeccion._id,
        );
      }

      // Crear sub-secciones recursivamente
      if (seccion && seccion.length > 0) {
        await this.createSections(seccion, formulario_id, newSeccion._id);
      }
    }
  }

  private async createElementosPersonalizados(
    elementos: any[],
    seccion_id: Types.ObjectId,
  ) {
    for (const elementoData of elementos) {
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

      const elementoPersonalizadoDto: ElementoPersonalizadoDto = {
        ...elementoData,
        activo: true,
        seccion_id,
        elemento_html_id: elemento_html_id,
      };

      await this.elementoPersonalizadoService.post(elementoPersonalizadoDto);
    }
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
}
