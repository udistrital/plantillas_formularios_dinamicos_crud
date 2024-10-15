import { ApiProperty } from '@nestjs/swagger';

export class FormularioDto {
  @ApiProperty()
  readonly nombre: string;

  @ApiProperty()
  readonly descripcion: string;

  @ApiProperty()
  readonly version: number;

  @ApiProperty()
  readonly version_actual: boolean;

  @ApiProperty()
  readonly periodo_id: number;

  @ApiProperty()
  readonly creado_por_id: number;

  @ApiProperty()
  readonly modificado_por_id: number;

  @ApiProperty()
  readonly modulo_id: string;

  @ApiProperty()
  readonly traduccion: boolean;

  @ApiProperty()
  readonly etiqueta: object;

  @ApiProperty()
  activo: boolean;

  @ApiProperty()
  fecha_creacion: Date;

  @ApiProperty()
  fecha_modificacion: Date;
}
