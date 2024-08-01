import { Test, TestingModule } from '@nestjs/testing';
import { ElementoPersonalizadoService } from './elemento_personalizado.service';

describe('ElementoPersonalizadoService', () => {
  let service: ElementoPersonalizadoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElementoPersonalizadoService],
    }).compile();

    service = module.get<ElementoPersonalizadoService>(
      ElementoPersonalizadoService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
