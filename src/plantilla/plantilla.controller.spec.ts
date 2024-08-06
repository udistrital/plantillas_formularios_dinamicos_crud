import { Test, TestingModule } from '@nestjs/testing';
import { VersionadoController } from './plantilla.controller';

describe('VersionadoController', () => {
  let controller: VersionadoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VersionadoController],
    }).compile();

    controller = module.get<VersionadoController>(VersionadoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
