// Created automatically by Cursor AI (2024-08-24)
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RLSGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    
    if (!user) {
      return false;
    }
    
    // Add user context to request for RLS policies
    request.userContext = {
      userId: user.id,
      organizationId: user.organizationId,
      roles: user.roles,
      permissions: user.permissions
    };
    
    return true;
  }
}
