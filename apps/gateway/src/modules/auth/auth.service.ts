// Created automatically by Cursor AI (2024-08-24)
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    // TODO: Implement actual user lookup from database
    // For now, return mock response
    const user = {
      id: '1',
      email: loginDto.email,
      name: 'Test User',
      orgId: '1',
    };

    const payload = { sub: user.id, email: user.email, orgId: user.orgId };
    
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const newPayload = { sub: payload.sub, email: payload.email, orgId: payload.orgId };
      
      return {
        access_token: this.jwtService.sign(newPayload),
        refresh_token: this.jwtService.sign(newPayload, { expiresIn: '7d' }),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async oauthLogin(user: any) {
    const payload = { 
      sub: user.id, 
      email: user.email, 
      orgId: user.orgId || '1',
      provider: user.provider 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider,
      },
    };
  }

  async getProfile(userId: string) {
    // TODO: Implement actual user lookup from database
    return {
      id: userId,
      email: 'test@example.com',
      name: 'Test User',
      orgId: '1',
      role: 'founder',
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    // TODO: Implement actual user validation from database
    // For now, return mock user
    return {
      id: '1',
      email: 'test@example.com',
      password: await bcrypt.hash('password', 10),
    };
  }
}
