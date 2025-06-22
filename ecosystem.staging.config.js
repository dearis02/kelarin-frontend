export const apps = [
	{
		name: 'kelarin-consumer@staging',
		script: './build/index.js',
		cwd: './',
		env: {
			HOST: '127.0.0.1',
			PORT: 3100
		},
		log_type: 'json',
		time: true,
		out_file: '~/logs/kelarin-consumer-staging.log',
		error_file: '~/logs/kelarin-consumer-staging.error.log',
		kill_timeout: 5000
	}
];
