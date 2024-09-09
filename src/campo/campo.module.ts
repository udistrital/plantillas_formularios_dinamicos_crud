import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Campo,
  CampoSchema,
} from './schemas/campo.schema';
import { CampoService } from './campo.service';
import { CampoController } from './campo.controller';
import {
  ElementoHtml,
  ElementoHtmlSchema,
} from '../elemento-html/schemas/elemento-html.schema';
import { Seccion, SeccionSchema } from '../seccion/schemas/seccion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Campo.name, schema: CampoSchema },
      { name: ElementoHtml.name, schema: ElementoHtmlSchema },
      { name: Seccion.name, schema: SeccionSchema },
    ]),
  ],
  providers: [CampoService],
  controllers: [CampoController],
  exports: [CampoService],
})
export class CampoModule {}
