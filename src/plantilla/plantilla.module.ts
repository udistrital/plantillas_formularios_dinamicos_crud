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
import { CampoModule } from '../campo/campo.module';
import { Seccion, SeccionSchema } from '../seccion/schemas/seccion.schema';
import {
  Campo,
  CampoSchema,
} from '../campo/schemas/campo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Modulo.name, schema: ModuloSchema },
      { name: Formulario.name, schema: FormularioSchema },
      { name: Seccion.name, schema: SeccionSchema },
      { name: Campo.name, schema: CampoSchema },
    ]),
    FormularioModule,
    SeccionModule,
    CampoModule,
  ],
  providers: [PlantillaService],
  controllers: [PlantillaController],
  exports: [PlantillaService],
})
export class PlantillaModule {}
