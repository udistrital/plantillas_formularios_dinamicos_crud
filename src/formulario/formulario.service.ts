import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Formulario } from './schemas/formulario.schema';
import { FormularioDto } from './dto/formulario.dto';
import { FilterDto } from '../filters/filters.dto';
import { FiltersService } from '../filters/filters.service';
import { Modulo } from '../modulo/schemas/modulo.schema';

@Injectable()
export class FormularioService {
  constructor(
    @InjectModel(Formulario.name)
    private readonly formularioModel: Model<Formulario>,
    @InjectModel(Modulo.name) private readonly moduloModel: Model<Modulo>,
  ) {}

  private async checkRelated(formularioDto: FormularioDto) {
    if (formularioDto.modulo_id) {
      const modulo = await this.moduloModel
        .findById(formularioDto.modulo_id)
        .exec();
      if (!modulo) {
        throw new Error(
          `Modulo with id ${formularioDto.modulo_id} doesn't exist`,
        );
      }
    }
  }

  private populateFields(): any[] {
    return [{ path: 'modulo_id' }];
  }

  async post(formularioDto: FormularioDto): Promise<Formulario> {
    const fecha = new Date();
    const formularioData = {
      ...formularioDto,
      fecha_creacion: fecha,
      fecha_modificacion: fecha,
    };
    await this.checkRelated(formularioDto);
    return await this.formularioModel.create(formularioData);
  }

  async getAll(filterDto: FilterDto): Promise<Formulario[]> {
    const filtersService = new FiltersService(filterDto);
    let populateFields = [];
    if (filtersService.isPopulated()) {
      populateFields = this.populateFields();
    }
    return await this.formularioModel
      .find(
        filtersService.getQuery(),
        filtersService.getFields(),
        filtersService.getLimitAndOffset(),
      )
      .sort(filtersService.getSortBy())
      .populate(populateFields)
      .exec();
  }

  async getById(id: string): Promise<Formulario> {
    const formulario = await this.formularioModel.findById(id).exec();
    if (!formulario) {
      throw new Error(`${id} doesn't exist`);
    }
    return formulario;
  }

  async put(id: string, formularioDto: FormularioDto): Promise<Formulario> {
    formularioDto.fecha_modificacion = new Date();
    if (formularioDto.fecha_creacion) {
      delete formularioDto.fecha_creacion;
    }
    await this.checkRelated(formularioDto);
    const update = await this.formularioModel
      .findByIdAndUpdate(id, formularioDto, { new: true })
      .exec();
    if (!update) {
      throw new Error(`${id} doesn't exist`);
    }
    return update;
  }

  async delete(id: string): Promise<Formulario> {
    const deleted = await this.formularioModel
      .findByIdAndUpdate(id, { activo: false }, { new: true })
      .exec();
    if (!deleted) {
      throw new Error(`${id} doesn't exist`);
    }
    return deleted;
  }
}
