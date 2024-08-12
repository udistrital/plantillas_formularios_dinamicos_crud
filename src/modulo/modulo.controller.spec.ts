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
    const mockFilterDto: FilterDto = {
      query: 'nombre:Modulo',
      fields: 'nombre,descripcion',
      sortby: 'fecha_creacion',
      order: 'desc',
      limit: '10',
      offset: '0',
      populate: 'true',
    };
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
      jest.spyOn(service, 'getById').mockResolvedValue(mockModulo as any);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getById(res as any, mockModulo._id);

      expect(service.getById).toHaveBeenCalledWith(mockModulo._id);
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
        .mockRejectedValue(new Error(`${mockModulo._id} doesn't exist`));

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getById(res as any, mockModulo._id);

      expect(service.getById).toHaveBeenCalledWith(mockModulo._id);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        Success: false,
        Status: HttpStatus.NOT_FOUND,
        Message:
          'Error service GetOne: The request contains an incorrect parameter or no record exist',
        Data: `${mockModulo._id} doesn't exist`,
      });
    });
  });

  describe('put', () => {
    it('Debería retornar OK con datos válidos', async () => {
      jest.spyOn(service, 'put').mockResolvedValue(mockModulo as any);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.put(res as any, mockModulo._id, mockModuloDto);

      expect(service.put).toHaveBeenCalledWith(mockModulo._id, mockModuloDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Update successful',
        Data: mockModulo,
      });
    });

    it('Debería retornar NotFound con id inválido', async () => {
      const mockError = new Error(`${mockModulo._id} doesn't exist`);

      jest.spyOn(service, 'put').mockRejectedValue(mockError);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.put(res as any, mockModulo._id, mockModuloDto);

      expect(service.put).toHaveBeenCalledWith(mockModulo._id, mockModuloDto);
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
      jest.spyOn(service, 'delete').mockResolvedValue(mockModulo as any);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.delete(res as any, mockModulo._id);

      expect(service.delete).toHaveBeenCalledWith(mockModulo._id);
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
        .mockRejectedValue(new Error(`${mockModulo._id} doesn't exist`));

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.delete(res as any, mockModulo._id);

      expect(service.delete).toHaveBeenCalledWith(mockModulo._id);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        Success: false,
        Status: HttpStatus.NOT_FOUND,
        Message: 'Error service Delete: Request contains incorrect parameter',
        Data: `${mockModulo._id} doesn't exist`,
      });
    });
  });
});
