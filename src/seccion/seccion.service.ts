import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Seccion } from './schemas/seccion.schema';
import { SeccionDto } from './dto/seccion.dto';
import { FilterDto } from '../filters/filters.dto';
import { FiltersService } from '../filters/filters.service';
import { Formulario } from '../formulario/schemas/formulario.schema';

@Injectable()
export class SeccionService {
  constructor(
    @InjectModel(Seccion.name)
    private readonly seccionModel: Model<Seccion>,
    @InjectModel(Formulario.name)
    private readonly formularioModel: Model<Formulario>,
  ) {}

  private async checkRelated(seccionDto: SeccionDto) {
    if (seccionDto.formulario_id) {
      const formulario = await this.formularioModel
        .findById(seccionDto.formulario_id)
        .exec();
      if (!formulario) {
        throw new Error(
          `Formulario with id ${seccionDto.formulario_id} doesn't exist`,
        );
      }
    }
    if (seccionDto.padre_id) {
      const seccionPadre = await this.seccionModel
        .findById(seccionDto.padre_id)
        .exec();
      if (!seccionPadre) {
        throw new Error(`Seccion with id ${seccionDto.padre_id} doesn't exist`);
      }
    }
  }

  private populateFields(): any[] {
    return [{ path: 'formulario_id' }, { path: 'padre_id' }];
  }

  async post(seccionDto: SeccionDto): Promise<Seccion> {
    const fecha = new Date();
    const seccionData = {
      ...seccionDto,
      fecha_creacion: fecha,
      fecha_modificacion: fecha,
    };
    await this.checkRelated(seccionDto);
    return await this.seccionModel.create(seccionData);
  }

  async getAll(filterDto: FilterDto): Promise<Seccion[]> {
    const filtersService = new FiltersService(filterDto);
    let populateFields = [];
    if (filtersService.isPopulated()) {
      populateFields = this.populateFields();
    }
    return await this.seccionModel
      .find(
        filtersService.getQuery(),
        filtersService.getFields(),
        filtersService.getLimitAndOffset(),
      )
      .sort(filtersService.getSortBy())
      .populate(populateFields)
      .exec();
  }

  async getById(id: string): Promise<Seccion> {
    const seccion = await this.seccionModel.findById(id).exec();
    if (!seccion) {
      throw new Error(`${id} doesn't exist`);
    }
    return seccion;
  }

  async put(id: string, seccionDto: SeccionDto): Promise<Seccion> {
    seccionDto.fecha_modificacion = new Date();
    if (seccionDto.fecha_creacion) {
      delete seccionDto.fecha_creacion;
    }
    await this.checkRelated(seccionDto);
    const update = await this.seccionModel
      .findByIdAndUpdate(id, seccionDto, { new: true })
      .exec();
    if (!update) {
      throw new Error(`${id} doesn't exist`);
    }
    return update;
  }

  async delete(id: string): Promise<Seccion> {
    const deleted = await this.seccionModel
      .findByIdAndUpdate(id, { activo: false }, { new: true })
      .exec();
    if (!deleted) {
      throw new Error(`${id} doesn't exist`);
    }
    return deleted;
  }
}
