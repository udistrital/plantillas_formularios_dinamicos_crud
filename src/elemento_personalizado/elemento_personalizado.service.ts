import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ElementoPersonalizado } from './schemas/elemento_personalizado.schema';
import { ElementoPersonalizadoDto } from './dto/elemento_personalizado.dto';
import { FilterDto } from '../filters/filters.dto';
import { FiltersService } from '../filters/filters.service';
import { Seccion } from '../seccion/schemas/seccion.schema';
import { ElementoHtml } from '../elemento-html/schemas/elemento-html.schema';

@Injectable()
export class ElementoPersonalizadoService {
  constructor(
    @InjectModel(ElementoPersonalizado.name)
    private readonly elementoPersonalizadoModel: Model<ElementoPersonalizado>,
    @InjectModel(Seccion.name) private readonly seccionModel: Model<Seccion>,
    @InjectModel(ElementoHtml.name)
    private readonly elementoHtmlModel: Model<ElementoHtml>,
  ) {}

  private async checkRelated(
    elementoPersonalizadoDto: ElementoPersonalizadoDto,
  ) {
    if (elementoPersonalizadoDto.seccion_id) {
      const elementoPersonalizado = await this.seccionModel
        .findById(elementoPersonalizadoDto.seccion_id)
        .exec();
      if (!elementoPersonalizado) {
        throw new Error(
          `Elemento-personalizado with id ${elementoPersonalizadoDto.seccion_id} doesn't exist`,
        );
      }
    }
    if (elementoPersonalizadoDto.elemento_html_id) {
      const elementoHtml = await this.elementoHtmlModel
        .findById(elementoPersonalizadoDto.elemento_html_id)
        .exec();
      if (!elementoHtml) {
        throw new Error(
          `Elemento-html with id ${elementoPersonalizadoDto.elemento_html_id} doesn't exist`,
        );
      }
    }
  }

  private populateFields(): any[] {
    return [{ path: 'seccion_id' }, { path: 'elemento_html_id' }];
  }

  async post(
    elementoPersonalizadoDto: ElementoPersonalizadoDto,
  ): Promise<ElementoPersonalizado> {
    const elementoPersonalizado = new this.elementoPersonalizadoModel(
      elementoPersonalizadoDto,
    );
    elementoPersonalizado.fecha_creacion = new Date();
    elementoPersonalizado.fecha_modificacion =
      elementoPersonalizado.fecha_creacion;
    await this.checkRelated(elementoPersonalizadoDto);
    return await elementoPersonalizado.save();
  }

  async getAll(filterDto: FilterDto): Promise<ElementoPersonalizado[]> {
    const filtersService = new FiltersService(filterDto);
    let populateFields = [];
    if (filtersService.isPopulated()) {
      populateFields = this.populateFields();
    }
    return await this.elementoPersonalizadoModel
      .find(
        filtersService.getQuery(),
        filtersService.getFields(),
        filtersService.getLimitAndOffset(),
      )
      .sort(filtersService.getSortBy())
      .populate(populateFields)
      .exec();
  }

  async getById(id: string): Promise<ElementoPersonalizado> {
    const elementoPersonalizado = await this.elementoPersonalizadoModel
      .findById(id)
      .exec();
    if (!elementoPersonalizado) {
      throw new Error(`${id} doesn't exist`);
    }
    return elementoPersonalizado;
  }

  async put(
    id: string,
    elementoPersonalizadoDto: ElementoPersonalizadoDto,
  ): Promise<ElementoPersonalizado> {
    elementoPersonalizadoDto.fecha_modificacion = new Date();
    if (elementoPersonalizadoDto.fecha_creacion) {
      delete elementoPersonalizadoDto.fecha_creacion;
    }
    await this.checkRelated(elementoPersonalizadoDto);
    const update = await this.elementoPersonalizadoModel
      .findByIdAndUpdate(id, elementoPersonalizadoDto, { new: true })
      .exec();
    if (!update) {
      throw new Error(`${id} doesn't exist`);
    }
    return update;
  }

  async delete(id: string): Promise<ElementoPersonalizado> {
    const deleted = await this.elementoPersonalizadoModel
      .findByIdAndUpdate(id, { activo: false }, { new: true })
      .exec();
    if (!deleted) {
      throw new Error(`${id} doesn't exist`);
    }
    return deleted;
  }
}
