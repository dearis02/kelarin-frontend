import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getMessaging, getToken, isSupported, onMessage, type Messaging } from 'firebase/messaging';
import {
	PUBLIC_FIREBASE_VAPID_KEY,
	PUBLIC_FIREBASE_API_KEY,
	PUBLIC_FIREBASE_AUTH_DOMAIN,
	PUBLIC_FIREBASE_PROJECT_ID,
	PUBLIC_FIREBASE_STORAGE_BUCKET,
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	PUBLIC_FIREBASE_APP_ID
} from '$env/static/public';
import { fcmTokenSaveService } from '../service/fcm_token';
import ToastNotification from '$lib/components/notification/ToastNotification.svelte';
import { toast } from 'svelte-sonner';
import type { ComponentType } from 'svelte';

const firebaseConfig: FirebaseOptions = {
	apiKey: PUBLIC_FIREBASE_API_KEY,
	appId: PUBLIC_FIREBASE_APP_ID,
	authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
	storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	projectId: PUBLIC_FIREBASE_PROJECT_ID
};

let messaging: Messaging;

export async function initFirebaseMessaging(notifToast: string | number) {
	if (typeof window === 'undefined') {
		console.warn('Firebase Messaging cannot run on the server.');
		return;
	}

	const supported = await isSupported();
	if (!supported) {
		console.warn('Firebase Messaging is not supported in this browser.');
		return;
	}

	const firebase = initializeApp(firebaseConfig);
	messaging = getMessaging(firebase);

	onMessage(messaging, (payload) => {
		toast.custom(ToastNotification as unknown as ComponentType, {
			componentProps: {
				title: payload.notification?.title,
				message: payload.notification?.body,
				imgURL: payload.notification?.image
			},
			id: notifToast,
			duration: 10000,
			position: 'top-center',
			class: 'w-full'
		});
	});
}

export async function requestPermission() {
	if (!messaging) {
		console.warn('Firebase Messaging not initialized.');
		return;
	}

	const permission = await Notification.requestPermission();
	if (permission === 'granted') {
		try {
			const token = await getToken(messaging, { vapidKey: PUBLIC_FIREBASE_VAPID_KEY });
			if (token) {
				try {
					await fcmTokenSaveService(token);
				} catch (error) {
					console.error(error);
				}
			} else {
				console.error('No registration token available.');
			}
		} catch (error) {
			console.error('Error getting token:', error);
		}
	} else {
		console.warn('Notification permission denied.');
	}
}
