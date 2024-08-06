import { Test, TestingModule } from '@nestjs/testing';
import { ElementoPersonalizadoController } from './elemento_personalizado.controller';

describe('ElementoPersonalizadoController', () => {
  let controller: ElementoPersonalizadoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
