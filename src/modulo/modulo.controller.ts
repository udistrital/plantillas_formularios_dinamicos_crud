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
import { Response } from 'express';

@ApiTags('modulos')
@Controller('modulos')
export class ModuloController {
  constructor(private moduloService: ModuloService) {}

  @Post()
  async post(@Res() res: Response, @Body() moduloDto: ModuloDto) {
    try {
      const modulo = await this.moduloService.post(moduloDto);
      res.status(HttpStatus.CREATED).json({
        Success: true,
        Status: HttpStatus.CREATED,
        Message: 'Registration successful',
        Data: modulo,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        Success: false,
        Status: HttpStatus.BAD_REQUEST,
        Message:
          'Error service Post: The request contains an incorrect data type or an invalid parameter',
        Data: error.message,
      });
    }
  }

  @Get()
  async getAll(@Res() res: Response, @Query() filterDto: FilterDto) {
    try {
      const modulos = await this.moduloService.getAll(filterDto);
      res.status(HttpStatus.OK).json({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Request successful',
        Data: modulos,
      });
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        Success: false,
        Status: HttpStatus.NOT_FOUND,
        Message:
          'Error service GetAll: The request contains an incorrect parameter or no record exist',
        Data: error.message,
      });
    }
  }

  @Get('/:id')
  async getById(@Res() res: Response, @Param('id') id: string) {
    try {
      const modulo = await this.moduloService.getById(id);
      res.status(HttpStatus.OK).json({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Request successful',
        Data: modulo,
      });
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        Success: false,
        Status: HttpStatus.NOT_FOUND,
        Message:
          'Error service GetOne: The request contains an incorrect parameter or no record exist',
        Data: error.message,
      });
    }
  }

  @Put('/:id')
  async put(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() moduloDto: ModuloDto,
  ) {
    try {
      const modulo = await this.moduloService.put(id, moduloDto);
      res.status(HttpStatus.OK).json({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Update successful',
        Data: modulo,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        Success: false,
        Status: HttpStatus.BAD_REQUEST,
        Message:
          'Error service Put: The request contains an incorrect data type or an invalid parameter',
        Data: error.message,
      });
    }
  }

  @Delete('/:id')
  async delete(@Res() res: Response, @Param('id') id: string) {
    try {
      await this.moduloService.delete(id);
      res.status(HttpStatus.OK).json({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Delete successful',
        Data: {
          _id: id,
        },
      });
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        Success: false,
        Status: HttpStatus.NOT_FOUND,
        Message: 'Error service Delete: Request contains incorrect parameter',
        Data: error.message,
      });
    }
  }
}
