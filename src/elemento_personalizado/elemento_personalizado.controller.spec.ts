import { Test, TestingModule } from '@nestjs/testing';
import { ElementoPersonalizadoController } from './elemento_personalizado.controller';
import { ElementoPersonalizadoService } from './elemento_personalizado.service';
import { SeccionService } from '../seccion/seccion.service';
import { ElementoHtmlService } from '../elemento-html/elemento-html.service';

describe('ElementoPersonalizadoController', () => {
  let controller: ElementoPersonalizadoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElementoPersonalizadoService,
        SeccionService,
        ElementoHtmlService,
      ],
      controllers: [ElementoPersonalizadoController],
    }).compile();

    controller = module.get<ElementoPersonalizadoController>(
      ElementoPersonalizadoController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
