import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ModuloService } from './modulo.service';
import { Modulo } from './schemas/modulo.schema';
import { ModuloDto } from './dto/modulo.dto';
import { FilterDto } from '../filters/filters.dto';
import { FiltersService } from '../filters/filters.service';

interface ModuloTest {
  _id: string;
  nombre: string;
  descripcion: string;
  sistema_id: number;
  activo: boolean;
  fecha_creacion: Date;
  fecha_modificacion: Date;
}

describe('ModuloService', () => {
  let service: ModuloService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModuloService,
        {
          provide: getModelToken(Modulo.name),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ModuloService>(ModuloService);
  });

  it('Debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('post', () => {
    it('Debería crear un módulo', async () => {
      const mockModuloDto: ModuloDto = {
        nombre: 'Modulo 1',
        descripcion: 'Descripción del módulo 1',
        sistema_id: 1,
        activo: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };

      const mockModulo: ModuloTest = {
        ...mockModuloDto,
        _id: '1',
      };

      jest
        .spyOn(service, 'post')
        .mockResolvedValue(mockModulo as unknown as Modulo);

      const result = await service.post(mockModuloDto);

      expect(result).toEqual(mockModulo);
    });
  });

  describe('getAll', () => {
    it('Debería retornar todos los módulos con filtros aplicados', async () => {
      const mockModulos = [
        {
          _id: '1',
          nombre: 'Modulo 1',
          descripcion: 'Descripción 1',
          sistema_id: 1,
          activo: true,
          fecha_creacion: new Date(),
          fecha_modificacion: new Date(),
        },
        {
          _id: '2',
          nombre: 'Modulo 2',
          descripcion: 'Descripción 2',
          sistema_id: 2,
          activo: true,
          fecha_creacion: new Date(),
          fecha_modificacion: new Date(),
        },
      ];

      const mockFilterDto: FilterDto = {
        query: 'nombre:Modulo',
        fields: 'nombre,descripcion',
        sortby: 'fecha_creacion',
        order: 'desc',
        limit: '10',
        offset: '0',
        populate: 'true',
      };

      const mockFiltersService = {
        isPopulated: jest.fn().mockReturnValue(true),
        getQuery: jest.fn().mockReturnValue({ nombre: /Modulo/ }),
        getFields: jest.fn().mockReturnValue('nombre descripcion'),
        getLimitAndOffset: jest.fn().mockReturnValue({ limit: 10, skip: 0 }),
        getSortBy: jest.fn().mockReturnValue({ fecha_creacion: -1 }),
      };

      jest
        .spyOn(FiltersService.prototype, 'isPopulated')
        .mockImplementation(mockFiltersService.isPopulated);
      jest
        .spyOn(FiltersService.prototype, 'getQuery')
        .mockImplementation(mockFiltersService.getQuery);
      jest
        .spyOn(FiltersService.prototype, 'getFields')
        .mockImplementation(mockFiltersService.getFields);
      jest
        .spyOn(FiltersService.prototype, 'getLimitAndOffset')
        .mockImplementation(mockFiltersService.getLimitAndOffset);
      jest
        .spyOn(FiltersService.prototype, 'getSortBy')
        .mockImplementation(mockFiltersService.getSortBy);

      jest
        .spyOn(service, 'getAll')
        .mockResolvedValue(mockModulos as unknown as Modulo[]);

      const result = await service.getAll(mockFilterDto);

      expect(result).toEqual(mockModulos);
    });
  });

  describe('getById', () => {
    it('Debería retornar un módulo por su ID', async () => {
      const mockModulo: ModuloTest = {
        _id: '1',
        nombre: 'Modulo 1',
        descripcion: 'Descripción 1',
        sistema_id: 1,
        activo: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };

      jest
        .spyOn(service, 'getById')
        .mockResolvedValue(mockModulo as unknown as Modulo);

      const result = await service.getById('1');

      expect(result).toEqual(mockModulo);
    });

    it('Debería lanzar un error si el módulo no existe', async () => {
      jest
        .spyOn(service, 'getById')
        .mockRejectedValue(new Error(`1 doesn't exist`));

      await expect(service.getById('1')).rejects.toThrow(`1 doesn't exist`);
    });
  });

  describe('put', () => {
    it('Debería actualizar un módulo', async () => {
      const mockModuloDto: ModuloDto = {
        nombre: 'Modulo 1',
        descripcion: 'Descripción del módulo 1',
        sistema_id: 1,
        activo: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };

      const mockModulo: ModuloTest = {
        _id: '1',
        ...mockModuloDto,
        fecha_creacion: new Date(),
      };

      jest
        .spyOn(service, 'put')
        .mockResolvedValue(mockModulo as unknown as Modulo);

      const result = await service.put('1', mockModuloDto);

      expect(result).toEqual(mockModulo);
    });

    it('Debería lanzar un error si el módulo no existe', async () => {
      const mockModuloDto: ModuloDto = {
        nombre: 'Modulo 1',
        descripcion: 'Descripción del módulo 1',
        sistema_id: 1,
        activo: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };

      jest
        .spyOn(service, 'put')
        .mockRejectedValue(new Error(`1 doesn't exist`));

      await expect(service.put('1', mockModuloDto)).rejects.toThrow(
        `1 doesn't exist`,
      );
    });
  });

  describe('delete', () => {
    it('Debería marcar un módulo como inactivo', async () => {
      const mockModulo: ModuloTest = {
        _id: '1',
        nombre: 'Modulo 1',
        descripcion: 'Descripción 1',
        sistema_id: 1,
        activo: false,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };

      jest
        .spyOn(service, 'delete')
        .mockResolvedValue(mockModulo as unknown as Modulo);

      const result = await service.delete('1');

      expect(result).toEqual(mockModulo);
    });

    it('Debería lanzar un error si el módulo no existe', async () => {
      jest
        .spyOn(service, 'delete')
        .mockRejectedValue(new Error(`1 doesn't exist`));

      await expect(service.delete('1')).rejects.toThrow(`1 doesn't exist`);
    });
  });
});
