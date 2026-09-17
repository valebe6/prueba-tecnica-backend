import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { AdminGuard } from '../auth/guards/admin.guard.js';
import { UserRole } from './entities/user.entity.js';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    changeStatus: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(AdminGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should list all users', async () => {
    mockUsersService.findAll.mockResolvedValue([]);
    const res = await controller.findAll();
    expect(res).toEqual([]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should find a user by id', async () => {
    mockUsersService.findById.mockResolvedValue({ id: '1', name: 'Test' });
    const res = await controller.findOne('1');
    expect(res).toEqual({ id: '1', name: 'Test' });
    expect(service.findById).toHaveBeenCalledWith('1');
  });

  it('should create a user', async () => {
    const dto = {
      name: 'Test',
      email: 'test@test.com',
      password: 'password123',
      role: UserRole.USER,
    };
    mockUsersService.create.mockResolvedValue({ id: '1', ...dto });
    const res = await controller.create(dto);
    expect(res).toEqual({ id: '1', ...dto });
    expect(service.create).toHaveBeenCalledWith(
      dto.name,
      dto.email,
      dto.password,
      dto.role,
    );
  });

  it('should update a user', async () => {
    const dto = { name: 'Updated' };
    mockUsersService.update.mockResolvedValue({ id: '1', name: 'Updated' });
    const res = await controller.update('1', dto);
    expect(res).toEqual({ id: '1', name: 'Updated' });
    expect(service.update).toHaveBeenCalledWith('1', dto);
  });

  it('should change status of a user', async () => {
    mockUsersService.changeStatus.mockResolvedValue({ id: '1', active: false });
    const res = await controller.changeStatus('1');
    expect(res).toEqual({ id: '1', active: false });
    expect(service.changeStatus).toHaveBeenCalledWith('1');
  });
});
