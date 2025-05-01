import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
	stages: [
		{ duration: '2s', target: 1000 },
		{ duration: '10s', target: 5000 }
	]
};

export default () => {
	http.patch('http://127.0.0.1:3123/creator/v1/offers/125/_view', null, {
		headers: {
			Authorization:
				'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ0ZWVwZWUiLCJzdWIiOiIxMiIsImV4cCI6MTc3NTc1NDA0NSwiaWF0IjoxNzQ0MjE4MDQ1LCJqdGkiOiIxYTFhOTk0MC1iODUyLTRjMTYtYWYxNi02YTI2MjM4OWQyOTUiLCJyb2xlcyI6WyJjcmVhdG9yIl19.LfC7c66129t_izCUiz1QjUaAkIjZzTipVX17lOCwRCc '
		}
	});

	sleep(3);
};
