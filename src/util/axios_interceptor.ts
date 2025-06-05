import axios, { AxiosError, type InternalAxiosRequestConfig, type AxiosResponse, HttpStatusCode } from 'axios';
import { env } from '$env/dynamic/public';
import { authRenewSessionService, clearToken, getToken, setLoginSession, setToken } from '../service/auth';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

const baseURL = env.PUBLIC_API_BASE_URL;
const instance = axios.create({
	baseURL: baseURL
});

interface CustomAxiosReqConfig extends InternalAxiosRequestConfig {
	retry: boolean;
}

interface CustomError extends Omit<AxiosError, 'config'> {
	config: CustomAxiosReqConfig;
}

function onRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
	if (browser) {
		const token = getToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token.accessToken}`;
		}

		config.headers['Time-Zone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
	}

	return config;
}

function onResponse(response: AxiosResponse): AxiosResponse {
	return response.data;
}

async function onError(err: CustomError): Promise<CustomError> {
	const { config, response } = err;

	if (config?.retry || (config?.url?.includes('/auth/refresh-token') ?? false)) {
		if (browser) {
			try {
				setLoginSession(false);
				clearToken();
				window.location.href = '/login';
			} catch (e) {
				console.error(e);
				window.location.href = '/login';
			}
		}

		return Promise.reject(err);
	}

	if (response?.status === HttpStatusCode.Unauthorized && !(config?.url?.includes('/auth/refresh-token') ?? false)) {
		config.retry = true;

		const t = getToken();
		if (!t) {
			return Promise.reject(error);
		}

		try {
			const res = await authRenewSessionService({ refresh_token: t.refreshToken });
			setToken(res.access_token, res.refresh_token);
			setLoginSession(true);

			if (config?.headers?.Authorization) {
				config.headers.Authorization = `Bearer ${res.access_token}`;
			}
			return instance(config);
		} catch (error) {
			console.error(error);
			return Promise.reject(error);
		}
	}

	if (response?.status == HttpStatusCode.NotFound) {
		error(HttpStatusCode.NotFound, { message: 'NOT FOUND' });
	} else if (response?.status == HttpStatusCode.Unauthorized) {
		error(HttpStatusCode.Unauthorized, { message: 'FORBIDDEN' });
	}

	// if (responseStatus! >= 500) window.location.href = '/500'

	return Promise.reject(err);
}

instance.interceptors.request.use(onRequest, onError);
instance.interceptors.response.use(onResponse, onError);

export default instance;
