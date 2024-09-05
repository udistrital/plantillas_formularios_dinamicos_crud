import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CampoService } from './campo.service';
import { Campo } from './schemas/campo.schema';
import { CampoDto } from './dto/campo.dto';
import { Seccion } from '../seccion/schemas/seccion.schema';
import { ElementoHtml } from '../elemento-html/schemas/elemento-html.schema';
import { Model } from 'mongoose';
import { FilterDto } from '../filters/filters.dto';

const mockCampoDto: CampoDto = {
  nombre: 'Campo',
  descripcion: 'Descripción del campo',
  seccion_id: '66aed6a431c4ca1c60085cdd',
  elemento_html_id: '66aed6a431c4ca1c60085cde',
  label: {},
  deshabilitado: false,
  solo_lectura: false,
  placeholder: {},
  validaciones: {},
  parametros: {},
  dependencia: {},
  activo: true,
  fecha_creacion: new Date(),
  fecha_modificacion: new Date(),
};

const mockCampo = {
  ...mockCampoDto,
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

describe('CampoService', () => {
  let campoService: CampoService;
  let campoModel: Model<Campo>;
  let seccionModel: Model<Seccion>;
  let elementoHtmlModel: Model<ElementoHtml>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampoService,
        {
          provide: getModelToken(Campo.name),
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

    campoService = module.get<CampoService>(
      CampoService,
    );
    campoModel = module.get<Model<Campo>>(
      getModelToken(Campo.name),
    );
    seccionModel = module.get<Model<Seccion>>(getModelToken(Seccion.name));
    elementoHtmlModel = module.get<Model<ElementoHtml>>(
      getModelToken(ElementoHtml.name),
    );
  });

  it('Debería estar definido', () => {
    expect(campoService).toBeDefined();
  });

  describe('post', () => {
    it('Debería crear y devolver un campo', async () => {
      jest.spyOn(seccionModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSeccion),
      } as any);
      jest.spyOn(elementoHtmlModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockElementoHtml),
      } as any);
      jest
        .spyOn(campoModel, 'create')
        .mockImplementationOnce(() =>
          Promise.resolve(mockCampo),
        );

      const result = await campoService.post(
        mockCampoDto,
      );

      expect(result).toEqual(mockCampo);
    });

    it('Debería lanzar un error si la sección relacionada no existe', async () => {
      jest.spyOn(seccionModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      jest.spyOn(elementoHtmlModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockElementoHtml),
      } as any);

      await expect(
        campoService.post(mockCampoDto),
      ).rejects.toThrow(
        `Elemento-personalizado with id ${mockCampoDto.seccion_id} doesn't exist`,
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
        campoService.post(mockCampoDto),
      ).rejects.toThrow(
        `Elemento-html with id ${mockCampoDto.elemento_html_id} doesn't exist`,
      );
    });
  });

  describe('getAll', () => {
    it('Debería retornar todos los campos con filtros aplicados', async () => {
      const mockElementosPersonalizados = [
        mockCampo,
        {
          _id: '66aed6a431c4ca1c60085ce0',
          nombre: 'campo 2',
          descripcion: 'Otra descripción',
          seccion_id: '66aed6a431c4ca1c60085cdd',
          elemento_html_id: '66aed6a431c4ca1c60085cde',
          activo: true,
          fecha_creacion: new Date(),
          fecha_modificacion: new Date(),
        },
      ];

      const mockFilterDto: FilterDto = {
        query: 'nombre:campo',
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
        .spyOn(campoModel, 'find')
        .mockReturnValue(mockQuery as any);

      const result = await campoService.getAll(mockFilterDto);

      expect(result).toEqual(mockElementosPersonalizados);
    });
  });

  describe('getById', () => {
    it('Debería retornar un campo por su ID', async () => {
      jest.spyOn(campoModel, 'findById').mockReturnValue({
        exec: jest
          .fn()
          .mockResolvedValue(
            mockCampo as unknown as Campo,
          ),
      } as any);

      const result = await campoService.getById(
        mockCampo._id,
      );

      expect(campoModel.findById).toHaveBeenCalledWith(
        mockCampo._id,
      );
      expect(result).toEqual(mockCampo);
    });

    it('Debería lanzar un error si el campo no existe', async () => {
      jest.spyOn(campoModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        campoService.getById(mockCampo._id),
      ).rejects.toThrow(`${mockCampo._id} doesn't exist`);

      expect(campoModel.findById).toHaveBeenCalledWith(
        mockCampo._id,
      );
    });
  });

  describe('put', () => {
    it('Debería actualizar un campo', async () => {
      jest.spyOn(seccionModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSeccion),
      } as any);
      jest.spyOn(elementoHtmlModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockElementoHtml),
      } as any);
      jest
        .spyOn(campoModel, 'findByIdAndUpdate')
        .mockReturnValue({
          exec: jest
            .fn()
            .mockResolvedValue(
              mockCampo as unknown as Campo,
            ),
        } as any);

      const result = await campoService.put(
        mockCampo._id,
        mockCampoDto,
      );

      expect(campoModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockCampo._id,
        mockCampoDto,
        { new: true },
      );
      expect(result).toEqual(mockCampo);
    });

    it('Debería lanzar un error si el campo no existe', async () => {
      jest.spyOn(seccionModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSeccion),
      } as any);
      jest.spyOn(elementoHtmlModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockElementoHtml),
      } as any);
      jest
        .spyOn(campoModel, 'findByIdAndUpdate')
        .mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        } as any);

      await expect(
        campoService.put(
          mockCampo._id,
          mockCampoDto,
        ),
      ).rejects.toThrow(`${mockCampo._id} doesn't exist`);

      expect(campoModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockCampo._id,
        mockCampoDto,
        { new: true },
      );
    });
  });

  describe('delete', () => {
    it('Debería desactivar un campo', async () => {
      jest
        .spyOn(campoModel, 'findByIdAndUpdate')
        .mockReturnValue({
          exec: jest
            .fn()
            .mockResolvedValue(
              mockCampo as unknown as Campo,
            ),
        } as any);

      const result = await campoService.delete(
        mockCampo._id,
      );

      expect(campoModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockCampo._id,
        { activo: false },
        { new: true },
      );
      expect(result).toEqual(mockCampo);
    });

    it('Debería lanzar un error si el campo no existe', async () => {
      jest
        .spyOn(campoModel, 'findByIdAndUpdate')
        .mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        } as any);

      await expect(
        campoService.delete(mockCampo._id),
      ).rejects.toThrow(`${mockCampo._id} doesn't exist`);

      expect(campoModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockCampo._id,
        { activo: false },
        { new: true },
      );
    });
  });
});
