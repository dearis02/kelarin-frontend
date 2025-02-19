export type AuthLoginReq = {
	id_token: string;
};

export type AuthLoginRes = {
	access_token: string;
	refresh_token: string;
};

export type AuthRenewSessionReq = {
	refresh_token: string;
};

export type AuthRenewSessionRes = AuthLoginRes;

export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

export interface Token {
	accessToken: string;
	refreshToken: string;
}

export type AuthDecodedAccessToken = {
	exp: number;
	iat: number;
	iss: string;
	jti: string;
	name: string;
	role: number;
	sub: string;
};
