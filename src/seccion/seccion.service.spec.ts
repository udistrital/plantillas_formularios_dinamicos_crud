import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SeccionService } from './seccion.service';
import { Seccion } from './schemas/seccion.schema';
import { SeccionDto } from './dto/seccion.dto';
import { Formulario } from '../formulario/schemas/formulario.schema';
import { Model } from 'mongoose';
import { FilterDto } from '../filters/filters.dto';

const mockSeccionDto: SeccionDto = {
  nombre: 'Sección de Prueba',
  descripcion: 'Descripción de la sección de prueba',
  formulario_id: '66aed6a431c4ca1c60085cdd',
  padre_id: '66aed6a431c4ca1c60085cde',
  label: {},
  activo: true,
  fecha_creacion: new Date(),
  fecha_modificacion: new Date(),
};

const mockSeccion = {
  ...mockSeccionDto,
  _id: '66aed6a431c4ca1c60085cde',
};

const mockFormulario = {
  _id: '66aed6a431c4ca1c60085cdd',
  nombre: 'Formulario de Prueba',
};

const mockSeccionPadre = {
  _id: '66aed6a431c4ca1c60085cde',
  nombre: 'Sección Padre',
};

describe('SeccionService', () => {
  let seccionService: SeccionService;
  let seccionModel: Model<Seccion>;
  let formularioModel: Model<Formulario>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeccionService,
        {
          provide: getModelToken(Seccion.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
        {
          provide: getModelToken(Formulario.name),
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    seccionService = module.get<SeccionService>(SeccionService);
    seccionModel = module.get<Model<Seccion>>(getModelToken(Seccion.name));
    formularioModel = module.get<Model<Formulario>>(
      getModelToken(Formulario.name),
    );
  });

  it('Debería estar definido', () => {
    expect(seccionService).toBeDefined();
  });

  describe('post', () => {
    it('Debería crear y devolver una sección', async () => {
      jest.spyOn(formularioModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockFormulario),
      } as any);
      jest.spyOn(seccionModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSeccionPadre),
      } as any);
      jest
        .spyOn(seccionModel, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockSeccion));

      const result = await seccionService.post(mockSeccionDto);
      expect(result).toEqual(mockSeccion);
    });

    it('Debería lanzar un error si el formulario no existe', async () => {
      jest.spyOn(formularioModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(seccionService.post(mockSeccionDto)).rejects.toThrow(
        `Formulario with id ${mockSeccionDto.formulario_id} doesn't exist`,
      );
    });

    it('Debería lanzar un error si la sección padre no existe', async () => {
      jest.spyOn(formularioModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockFormulario),
      } as any);
      jest.spyOn(seccionModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(seccionService.post(mockSeccionDto)).rejects.toThrow(
        `Seccion with id ${mockSeccionDto.padre_id} doesn't exist`,
      );
    });
  });

  describe('getAll', () => {
    it('Debería retornar todas las secciones con filtros aplicados', async () => {
      const mockSecciones = [
        mockSeccion,
        {
          _id: '66aed6a431c4ca1c60085cdf',
          nombre: 'Sección de Prueba 2',
          descripcion: 'Otra descripción',
          formulario_id: '66aed6a431c4ca1c60085cdf',
          padre_id: '66aed6a431c4ca1c60085ce0',
          activo: true,
          fecha_creacion: new Date(),
          fecha_modificacion: new Date(),
        },
      ];

      const mockFilterDto: FilterDto = {
        query: 'nombre:Sección de Prueba',
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
        exec: jest.fn().mockResolvedValue(mockSecciones),
      };

      jest.spyOn(seccionModel, 'find').mockReturnValue(mockQuery as any);

      const result = await seccionService.getAll(mockFilterDto);

      expect(result).toEqual(mockSecciones);
    });
  });

  describe('getById', () => {
    it('Debería retornar una sección por su ID', async () => {
      jest.spyOn(seccionModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSeccion),
      } as any);

      const result = await seccionService.getById(mockSeccion._id);

      expect(seccionModel.findById).toHaveBeenCalledWith(mockSeccion._id);
      expect(result).toEqual(mockSeccion);
    });

    it('Debería lanzar un error si la sección no existe', async () => {
      jest.spyOn(seccionModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(seccionService.getById(mockSeccion._id)).rejects.toThrow(
        `${mockSeccion._id} doesn't exist`,
      );

      expect(seccionModel.findById).toHaveBeenCalledWith(mockSeccion._id);
    });
  });

  describe('put', () => {
    it('Debería actualizar una sección', async () => {
      jest.spyOn(formularioModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockFormulario),
      } as any);
      jest.spyOn(seccionModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSeccionPadre),
      } as any);
      jest.spyOn(seccionModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSeccion),
      } as any);

      const result = await seccionService.put(mockSeccion._id, mockSeccionDto);

      expect(seccionModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockSeccion._id,
        mockSeccionDto,
        { new: true },
      );
      expect(result).toEqual(mockSeccion);
    });

    it('Debería lanzar un error si la sección no existe', async () => {
      jest.spyOn(formularioModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockFormulario),
      } as any);
      jest.spyOn(seccionModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSeccionPadre),
      } as any);
      jest.spyOn(seccionModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        seccionService.put(mockSeccion._id, mockSeccionDto),
      ).rejects.toThrow(`${mockSeccion._id} doesn't exist`);

      expect(seccionModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockSeccion._id,
        mockSeccionDto,
        { new: true },
      );
    });

    it('Debería lanzar un error si el formulario relacionado no existe', async () => {
      jest.spyOn(formularioModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        seccionService.put(mockSeccion._id, mockSeccionDto),
      ).rejects.toThrow(
        `Formulario with id ${mockSeccionDto.formulario_id} doesn't exist`,
      );
    });

    it('Debería lanzar un error si la sección padre no existe', async () => {
      jest.spyOn(formularioModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockFormulario),
      } as any);
      jest.spyOn(seccionModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        seccionService.put(mockSeccion._id, mockSeccionDto),
      ).rejects.toThrow(
        `Seccion with id ${mockSeccionDto.padre_id} doesn't exist`,
      );
    });
  });

  describe('delete', () => {
    it('Debería marcar una sección como inactiva', async () => {
      jest.spyOn(seccionModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSeccion),
      } as any);

      const result = await seccionService.delete(mockSeccion._id);

      expect(seccionModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockSeccion._id,
        { activo: false },
        { new: true },
      );
      expect(result).toEqual(mockSeccion);
    });

    it('Debería lanzar un error si la sección no existe', async () => {
      jest.spyOn(seccionModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(seccionService.delete(mockSeccion._id)).rejects.toThrow(
        `${mockSeccion._id} doesn't exist`,
      );

      expect(seccionModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockSeccion._id,
        { activo: false },
        { new: true },
      );
    });
  });
});
