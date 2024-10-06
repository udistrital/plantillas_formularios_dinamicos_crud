import { ApiProperty } from '@nestjs/swagger';

export class SeccionDto {
  @ApiProperty()
  readonly nombre: string;

  @ApiProperty()
  readonly descripcion: string;

  @ApiProperty()
  readonly formulario_id: string;

  @ApiProperty()
  readonly padre_id: string;

  @ApiProperty()
  readonly label: object;

  @ApiProperty()
  readonly icono: string;

  @ApiProperty()
  activo: boolean;

  @ApiProperty()
  fecha_creacion: Date;

  @ApiProperty()
  fecha_modificacion: Date;
}
