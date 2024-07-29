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
import { ModuloDto } from './dto/modulo.dto';
import { ModuloService } from './modulo.service';
import { FilterDto } from '../filters/filters.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('modulos')
@Controller('modulos')
export class ModuloController {
  constructor(private moduloService: ModuloService) {}

  @Post()
  async post(@Res() res, @Body() moduloDto: ModuloDto) {
    this.moduloService
      .post(moduloDto)
      .then((modulo) => {
        res.status(HttpStatus.CREATED).json({
          Success: true,
          Status: HttpStatus.CREATED,
          Message: 'Registration successful',
          Data: modulo,
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
    this.moduloService
      .getAll(filterDto)
      .then((modulos) => {
        res.status(HttpStatus.OK).json({
          Success: true,
          Status: HttpStatus.OK,
          Message: 'Request successful',
          Data: modulos,
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
    this.moduloService
      .getById(id)
      .then((modulo) => {
        res.status(HttpStatus.OK).json({
          Success: true,
          Status: HttpStatus.OK,
          Message: 'Request successful',
          Data: modulo,
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
  async put(@Res() res, @Param('id') id: string, @Body() moduloDto: ModuloDto) {
    this.moduloService
      .put(id, moduloDto)
      .then((modulo) => {
        res.status(HttpStatus.OK).json({
          Success: true,
          Status: HttpStatus.OK,
          Message: 'Update successful',
          Data: modulo,
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
    this.moduloService
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
