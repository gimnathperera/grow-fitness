import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../../schemas/user.schema';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Call parent AuthGuard to authenticate with JWT
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new ForbiddenException('Authentication required');
    }

    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }

    return user;
  }
}
