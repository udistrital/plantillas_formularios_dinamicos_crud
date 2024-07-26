import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ElementoHtml,
  ElementoHtmlSchema,
} from './schemas/elemento-html.schema';
import { ElementoHtmlService } from './elemento-html.service';
import { ElementoHtmlController } from './elemento-html.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ElementoHtml.name, schema: ElementoHtmlSchema },
    ]),
  ],
  providers: [ElementoHtmlService],
  controllers: [ElementoHtmlController],
  exports: [ElementoHtmlService],
})
export class ElementoHtmlModule {}
