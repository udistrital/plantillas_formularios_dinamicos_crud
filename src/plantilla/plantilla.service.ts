import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';

// Schemas
import { Modulo } from '../modulo/schemas/modulo.schema';
import { Formulario } from '../formulario/schemas/formulario.schema';
import { Seccion } from '../seccion/schemas/seccion.schema';
import { Campo } from 'src/campo/schemas/campo.schema';

// DTOs
import { FormularioDto } from '../formulario/dto/formulario.dto';
import { SeccionDto } from '../seccion/dto/seccion.dto';
import { CampoDto } from 'src/campo/dto/campo.dto';
import { FilterDto } from 'src/filters/filters.dto';

// Services
import { FormularioService } from '../formulario/formulario.service';
import { SeccionService } from '../seccion/seccion.service';
import { CampoService } from 'src/campo/campo.service';
import { FiltersService } from 'src/filters/filters.service';

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
    @InjectModel(Campo.name)
    private readonly campoModel: Model<Campo>,
    private readonly campoService: CampoService,
  ) { }

  async createTemplate(template: any): Promise<any> {
    if (typeof template !== 'object' || template === null) {
      throw new TypeError('Se esperaba un objeto para la plantilla');
    }

    const { modulo_id, formulario } = template;
    const seccionIds = [];
    let newFormulario: Formulario;
    let previousVersion: number | null = null;

    try {
      // Encuentra el módulo
      const modulo = await this.findModulo(modulo_id);

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

      // Crear secciones y campos
      await this.createSections(formulario.seccion, newFormulario._id, null, seccionIds);

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

  private async createSections(
    secciones: any[],
    formulario_id: Types.ObjectId,
    parent_id: Types.ObjectId | null,
    seccionIds: Types.ObjectId[],
  ) {
    for (const seccionData of secciones) {
      const { campo, seccion } = seccionData;
      const seccionDto: SeccionDto = {
        ...seccionData,
        activo: true,
        formulario_id,
        padre_id: parent_id,
      };
      const newSeccion = await this.seccionService.post(seccionDto);
      seccionIds.push(newSeccion._id);

      // Crear campos para esta sección
      if (campo && campo.length > 0) {
        await this.createCampos(campo, newSeccion._id);
      }

      // Crear sub-secciones recursivamente
      if (seccion && seccion.length > 0) {
        await this.createSections(seccion, formulario_id, newSeccion._id, seccionIds);
      }
    }
  }

  private async createCampos(
    campos: any[],
    seccion_id: Types.ObjectId,
  ) {
    for (const camposData of campos) {
      const campoDto: CampoDto = {
        ...camposData,
        activo: true,
        seccion_id,
        validacion: camposData.validaciones || camposData.validacion || [],
        parametro: camposData.parametros || camposData.parametro || {}
      };

      await this.campoService.post(campoDto);
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


  async getAllTemplate(filterDto: FilterDto): Promise<any> {
    const filtersService = new FiltersService(filterDto);

    let populateFields = [];
    if (filtersService.isPopulated()) {
      populateFields = this.populateFields();
    }

    // Contar el total de formularios
    const registros = await this.formularioModel
      .countDocuments(filtersService.getQuery())
      .exec();

    const formularios = await this.formularioModel
      .find(
        filtersService.getQuery(),
        filtersService.getFields(),
        filtersService.getLimitAndOffset(),
      )
      .select('modulo_id formulario_id periodo_id version version_actual') 
      .sort(filtersService.getSortBy())
      .populate(populateFields)
      .exec();

    return {
      metadata: {
        registros, 
      },
      formularios, 
    };
  }

  private populateFields(): any[] {
    return [{ path: 'modulo_id' }];
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

    // Obtener los campos de cada sección
    const campos = await this.campoModel
      .find({ seccion_id: { $in: secciones.map((seccion) => seccion._id) } })
      .exec();

    // Construir la estructura jerárquica
    const seccionesMap = new Map();
    secciones.forEach((seccion) => {
      seccionesMap.set(seccion._id.toString(), seccion);
    });

    const buildHierarchy = (seccionId: string) => {
      const seccion = seccionesMap.get(seccionId);
      if (!seccion) return null;

      const elementos = campos
        .filter((campo) => campo.seccion_id.toString() === seccionId)
        .map((campo) => ({
          _id: campo._id,
          nombre: campo.nombre,
          descripcion: campo.descripcion,
          etiqueta: campo.label,
          tipo: campo.tipo,
          deshabilitado: campo.deshabilitado,
          solo_lectura: campo.solo_lectura,
          validaciones: campo.validacion,
          parametros: campo.parametro, 	
          dependencia: campo.dependencia,
        }));

      const subSecciones = secciones
        .filter((subSeccion) => subSeccion.padre_id?.toString() === seccionId)
        .map((subSeccion) => buildHierarchy(subSeccion._id.toString()))
        .filter((subSeccion) => subSeccion !== null);

      return {
        _id: seccion._id,
        nombre: seccion.nombre,
        descripcion: seccion.descripcion,
        etiqueta: seccion.label,
        icono: seccion.icono,
        activo: seccion.activo,
        fecha_creacion: seccion.fecha_creacion,
        fecha_modificacion: seccion.fecha_modificacion,
        ...(elementos.length > 0 && { campos: elementos }),
        ...(subSecciones.length > 0 && { secciones: subSecciones }),
      };
    };

    const formularioJson = {
      modulo_id: modulo_id,
      formulario: {
        _id: formulario._id,
        nombre: formulario.nombre,
        descripcion: formulario.descripcion,
        version: formulario.version,
        periodo_id: formulario.periodo_id,
        creado_por_id: formulario.creado_por_id,
        traduccion: formulario.traduccion,
        etiqueta: formulario.label,
        activo: formulario.activo,
        fecha_creacion: formulario.fecha_creacion,
        fecha_modificacion: formulario.fecha_modificacion,
        secciones: secciones
          .filter((seccion) => !seccion.padre_id) // Filtrar secciones sin padre
          .map((seccion) => buildHierarchy(seccion._id.toString()))
          .filter((seccion) => seccion !== null),
      },
    };

    return formularioJson;
  }

  // Realiza la eliminacion logica de todos los elementos relacionados a una plantilla
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
      // Eliminación lógica de los campos asociados a las secciones
      await this.campoModel.updateMany(
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

  private async disableFormulario(formularioId: ObjectId) {
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
