var fs = require('fs');
var path = require('path');

var flatten = require('component-flatten');
var log = require('debuglog')(require('../package').name);
var outputDeclarations = require('./declarations-sync');
var Compiler = require('./compiler');
var Host = require('./caching-host');

var isTypescript = Compiler.isTypescript;
var isTypescriptDeclaration = Compiler.isTypescriptDeclaration;

function EntryCompiler(opts) {
	this.opts = {
		noImplicitAny: opts.noImplicitAny || false,
		removeComments: opts.removeComments || false,
		sourceMap: opts.sourceMap || false,
		inlineSourceMap: opts.inlineSourceMap || false,
		declaration: opts.declaration || false,
		target: opts.target || opts.t || 'ES5'
	};
	this.compiler = new Compiler(new Host(opts));
	this.error = false;
}

EntryCompiler.prototype.compileEntry = function (entry, cmpout) {
	var self = this;

	self.compiler.reset();
	this.error = false;
	
	var tsopts = {
		module: 'commonjs',
		noImplicitAny: !!self.opts.noImplicitAny,
		removeComments: !!self.opts.removeComments,
		sourceMap: !!self.opts.sourceMap || !!self.opts.inlineSourceMap,
		declaration: !!self.opts.declaration,
		target: self.opts.target || opts.t || 'ES5',
		skipWrite: true,
		noResolve: false
	};

	var errors = self.compiler.compile([entry.path], tsopts);
	
	if (errors.length) {
		if (errors[0].category === 1 /* Error */) {
			this.error = true;
		}

		self.outputDiagnostics(entry, errors, cmpout);
		return false;
	}
	
	return true;
}

EntryCompiler.prototype.outputDiagnostics = function (entry, diags, cmpout) {
	diags.slice(0, 10).forEach(function(diag) {
		// feature: print the compiler output over 2 lines! file then message
		if (diag.file) {
		  var loc = diag.file.getLineAndCharacterFromPosition(diag.start);
		  var filename = Compiler.normalizePath(path.relative(entry.root, diag.file.filename));
		  var output = filename + "(" + loc.line + "," + loc.character + "): ";

		  if (diag.category === 1)
		    cmpout.error('typescript', output)
		  else
		    cmpout.warn('typescript', output)
		}

		if (diag.category === 1)
		  cmpout.error('typescript', diag.messageText + " (TS" + diag.code + ")");
		else
		  cmpout.warn('typescript', diag.messageText + " (TS" + diag.code + ")");
	});
}

EntryCompiler.prototype.generateDeclarationFile = function (branch, cmpout) {
	// generate an external definition file for local or linked components
	var stats = fs.lstatSync(branch.path);
	isLinked = stats && stats.isSymbolicLink();

	if ((branch.type == 'local') || isLinked)
		return outputDeclarations(branch, branch.__tsc.manifest, this.compiler.getDeclarationFiles(), this.opts, cmpout);
	else
		return true;
}

EntryCompiler.prototype.updateFile = function (file, cmpout) {
	var self = this;

	file.src = self.compiler.getCompiledFile(file.path, self.opts.inlineSourceMap);

	if (!file.src) {
		if (self.shouldIgnoreFile(file.path, file.branch))
			return true;
		
		if (!this.error)
			cmpout.error('typescript', file.path + ' was not compiled');
		
		return false;
	}
	else {
		file.type = 'js';
		file.mtime = new Date();

		if (self.opts.sourceMap && !self.opts.inlineSourceMap)
			file.sourceMap = self.compiler.getSourceMapJson(file.filename);

		return true;
	}
}

module.exports = EntryCompiler;
module.exports.isTypescript = Compiler.isTypescript;
module.exports.isTypescriptDeclaration = Compiler.isTypescriptDeclaration;
