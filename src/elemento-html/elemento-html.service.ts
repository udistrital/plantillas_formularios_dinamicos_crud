import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ElementoHtml } from './schemas/elemento-html.schema';
import { ElementoHtmlDto } from './dto/elemento-html.dto';
import { FilterDto } from '../filters/filters.dto';
import { FiltersService } from '../filters/filters.service';

@Injectable()
export class ElementoHtmlService {
  constructor(
    @InjectModel(ElementoHtml.name)
    private readonly elementoHtmlModel: Model<ElementoHtml>,
  ) {}

  private populateFields(): any[] {
    // Define the fields to be populated, if any
    return [];
  }

  async post(elementoHtmlDto: ElementoHtmlDto): Promise<ElementoHtml> {
    const elementoHtml = new this.elementoHtmlModel(elementoHtmlDto);
    elementoHtml.fecha_creacion = new Date();
    elementoHtml.fecha_modificacion = elementoHtml.fecha_creacion;
    return await elementoHtml.save();
  }

  async getAll(filterDto: FilterDto): Promise<ElementoHtml[]> {
    const filtersService = new FiltersService(filterDto);
    let populateFields = [];
    if (filtersService.isPopulated()) {
      populateFields = this.populateFields();
    }
    return await this.elementoHtmlModel
      .find(
        filtersService.getQuery(),
        filtersService.getFields(),
        filtersService.getLimitAndOffset(),
      )
      .sort(filtersService.getSortBy())
      .populate(populateFields)
      .exec();
  }

  async getById(id: string): Promise<ElementoHtml> {
    const elementoHtml = await this.elementoHtmlModel.findById(id).exec();
    if (!elementoHtml) {
      throw new Error(`${id} doesn't exist`);
    }
    return elementoHtml;
  }

  async put(
    id: string,
    elementoHtmlDto: ElementoHtmlDto,
  ): Promise<ElementoHtml> {
    elementoHtmlDto.fecha_modificacion = new Date();
    if (elementoHtmlDto.fecha_creacion) {
      delete elementoHtmlDto.fecha_creacion;
    }
    const update = await this.elementoHtmlModel
      .findByIdAndUpdate(id, elementoHtmlDto, { new: true })
      .exec();
    if (!update) {
      throw new Error(`${id} doesn't exist`);
    }
    return update;
  }

  async delete(id: string): Promise<ElementoHtml> {
    const deleted = await this.elementoHtmlModel
      .findByIdAndUpdate(id, { activo: false }, { new: true })
      .exec();
    if (!deleted) {
      throw new Error(`${id} doesn't exist`);
    }
    return deleted;
  }
}
