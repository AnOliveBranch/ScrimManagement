const { FileManager } = require('./FileManager.js');

class GuildManager {
	constructor(guild) {
		this._fileManager = new FileManager();
		this._guild = guild;
	}

	async init() {
		this._settings = await this._fileManager.getGuildSettings(this._guild.id);
	}

	async persist() {
		await this._fileManager.setGuildSettings(this._guild.id, this._settings);
	}

	getSettings() {
		return this._settings;
	}

	getChannel() {
		return this._settings.scrimChannel;
	}

	getRole(league) {
		return this._settings.roles[league];
	}

	getReply(message) {
		return this._settings.replies[message];
	}

	async setChannel(channel) {
		this._settings.scrimChannel = channel;
		await this.persist();
	}

	async unsetChannel() {
		this._settings.scrimChannel = '';
		await this.persist();
	}

	async setRole(league, role) {
		this._settings.roles[league] = role;
		await this.persist();
	}

	async unsetRole(league) {
		this._settings.roles[league] = '';
		await this.persist();
	}

	async setReply(message, reply) {
		this._settings.replies[message] = reply;
		await this.persist();
	}

	async unsetReply(message) {
		delete this._settings.replies[message];
		await this.persist();
	}
}

module.exports = {
	GuildManager
};
