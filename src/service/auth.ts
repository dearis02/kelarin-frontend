import { createMutation, QueryClient } from '@tanstack/svelte-query';
import type { AxiosInstance } from 'axios';
import {
	ACCESS_TOKEN_KEY,
	REFRESH_TOKEN_KEY,
	type AuthLoginReq,
	type AuthLoginRes,
	type Token
} from '../types/auth';
import { isLoggedIn } from '../store/auth';

export function googleLoginService(queryClient: QueryClient, api: AxiosInstance) {
	return createMutation<AuthLoginRes, Error, AuthLoginReq>(
		{
			mutationKey: ['googleLogin'],
			mutationFn: async (req: AuthLoginReq) => {
				const res = await api.post<AuthLoginRes>('/consumer/v1/auth/_google_login', req);
				return res.data;
			}
		},
		queryClient
	);
}

export function getToken(): Token | null {
	const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
	const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

	if (accessToken && refreshToken) {
		return { accessToken, refreshToken };
	}

	return null;
}

export function setToken(accessToken: string, refreshToken: string): void {
	localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
	localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearToken(): void {
	localStorage.removeItem(ACCESS_TOKEN_KEY);
	localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function setLoginSession(loggedIn: boolean): void {
	isLoggedIn.set(loggedIn);
}

export function isSessionExists(): boolean {
	let _isLoggedIn = false;
	isLoggedIn.subscribe((loggedIn) => {
		_isLoggedIn = loggedIn;
	});

	return _isLoggedIn && !!getToken();
}
