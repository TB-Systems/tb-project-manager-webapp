import { AuthUser } from '../domain/auth-user.model';
import { AuthSessionResponseDto } from './auth.dto';

export function mapAuthSessionResponseDto(dto: AuthSessionResponseDto): AuthUser {
  return {
    id: dto.id,
    name: dto.name,
    username: dto.username,
    email: dto.email,
    cpf: dto.cpf,
    expiresAt: dto.expires_at,
  };
}

export const mapLoginResponseDto = mapAuthSessionResponseDto;
