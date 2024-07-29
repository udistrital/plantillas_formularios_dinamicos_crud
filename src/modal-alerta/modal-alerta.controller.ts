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
import { ModalAlertaDto } from './dto/modal-alerta.dto';
import { ModalAlertaService } from './modal-alerta.service';
import { FilterDto } from '../filters/filters.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('modal-alertas')
@Controller('modal-alertas')
export class ModalAlertaController {
  constructor(private modalAlertaService: ModalAlertaService) {}

  @Post()
  async post(@Res() res, @Body() modalAlertaDto: ModalAlertaDto) {
    this.modalAlertaService
      .post(modalAlertaDto)
      .then((modalAlerta) => {
        res.status(HttpStatus.CREATED).json({
          Success: true,
          Status: HttpStatus.CREATED,
          Message: 'Registration successful',
          Data: modalAlerta,
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
    this.modalAlertaService
      .getAll(filterDto)
      .then((modalAlertas) => {
        res.status(HttpStatus.OK).json({
          Success: true,
          Status: HttpStatus.OK,
          Message: 'Request successful',
          Data: modalAlertas,
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
    this.modalAlertaService
      .getById(id)
      .then((modalAlerta) => {
        res.status(HttpStatus.OK).json({
          Success: true,
          Status: HttpStatus.OK,
          Message: 'Request successful',
          Data: modalAlerta,
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
    @Body() modalAlertaDto: ModalAlertaDto,
  ) {
    this.modalAlertaService
      .put(id, modalAlertaDto)
      .then((modalAlerta) => {
        res.status(HttpStatus.OK).json({
          Success: true,
          Status: HttpStatus.OK,
          Message: 'Update successful',
          Data: modalAlerta,
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
    this.modalAlertaService
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
