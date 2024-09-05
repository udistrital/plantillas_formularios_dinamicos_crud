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
import { CampoDto } from './dto/campo.dto';
import { CampoService } from './campo.service';
import { FilterDto } from '../filters/filters.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('campos')
@Controller('campos')
export class CampoController {
  constructor(
    private campoService: CampoService,
  ) {}

  @Post()
  async post(
    @Res() res,
    @Body() campoDto: CampoDto,
  ) {
    try {
      const campo =
        await this.campoService.post(campoDto);
      res.status(HttpStatus.CREATED).json({
        Success: true,
        Status: HttpStatus.CREATED,
        Message: 'Registration successful',
        Data: campo,
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
  async getAll(@Res() res, @Query() filterDto: FilterDto) {
    try {
      const elementosPersonalizados =
        await this.campoService.getAll(filterDto);
      res.status(HttpStatus.OK).json({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Request successful',
        Data: elementosPersonalizados,
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
  async getById(@Res() res, @Param('id') id: string) {
    try {
      const campo =
        await this.campoService.getById(id);
      res.status(HttpStatus.OK).json({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Request successful',
        Data: campo,
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
    @Res() res,
    @Param('id') id: string,
    @Body() campoDto: CampoDto,
  ) {
    try {
      const campo = await this.campoService.put(
        id,
        campoDto,
      );
      res.status(HttpStatus.OK).json({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Update successful',
        Data: campo,
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
  async delete(@Res() res, @Param('id') id: string) {
    try {
      await this.campoService.delete(id);
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
