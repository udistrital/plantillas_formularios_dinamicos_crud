import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'modulos' })
export class Modulo extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: false })
  descripcion: string;

  @Prop({ required: true })
  sistema_id: number;

  @Prop({ required: true })
  activo: boolean;

  @Prop({ required: true })
  fecha_creacion: Date;

  @Prop({ required: true })
  fecha_modificacion: Date;
}

export const ModuloSchema = SchemaFactory.createForClass(Modulo);
