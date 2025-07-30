import api from '../util/axios_interceptor';
import type { ApiResponse } from '../types/api';
import type { AuthLoginReq, AuthLoginRes, AuthRenewSessionReq, AuthRenewSessionRes } from '../types/auth';

export abstract class AuthRepository {
	abstract googleLogin(req: AuthLoginReq): Promise<AuthLoginRes>;
	abstract renewSession(req: AuthRenewSessionReq): Promise<AuthRenewSessionRes>;
}

class AuthRepositoryImpl extends AuthRepository {
	async googleLogin(req: AuthLoginReq): Promise<AuthLoginRes> {
		const res = await api.post<AuthLoginRes, ApiResponse<AuthLoginRes>>('/consumer/v1/auth/_google_login', req);
		return res.data;
	}

	async renewSession(req: AuthRenewSessionReq): Promise<AuthRenewSessionRes> {
		const res = await api.post<AuthRenewSessionRes, ApiResponse<AuthRenewSessionRes>>('/v1/auth/_renew_session', req);
		return res.data;
	}
}

export function NewAuthRepository(): AuthRepository {
	return new AuthRepositoryImpl();
}
