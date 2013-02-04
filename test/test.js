var assert = require("assert"),
    config = require("../lib/config"),
    path   = require("path"),
    _      = require("underscore");

suite("Config",function(){
  suite("constructor arguments",function(){
    test("basedir should default to the current directory",function(){
      assert.equal(process.cwd(),new config().basedir);
    });
    test("basedir should be overridden by the first argument",function(){
      assert.equal("abc",new config("abc").basedir);
      assert.equal("abc",new config("abc").basedir);
    });
  });
  suite("utilities",function(){
    setup(function(){
      this.config = new config("bar");
    });
    test("#stripext",function(){
      assert.equal("foo",this.config.stripext("foo.json","json"));
    });
    suite("#fileInfo",function(){
      test("it constructs a valid object",function(){
        var fi = this.config.fileInfo("foo.json");
        assert.equal("json",fi.type);
        assert.equal("foo" ,fi.name);
        assert.equal("bar/foo.json" ,fi.path);
      });
      test("it returns null on an invalid filename",function(){
        assert.equal(null,this.config.fileInfo("test"));
        assert.equal(null,this.config.fileInfo("test."));
        assert.equal(null,this.config.fileInfo(".json"));
      });
    });
    suite("#mergeConfig",function(){
      test("it assigns a new key when empty", function(){
        var current = {};
        current = this.config.mergeConfig(current,'foo',{"a":1});
        assert.equal(current.foo.a,1);
      });
      test("it assigns a new key and retains the old keys",function(){
        var current = {"foo": {"a": 1}};
        current = this.config.mergeConfig(current,'bar',{"b":2});
        assert.equal(current.foo.a,1);
        assert.equal(current.bar.b,2);
      });
      test("it does not perform a true deep-merge",function(){
        var current = {"foo": {"a": 1}};
        current = this.config.mergeConfig(current,'foo',{"b":2});
        assert.equal(current.foo.a,undefined);
        assert.equal(current.foo.b,2);
      });
    });
  });
  suite("file methods",function(){
    setup(function(){
      this.basedir = path.join(__dirname,"config");
      this.config  = new config(this.basedir);
    });
    test("#files",function(){
      var files = this.config.files();
      assert.equal(files.length,2);
      assert.ok(_.findWhere(files,{"type":"json"}));
      assert.ok(_.findWhere(files,{"type":"yml"}));
    });
    test("#load",function(){
      var cfg = this.config.load();
      assert.deepEqual(cfg,{"foo":{"a":1,"b":2}});
    });
    test("Config.load",function(){
      var cfg = config.load(this.basedir);
      assert.deepEqual(cfg,{"foo":{"a":1,"b":2}});
    });
  });
});
