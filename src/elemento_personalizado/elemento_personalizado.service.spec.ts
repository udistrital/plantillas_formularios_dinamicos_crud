import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ElementoPersonalizadoService } from './elemento_personalizado.service';
import { ElementoPersonalizado } from './schemas/elemento_personalizado.schema';
import { ElementoPersonalizadoDto } from './dto/elemento_personalizado.dto';
import { Seccion } from '../seccion/schemas/seccion.schema';
import { ElementoHtml } from '../elemento-html/schemas/elemento-html.schema';
import { Model } from 'mongoose';
import { FilterDto } from '../filters/filters.dto';

const mockElementoPersonalizadoDto: ElementoPersonalizadoDto = {
  nombre: 'Elemento Personalizado',
  descripcion: 'Descripción del elemento personalizado',
  seccion_id: '66aed6a431c4ca1c60085cdd',
  elemento_html_id: '66aed6a431c4ca1c60085cde',
  label: {},
  deshabilitado: false,
  solo_lectura: false,
  placeholder: {},
  requerido: true,
  validadores_personalizados: {},
  parametros_personalizados: {},
  dependencia: {},
  activo: true,
  fecha_creacion: new Date(),
  fecha_modificacion: new Date(),
};

const mockElementoPersonalizado = {
  ...mockElementoPersonalizadoDto,
  _id: '66aed6a431c4ca1c60085cdf',
};

const mockSeccion = {
  _id: '66aed6a431c4ca1c60085cdd',
  nombre: 'Sección de Prueba',
};

const mockElementoHtml = {
  _id: '66aed6a431c4ca1c60085cde',
  nombre: 'Elemento de Prueba',
};

