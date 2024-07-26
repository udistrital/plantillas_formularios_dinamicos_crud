import { ApiProperty } from '@nestjs/swagger';

export class ModuloDto {
  @ApiProperty()
  readonly nombre: string;

  @ApiProperty()
  readonly descripcion: string;

  @ApiProperty()
  readonly sistema_id: number;

  @ApiProperty()
  activo: boolean;

  @ApiProperty()
  fecha_creacion: Date;

  @ApiProperty()
  fecha_modificacion: Date;
}
