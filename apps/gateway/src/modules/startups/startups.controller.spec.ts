// Created automatically by Cursor AI (2024-08-24)
import { Test, TestingModule } from '@nestjs/testing';
import { StartupsController } from './startups.controller';
import { StartupsService } from './startups.service';

describe('StartupsController', () => {
  let controller: StartupsController;
  let service: StartupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StartupsController],
      providers: [
        {
          provide: StartupsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            uploadMaterial: jest.fn(),
            getMaterials: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StartupsController>(StartupsController);
    service = module.get<StartupsService>(StartupsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a startup', async () => {
      const createStartupDto = {
        name: 'Test Startup',
        sector: 'Technology',
        stage: 'Seed',
        brand: { primaryColor: '#000000' }
      };
      
      const expectedResult = {
        id: '1',
        ...createStartupDto,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      const result = await controller.create(createStartupDto);
      
      expect(service.create).toHaveBeenCalledWith(createStartupDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return an array of startups', async () => {
      const expectedResult = [
        {
          id: '1',
          name: 'Test Startup 1',
          sector: 'Technology',
          stage: 'Seed',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          name: 'Test Startup 2',
          sector: 'Healthcare',
          stage: 'Series A',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult);

      const result = await controller.findAll();
      
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a single startup', async () => {
      const id = '1';
      const expectedResult = {
        id,
        name: 'Test Startup',
        sector: 'Technology',
        stage: 'Seed',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(expectedResult);

      const result = await controller.findOne(id);
      
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a startup', async () => {
      const id = '1';
      const updateStartupDto = {
        name: 'Updated Startup Name'
      };
      
      const expectedResult = {
        id,
        name: 'Updated Startup Name',
        sector: 'Technology',
        stage: 'Seed',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult);

      const result = await controller.update(id, updateStartupDto);
      
      expect(service.update).toHaveBeenCalledWith(id, updateStartupDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should remove a startup', async () => {
      const id = '1';
      const expectedResult = { deleted: true };

      jest.spyOn(service, 'remove').mockResolvedValue(expectedResult);

      const result = await controller.remove(id);
      
      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('uploadMaterial', () => {
    it('should upload material for a startup', async () => {
      const id = '1';
      const file = {
        fieldname: 'material',
        originalname: 'test.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        buffer: Buffer.from('test'),
        size: 4
      } as Express.Multer.File;

      const expectedResult = {
        id: 'material-1',
        startupId: id,
        filename: 'test.pdf',
        url: 'https://storage.example.com/test.pdf',
        uploadedAt: new Date()
      };

      jest.spyOn(service, 'uploadMaterial').mockResolvedValue(expectedResult);

      const result = await controller.uploadMaterial(id, file);
      
      expect(service.uploadMaterial).toHaveBeenCalledWith(id, file);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getMaterials', () => {
    it('should return materials for a startup', async () => {
      const id = '1';
      const expectedResult = [
        {
          id: 'material-1',
          startupId: id,
          filename: 'test.pdf',
          url: 'https://storage.example.com/test.pdf',
          uploadedAt: new Date()
        }
      ];

      jest.spyOn(service, 'getMaterials').mockResolvedValue(expectedResult);

      const result = await controller.getMaterials(id);
      
      expect(service.getMaterials).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });
});
