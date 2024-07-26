import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Modulo } from './schemas/modulo.schema';
import { ModuloDto } from './dto/modulo.dto';
import { FilterDto } from '../filters/filters.dto';
import { FiltersService } from '../filters/filters.service';

@Injectable()
export class ModuloService {
  constructor(
    @InjectModel(Modulo.name) private readonly moduloModel: Model<Modulo>,
  ) {}

  private populateFields(): any[] {
    return [
      // Lista de campos para populate
    ];
  }

  async post(moduloDto: ModuloDto): Promise<Modulo> {
    const modulo = new this.moduloModel(moduloDto);
    modulo.fecha_creacion = new Date();
    modulo.fecha_modificacion = modulo.fecha_creacion;
    return await modulo.save();
  }

  async getAll(filterDto: FilterDto): Promise<Modulo[]> {
    const filtersService = new FiltersService(filterDto);
    let populateFields = [];
    if (filtersService.isPopulated()) {
      populateFields = this.populateFields();
    }
    return await this.moduloModel
      .find(
        filtersService.getQuery(),
        filtersService.getFields(),
        filtersService.getLimitAndOffset(),
      )
      .sort(filtersService.getSortBy())
      .populate(populateFields)
      .exec();
  }

  async getById(id: string): Promise<Modulo> {
    const modulo = await this.moduloModel.findById(id).exec();
    if (!modulo) {
      throw new Error(`${id} no existe`);
    }
    return modulo;
  }

  async put(id: string, moduloDto: ModuloDto): Promise<Modulo> {
    moduloDto.fecha_modificacion = new Date();
    if (moduloDto.fecha_creacion) {
      delete moduloDto.fecha_creacion;
    }
    const update = await this.moduloModel
      .findByIdAndUpdate(id, moduloDto, { new: true })
      .exec();
    if (!update) {
      throw new Error(`${id} doesn't exist`);
    }
    return update;
  }

  async delete(id: string): Promise<Modulo> {
    const deleted = await this.moduloModel
      .findByIdAndUpdate(id, { activo: false }, { new: true })
      .exec();
    if (!deleted) {
      throw new Error(`${id} no existe`);
    }
    return deleted;
  }
}
