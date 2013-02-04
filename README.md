# node-config [![Build Status](https://secure.travis-ci.org/boz/node-config.png)](http://travis-ci.org/boz/node-config) #

Simple configuration for nodejs applications.

***

## Example

Place (json-formatted) configuration files in the `config` directory of your
project root.

```bash
$ cat config/database.json
{
  "host": "localhost",
  "user": "test",
  "pass": "test"
}
$ cat config/http.json
{
  "port": 8081
}
```

Load your application's configuration by calling `load()`.  Access
configuration declared in any file by using its filename (without an
extension) as an index in the global configuration object.

```js
var config = require('config').load();

db.connect({
  user: config.database.user,
  pass: config.database.pass
});

server.listen(config.http.port);
```
