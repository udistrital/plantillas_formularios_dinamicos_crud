import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ModalAlerta } from './schemas/modal-alerta.schema';
import { ModalAlertaDto } from './dto/modal-alerta.dto';
import { FilterDto } from '../filters/filters.dto';
import { FiltersService } from '../filters/filters.service';
import { Formulario } from '../formulario/schemas/formulario.schema';

@Injectable()
export class ModalAlertaService {
  constructor(
    @InjectModel(ModalAlerta.name)
    private readonly modalAlertaModel: Model<ModalAlerta>,
    @InjectModel(Formulario.name)
    private readonly formularioModel: Model<Formulario>,
  ) {}

  private async checkRelated(modalAlertaDto: ModalAlertaDto) {
    if (modalAlertaDto.formulario_id) {
      const formulario = await this.formularioModel
        .findById(modalAlertaDto.formulario_id)
        .exec();
      if (!formulario) {
        throw new Error(
          `Formulario with id ${modalAlertaDto.formulario_id} doesn't exist`,
        );
      }
    }
  }

  private populateFields(): any[] {
    return [{ path: 'formulario_id' }];
  }

  async post(modalAlertaDto: ModalAlertaDto): Promise<ModalAlerta> {
    const fecha = new Date();
    const modalAlertaData = {
      ...modalAlertaDto,
      fecha_creacion: fecha,
      fecha_modificacion: fecha,
    };
    await this.checkRelated(modalAlertaDto);
    return await this.modalAlertaModel.create(modalAlertaData);
  }

  async getAll(filterDto: FilterDto): Promise<ModalAlerta[]> {
    const filtersService = new FiltersService(filterDto);
    let populateFields = [];
    if (filtersService.isPopulated()) {
      populateFields = this.populateFields();
    }
    return await this.modalAlertaModel
      .find(
        filtersService.getQuery(),
        filtersService.getFields(),
        filtersService.getLimitAndOffset(),
      )
      .sort(filtersService.getSortBy())
      .populate(populateFields)
      .exec();
  }

  async getById(id: string): Promise<ModalAlerta> {
    const modalAlerta = await this.modalAlertaModel.findById(id).exec();
    if (!modalAlerta) {
      throw new Error(`${id} doesn't exist`);
    }
    return modalAlerta;
  }

  async put(id: string, modalAlertaDto: ModalAlertaDto): Promise<ModalAlerta> {
    modalAlertaDto.fecha_modificacion = new Date();
    if (modalAlertaDto.fecha_creacion) {
      delete modalAlertaDto.fecha_creacion;
    }
    await this.checkRelated(modalAlertaDto);
    const update = await this.modalAlertaModel
      .findByIdAndUpdate(id, modalAlertaDto, { new: true })
      .exec();
    if (!update) {
      throw new Error(`${id} doesn't exist`);
    }
    return update;
  }

  async delete(id: string): Promise<ModalAlerta> {
    const deleted = await this.modalAlertaModel
      .findByIdAndUpdate(id, { activo: false }, { new: true })
      .exec();
    if (!deleted) {
      throw new Error(`${id} doesn't exist`);
    }
    return deleted;
  }
}
