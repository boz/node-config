var  _   = require("underscore"),
    fs   = require("fs"),
    path = require("path");

function Loader(basedir) {
  this.basedir = basedir || process.env['NODE_CONFIG_DIR'] || path.join(process.cwd(),'config');
}

Loader.load = function(basedir) {
  return new Loader(basedir).load();
};

Loader.prototype.load = function() {
  return _.reduce(this.files(),function(config,fileInfo){
    return this.loadAndMergeFile(config,fileInfo);
  },{},this);
};

Loader.prototype.loadAndMergeFile = function(config,fileInfo) {
  var fileLoader = this.loadFile(fileInfo);
  if(fileLoader)
    config = this.mergeLoader(config,fileInfo.name,fileLoader);
  return config;
};

Loader.prototype.files = function() {
  return _.reduce(fs.readdirSync(this.basedir),function(acc,file){
    var fi = this.fileInfo(file);
    if(fi) acc.push(fi);
    return acc;
  },[],this);
};

Loader.prototype.fileInfo = function(file) {
  var ext = path.extname(file).substr(1);
  if(_.isEmpty(ext) || _.isNull(ext) || file === "." + ext) {
    console.warn("skipping %s: invalid filename",file);
    return null;
  }
  return ({
     "path": path.join(this.basedir,file),
     "type": ext,
     "name": this.stripext(file,ext)
  });
};

Loader.prototype.stripext = function(path,ext) {
  return path.substr(0,path.lastIndexOf(ext) - 1);
};

Loader.prototype.mergeLoader = function(config,nextName,nextLoader){
  /* TODO: propper deep-merge */
  if(!_.contains(config)) {
    config[nextName] = nextLoader;
  } else {
    _.extend(config[nextName],nextLoader);
  }
  return config;
};

Loader.prototype.loadFile = function(fileInfo){
  /* TODO: support more than json */
  if(fileInfo.type !== "json") {
    console.warn("skipping %s: unsupported extension %s",fileInfo.path,fileInfo.type);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(fileInfo.path));
  } catch (e) {
    console.warn("skipping %s: %s",fileInfo.path,e);
    return null;
  }
};

module.exports = Loader;
