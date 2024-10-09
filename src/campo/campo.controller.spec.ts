import { Test, TestingModule } from '@nestjs/testing';
import { CampoController } from './campo.controller';
import { CampoService } from './campo.service';
import { HttpStatus } from '@nestjs/common';
import { CampoDto } from './dto/campo.dto';
import { FilterDto } from '../filters/filters.dto';

const mockCampoDto: CampoDto = {
  nombre: 'Campo',
  descripcion: 'Descripción del Campo',
  seccion_id: '66aed6a431c4ca1c60085cdd',
  tipo: 'text',
  etiqueta: {},
  deshabilitado: false,
  valor: 'campo',
  solo_lectura: false,
  placeholder: {},
  validacion: [],
  parametro: {},
  dependencia: {},
  servicio: "",
  endpoint: "",
  campo: "",
  agrupado: false,
  activo: true,
  fecha_creacion: new Date(),
  fecha_modificacion: new Date(),
};

const mockCampo = {
  ...mockCampoDto,
  _id: '66aed6a431c4ca1c60085cdd',
};

describe('CampoController', () => {
  let controller: CampoController;
  let service: CampoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampoController],
      providers: [
        {
          provide: CampoService,
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

    controller = module.get<CampoController>(
      CampoController,
    );
    service = module.get<CampoService>(
      CampoService,
    );
  });

  it('Debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('post', () => {
    it('Debería retornar Created con datos válidos', async () => {
      jest
        .spyOn(service, 'post')
        .mockResolvedValue(mockCampo as any);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.post(res as any, mockCampoDto);

      expect(service.post).toHaveBeenCalledWith(mockCampoDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        Success: true,
        Status: HttpStatus.CREATED,
        Message: 'Registration successful',
        Data: mockCampo,
      });
    });

    it('Debería retornar BadRequest con error', async () => {
      const mockError = new Error(
        'Campo validation failed: activo: Cast to Boolean failed for value "2" (type number) at path "activo"',
      );

      jest.spyOn(service, 'post').mockRejectedValue(mockError);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.post(res as any, mockCampoDto);

      expect(service.post).toHaveBeenCalledWith(mockCampoDto);
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
          ...mockCampo,
          _id: '1',
          nombre: 'Campo 1',
        },
        {
          ...mockCampo,
          _id: '2',
          nombre: 'Campo 2',
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
        .mockResolvedValue(mockCampo as any);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getById(res as any, mockCampo._id);

      expect(service.getById).toHaveBeenCalledWith(
        mockCampo._id,
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Request successful',
        Data: mockCampo,
      });
    });

    it('Debería retornar NotFound con id inválido', async () => {
      jest
        .spyOn(service, 'getById')
        .mockRejectedValue(
          new Error(`${mockCampo._id} doesn't exist`),
        );

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getById(res as any, mockCampo._id);

      expect(service.getById).toHaveBeenCalledWith(
        mockCampo._id,
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        Success: false,
        Status: HttpStatus.NOT_FOUND,
        Message:
          'Error service GetOne: The request contains an incorrect parameter or no record exist',
        Data: `${mockCampo._id} doesn't exist`,
      });
    });
  });

  describe('put', () => {
    it('Debería retornar OK con datos válidos', async () => {
      jest
        .spyOn(service, 'put')
        .mockResolvedValue(mockCampo as any);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.put(
        res as any,
        mockCampo._id,
        mockCampoDto,
      );

      expect(service.put).toHaveBeenCalledWith(
        mockCampo._id,
        mockCampoDto,
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Update successful',
        Data: mockCampo,
      });
    });

    it('Debería retornar BadRequest con error', async () => {
      const mockError = new Error(
        `${mockCampo._id} doesn't exist`,
      );

      jest.spyOn(service, 'put').mockRejectedValue(mockError);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.put(
        res as any,
        mockCampo._id,
        mockCampoDto,
      );

      expect(service.put).toHaveBeenCalledWith(
        mockCampo._id,
        mockCampoDto,
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

      await controller.delete(res as any, mockCampo._id);

      expect(service.delete).toHaveBeenCalledWith(
        mockCampo._id,
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        Success: true,
        Status: HttpStatus.OK,
        Message: 'Delete successful',
        Data: {
          _id: mockCampo._id,
        },
      });
    });

    it('Debería retornar NotFound con error', async () => {
      const mockError = new Error(
        `${mockCampo._id} doesn't exist`,
      );

      jest.spyOn(service, 'delete').mockRejectedValue(mockError);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.delete(res as any, mockCampo._id);

      expect(service.delete).toHaveBeenCalledWith(
        mockCampo._id,
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
