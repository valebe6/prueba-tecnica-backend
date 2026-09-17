import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { User, UserRole } from './entities/user.entity.js';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser: User = {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'hashedpassword',
    role: UserRole.ADMIN,
    active: true,
  };

  const mockRepository = {
    find: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    count: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of users without password', async () => {
      mockRepository.find.mockResolvedValue([mockUser]);
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          active: true,
        },
        order: { name: 'ASC' },
      });
    });
  });

  describe('findById', () => {
    it('should return user if found', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      const result = await service.findById('user-1');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findById('unknown')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(
        'Admin User',
        'admin@test.com',
        'password123',
        UserRole.ADMIN,
      );

      expect(result).toEqual(mockUser);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if email exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.create('Test', 'admin@test.com', '123456', UserRole.USER),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update name and role', async () => {
      const userCopy = { ...mockUser };
      mockRepository.findOne.mockResolvedValue(userCopy);
      mockRepository.count.mockResolvedValue(2);
      mockRepository.save.mockImplementation((u) => Promise.resolve(u));

      const updated = await service.update('user-1', {
        name: 'New Name',
        role: UserRole.USER,
      });

      expect(updated.name).toBe('New Name');
      expect(updated.role).toBe(UserRole.USER);
    });

    it('should prevent demoting the last active admin', async () => {
      const userCopy = { ...mockUser, role: UserRole.ADMIN, active: true };
      mockRepository.findOne.mockResolvedValue(userCopy);
      mockRepository.count.mockResolvedValue(1);

      await expect(
        service.update('user-1', { role: UserRole.USER }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('changeStatus', () => {
    it('should toggle user status', async () => {
      const regularUser: User = {
        id: 'user-2',
        name: 'Regular',
        email: 'reg@test.com',
        password: 'hash',
        role: UserRole.USER,
        active: true,
      };
      mockRepository.findOne.mockResolvedValue(regularUser);
      mockRepository.save.mockImplementation((u) => Promise.resolve(u));

      const result = await service.changeStatus('user-2');
      expect(result.active).toBe(false);
    });

    it('should throw ConflictException if trying to deactivate the last admin', async () => {
      const adminUser: User = { ...mockUser, active: true };
      mockRepository.findOne.mockResolvedValue(adminUser);
      mockRepository.count.mockResolvedValue(1);

      await expect(service.changeStatus('user-1')).rejects.toThrow(ConflictException);
    });
  });
});
