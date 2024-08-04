import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Seccion } from '../../seccion/schemas/seccion.schema';
import { ElementoHtml } from '../../elemento-html/schemas/elemento-html.schema';

@Schema({ collection: 'elementos_personalizados' })
export class ElementoPersonalizado extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: false })
  descripcion: string;

  @Prop({ required: true, type: Types.ObjectId, ref: Seccion.name })
  seccion_id: Seccion | Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: ElementoHtml.name })
  elemento_html_id: ElementoHtml | Types.ObjectId;

  @Prop({ type: Object, required: true })
  label: object;

  @Prop({ required: true })
  deshabilitado: boolean;

  @Prop({ required: true })
  solo_lectura: boolean;

  @Prop({ type: Object, required: false })
  placeholder: object;

  @Prop({ required: true })
  requerido: boolean;

  @Prop({ type: Object, required: false })
  validadores_personalizados: object;

  @Prop({ type: Object, required: false })
  parametros_personalizados: object;

  @Prop({ type: Object, required: false })
  dependencia: object;

  @Prop({ required: true })
  activo: boolean;

  @Prop({ required: true })
  fecha_creacion: Date;

  @Prop({ required: true })
  fecha_modificacion: Date;
}

export const ElementoPersonalizadoSchema = SchemaFactory.createForClass(
  ElementoPersonalizado,
);
