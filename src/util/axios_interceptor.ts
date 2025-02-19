import axios, {
	AxiosError,
	type InternalAxiosRequestConfig,
	type AxiosResponse,
	HttpStatusCode
} from 'axios';
import { env } from '$env/dynamic/public';
import { getToken } from '../service/auth';
import { browser } from '$app/environment';

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
	}

	return config;
}

function onResponse(response: AxiosResponse): AxiosResponse {
	return response.data;
}

async function onError(error: CustomError): Promise<CustomError> {
	const { config, response } = error;

	if (config?.retry || (config?.url?.includes('/auth/refresh-token') ?? false)) {
		// try {
		// 	//TODO logout
		// 	window.location.href = '/'
		// } catch (e) {
		// 	window.location.href = '/'
		// }

		return Promise.reject(error);
	}

	if (
		response?.status === HttpStatusCode.Unauthorized &&
		!(config?.url?.includes('/auth/refresh-token') ?? false)
	) {
		config.retry = true;
	}

	if (response?.status === 404) {
		// redirect(HttpStatusCode.TemporaryRedirect,'/404')
	}

	// const responseStatus = response?.status

	// if (responseStatus! >= 500) window.location.href = '/500'

	return Promise.reject(error);
}

instance.interceptors.request.use(onRequest, onError);
instance.interceptors.response.use(onResponse, onError);

export default instance;
