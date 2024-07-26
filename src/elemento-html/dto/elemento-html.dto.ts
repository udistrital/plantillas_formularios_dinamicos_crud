import { ApiProperty } from '@nestjs/swagger';

export class ElementoHtmlDto {
  @ApiProperty()
  readonly nombre: string;

  @ApiProperty()
  readonly descripcion: string;

  @ApiProperty()
  readonly tipo_id: number;

  @ApiProperty()
  readonly tipo_dato_id: number;

  @ApiProperty()
  readonly validadores: object;

  @ApiProperty()
  readonly parametros: object;

  @ApiProperty()
  activo: boolean;

  @ApiProperty()
  fecha_creacion: Date;

  @ApiProperty()
  fecha_modificacion: Date;
}
