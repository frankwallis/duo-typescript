var Compiler = require('./compiler');
var EntryCompiler = require('./entry-compiler');
var Logger = require('./logger');

// singleton
var compiler;

module.exports = function(options) {

  var logger = new Logger(options);
  var compiler = new Compiler(options);
  var entryCompiler = new EntryCompiler(logger, compiler, options);

  return function(file, entry, done) {

    // ignore other non ts files
    if (!Compiler.isTypescript(file.path))
      return done();

    if (file.entry === true) {
      logger.log('duo-typescript', 'compiling ' + file.path);

      // do the compilation
      if (!entryCompiler.compile(file)) {
        logger.error('typescript compilation failed(1)')
        return done(new Error('typescript compilation failed(1)'));
      }
    }

    // update the current file
    if (!entryCompiler.update(file, entry)) {
      logger.error('typescript compilation failed(2)')
      return done(new Error('typescript compilation failed(2)'));
    }

    return done();
  }
}