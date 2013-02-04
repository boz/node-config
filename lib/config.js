var  _   = require("underscore"),
    fs   = require("fs"),
    path = require("path");

function Config(basedir) {
  this.basedir = basedir || process.env['NODE_CONFIG_DIR'] || process.cwd();
}

Config.load = function(basedir) {
  return new Config(basedir).load();
};

Config.prototype.load = function() {
  return _.reduce(this.files(),function(config,fileInfo){
    return this.loadAndMergeFile(config,fileInfo);
  },{},this);
};

Config.prototype.loadAndMergeFile = function(config,fileInfo) {
  var fileConfig = this.loadFile(fileInfo);
  if(fileConfig)
    config = this.mergeConfig(config,fileInfo.name,fileConfig);
  return config;
};

Config.prototype.files = function() {
  return _.reduce(fs.readdirSync(this.basedir),function(acc,file){
    var fi = this.fileInfo(file);
    if(fi) acc.push(fi);
    return acc;
  },[],this);
};

Config.prototype.fileInfo = function(file) {
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

Config.prototype.stripext = function(path,ext) {
  return path.substr(0,path.lastIndexOf(ext) - 1);
};

Config.prototype.mergeConfig = function(config,nextName,nextConfig){
  /* TODO: propper deep-merge */
  if(!_.contains(config)) {
    config[nextName] = nextConfig;
  } else {
    _.extend(config[nextName],nextConfig);
  }
  return config;
};

Config.prototype.loadFile = function(fileInfo){
  /* TODO: support more than json */
  if(fileInfo.type !== "json") {
    console.warn("skipping %s: unsupported extension %s",fileInfo.path,fileInfo.type);
    return null;
  }
  return JSON.parse(fs.readFileSync(fileInfo.path));
};

module.exports = Config;
