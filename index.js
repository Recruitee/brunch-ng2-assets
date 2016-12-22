const sysPath = require('path');

class RecruiteeBrunchTemplates {
	constructor(config) {
		this.config = config.plugins.recruitee || {};
	}

	compile(file) {
    const data = file.data;
    const path = file.path;

		let exports = `module.exports = ${JSON.stringify(file.data)}`;
		return Promise.resolve({ data: '', exports });
	}
}

RecruiteeBrunchTemplates.prototype.brunchPlugin = true;
RecruiteeBrunchTemplates.prototype.extension = 'html';
module.exports = RecruiteeBrunchTemplates;
