import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { FormularioService } from './formulario.service';
import { Formulario } from './schemas/formulario.schema';
import { FormularioDto } from './dto/formulario.dto';
import { ModuloDto } from 'src/modulo/dto/modulo.dto';
import { FilterDto } from '../filters/filters.dto';
import { Modulo } from '../modulo/schemas/modulo.schema';
import { Model } from 'mongoose';

const mockFormularioDto: FormularioDto = {
  nombre: 'Formulario 1',
  descripcion: 'Descripción del formulario 1',
  version: 1,
  version_actual: true,
  periodo_id: 2,
  creado_por_id: 2,
  modificado_por_id: 3,
  modulo_id: '66aed6a431c4ca1c60085cdd',
  traduccion: true,
  label: {
    nombre: 'nombre del label',
  },
  activo: true,
  fecha_creacion: new Date(),
  fecha_modificacion: new Date(),
};

const mockFormulario = {
  ...mockFormularioDto,
  _id: '66aed6a431c4ca1c60085cde',
};

const mockModulo = {
  _id: '66aed6a431c4ca1c60085cdd',
  nombre: 'Modulo 1',
};

describe('FormularioService', () => {
  let formularioService: FormularioService;
  let formularioModel: Model<Formulario>;
  let moduloModel: Model<Modulo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormularioService,
        {
          provide: getModelToken(Formulario.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
        {
          provide: getModelToken(Modulo.name),
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    formularioService = module.get<FormularioService>(FormularioService);
    formularioModel = module.get<Model<Formulario>>(
      getModelToken(Formulario.name),
    );
    moduloModel = module.get<Model<Modulo>>(getModelToken(Modulo.name));
  });

  it('Debería estar definido', () => {
    expect(formularioService).toBeDefined();
  });

  describe('post', () => {
    it('Debería crear y devolver un formulario', async () => {
      jest.spyOn(moduloModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockModulo as Modulo),
      } as any);
      jest
        .spyOn(formularioModel, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockFormularioDto));

      const result = await formularioService.post(mockFormularioDto);
      expect(result).toEqual(mockFormularioDto);
    });

    it('Debería lanzar un error si el modulo no existe', async () => {
      jest.spyOn(moduloModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      jest
        .spyOn(formularioModel, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockFormularioDto));

      await expect(formularioService.post(mockFormularioDto)).rejects.toThrow(
        `Modulo with id ${mockModulo._id} doesn't exist`,
      );
    });
  });

  describe('getAll', () => {
    it('Debería retornar todos los formularios con filtros aplicados', async () => {
      const mockFormularios = [
        {
          _id: '66aed6a431c4ca1c60085cde',
          nombre: 'Formulario 1',
          descripcion: 'Descripción 1',
          modulo_id: '66aed6a431c4ca1c60085cdd',
          activo: true,
          fecha_creacion: new Date(),
          fecha_modificacion: new Date(),
        },
        {
          _id: '266aed6a431c4ca1c60085cdf',
          nombre: 'Formulario 2',
          descripcion: 'Descripción 2',
          modulo_id: '66aed6a431c4ca1c60085cde',
          activo: true,
          fecha_creacion: new Date(),
          fecha_modificacion: new Date(),
        },
      ];

      const mockFilterDto: FilterDto = {
        query: 'nombre:Formulario 1',
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
        exec: jest.fn().mockResolvedValue(mockFormularios),
      };

      jest.spyOn(formularioModel, 'find').mockReturnValue(mockQuery as any);

      const result = await formularioService.getAll(mockFilterDto);

      expect(result).toEqual(mockFormularios);
    });
  });

  describe('getById', () => {
    it('Debería retornar un formulario por su ID', async () => {
      jest.spyOn(formularioModel, 'findById').mockReturnValue({
        exec: jest
          .fn()
          .mockResolvedValue(mockFormulario as unknown as Formulario),
      } as any);

      const result = await formularioService.getById(mockFormulario._id);

      expect(formularioModel.findById).toHaveBeenCalledWith(mockFormulario._id);
      expect(result).toEqual(mockFormulario);
    });

    it('Debería lanzar un error si el formulario no existe', async () => {
      jest.spyOn(formularioModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        formularioService.getById(mockFormulario._id),
      ).rejects.toThrow(`${mockFormulario._id} doesn't exist`);

      expect(formularioModel.findById).toHaveBeenCalledWith(mockFormulario._id);
    });
  });

  describe('put', () => {
    it('Debería actualizar un formulario', async () => {
      jest.spyOn(moduloModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockModulo as Modulo),
      } as any);
      jest.spyOn(formularioModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest
          .fn()
          .mockResolvedValue(mockFormularioDto as unknown as Formulario),
      } as any);

      const result = await formularioService.put(
        mockFormulario._id,
        mockFormulario,
      );

      expect(formularioModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockFormulario._id,
        mockFormulario,
        { new: true },
      );
      expect(result).toEqual(mockFormularioDto);
    });

    it('Debería lanzar un error si el formulario no existe', async () => {
      jest.spyOn(moduloModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockModulo as Modulo),
      } as any);
      jest.spyOn(formularioModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        formularioService.put(mockFormulario._id, mockFormulario),
      ).rejects.toThrow(`${mockFormulario._id} doesn't exist`);

      expect(formularioModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockFormulario._id,
        mockFormulario,
        { new: true },
      );
    });

    it('Debería lanzar un error si el modulo no existe', async () => {
      jest.spyOn(moduloModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      jest.spyOn(formularioModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest
          .fn()
          .mockResolvedValue(mockFormularioDto as unknown as Formulario),
      } as any);

      await expect(
        formularioService.put(mockFormulario._id, mockFormulario),
      ).rejects.toThrow(`Modulo with id ${mockModulo._id} doesn't exist`);
    });
  });

  describe('delete', () => {
    it('Debería marcar un formulario como inactivo', async () => {
      jest.spyOn(formularioModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest
          .fn()
          .mockResolvedValue(mockFormularioDto as unknown as Formulario),
      } as any);

      const result = await formularioService.delete(mockFormulario._id);

      expect(result).toEqual(mockFormularioDto);
    });

    it('Debería lanzar un error si el formulario no existe', async () => {
      jest.spyOn(formularioModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        formularioService.delete(mockFormulario._id),
      ).rejects.toThrow(`${mockFormulario._id} doesn't exist`);
    });
  });
});
