import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Formulario } from '../../formulario/schemas/formulario.schema';

@Schema({ collection: 'modal_alertas' })
export class ModalAlerta extends Document {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true, type: Types.ObjectId, ref: Formulario.name })
  formulario_id: Formulario | Types.ObjectId;

  @Prop({ required: true })
  titulo_boton_principal: string;

  @Prop({ required: false })
  titulo_boton_secundario: string;

  @Prop({ required: true })
  tipo_id: number;

  @Prop({ required: true })
  activo: boolean;

  @Prop({ required: true })
  fecha_creacion: Date;

  @Prop({ required: true })
  fecha_modificacion: Date;
}

export const ModalAlertaSchema = SchemaFactory.createForClass(ModalAlerta);
