import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ElementoPersonalizadoDto } from './dto/elemento_personalizado.dto';
import { ElementoPersonalizadoService } from './elemento_personalizado.service';
import { FilterDto } from '../filters/filters.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('elementos-personalizados')
@Controller('elementos-personalizados')
export class ElementoPersonalizadoController {
  constructor(
    private elementoPersonalizadoService: ElementoPersonalizadoService,
  ) {}

  @Post()
  async post(
    @Res() res,
    @Body() elementoPersonalizadoDto: ElementoPersonalizadoDto,
  ) {
    this.elementoPersonalizadoService
      .post(elementoPersonalizadoDto)
      .then((elementoPersonalizado) => {
        res.status(HttpStatus.CREATED).json({
          Success: true,
          Status: HttpStatus.CREATED,
          Message: 'Registration successful',
          Data: elementoPersonalizado,
        });
      })
      .catch((error) => {
        res.status(HttpStatus.BAD_REQUEST).json({
          Success: false,
          Status: HttpStatus.BAD_REQUEST,
          Message:
            'Error service Post: The request contains an incorrect data type or an invalid parameter',
          Data: error.message,
        });
      });
  }

  @Get()
  async getAll(@Res() res, @Query() filterDto: FilterDto) {
    this.elementoPersonalizadoService
      .getAll(filterDto)
      .then((elementosPersonalizados) => {
        res.status(HttpStatus.OK).json({
          Success: true,
          Status: HttpStatus.OK,
          Message: 'Request successful',
          Data: elementosPersonalizados,
        });
      })
      .catch((error) => {
        res.status(HttpStatus.NOT_FOUND).json({
          Success: false,
          Status: HttpStatus.NOT_FOUND,
          Message:
            'Error service GetAll: The request contains an incorrect parameter or no record exist',
          Data: error.message,
        });
      });
  }

  @Get('/:id')
  async getById(@Res() res, @Param('id') id: string) {
    this.elementoPersonalizadoService
      .getById(id)
      .then((elementoPersonalizado) => {
        res.status(HttpStatus.OK).json({
          Success: true,
          Status: HttpStatus.OK,
          Message: 'Request successful',
          Data: elementoPersonalizado,
        });
      })
      .catch((error) => {
        res.status(HttpStatus.NOT_FOUND).json({
          Success: false,
          Status: HttpStatus.NOT_FOUND,
          Message:
            'Error service GetOne: The request contains an incorrect parameter or no record exist',
          Data: error.message,
        });
      });
  }

  @Put('/:id')
  async put(
    @Res() res,
    @Param('id') id: string,
    @Body() elementoPersonalizadoDto: ElementoPersonalizadoDto,
  ) {
    this.elementoPersonalizadoService
      .put(id, elementoPersonalizadoDto)
      .then((elementoPersonalizado) => {
        res.status(HttpStatus.OK).json({
          Success: true,
          Status: HttpStatus.OK,
          Message: 'Update successful',
          Data: elementoPersonalizado,
        });
      })
      .catch((error) => {
        res.status(HttpStatus.BAD_REQUEST).json({
          Success: false,
          Status: HttpStatus.BAD_REQUEST,
          Message:
            'Error service Put: The request contains an incorrect data type or an invalid parameter',
          Data: error.message,
        });
      });
  }

  @Delete('/:id')
  async delete(@Res() res, @Param('id') id: string) {
    this.elementoPersonalizadoService
      .delete(id)
      .then(() => {
        res.status(HttpStatus.OK).json({
          Success: true,
          Status: HttpStatus.OK,
          Message: 'Delete successful',
          Data: {
            _id: id,
          },
        });
      })
      .catch((error) => {
        res.status(HttpStatus.NOT_FOUND).json({
          Success: false,
          Status: HttpStatus.NOT_FOUND,
          Message: 'Error service Delete: Request contains incorrect parameter',
          Data: error.message,
        });
      });
  }
}
