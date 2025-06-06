import { loginRequiredAlert } from '$store/auth';

export function showLoginRequiredAlert(msg?: string) {
	loginRequiredAlert.set({ open: true, message: msg });
}

export function hideLoginRequiredAlert() {
	loginRequiredAlert.set({ open: false });
}
