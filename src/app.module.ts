import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from './config/configuration';
import { LoggerMiddleware } from './logger/logger';

//Modulos
import { ModuloModule } from './modulo/modulo.module';
import { FormularioModule } from './formulario/formulario.module';
import { ModalAlertaModule } from './modal-alerta/modal-alerta.module';
import { SeccionModule } from './seccion/seccion.module';
import { CampoModule } from './campo/campo.module';
import { PlantillaModule } from './plantilla/plantilla.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${environment.PLANTILLAS_FORMULARIOS_DINAMICOS_USER}:${environment.PLANTILLAS_FORMULARIOS_DINAMICOS_PASS}@` +
        `${environment.PLANTILLAS_FORMULARIOS_DINAMICOS_HOST}:${environment.PLANTILLAS_FORMULARIOS_DINAMICOS_PORT}/${environment.PLANTILLAS_FORMULARIOS_DINAMICOS_DB}?authSource=${environment.PLANTILLAS_FORMULARIOS_DINAMICOS_AUTH_DB}`,
      {
        useFindAndModify: false,
      },
    ),
    ModuloModule,
    FormularioModule,
    ModalAlertaModule,
    SeccionModule,
    CampoModule,
    PlantillaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
