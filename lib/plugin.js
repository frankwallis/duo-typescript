var Compiler = require('./entry-compiler');

// singleton
var compiler;

module.exports = function(options) {

  options = options || {};
  options.declaration = options.declaration || false;
  options.sourceMap = options.sourceMap || false;
  options.inlineSourceMap = options.inlineSourceMap || false;
  options.gulpMode = options.gulpMode || false;

  var cmpout = require('./logger')(options);
  
  if (!compiler)
    compiler = new Compiler(options);

  return function(file, entry, done) {

    // function strungify(a) {
    //     for (var prop in a)
    //         console.log(prop + ': ' + a[prop]);
    // }
    
    //console.log(strungify(file));

    // don't need to compile components which only have declaration files
    if (Compiler.isTypescriptDeclaration(file.path)) {
      file.string = false;
      return done();
    }  

    // ignore other non ts files
    if (!Compiler.isTypescript(file.path))
      return done();

    if (file.entry === true) {
      //console.log(strungify(file));
      // do the compilation
      if (!compiler.compileEntry(file, cmpout))
        return done(new Error('typescript compilation failed(1)'))

    }

    // update the current file
    if (!compiler.updateFile(file, cmpout))
      return done(new Error('typescript compilation failed(2)'));

    return done();      
  }
}