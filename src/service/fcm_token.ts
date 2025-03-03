import api from '$util/axios_interceptor';

export async function fcmTokenSaveService(token: string) {
	await api.post('/v1/notifications/_token', { token });
}
