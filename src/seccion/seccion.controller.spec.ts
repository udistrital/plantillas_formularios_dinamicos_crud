import { Test, TestingModule } from '@nestjs/testing';
import { SeccionController } from './seccion.controller';

describe('SeccionController', () => {
  let controller: SeccionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeccionController],
    }).compile();

    controller = module.get<SeccionController>(SeccionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
