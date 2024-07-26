import { Test, TestingModule } from '@nestjs/testing';
import { ModalAlertaController } from './modal-alerta.controller';

describe('ModalAlertaController', () => {
  let controller: ModalAlertaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModalAlertaController],
    }).compile();

    controller = module.get<ModalAlertaController>(ModalAlertaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
