import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ModalAlertaService } from './modal-alerta.service';
import { ModalAlerta } from './schemas/modal-alerta.schema';
import { ModalAlertaDto } from './dto/modal-alerta.dto';
import { Formulario } from '../formulario/schemas/formulario.schema';
import { Model } from 'mongoose';
import { FilterDto } from '../filters/filters.dto';

const mockModalAlertaDto: ModalAlertaDto = {
  titulo: 'Alerta de Prueba',
  descripcion: 'Descripción de la alerta de prueba',
  formulario_id: '66aed6a431c4ca1c60085cdd',
  titulo_boton_principal: 'Aceptar',
  titulo_boton_secundario: 'Cancelar',
  tipo_id: 1,
  activo: true,
  fecha_creacion: new Date(),
  fecha_modificacion: new Date(),
};

const mockModalAlerta = {
  ...mockModalAlertaDto,
  _id: '66aed6a431c4ca1c60085cde',
};

const mockFormulario = {
  _id: '66aed6a431c4ca1c60085cdd',
  nombre: 'Formulario de Prueba',
};

describe('ModalAlertaService', () => {
  let modalAlertaService: ModalAlertaService;
  let modalAlertaModel: Model<ModalAlerta>;
  let formularioModel: Model<Formulario>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModalAlertaService,
        {
          provide: getModelToken(ModalAlerta.name),
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

    modalAlertaService = module.get<ModalAlertaService>(ModalAlertaService);
    modalAlertaModel = module.get<Model<ModalAlerta>>(
      getModelToken(ModalAlerta.name),
    );
    formularioModel = module.get<Model<Formulario>>(
      getModelToken(Formulario.name),
    );
  });

  it('Debería estar definido', () => {
    expect(modalAlertaService).toBeDefined();
  });

  describe('post', () => {
    it('Debería crear y devolver una alerta modal', async () => {
      jest.spyOn(formularioModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockFormulario),
      } as any);
      jest
        .spyOn(modalAlertaModel, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockModalAlertaDto));

      const result = await modalAlertaService.post(mockModalAlertaDto);
      expect(result).toEqual(mockModalAlertaDto);
    });

    it('Debería lanzar un error si el formulario no existe', async () => {
      jest.spyOn(formularioModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(modalAlertaService.post(mockModalAlertaDto)).rejects.toThrow(
        `Formulario with id ${mockModalAlertaDto.formulario_id} doesn't exist`,
      );
    });
  });

  describe('getAll', () => {
    it('Debería retornar todas las alertas modales con filtros aplicados', async () => {
      const mockModalAlertas = [
        mockModalAlerta,
        {
          _id: '66aed6a431c4ca1c60085cdf',
          titulo: 'Alerta de Prueba 2',
          descripcion: 'Otra descripción',
          formulario_id: '66aed6a431c4ca1c60085cdf',
          activo: true,
          fecha_creacion: new Date(),
          fecha_modificacion: new Date(),
        },
      ];

      const mockFilterDto: FilterDto = {
        query: 'titulo:Alerta de Prueba',
        fields: 'titulo,descripcion',
        sortby: 'fecha_creacion',
        order: 'desc',
        limit: '10',
        offset: '0',
        populate: 'true',
      };

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockModalAlertas),
      };

      jest.spyOn(modalAlertaModel, 'find').mockReturnValue(mockQuery as any);

      const result = await modalAlertaService.getAll(mockFilterDto);

      expect(result).toEqual(mockModalAlertas);
    });
  });

  describe('getById', () => {
    it('Debería retornar una alerta modal por su ID', async () => {
      jest.spyOn(modalAlertaModel, 'findById').mockReturnValue({
        exec: jest
          .fn()
          .mockResolvedValue(mockModalAlerta as unknown as ModalAlerta),
      } as any);

      const result = await modalAlertaService.getById(mockModalAlerta._id);

      expect(modalAlertaModel.findById).toHaveBeenCalledWith(
        mockModalAlerta._id,
      );
      expect(result).toEqual(mockModalAlerta);
    });

    it('Debería lanzar un error si la alerta modal no existe', async () => {
      jest.spyOn(modalAlertaModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        modalAlertaService.getById(mockModalAlerta._id),
      ).rejects.toThrow(`${mockModalAlerta._id} doesn't exist`);

      expect(modalAlertaModel.findById).toHaveBeenCalledWith(
        mockModalAlerta._id,
      );
    });
  });

  describe('put', () => {
    it('Debería actualizar una alerta modal', async () => {
      jest.spyOn(formularioModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockFormulario),
      } as any);
      jest.spyOn(modalAlertaModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest
          .fn()
          .mockResolvedValue(mockModalAlertaDto as unknown as ModalAlerta),
      } as any);

      const result = await modalAlertaService.put(
        mockModalAlerta._id,
        mockModalAlertaDto,
      );

      expect(modalAlertaModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockModalAlerta._id,
        mockModalAlertaDto,
        { new: true },
      );
      expect(result).toEqual(mockModalAlertaDto);
    });

    it('Debería lanzar un error si la alerta modal no existe', async () => {
      jest.spyOn(formularioModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockFormulario),
      } as any);
      jest.spyOn(modalAlertaModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        modalAlertaService.put(mockModalAlerta._id, mockModalAlertaDto),
      ).rejects.toThrow(`${mockModalAlerta._id} doesn't exist`);

      expect(modalAlertaModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockModalAlerta._id,
        mockModalAlertaDto,
        { new: true },
      );
    });

    it('Debería lanzar un error si el formulario relacionado no existe', async () => {
      jest.spyOn(formularioModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        modalAlertaService.put(mockModalAlerta._id, mockModalAlertaDto),
      ).rejects.toThrow(
        `Formulario with id ${mockModalAlertaDto.formulario_id} doesn't exist`,
      );
    });
  });

  describe('delete', () => {
    it('Debería marcar una alerta modal como inactiva', async () => {
      jest.spyOn(modalAlertaModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest
          .fn()
          .mockResolvedValue(mockModalAlertaDto as unknown as ModalAlerta),
      } as any);

      const result = await modalAlertaService.delete(mockModalAlerta._id);

      expect(result).toEqual(mockModalAlertaDto);
    });

    it('Debería lanzar un error si la alerta modal no existe', async () => {
      jest.spyOn(modalAlertaModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        modalAlertaService.delete(mockModalAlerta._id),
      ).rejects.toThrow(`${mockModalAlerta._id} doesn't exist`);
    });
  });
});
