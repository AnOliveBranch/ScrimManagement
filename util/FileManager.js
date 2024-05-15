const fsPromises = require('node:fs/promises');
const path = require('node:path');

class FileManager {
	constructor() {}

	async createDataFolder() {
		const dataFolder = path.join(__dirname, '..', 'data');
		try {
			await fsPromises.access(dataFolder);
		} catch {
			await fsPromises.mkdir(dataFolder);
		}
	}

	async createGuildFiles(guildId) {
		const dataFolder = path.join(__dirname, '..', 'data', guildId);
		const dataFile = path.join(dataFolder, 'settings.json');

		try {
			await fsPromises.access(dataFolder);
		} catch {
			await fsPromises.mkdir(dataFolder);
		}

		try {
			await fsPromises.access(dataFile);
		} catch {
			await fsPromises.writeFile(dataFile, JSON.stringify(getDefaultSettings()));
		}
	}

	async getGuildSettings(guildId) {
		const settingsFile = path.join(__dirname, '..', 'data', guildId, 'settings.json');

		try {
			const settings = JSON.parse(await fsPromises.readFile(settingsFile));
			return settings;
		} catch {
			const defaultSettings = getDefaultSettings();
			await fsPromises.writeFile(settingsFile, JSON.stringify(defaultSettings));
			return defaultSettings;
		}
	}

	async setGuildSettings(guildId, newSettings) {
		const settingsFile = path.join(__dirname, '..', 'data', guildId, 'settings.json');
		await fsPromises.writeFile(settingsFile, JSON.stringify(newSettings));
	}

	async setFile(guildId, guide, contents, fileName) {
		const filePath = path.join(__dirname, '..', 'data', guildId, guide, fileName);
		await fsPromises.writeFile(filePath, contents);
	}
}

module.exports = {
	FileManager
};

function getDefaultSettings() {
	const settings = {
		scrimChannel: '',
		roles: {
			fl: '',
			al: '',
			cl: '',
			ml: '',
			pl: ''
		},
		replies: {}
	};

	return settings;
}
