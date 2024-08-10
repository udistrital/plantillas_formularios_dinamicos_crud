import { Test, TestingModule } from '@nestjs/testing';
import { ElementoHtmlController } from './elemento-html.controller';
import { ElementoHtmlService } from './elemento-html.service';
import { HttpStatus } from '@nestjs/common';
import { ElementoHtmlDto } from './dto/elemento-html.dto';
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
  _id: '66aed6a431c4ca1c60085cdd',
};

describe('ElementoHtmlController', () => {
  let controller: ElementoHtmlController;
  let service: ElementoHtmlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElementoHtmlController],
      providers: [
        {
          provide: ElementoHtmlService,
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

    controller = module.get<ElementoHtmlController>(ElementoHtmlController);
    service = module.get<ElementoHtmlService>(ElementoHtmlService);
  });

  it('Debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('post', () => {
    it('Debería retornar Created con datos válidos', async () => {
      jest.spyOn(service, 'post').mockResolvedValue(mockElementoHtml as any);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.post(res as any, mockElementoHtmlDto);

      expect(service.post).toHaveBeenCalledWith(mockElementoHtmlDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        Success: true,
        Status: HttpStatus.CREATED,
        Message: 'Registration successful',
        Data: mockElementoHtml,
      });
    });

    it('Debería retornar BadRequest con error', async () => {
      const mockError = new Error(
        'ElementoHtml validation failed: activo: Cast to Boolean failed for value "2" (type number) at path "activo"',
      );

      jest.spyOn(service, 'post').mockRejectedValue(mockError);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.post(res as any, mockElementoHtmlDto);

      expect(service.post).toHaveBeenCalledWith(mockElementoHtmlDto);
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
      query: 'nombre:Elemento',
      fields: 'nombre,tipo',
      sortby: 'fecha_creacion',
      order: 'desc',
      limit: '10',
      offset: '0',
      populate: 'true',
    };

    it('Debería retornar OK con datos válidos', async () => {
      const mockElementosHtml = [
        {
          ...mockElementoHtml,
          _id: '1',
          nombre: 'Elemento HTML 1',
        },
        {
          ...mockElementoHtml,
          _id: '2',
          nombre: 'Elemento HTML 2',
        },
      ];

      jest.spyOn(service, 'getAll').mockResolvedValue(mockElementosHtml as any);

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
        Data: mockElementosHtml,
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
      jest.spyOn(service, 'getById').mockResolvedValue(mockElementoHtml as any);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getById(res as any, mockElementoHtml._id);

      expect(service.getById).toHaveBeenCalledWith(mockElementoHtml._id);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Request successful',
        Data: mockElementoHtml,
      });
    });

    it('Debería retornar NotFound con id inválido', async () => {
      jest
        .spyOn(service, 'getById')
        .mockRejectedValue(new Error(`${mockElementoHtml._id} doesn't exist`));

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getById(res as any, mockElementoHtml._id);

      expect(service.getById).toHaveBeenCalledWith(mockElementoHtml._id);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        Success: false,
        Status: HttpStatus.NOT_FOUND,
        Message:
          'Error service GetOne: The request contains an incorrect parameter or no record exist',
        Data: `${mockElementoHtml._id} doesn't exist`,
      });
    });
  });

  describe('put', () => {
    it('Debería retornar OK con datos válidos', async () => {
      jest.spyOn(service, 'put').mockResolvedValue(mockElementoHtml as any);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.put(
        res as any,
        mockElementoHtml._id,
        mockElementoHtmlDto,
      );

      expect(service.put).toHaveBeenCalledWith(
        mockElementoHtml._id,
        mockElementoHtmlDto,
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Update successful',
        Data: mockElementoHtml,
      });
    });

    it('Debería retornar BadRequest con error', async () => {
      const mockError = new Error(`${mockElementoHtml._id} doesn't exist`);

      jest.spyOn(service, 'put').mockRejectedValue(mockError);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.put(
        res as any,
        mockElementoHtml._id,
        mockElementoHtmlDto,
      );

      expect(service.put).toHaveBeenCalledWith(
        mockElementoHtml._id,
        mockElementoHtmlDto,
      );
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

      await controller.delete(res as any, mockElementoHtml._id);

      expect(service.delete).toHaveBeenCalledWith(mockElementoHtml._id);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Delete successful',
        Data: {
          _id: mockElementoHtml._id,
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

      await controller.delete(res as any, mockElementoHtml._id);

      expect(service.delete).toHaveBeenCalledWith(mockElementoHtml._id);
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
