import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Campo } from './schemas/campo.schema';
import { CampoDto } from './dto/campo.dto';
import { FilterDto } from '../filters/filters.dto';
import { FiltersService } from '../filters/filters.service';
import { Seccion } from '../seccion/schemas/seccion.schema';

@Injectable()
export class CampoService {
  constructor(
    @InjectModel(Campo.name)
    private readonly campoModel: Model<Campo>,
    @InjectModel(Seccion.name) private readonly seccionModel: Model<Seccion>,
  ) {}

  private async checkRelated(
    campoDto: CampoDto,
  ) {
    if (campoDto.seccion_id) {
      const campo = await this.seccionModel
        .findById(campoDto.seccion_id)
        .exec();
      if (!campo) {
        throw new Error(
          `Elemento-personalizado with id ${campoDto.seccion_id} doesn't exist`,
        );
      }
    }
  }

  private populateFields(): any[] {
    return [{ path: 'seccion_id' }, { path: 'elemento_html_id' }];
  }

  async post(
    campoDto: CampoDto,
  ): Promise<Campo> {
    const fecha = new Date();
    const campoData = {
      ...campoDto,
      fecha_creacion: fecha,
      fecha_modificacion: fecha,
    };
    await this.checkRelated(campoDto); // Asumiendo que checkRelated también es aplicable aquí
    return await this.campoModel.create(
      campoData,
    );
  }

  async getAll(filterDto: FilterDto): Promise<Campo[]> {
    const filtersService = new FiltersService(filterDto);
    let populateFields = [];
    if (filtersService.isPopulated()) {
      populateFields = this.populateFields();
    }
    return await this.campoModel
      .find(
        filtersService.getQuery(),
        filtersService.getFields(),
        filtersService.getLimitAndOffset(),
      )
      .sort(filtersService.getSortBy())
      .populate(populateFields)
      .exec();
  }

  async getById(id: string): Promise<Campo> {
    const campo = await this.campoModel
      .findById(id)
      .exec();
    if (!campo) {
      throw new Error(`${id} doesn't exist`);
    }
    return campo;
  }

  async put(
    id: string,
    campoDto: CampoDto,
  ): Promise<Campo> {
    campoDto.fecha_modificacion = new Date();
    if (campoDto.fecha_creacion) {
      delete campoDto.fecha_creacion;
    }
    await this.checkRelated(campoDto);
    const update = await this.campoModel
      .findByIdAndUpdate(id, campoDto, { new: true })
      .exec();
    if (!update) {
      throw new Error(`${id} doesn't exist`);
    }
    return update;
  }

  async delete(id: string): Promise<Campo> {
    const deleted = await this.campoModel
      .findByIdAndUpdate(id, { activo: false }, { new: true })
      .exec();
    if (!deleted) {
      throw new Error(`${id} doesn't exist`);
    }
    return deleted;
  }
}
