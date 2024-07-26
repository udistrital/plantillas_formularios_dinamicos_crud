import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Modulo, ModuloSchema } from './schemas/modulo.schema';
import { ModuloService } from './modulo.service';
import { ModuloController } from './modulo.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Modulo.name, schema: ModuloSchema }]),
  ],
  controllers: [ModuloController],
  providers: [ModuloService],
  exports: [ModuloService],
})
export class ModuloModule {}
