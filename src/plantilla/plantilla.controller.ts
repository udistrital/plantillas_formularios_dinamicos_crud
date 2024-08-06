import {
  Controller,
  Post,
  Res,
  Body,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiQuery } from '@nestjs/swagger';
import { PlantillaService } from './plantilla.service';

@ApiTags('plantillas')
@Controller('plantillas')
export class PlantillaController {
  constructor(private readonly plantillaService: PlantillaService) {}

  @Post()
  @ApiBody({ type: Object })
  async post(@Res() res, @Body() template: object) {
    this.plantillaService
      .almacenarFormulario(template)
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
  @ApiQuery({ name: 'modulo_id', required: true, type: String })
  @ApiQuery({ name: 'version', required: false, type: Number })
  async get(
    @Res() res,
    @Query('modulo_id') modulo_id: string,
    @Query('version') version?: number,
  ) {
    this.plantillaService
      .getTemplate(modulo_id, version)
      .then((template) => {
        res.status(HttpStatus.OK).json({
          Success: true,
          Status: HttpStatus.OK,
          Message: 'Template retrieved successfully',
          Data: template,
        });
      })
      .catch((error) => {
        res.status(HttpStatus.BAD_REQUEST).json({
          Success: false,
          Status: HttpStatus.BAD_REQUEST,
          Message: 'Error retrieving template',
          Data: error.message,
        });
      });
  }
}
