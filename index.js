const less = require('less');
const sysPath = require('path');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');

class RecruiteeBrunchTools {
	constructor(config) {
		this.config = config.plugins.recruitee || {};
		this.rootPath = config.paths.root;

		this._lessDeps = [];
	}

	compile(file) {
    const data = file.data;
    const path = file.path;

		// compile and inline LESS
		if (/.less/.test(file.path)) {
	    const lessConfig = Object.assign({}, this.config, {
	      paths: [this.rootPath, sysPath.dirname(path)],
	      filename: path,
	      dumpLineNumbers: !this.optimize && this.config.dumpLineNumbers
	    });

			return this.compileLess(data, lessConfig).then(output => {
				this._lessDeps = output.imports;
				let exports = `module.exports = ${JSON.stringify(output.css)}`;
				return Promise.resolve({ data: '', exports });
			});
		}

		// inline html
		if (/\.html/.test(file.path)) {
			let exports = `module.exports = ${JSON.stringify(file.data)}`;
			return Promise.resolve({ data: '', exports });
		}

		return Promise.resolve(file);
	}

	getDependencies(data, path) {
		let deps = [];

		if (/\.less/.test(path)) {
			deps = [].concat(this._lessDeps);
			this._lessDeps = [];
		}

		return Promise.resolve(deps);
	}


	compileLess(data, config) {
		var prefixer = postcss([ autoprefixer ]);

    return less.render(data, config).then(
			output => {
				return prefixer.process(output.css).then(processed => {
					return {
						css: processed.css,
						imports: output.imports
					}
				});
			},
			err => {
				console.log(err);
	      // let msg = `${err.type}Error: ${err.message}`;
	      // if (err.filename) {
	      //   msg += ` in "${err.filename}:${err.line}:${err.column}"`;
	      // }
	      // throw msg;
    	}
		);
	}
}

RecruiteeBrunchTools.prototype.brunchPlugin = true;
RecruiteeBrunchTools.prototype.pattern = /\.(less|html)/;
module.exports = RecruiteeBrunchTools;
