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
import { ElementoHtmlModule } from './elemento-html/elemento-html.module';
import { ElementoPersonalizadoModule } from './elemento_personalizado/elemento_personalizado.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${environment.USER}:${environment.PASS}@` +
        `${environment.HOST}:${environment.PORT}/${environment.DB}?authSource=${environment.AUTH_DB}`,
      {
        useFindAndModify: false,
      },
    ),
    ModuloModule,
    FormularioModule,
    ModalAlertaModule,
    SeccionModule,
    ElementoHtmlModule,
    ElementoPersonalizadoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
