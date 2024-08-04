import { Test, TestingModule } from '@nestjs/testing';
import { ModuloController } from './modulo.controller';
import { ModuloService } from './modulo.service';
import { HttpStatus } from '@nestjs/common';
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

describe('ModuloController', () => {
  let controller: ModuloController;
  let service: ModuloService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModuloController],
      providers: [
        {
          provide: ModuloService,
          useValue: {
            post: jest.fn(),
            getAll: jest.fn(),
            getById: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: FiltersService,
          useValue: {
            isPopulated: jest.fn(),
            getQuery: jest.fn(),
            getFields: jest.fn(),
            getLimitAndOffset: jest.fn(),
            getSortBy: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ModuloController>(ModuloController);
    service = module.get<ModuloService>(ModuloService);
  });

  it('Debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('post', () => {
    it('Debería retornar Created con datos válidos', async () => {
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
      };

      jest.spyOn(service, 'post').mockResolvedValue(mockModulo as any);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.post(res as any, mockModuloDto);

      expect(service.post).toHaveBeenCalledWith(mockModuloDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        Success: true,
        Status: HttpStatus.CREATED,
        Message: 'Registration successful',
        Data: mockModulo,
      });
    });

    it('Debería retornar BadRequest con error', async () => {
      const mockModuloDto: ModuloDto = {
        nombre: 'Modulo 1',
        descripcion: 'Descripción del módulo 1',
        sistema_id: 1,
        activo: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };
      const mockError = new Error(
        'Modulo validation failed: activo: Cast to Boolean failed for value "2" (type number) at path "activo"',
      );

      jest.spyOn(service, 'post').mockRejectedValue(mockError);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.post(res as any, mockModuloDto);

      expect(service.post).toHaveBeenCalledWith(mockModuloDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        Success: false,
        Status: HttpStatus.BAD_REQUEST,
        Message:
          'Error service Post: The request contains an incorrect data type or an invalid parameter',
        Data: mockError.message,
      });
    });
  });

  describe('getAll', () => {
    it('Debería retornar OK con datos válidos', async () => {
      const mockModulos: ModuloTest[] = [
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

      jest.spyOn(service, 'getAll').mockResolvedValue(mockModulos as any);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getAll(res as any, mockFilterDto);

      expect(service.getAll).toHaveBeenCalledWith(mockFilterDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Request successful',
        Data: mockModulos,
      });
    });

    it('Debería retornar NotFound con error', async () => {
      const mockFilterDto: FilterDto = {
        query: 'nombre:Modulo',
        fields: 'nombre,descripcion',
        sortby: 'fecha_creacion',
        order: 'desc',
        limit: '10',
        offset: '0',
        populate: 'true',
      };
      const mockError = new Error('No records found');

      jest.spyOn(service, 'getAll').mockRejectedValue(mockError);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getAll(res as any, mockFilterDto);

      expect(service.getAll).toHaveBeenCalledWith(mockFilterDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        Success: false,
        Status: HttpStatus.NOT_FOUND,
        Message:
          'Error service GetAll: The request contains an incorrect parameter or no record exist',
        Data: mockError.message,
      });
    });
  });

  describe('getById', () => {
    it('Debería retornar OK con id válido', async () => {
      const mockModulo: ModuloTest = {
        _id: '1',
        nombre: 'Modulo 1',
        descripcion: 'Descripción 1',
        sistema_id: 1,
        activo: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };

      jest.spyOn(service, 'getById').mockResolvedValue(mockModulo as any);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getById(res as any, '1');

      expect(service.getById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Request successful',
        Data: mockModulo,
      });
    });

    it('Debería retornar NotFound con id inválido', async () => {
      jest
        .spyOn(service, 'getById')
        .mockRejectedValue(new Error(`1 doesn't exist`));

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getById(res as any, '1');

      expect(service.getById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        Success: false,
        Status: HttpStatus.NOT_FOUND,
        Message:
          'Error service GetOne: The request contains an incorrect parameter or no record exist',
        Data: `1 doesn't exist`,
      });
    });
  });

  describe('put', () => {
    it('Debería retornar OK con datos válidos', async () => {
      const mockId = '1';
      const mockModuloDto: ModuloDto = {
        nombre: 'Modulo 1',
        descripcion: 'Descripción del módulo 1',
        sistema_id: 1,
        activo: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };

      const mockModulo: ModuloTest = {
        _id: mockId,
        ...mockModuloDto,
        fecha_creacion: new Date(),
      };

      jest.spyOn(service, 'put').mockResolvedValue(mockModulo as any);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.put(res as any, mockId, mockModuloDto);

      expect(service.put).toHaveBeenCalledWith(mockId, mockModuloDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Update successful',
        Data: mockModulo,
      });
    });

    it('Debería retornar NotFound con id inválido', async () => {
      const mockId = '1';
      const mockModuloDto: ModuloDto = {
        nombre: 'Modulo 1',
        descripcion: 'Descripción del módulo 1',
        sistema_id: 1,
        activo: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };
      const mockError = new Error(`1 doesn't exist`);

      jest.spyOn(service, 'put').mockRejectedValue(mockError);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.put(res as any, mockId, mockModuloDto);

      expect(service.put).toHaveBeenCalledWith(mockId, mockModuloDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        Success: false,
        Status: HttpStatus.BAD_REQUEST,
        Message:
          'Error service Put: The request contains an incorrect data type or an invalid parameter',
        Data: mockError.message,
      });
    });
  });

  describe('delete', () => {
    it('Debería retornar OK con id válido', async () => {
      const mockModulo: ModuloTest = {
        _id: '1',
        nombre: 'Modulo 1',
        descripcion: 'Descripción 1',
        sistema_id: 1,
        activo: false,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };

      jest.spyOn(service, 'delete').mockResolvedValue(mockModulo as any);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.delete(res as any, '1');

      expect(service.delete).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Delete successful',
        Data: {
          _id: mockModulo._id,
        },
      });
    });

    it('Debería retornar NotFound con id inválido', async () => {
      jest
        .spyOn(service, 'delete')
        .mockRejectedValue(new Error(`1 doesn't exist`));

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.delete(res as any, '1');

      expect(service.delete).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        Success: false,
        Status: HttpStatus.NOT_FOUND,
        Message: 'Error service Delete: Request contains incorrect parameter',
        Data: `1 doesn't exist`,
      });
    });
  });
});
