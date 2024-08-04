import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ElementoPersonalizado,
  ElementoPersonalizadoSchema,
} from './schemas/elemento_personalizado.schema';
import { ElementoPersonalizadoService } from './elemento_personalizado.service';
import { ElementoPersonalizadoController } from './elemento_personalizado.controller';
import {
  ElementoHtml,
  ElementoHtmlSchema,
} from '../elemento-html/schemas/elemento-html.schema';
import { Seccion, SeccionSchema } from '../seccion/schemas/seccion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ElementoPersonalizado.name, schema: ElementoPersonalizadoSchema },
      { name: ElementoHtml.name, schema: ElementoHtmlSchema },
      { name: Seccion.name, schema: SeccionSchema },
    ]),
  ],
  providers: [ElementoPersonalizadoService],
  controllers: [ElementoPersonalizadoController],
  exports: [ElementoPersonalizadoService],
})
export class ElementoPersonalizadoModule {}
