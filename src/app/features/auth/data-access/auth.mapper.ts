import { AuthUser } from '../domain/auth-user.model';
import { LoginResponseDto } from './auth.dto';

export function mapLoginResponseDto(dto: LoginResponseDto): AuthUser {
  return {
    id: dto.id,
    name: dto.name,
    username: dto.username,
    email: dto.email,
    cpf: dto.cpf,
    expiresAt: dto.expires_at
  };
}
