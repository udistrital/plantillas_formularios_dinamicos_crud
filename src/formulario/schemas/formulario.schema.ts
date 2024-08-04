import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Modulo } from '../../modulo/schemas/modulo.schema';

@Schema({ collection: 'formularios' })
export class Formulario extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: false })
  descripcion: string;

  @Prop({ required: true })
  version: number;

  @Prop({ required: true })
  version_actual: boolean;

  @Prop({ required: true })
  creado_por_id: number;

  @Prop({ required: false })
  modificado_por_id: number;

  @Prop({ required: true, type: Types.ObjectId, ref: Modulo.name })
  modulo_id: Modulo | Types.ObjectId;

  @Prop({ required: true })
  traduccion: boolean;

  @Prop({ type: Object, required: false })
  label: object;

  @Prop({ required: true })
  activo: boolean;

  @Prop({ required: true })
  fecha_creacion: Date;

  @Prop({ required: true })
  fecha_modificacion: Date;
}

export const FormularioSchema = SchemaFactory.createForClass(Formulario);
