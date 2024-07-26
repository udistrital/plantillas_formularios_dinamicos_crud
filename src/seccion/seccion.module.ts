import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Seccion, SeccionSchema } from './schemas/seccion.schema';
import { SeccionService } from './seccion.service';
import { SeccionController } from './seccion.controller';
import {
  Formulario,
  FormularioSchema,
} from 'src/formulario/schemas/formulario.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Seccion.name, schema: SeccionSchema },
      { name: Formulario.name, schema: FormularioSchema },
    ]),
  ],
  providers: [SeccionService],
  controllers: [SeccionController],
  exports: [SeccionService],
})
export class SeccionModule {}
