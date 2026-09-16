import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

import { User, UserRole } from '../../users/entities/user.entity.js';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const user = request.user as User;

    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Solo los administradores pueden realizar esta acción',
      );
    }

    return true;
  }
}
