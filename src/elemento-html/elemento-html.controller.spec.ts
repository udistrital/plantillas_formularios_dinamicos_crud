import { Test, TestingModule } from '@nestjs/testing';
import { ElementoHtmlController } from './elemento-html.controller';

describe('ElementoHtmlController', () => {
  let controller: ElementoHtmlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElementoHtmlController],
    }).compile();

    controller = module.get<ElementoHtmlController>(ElementoHtmlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
