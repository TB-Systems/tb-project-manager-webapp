export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  id: number;
  name: string;
  username: string;
  email: string;
  cpf: string;
  expires_at: string;
}
