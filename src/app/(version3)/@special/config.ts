import * as fs from "node:fs";

export type V3Config = {
	mainWalletAddress?: string,
	mainWalletPrivateKey?: string,
	farmMaxHours: number
}

const defaultV3Config: {
	[k in keyof V3Config]: V3Config[k]
} = {
	farmMaxHours: 8
}

const configPath = process.cwd()+"/v3.site.config.json";

export function getV3Config(): V3Config {
	try {
		return {
			...JSON.parse(fs.readFileSync(configPath).toString('utf8') || "{}"),
			...defaultV3Config
		}
	} catch {
		return defaultV3Config;
	}
}

export function getV3ConfigValue<T extends keyof V3Config>(key: T, defaultValue?: V3Config[T]) {
	return getV3Config()[key] || defaultValue as V3Config[T];
}

export function setV3Config(config: Partial<V3Config>) {
	config = {
		...getV3Config(),
		...config
	}

	fs.writeFileSync(configPath,JSON.stringify(config));

	return config as V3Config;
}

export function setV3ConfigKey<T extends keyof V3Config,V extends V3Config[T]>(key: T,value: V) {
	return setV3Config({
		[key]: value
	});
}
