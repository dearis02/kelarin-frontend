import { writable } from 'svelte/store';
import type { AuthDecodedAccessToken } from '../types/auth';

export interface AuthUser {
	id: string;
	role: number;
	name: string;
}

const authUser = writable<AuthUser | null>(null);
const isLoggedIn = writable<boolean>(false);

export function setAuthUser(user: AuthUser | null): void {
	authUser.set(user);
}

export function getAuthUserFromDecodedToken(decoded: AuthDecodedAccessToken): AuthUser {
	return {
		id: decoded.jti,
		role: decoded.role,
		name: decoded.name
	};
}

export { authUser, isLoggedIn };
