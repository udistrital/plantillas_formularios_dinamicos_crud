import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ModuloService } from './modulo.service';
import { Modulo } from './schemas/modulo.schema';
import { ModuloDto } from './dto/modulo.dto';
import { FilterDto } from '../filters/filters.dto';
import { Model } from 'mongoose';

const mockModuloDto: ModuloDto = {
  nombre: 'Modulo 1',
  descripcion: 'Descripción del módulo 1',
  sistema_id: 1,
  activo: true,
  fecha_creacion: new Date(),
  fecha_modificacion: new Date(),
};

const mockModulo = {
  ...mockModuloDto,
  _id: '66aed6a431c4ca1c60085cdd',
};

describe('ModuloService', () => {
  let moduloService: ModuloService;
  let model: Model<Modulo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModuloService,
        {
          provide: getModelToken(Modulo.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    moduloService = module.get<ModuloService>(ModuloService);
    model = module.get<Model<Modulo>>(getModelToken(Modulo.name));
  });

  it('Debería estar definido', () => {
    expect(moduloService).toBeDefined();
  });

  describe('post', () => {
    it('Debería crear y devolver un módulo', async () => {
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockModuloDto));

      const result = await moduloService.post(mockModuloDto);
      expect(result).toEqual(mockModuloDto);
    });
  });

  describe('getAll', () => {
    it('Debería retornar todos los módulos con filtros aplicados', async () => {
      const mockModulos = [
        {
          _id: '66aed6a431c4ca1c60085cdd',
          nombre: 'Modulo 1',
          descripcion: 'Descripción 1',
          sistema_id: 1,
          activo: true,
          fecha_creacion: new Date(),
          fecha_modificacion: new Date(),
        },
        {
          _id: '266aed6a431c4ca1c60085cde',
          nombre: 'Modulo 2',
          descripcion: 'Descripción 2',
          sistema_id: 2,
          activo: true,
          fecha_creacion: new Date(),
          fecha_modificacion: new Date(),
        },
      ];

      const mockFilterDto: FilterDto = {
        query: 'nombre:Modulo 1',
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
        exec: jest.fn().mockResolvedValue(mockModulos),
      };

      jest.spyOn(model, 'find').mockReturnValue(mockQuery as any);

      const result = await moduloService.getAll(mockFilterDto);

      expect(result).toEqual(mockModulos);
    });
  });

  describe('getById', () => {
    it('Debería retornar un módulo por su ID', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockModulo as Modulo),
      } as any);

      const result = await moduloService.getById(mockModulo._id);

      expect(model.findById).toHaveBeenCalledWith(mockModulo._id);
      expect(result).toEqual(mockModulo);
    });

    it('Debería lanzar un error si el módulo no existe', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(moduloService.getById(mockModulo._id)).rejects.toThrow(
        `${mockModulo._id} doesn't exist`,
      );

      expect(model.findById).toHaveBeenCalledWith(mockModulo._id);
    });
  });

  describe('put', () => {
    it('Debería actualizar un módulo', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockModuloDto as Modulo),
      } as any);

      const result = await moduloService.put(mockModulo._id, mockModulo);

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        mockModulo._id,
        mockModulo,
        { new: true },
      );
      expect(result).toEqual(mockModuloDto);
    });

    it('Debería lanzar un error si el módulo no existe', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        moduloService.put(mockModulo._id, mockModulo),
      ).rejects.toThrow(`${mockModulo._id} doesn't exist`);

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        mockModulo._id,
        mockModulo,
        { new: true },
      );
    });
  });

  describe('delete', () => {
    it('Debería marcar un módulo como inactivo', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockModuloDto as Modulo),
      } as any);

      const result = await moduloService.delete(mockModulo._id);

      expect(result).toEqual(mockModuloDto);
    });

    it('Debería lanzar un error si el módulo no existe', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(moduloService.delete(mockModulo._id)).rejects.toThrow(
        `${mockModulo._id} doesn't exist`,
      );
    });
  });
});
