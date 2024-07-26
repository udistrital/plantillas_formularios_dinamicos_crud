import { Test, TestingModule } from '@nestjs/testing';
import { ElementoHtmlService } from './elemento-html.service';

describe('ElementoHtmlService', () => {
  let service: ElementoHtmlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElementoHtmlService],
    }).compile();

    service = module.get<ElementoHtmlService>(ElementoHtmlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
