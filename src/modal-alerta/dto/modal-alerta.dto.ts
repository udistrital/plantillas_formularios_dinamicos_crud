import { ApiProperty } from '@nestjs/swagger';

export class ModalAlertaDto {
  @ApiProperty()
  readonly titulo: string;

  @ApiProperty()
  readonly descripcion: string;

  @ApiProperty()
  readonly formulario_id: string;

  @ApiProperty()
  readonly titulo_boton_principal: string;

  @ApiProperty()
  readonly titulo_boton_secundario: string;

  @ApiProperty()
  readonly tipo_id: number;

  @ApiProperty()
  activo: boolean;

  @ApiProperty()
  fecha_creacion: Date;

  @ApiProperty()
  fecha_modificacion: Date;
}
