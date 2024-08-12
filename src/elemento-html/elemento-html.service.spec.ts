import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ElementoHtmlService } from './elemento-html.service';
import { ElementoHtml } from './schemas/elemento-html.schema';
import { ElementoHtmlDto } from './dto/elemento-html.dto';
import { Model } from 'mongoose';
import { FilterDto } from '../filters/filters.dto';

const mockElementoHtmlDto: ElementoHtmlDto = {
  nombre: 'Elemento HTML de Prueba',
  descripcion: 'Descripción del elemento HTML de prueba',
  tipo_id: 1,
  tipo_dato_id: 1,
  validadores: {},
  parametros: {},
  activo: true,
  fecha_creacion: new Date(),
  fecha_modificacion: new Date(),
};

const mockElementoHtml = {
  ...mockElementoHtmlDto,
  _id: '66aed6a431c4ca1c60085cde',
};

describe('ElementoHtmlService', () => {
  let elementoHtmlService: ElementoHtmlService;
  let elementoHtmlModel: Model<ElementoHtml>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElementoHtmlService,
        {
          provide: getModelToken(ElementoHtml.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    elementoHtmlService = module.get<ElementoHtmlService>(ElementoHtmlService);
    elementoHtmlModel = module.get<Model<ElementoHtml>>(
      getModelToken(ElementoHtml.name),
    );
  });

  it('Debería estar definido', () => {
    expect(elementoHtmlService).toBeDefined();
  });

  describe('post', () => {
    it('Debería crear y devolver un elemento HTML', async () => {
      jest
        .spyOn(elementoHtmlModel, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockElementoHtmlDto));

      const result = await elementoHtmlService.post(mockElementoHtmlDto);
      expect(result).toEqual(mockElementoHtmlDto);
    });
  });

  describe('getAll', () => {
    it('Debería retornar todos los elementos HTML con filtros aplicados', async () => {
      const mockFilterDto: FilterDto = {
        query: 'nombre:Elemento HTML de Prueba',
        fields: 'nombre,descripcion',
        sortby: 'fecha_creacion',
        order: 'desc',
        limit: '10',
        offset: '0',
        populate: 'false',
      };

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockElementoHtml]),
      };

      jest.spyOn(elementoHtmlModel, 'find').mockReturnValue(mockQuery as any);

      const result = await elementoHtmlService.getAll(mockFilterDto);

      expect(result).toEqual([mockElementoHtml]);
    });
  });

  describe('getById', () => {
    it('Debería retornar un elemento HTML por su ID', async () => {
      jest.spyOn(elementoHtmlModel, 'findById').mockReturnValue({
        exec: jest
          .fn()
          .mockResolvedValue(mockElementoHtml as unknown as ElementoHtml),
      } as any);

      const result = await elementoHtmlService.getById(mockElementoHtml._id);

      expect(elementoHtmlModel.findById).toHaveBeenCalledWith(
        mockElementoHtml._id,
      );
      expect(result).toEqual(mockElementoHtml);
    });

    it('Debería lanzar un error si el elemento HTML no existe', async () => {
      jest.spyOn(elementoHtmlModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        elementoHtmlService.getById(mockElementoHtml._id),
      ).rejects.toThrow(`${mockElementoHtml._id} doesn't exist`);

      expect(elementoHtmlModel.findById).toHaveBeenCalledWith(
        mockElementoHtml._id,
      );
    });
  });

  describe('put', () => {
    it('Debería actualizar un elemento HTML', async () => {
      jest.spyOn(elementoHtmlModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest
          .fn()
          .mockResolvedValue(mockElementoHtmlDto as unknown as ElementoHtml),
      } as any);

      const result = await elementoHtmlService.put(
        mockElementoHtml._id,
        mockElementoHtml,
      );

      expect(elementoHtmlModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockElementoHtml._id,
        mockElementoHtml,
        { new: true },
      );
      expect(result).toEqual(mockElementoHtmlDto);
    });

    it('Debería lanzar un error si el elemento HTML no existe', async () => {
      jest.spyOn(elementoHtmlModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        elementoHtmlService.put(mockElementoHtml._id, mockElementoHtmlDto),
      ).rejects.toThrow(`${mockElementoHtml._id} doesn't exist`);

      expect(elementoHtmlModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockElementoHtml._id,
        { ...mockElementoHtmlDto, fecha_modificacion: expect.any(Date) },
        { new: true },
      );
    });
  });

  describe('delete', () => {
    it('Debería marcar un elemento HTML como inactivo', async () => {
      jest.spyOn(elementoHtmlModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest
          .fn()
          .mockResolvedValue(mockElementoHtmlDto as unknown as ElementoHtml),
      } as any);

      const result = await elementoHtmlService.delete(mockElementoHtml._id);

      expect(result).toEqual(mockElementoHtmlDto);
    });

    it('Debería lanzar un error si el elemento HTML no existe', async () => {
      jest.spyOn(elementoHtmlModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        elementoHtmlService.delete(mockElementoHtml._id),
      ).rejects.toThrow(`${mockElementoHtml._id} doesn't exist`);

      expect(elementoHtmlModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockElementoHtml._id,
        { activo: false },
        { new: true },
      );
    });
  });
});
