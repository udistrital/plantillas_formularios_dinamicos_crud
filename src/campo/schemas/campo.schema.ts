import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Seccion } from '../../seccion/schemas/seccion.schema';

@Schema({ collection: 'campos' })
export class Campo extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: false })
  descripcion: string;

  @Prop({ required: true, type: Types.ObjectId, ref: Seccion.name })
  seccion_id: Seccion | Types.ObjectId;

  @Prop({ required: true })
  tipo: string;

  @Prop({ type: Object, required: true })
  etiqueta: object;

  @Prop({ required: false })
  valor: string;

  @Prop({ required: true })
  deshabilitado: boolean;

  @Prop({ required: true })
  solo_lectura: boolean;

  @Prop({ type: Object, required: false })
  placeholder: object;

  @Prop({ type: [Object], required: false })
  validacion: object[];

  @Prop({ type: Object, required: false })
  parametro: object;

  @Prop({ type: Object, required: false })
  dependencia: object;

  @Prop({ required: false })
  servicio: string;

  @Prop({ required: false })
  endpoint: string;

  @Prop({ required: false })
  campo: string;
  
  @Prop({ required: false })
  agrupado: boolean;

  @Prop({ required: true })
  activo: boolean;

  @Prop({ required: true })
  fecha_creacion: Date;

  @Prop({ required: true })
  fecha_modificacion: Date;
}

export const CampoSchema = SchemaFactory.createForClass(
  Campo,
);
