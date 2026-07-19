import { mapLoginResponseDto } from './auth.mapper';

describe('mapLoginResponseDto', () => {
  it('deve converter o contrato da API para o modelo da aplicacao', () => {
    expect(
      mapLoginResponseDto({
        id: 1,
        name: 'Tiago',
        username: 'tiago',
        email: 'tiago@example.com',
        cpf: '12345678900',
        expires_at: '2026-07-20T16:00:00Z'
      })
    ).toEqual({
      id: 1,
      name: 'Tiago',
      username: 'tiago',
      email: 'tiago@example.com',
      cpf: '12345678900',
      expiresAt: '2026-07-20T16:00:00Z'
    });
  });
});
