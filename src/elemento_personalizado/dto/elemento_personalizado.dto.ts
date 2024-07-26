import { ApiProperty } from '@nestjs/swagger';

export class ElementoPersonalizadoDto {
  @ApiProperty()
  readonly nombre: string;

  @ApiProperty()
  readonly descripcion: string;

  @ApiProperty()
  readonly seccion_id: string;

  @ApiProperty()
  readonly elemento_html_id: string;

  @ApiProperty()
  readonly label: object;

  @ApiProperty()
  readonly deshabilitado: boolean;

  @ApiProperty()
  readonly solo_lectura: boolean;

  @ApiProperty()
  readonly placeholder: object;

  @ApiProperty()
  readonly requerido: boolean;

  @ApiProperty()
  readonly validadores_personalizados: object;

  @ApiProperty()
  readonly parametros_personalizados: object;

  @ApiProperty()
  readonly dependencia: object;

  @ApiProperty()
  activo: boolean;

  @ApiProperty()
  fecha_creacion: Date;

  @ApiProperty()
  fecha_modificacion: Date;
}
