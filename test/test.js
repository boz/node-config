var assert = require("assert"),
    loader = require("../lib/loader"),
    path   = require("path"),
    _      = require("underscore");

suite("Loader",function(){
  suite("constructor arguments",function(){
    test("basedir should default to the current directory",function(){
      assert.equal(path.join(process.cwd(),'config'),new loader().basedir);
    });
    test("basedir should be overridden by the first argument",function(){
      assert.equal("abc",new loader("abc").basedir);
      assert.equal("abc",new loader("abc").basedir);
    });
  });
  suite("utilities",function(){
    setup(function(){
      this.loader = new loader("bar");
    });
    test("#stripext",function(){
      assert.equal("foo",this.loader.stripext("foo.json","json"));
    });
    suite("#fileInfo",function(){
      test("it constructs a valid object",function(){
        var fi = this.loader.fileInfo("foo.json");
        assert.equal("json",fi.type);
        assert.equal("foo" ,fi.name);
        assert.equal("bar/foo.json" ,fi.path);
      });
      test("it returns null on an invalid filename",function(){
        assert.equal(null,this.loader.fileInfo("test"));
        assert.equal(null,this.loader.fileInfo("test."));
        assert.equal(null,this.loader.fileInfo(".json"));
      });
    });
    suite("#mergeLoader",function(){
      test("it assigns a new key when empty", function(){
        var current = {};
        current = this.loader.mergeLoader(current,'foo',{"a":1});
        assert.equal(current.foo.a,1);
      });
      test("it assigns a new key and retains the old keys",function(){
        var current = {"foo": {"a": 1}};
        current = this.loader.mergeLoader(current,'bar',{"b":2});
        assert.equal(current.foo.a,1);
        assert.equal(current.bar.b,2);
      });
      test("it does not perform a true deep-merge",function(){
        var current = {"foo": {"a": 1}};
        current = this.loader.mergeLoader(current,'foo',{"b":2});
        assert.equal(current.foo.a,undefined);
        assert.equal(current.foo.b,2);
      });
    });
  });
  suite("file methods",function(){
    setup(function(){
      this.basedir = path.join(__dirname,"config");
      this.loader  = new loader(this.basedir);
    });
    test("#files",function(){
      var files = this.loader.files();
      assert.equal(files.length,3);
      assert.ok(_.findWhere(files,{"type":"json"}));
      assert.ok(_.findWhere(files,{"type":"yml"}));
    });
    test("#load",function(){
      var cfg = this.loader.load();
      assert.deepEqual(cfg,{"foo":{"a":1,"b":2}});
    });
    test("Loader.load",function(){
      var cfg = loader.load(this.basedir);
      assert.deepEqual(cfg,{"foo":{"a":1,"b":2}});
    });
  });
});
