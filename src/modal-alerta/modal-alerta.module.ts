import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModalAlerta, ModalAlertaSchema } from './schemas/modal-alerta.schema';
import { ModalAlertaService } from './modal-alerta.service';
import { ModalAlertaController } from './modal-alerta.controller';
import {
  Formulario,
  FormularioSchema,
} from 'src/formulario/schemas/formulario.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModalAlerta.name, schema: ModalAlertaSchema },
      { name: Formulario.name, schema: FormularioSchema },
    ]),
  ],
  providers: [ModalAlertaService],
  controllers: [ModalAlertaController],
  exports: [ModalAlertaService],
})
export class ModalAlertaModule {}
