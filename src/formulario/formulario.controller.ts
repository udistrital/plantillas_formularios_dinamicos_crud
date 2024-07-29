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
import { FormularioDto } from './dto/formulario.dto';
import { FormularioService } from './formulario.service';
import { FilterDto } from '../filters/filters.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('formularios')
@Controller('formularios')
export class FormularioController {
  constructor(private formularioService: FormularioService) {}

  @Post()
  async post(@Res() res, @Body() formularioDto: FormularioDto) {
    this.formularioService
      .post(formularioDto)
      .then((formulario) => {
        res.status(HttpStatus.CREATED).json({
          Success: true,
          Status: HttpStatus.CREATED,
          Message: 'Registration successful',
          Data: formulario,
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
    this.formularioService
      .getAll(filterDto)
      .then((formularios) => {
        res.status(HttpStatus.OK).json({
          Success: true,
          Status: HttpStatus.OK,
          Message: 'Request successful',
          Data: formularios,
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
    this.formularioService
      .getById(id)
      .then((formulario) => {
        res.status(HttpStatus.OK).json({
          Success: true,
          Status: HttpStatus.OK,
          Message: 'Request successful',
          Data: formulario,
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
    @Body() formularioDto: FormularioDto,
  ) {
    this.formularioService
      .put(id, formularioDto)
      .then((formulario) => {
        res.status(HttpStatus.OK).json({
          Success: true,
          Status: HttpStatus.OK,
          Message: 'Update successful',
          Data: formulario,
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
    this.formularioService
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
