import { AppConfig, configure } from 'ts-appconfig';

/**
 * Environment Variables Schema
 */
export class Environment extends AppConfig {
	readonly APP_TITLE = 'DodoTelBot';
	readonly CLIENT: string = 'CLIENT_TOKEN';
	readonly ADMIN: string = 'ADMIN_TOKEN';
	readonly WEB_ORIGIN: string = 'http://127.0.0.1:3000';
}

/**
 * Load & export environment variables
 */
export const env: Environment = configure(Environment);
