import {
  Controller,
  Post,
  Res,
  Body,
  HttpStatus,
  Get,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiQuery } from '@nestjs/swagger';
import { PlantillaService } from './plantilla.service';
import { FilterDto } from 'src/filters/filters.dto';

@ApiTags('plantillas')
@Controller('plantillas')
export class PlantillaController {
  constructor(private readonly plantillaService: PlantillaService) {}

  @Post()
  @ApiBody({ type: Object })
  async post(@Res() res, @Body() template: object) {
    try {
      const formulario = await this.plantillaService.createTemplate(template);
      res.status(HttpStatus.CREATED).json({
        Success: true,
        Status: HttpStatus.CREATED,
        Message: 'Registration successful',
        Data: formulario,
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
      const result = await this.plantillaService.getAllTemplate(filterDto);
      res.status(HttpStatus.OK).json({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Request successful',
        Metadata: result.metadata,
        Data: result.formularios,
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

  @Get('/versiones')
  @ApiQuery({ name: 'modulo_id', required: true, type: String })
  @ApiQuery({ name: 'version', required: false, type: Number })
  async get(
    @Res() res,
    @Query('modulo_id') modulo_id: string,
    @Query('version') version?: number,
  ) {
    try {
      const template = await this.plantillaService.getTemplate(
        modulo_id,
        version,
      );
      res.status(HttpStatus.OK).json({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Request successful',
        Data: template,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        Success: false,
        Status: HttpStatus.BAD_REQUEST,
        Message:
          'Error service GetAll: The request contains an incorrect parameter or no record exists',
        Data: error.message,
      });
    }
  }

  @Delete()
  @ApiQuery({ name: 'modulo_id', required: true, type: String })
  @ApiQuery({ name: 'version', required: true, type: Number })
  async deleteTemplate(
    @Res() res,
    @Query('modulo_id') modulo_id: string,
    @Query('version') version: number,
  ) {
    try {
      const data = await this.plantillaService.deleteTemplate(
        modulo_id,
        version,
      );
      res.status(HttpStatus.OK).json({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Template deleted successfully',
        Data: data,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        Success: false,
        Status: HttpStatus.BAD_REQUEST,
        Message: 'Error service Delete: Request contains incorrect parameter',
        Data: error.message,
      });
    }
  }
}
