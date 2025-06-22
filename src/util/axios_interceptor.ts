import axios, { AxiosError, type InternalAxiosRequestConfig, type AxiosResponse, HttpStatusCode } from 'axios';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { authRenewSessionService, clearToken, getToken, setLoginSession, setToken } from '../service/auth';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

const instance = axios.create({
	baseURL: PUBLIC_API_BASE_URL
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
	console.log('Axios Error:', err);

	if (config?.retry || (config?.url?.includes('/auth/_renew_session') ?? false)) {
		if (browser) {
			try {
				setLoginSession(false);
				clearToken();
				window.location.href = '/';
			} catch (e) {
				console.error(e);
				window.location.href = '/';
			}
		}

		return Promise.reject(err);
	}

	if (response?.status === HttpStatusCode.Unauthorized && !(config?.url?.includes('/auth/_renew_session') ?? false)) {
		config.retry = true;

		const t = getToken();
		if (!t) {
			// window.location.href = '/';
			return Promise.reject(err);
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
