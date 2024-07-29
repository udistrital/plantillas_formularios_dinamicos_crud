import { Test, TestingModule } from '@nestjs/testing';
import { ModalAlertaService } from './modal-alerta.service';

describe('ModalAlertaService', () => {
  let service: ModalAlertaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModalAlertaService],
    }).compile();

    service = module.get<ModalAlertaService>(ModalAlertaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
