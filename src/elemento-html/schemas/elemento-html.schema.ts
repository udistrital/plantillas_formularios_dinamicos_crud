import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'elementos_html' })
export class ElementoHtml extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: false })
  descripcion: string;

  @Prop({ required: true })
  tipo_id: number;

  @Prop({ required: true })
  tipo_dato_id: number;

  @Prop({ type: Object, required: false })
  validadores: object;

  @Prop({ type: Object, required: false })
  parametros: object;

  @Prop({ required: true })
  activo: boolean;

  @Prop({ required: true })
  fecha_creacion: Date;

  @Prop({ required: true })
  fecha_modificacion: Date;
}

export const ElementoHtmlSchema = SchemaFactory.createForClass(ElementoHtml);
