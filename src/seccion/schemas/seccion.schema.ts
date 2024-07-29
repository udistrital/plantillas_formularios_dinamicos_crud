import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Formulario } from 'src/formulario/schemas/formulario.schema';

@Schema({ collection: 'secciones' })
export class Seccion extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: false })
  descripcion: string;

  @Prop({ required: true, type: Types.ObjectId, ref: Formulario.name })
  formulario_id: Formulario | Types.ObjectId;

  @Prop({ required: false, type: Types.ObjectId, ref: Seccion.name })
  padre_id: Seccion | Types.ObjectId;

  @Prop({ type: Object, required: false })
  label: object;

  @Prop({ required: true })
  activo: boolean;

  @Prop({ required: true })
  fecha_creacion: Date;

  @Prop({ required: true })
  fecha_modificacion: Date;
}

export const SeccionSchema = SchemaFactory.createForClass(Seccion);
