import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlantillaService } from './plantilla.service';
import { PlantillaController } from './plantilla.controller';
import { Modulo, ModuloSchema } from '../modulo/schemas/modulo.schema';
import {
  Formulario,
  FormularioSchema,
} from '../formulario/schemas/formulario.schema';
import { FormularioModule } from '../formulario/formulario.module';
import { SeccionModule } from '../seccion/seccion.module';
import { ElementoPersonalizadoModule } from '../elemento_personalizado/elemento_personalizado.module';
import { Seccion, SeccionSchema } from '../seccion/schemas/seccion.schema';
import {
  ElementoPersonalizado,
  ElementoPersonalizadoSchema,
} from '../elemento_personalizado/schemas/elemento_personalizado.schema';
import {
  ElementoHtml,
  ElementoHtmlSchema,
} from '../elemento-html/schemas/elemento-html.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Modulo.name, schema: ModuloSchema },
      { name: Formulario.name, schema: FormularioSchema },
      { name: Seccion.name, schema: SeccionSchema },
      { name: ElementoPersonalizado.name, schema: ElementoPersonalizadoSchema },
      { name: ElementoHtml.name, schema: ElementoHtmlSchema },
    ]),
    FormularioModule,
    SeccionModule,
    ElementoPersonalizadoModule,
  ],
  providers: [PlantillaService],
  controllers: [PlantillaController],
  exports: [PlantillaService],
})
export class PlantillaModule {}
