import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Formulario, FormularioSchema } from './schemas/formulario.schema';
import { FormularioService } from './formulario.service';
import { FormularioController } from './formulario.controller';
import { Modulo, ModuloSchema } from 'src/modulo/schemas/modulo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Formulario.name, schema: FormularioSchema },
      { name: Modulo.name, schema: ModuloSchema },
    ]),
  ],
  providers: [FormularioService],
  controllers: [FormularioController],
  exports: [FormularioService],
})
export class FormularioModule {}
