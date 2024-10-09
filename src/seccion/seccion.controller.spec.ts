import { Test, TestingModule } from '@nestjs/testing';
import { SeccionController } from './seccion.controller';
import { SeccionService } from './seccion.service';
import { HttpStatus } from '@nestjs/common';
import { SeccionDto } from './dto/seccion.dto';
import { FilterDto } from '../filters/filters.dto';

const mockSeccionDto: SeccionDto = {
  nombre: 'Sección 1',
  descripcion: 'Descripción de la sección 1',
  formulario_id: 'formulario_id_1',
  padre_id: '66aed6a431c4ca1c60085cde',
  etiqueta: {},
  icono: 'home',
  activo: true,
  fecha_creacion: new Date(),
  fecha_modificacion: new Date(),
};

const mockSeccion = {
  ...mockSeccionDto,
  _id: '66aed6a431c4ca1c60085cdd',
};

describe('SeccionController', () => {
  let controller: SeccionController;
  let service: SeccionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeccionController],
      providers: [
        {
          provide: SeccionService,
          useValue: {
            post: jest.fn(),
            getAll: jest.fn(),
            getById: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SeccionController>(SeccionController);
    service = module.get<SeccionService>(SeccionService);
  });

  it('Debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('post', () => {
    it('Debería retornar Created con datos válidos', async () => {
      jest.spyOn(service, 'post').mockResolvedValue(mockSeccion as any);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.post(res as any, mockSeccionDto);

      expect(service.post).toHaveBeenCalledWith(mockSeccionDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        Success: true,
        Status: HttpStatus.CREATED,
        Message: 'Registration successful',
        Data: mockSeccion,
      });
    });

    it('Debería retornar BadRequest con error', async () => {
      const mockError = new Error(
        'Seccion validation failed: activo: Cast to Boolean failed for value "2" (type number) at path "activo"',
      );

      jest.spyOn(service, 'post').mockRejectedValue(mockError);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.post(res as any, mockSeccionDto);

      expect(service.post).toHaveBeenCalledWith(mockSeccionDto);
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
      query: 'nombre:Sección',
      fields: 'nombre,descripcion',
      sortby: 'fecha_creacion',
      order: 'desc',
      limit: '10',
      offset: '0',
      populate: 'true',
    };

    it('Debería retornar OK con datos válidos', async () => {
      const mockSecciones = [
        {
          ...mockSeccion,
          _id: '1',
          nombre: 'Sección 1',
        },
        {
          ...mockSeccion,
          _id: '2',
          nombre: 'Sección 2',
        },
      ];

      jest.spyOn(service, 'getAll').mockResolvedValue(mockSecciones as any);

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
        Data: mockSecciones,
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
      jest.spyOn(service, 'getById').mockResolvedValue(mockSeccion as any);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getById(res as any, mockSeccion._id);

      expect(service.getById).toHaveBeenCalledWith(mockSeccion._id);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Request successful',
        Data: mockSeccion,
      });
    });

    it('Debería retornar NotFound con id inválido', async () => {
      jest
        .spyOn(service, 'getById')
        .mockRejectedValue(new Error(`${mockSeccion._id} doesn't exist`));

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getById(res as any, mockSeccion._id);

      expect(service.getById).toHaveBeenCalledWith(mockSeccion._id);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        Success: false,
        Status: HttpStatus.NOT_FOUND,
        Message:
          'Error service GetOne: The request contains an incorrect parameter or no record exist',
        Data: `${mockSeccion._id} doesn't exist`,
      });
    });
  });

  describe('put', () => {
    it('Debería retornar OK con datos válidos', async () => {
      jest.spyOn(service, 'put').mockResolvedValue(mockSeccion as any);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.put(res as any, mockSeccion._id, mockSeccionDto);

      expect(service.put).toHaveBeenCalledWith(mockSeccion._id, mockSeccionDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Update successful',
        Data: mockSeccion,
      });
    });

    it('Debería retornar BadRequest con error', async () => {
      const mockError = new Error(`${mockSeccion._id} doesn't exist`);

      jest.spyOn(service, 'put').mockRejectedValue(mockError);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.put(res as any, mockSeccion._id, mockSeccionDto);

      expect(service.put).toHaveBeenCalledWith(mockSeccion._id, mockSeccionDto);
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
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.delete(res as any, mockSeccion._id);

      expect(service.delete).toHaveBeenCalledWith(mockSeccion._id);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Delete successful',
        Data: {
          _id: mockSeccion._id,
        },
      });
    });

    it('Debería retornar NotFound con error', async () => {
      const mockError = new Error('Record not found');

      jest.spyOn(service, 'delete').mockRejectedValue(mockError);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.delete(res as any, mockSeccion._id);

      expect(service.delete).toHaveBeenCalledWith(mockSeccion._id);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        Success: false,
        Status: HttpStatus.NOT_FOUND,
        Message: 'Error service Delete: Request contains incorrect parameter',
        Data: mockError.message,
      });
    });
  });
});
