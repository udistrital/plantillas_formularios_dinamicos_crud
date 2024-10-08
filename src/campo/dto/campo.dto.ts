import { ApiProperty } from '@nestjs/swagger';

export class CampoDto {
  @ApiProperty()
  readonly nombre: string;

  @ApiProperty()
  readonly descripcion: string;

  @ApiProperty()
  readonly seccion_id: string;

  @ApiProperty()
  readonly tipo: string;

  @ApiProperty()
  readonly label: object;

  @ApiProperty()
  readonly deshabilitado: boolean;

  @ApiProperty()
  readonly solo_lectura: boolean;

  @ApiProperty()
  readonly placeholder: object;

  @ApiProperty()
  readonly validacion: object[];

  @ApiProperty()
  readonly parametro: object;

  @ApiProperty()
  readonly dependencia: object;

  @ApiProperty()
  activo: boolean;

  @ApiProperty()
  fecha_creacion: Date;

  @ApiProperty()
  fecha_modificacion: Date;
}
