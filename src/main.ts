import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { environment } from './config/configuration';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('plantillas_formularios_dinamicos_crud')
    .setDescription(
      'API CRUD para la gestion de plantillas para la creacion de formularios dinamicos',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync('./swagger.json', JSON.stringify(document, null, 4));
  SwaggerModule.setup('api', app, document);

  await app.listen(
    parseInt(environment.PLANTILLAS_FORMULARIOS_DINAMICOS_HTTP_PORT, 10) ||
      8080,
  );
}
bootstrap();
