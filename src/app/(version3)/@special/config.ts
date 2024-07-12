import * as fs from "node:fs";

export type V3Config = {
	mainWalletAddress?: string,
	mainWalletPrivateKey?: string,
}

const configPath = process.cwd()+"/v3.config.json";

export function getV3Config(): V3Config {
	try {
		return JSON.parse(fs.readFileSync(configPath).toString('utf8') || "{}")
	} catch {
		return {};
	}
}

export function getV3ConfigValue(key: keyof V3Config) {
	return getV3Config()[key];
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
