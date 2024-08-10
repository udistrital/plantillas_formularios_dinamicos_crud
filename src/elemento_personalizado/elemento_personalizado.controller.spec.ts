import { Test, TestingModule } from '@nestjs/testing';
import { ElementoPersonalizadoController } from './elemento_personalizado.controller';
import { ElementoPersonalizadoService } from './elemento_personalizado.service';
import { HttpStatus } from '@nestjs/common';
import { ElementoPersonalizadoDto } from './dto/elemento_personalizado.dto';
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
  _id: '66aed6a431c4ca1c60085cdd',
};

describe('ElementoPersonalizadoController', () => {
  let controller: ElementoPersonalizadoController;
  let service: ElementoPersonalizadoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElementoPersonalizadoController],
      providers: [
        {
          provide: ElementoPersonalizadoService,
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

    controller = module.get<ElementoPersonalizadoController>(
      ElementoPersonalizadoController,
    );
    service = module.get<ElementoPersonalizadoService>(
      ElementoPersonalizadoService,
    );
  });

  it('Debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('post', () => {
    it('Debería retornar Created con datos válidos', async () => {
      jest
        .spyOn(service, 'post')
        .mockResolvedValue(mockElementoPersonalizado as any);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.post(res as any, mockElementoPersonalizadoDto);

      expect(service.post).toHaveBeenCalledWith(mockElementoPersonalizadoDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        Success: true,
        Status: HttpStatus.CREATED,
        Message: 'Registration successful',
        Data: mockElementoPersonalizado,
      });
    });

    it('Debería retornar BadRequest con error', async () => {
      const mockError = new Error(
        'ElementoPersonalizado validation failed: activo: Cast to Boolean failed for value "2" (type number) at path "activo"',
      );

      jest.spyOn(service, 'post').mockRejectedValue(mockError);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.post(res as any, mockElementoPersonalizadoDto);

      expect(service.post).toHaveBeenCalledWith(mockElementoPersonalizadoDto);
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
      const mockElementosPersonalizados = [
        {
          ...mockElementoPersonalizado,
          _id: '1',
          nombre: 'Elemento Personalizado 1',
        },
        {
          ...mockElementoPersonalizado,
          _id: '2',
          nombre: 'Elemento Personalizado 2',
        },
      ];

      jest
        .spyOn(service, 'getAll')
        .mockResolvedValue(mockElementosPersonalizados as any);

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
        Data: mockElementosPersonalizados,
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
      jest
        .spyOn(service, 'getById')
        .mockResolvedValue(mockElementoPersonalizado as any);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getById(res as any, mockElementoPersonalizado._id);

      expect(service.getById).toHaveBeenCalledWith(
        mockElementoPersonalizado._id,
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Request successful',
        Data: mockElementoPersonalizado,
      });
    });

    it('Debería retornar NotFound con id inválido', async () => {
      jest
        .spyOn(service, 'getById')
        .mockRejectedValue(
          new Error(`${mockElementoPersonalizado._id} doesn't exist`),
        );

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getById(res as any, mockElementoPersonalizado._id);

      expect(service.getById).toHaveBeenCalledWith(
        mockElementoPersonalizado._id,
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        Success: false,
        Status: HttpStatus.NOT_FOUND,
        Message:
          'Error service GetOne: The request contains an incorrect parameter or no record exist',
        Data: `${mockElementoPersonalizado._id} doesn't exist`,
      });
    });
  });

  describe('put', () => {
    it('Debería retornar OK con datos válidos', async () => {
      jest
        .spyOn(service, 'put')
        .mockResolvedValue(mockElementoPersonalizado as any);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.put(
        res as any,
        mockElementoPersonalizado._id,
        mockElementoPersonalizadoDto,
      );

      expect(service.put).toHaveBeenCalledWith(
        mockElementoPersonalizado._id,
        mockElementoPersonalizadoDto,
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Update successful',
        Data: mockElementoPersonalizado,
      });
    });

    it('Debería retornar BadRequest con error', async () => {
      const mockError = new Error(
        `${mockElementoPersonalizado._id} doesn't exist`,
      );

      jest.spyOn(service, 'put').mockRejectedValue(mockError);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.put(
        res as any,
        mockElementoPersonalizado._id,
        mockElementoPersonalizadoDto,
      );

      expect(service.put).toHaveBeenCalledWith(
        mockElementoPersonalizado._id,
        mockElementoPersonalizadoDto,
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

      await controller.delete(res as any, mockElementoPersonalizado._id);

      expect(service.delete).toHaveBeenCalledWith(
        mockElementoPersonalizado._id,
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Delete successful',
        Data: {
          _id: mockElementoPersonalizado._id,
        },
      });
    });

    it('Debería retornar NotFound con error', async () => {
      const mockError = new Error(
        `${mockElementoPersonalizado._id} doesn't exist`,
      );

      jest.spyOn(service, 'delete').mockRejectedValue(mockError);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.delete(res as any, mockElementoPersonalizado._id);

      expect(service.delete).toHaveBeenCalledWith(
        mockElementoPersonalizado._id,
      );
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