describe('ElementoPersonalizadoService', () => {
  let elementoPersonalizadoService: ElementoPersonalizadoService;
  let elementoPersonalizadoModel: Model<ElementoPersonalizado>;
  let seccionModel: Model<Seccion>;
  let elementoHtmlModel: Model<ElementoHtml>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElementoPersonalizadoService,
        {
          provide: getModelToken(ElementoPersonalizado.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
        {
          provide: getModelToken(Seccion.name),
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: getModelToken(ElementoHtml.name),
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    elementoPersonalizadoService = module.get<ElementoPersonalizadoService>(
      ElementoPersonalizadoService,
    );
    elementoPersonalizadoModel = module.get<Model<ElementoPersonalizado>>(
      getModelToken(ElementoPersonalizado.name),
    );
    seccionModel = module.get<Model<Seccion>>(getModelToken(Seccion.name));
    elementoHtmlModel = module.get<Model<ElementoHtml>>(
      getModelToken(ElementoHtml.name),
    );
  });

  it('Debería estar definido', () => {
    expect(elementoPersonalizadoService).toBeDefined();
  });

  describe('post', () => {
    it('Debería crear y devolver un elemento personalizado', async () => {
      jest.spyOn(seccionModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSeccion),
      } as any);
      jest.spyOn(elementoHtmlModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockElementoHtml),
      } as any);
      jest
        .spyOn(elementoPersonalizadoModel, 'create')
        .mockImplementationOnce(() =>
          Promise.resolve(mockElementoPersonalizado),
        );

      const result = await elementoPersonalizadoService.post(
        mockElementoPersonalizadoDto,
      );

      expect(result).toEqual(mockElementoPersonalizado);
    });

    it('Debería lanzar un error si la sección relacionada no existe', async () => {
      jest.spyOn(seccionModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      jest.spyOn(elementoHtmlModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockElementoHtml),
      } as any);

      await expect(
        elementoPersonalizadoService.post(mockElementoPersonalizadoDto),
      ).rejects.toThrow(
        `Elemento-personalizado with id ${mockElementoPersonalizadoDto.seccion_id} doesn't exist`,
      );
    });

    it('Debería lanzar un error si el elemento HTML relacionado no existe', async () => {
      jest.spyOn(seccionModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSeccion),
      } as any);
      jest.spyOn(elementoHtmlModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        elementoPersonalizadoService.post(mockElementoPersonalizadoDto),
      ).rejects.toThrow(
        `Elemento-html with id ${mockElementoPersonalizadoDto.elemento_html_id} doesn't exist`,
      );
    });
  });

  describe('getAll', () => {
    it('Debería retornar todos los elementos personalizados con filtros aplicados', async () => {
      const mockElementosPersonalizados = [
        mockElementoPersonalizado,
        {
          _id: '66aed6a431c4ca1c60085ce0',
          nombre: 'Elemento Personalizado 2',
          descripcion: 'Otra descripción',
          seccion_id: '66aed6a431c4ca1c60085cdd',
          elemento_html_id: '66aed6a431c4ca1c60085cde',
          activo: true,
          fecha_creacion: new Date(),
          fecha_modificacion: new Date(),
        },
      ];

      const mockFilterDto: FilterDto = {
        query: 'nombre:Elemento Personalizado',
        fields: 'nombre,descripcion',
        sortby: 'fecha_creacion',
        order: 'desc',
        limit: '10',
        offset: '0',
        populate: 'true',
      };

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockElementosPersonalizados),
      };

      jest
        .spyOn(elementoPersonalizadoModel, 'find')
        .mockReturnValue(mockQuery as any);

      const result = await elementoPersonalizadoService.getAll(mockFilterDto);

      expect(result).toEqual(mockElementosPersonalizados);
    });
  });

  describe('getById', () => {
    it('Debería retornar un elemento personalizado por su ID', async () => {
      jest.spyOn(elementoPersonalizadoModel, 'findById').mockReturnValue({
        exec: jest
          .fn()
          .mockResolvedValue(
            mockElementoPersonalizado as unknown as ElementoPersonalizado,
          ),
      } as any);

      const result = await elementoPersonalizadoService.getById(
        mockElementoPersonalizado._id,
      );

      expect(elementoPersonalizadoModel.findById).toHaveBeenCalledWith(
        mockElementoPersonalizado._id,
      );
      expect(result).toEqual(mockElementoPersonalizado);
    });

    it('Debería lanzar un error si el elemento personalizado no existe', async () => {
      jest.spyOn(elementoPersonalizadoModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        elementoPersonalizadoService.getById(mockElementoPersonalizado._id),
      ).rejects.toThrow(`${mockElementoPersonalizado._id} doesn't exist`);

      expect(elementoPersonalizadoModel.findById).toHaveBeenCalledWith(
        mockElementoPersonalizado._id,
      );
    });
  });

  describe('put', () => {
    it('Debería actualizar un elemento personalizado', async () => {
      jest.spyOn(seccionModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSeccion),
      } as any);
      jest.spyOn(elementoHtmlModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockElementoHtml),
      } as any);
      jest
        .spyOn(elementoPersonalizadoModel, 'findByIdAndUpdate')
        .mockReturnValue({
          exec: jest
            .fn()
            .mockResolvedValue(
              mockElementoPersonalizado as unknown as ElementoPersonalizado,
            ),
        } as any);

      const result = await elementoPersonalizadoService.put(
        mockElementoPersonalizado._id,
        mockElementoPersonalizadoDto,
      );

      expect(elementoPersonalizadoModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockElementoPersonalizado._id,
        mockElementoPersonalizadoDto,
        { new: true },
      );
      expect(result).toEqual(mockElementoPersonalizado);
    });

    it('Debería lanzar un error si el elemento personalizado no existe', async () => {
      jest.spyOn(seccionModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSeccion),
      } as any);
      jest.spyOn(elementoHtmlModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockElementoHtml),
      } as any);
      jest
        .spyOn(elementoPersonalizadoModel, 'findByIdAndUpdate')
        .mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        } as any);

      await expect(
        elementoPersonalizadoService.put(
          mockElementoPersonalizado._id,
          mockElementoPersonalizadoDto,
        ),
      ).rejects.toThrow(`${mockElementoPersonalizado._id} doesn't exist`);

      expect(elementoPersonalizadoModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockElementoPersonalizado._id,
        mockElementoPersonalizadoDto,
        { new: true },
      );
    });
  });

  describe('delete', () => {
    it('Debería desactivar un elemento personalizado', async () => {
      jest
        .spyOn(elementoPersonalizadoModel, 'findByIdAndUpdate')
        .mockReturnValue({
          exec: jest
            .fn()
            .mockResolvedValue(
              mockElementoPersonalizado as unknown as ElementoPersonalizado,
            ),
        } as any);

      const result = await elementoPersonalizadoService.delete(
        mockElementoPersonalizado._id,
      );

      expect(elementoPersonalizadoModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockElementoPersonalizado._id,
        { activo: false },
        { new: true },
      );
      expect(result).toEqual(mockElementoPersonalizado);
    });

    it('Debería lanzar un error si el elemento personalizado no existe', async () => {
      jest
        .spyOn(elementoPersonalizadoModel, 'findByIdAndUpdate')
        .mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        } as any);

      await expect(
        elementoPersonalizadoService.delete(mockElementoPersonalizado._id),
      ).rejects.toThrow(`${mockElementoPersonalizado._id} doesn't exist`);

      expect(elementoPersonalizadoModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockElementoPersonalizado._id,
        { activo: false },
        { new: true },
      );
    });
  });
});
