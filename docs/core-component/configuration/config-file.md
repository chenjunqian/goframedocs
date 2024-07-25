# Configuration - Config File

The `gcfg` component is designed with interface-based, and the default implementation is based on the file system interface. The supported data file formats include: `JSON, XML, YAML (YML), TOML, INI, PROPERTIES`. Developers can choose the configuration file format which they are familiar with.

## Config File

### Default File

We recommand use singleton configuration object `g.Cfg`, it will scan files with `toml/yaml/yml/json/ini/xml/properties` suffixes, load and cache them, configuration will automatic refresh when these file are changed.

If you want to use specific config file, you can use `SetFileName` to set it. Like `default.yaml, default.json, default.xml`

```go
g.Cfg().GetAdapter().(*gcfg.AdapterFile).SetFileName("default.yaml")
```

### Modified Default File

Config file can be a specific file name or a complete file absolute path.

We can modify the default file name in several ways:

- By using the configuration management method `SetFileName` to modify.

- By changing the command line startup argument `-gf.gcfg.file`.

- By modifying the specified environment variable - `GF_GCFG_FILE`.

Assuming the executable program file is named `main`, the following methods can be used to modify the configuration manager's configuration file directory (on `Linux`):

***1. By Singleton `g.Cfg`***

```go
g.Cfg().GetAdapter().(*gcfg.AdapterFile).SetFileName("default.yaml")
```

***2. By Command line startup argument `-gf.gcfg.file`***

```bash
./main -gf.gcfg.file=config,prod.toml
```

***3. By environment variable `GF_GCFG_FILE`***

- Startup command

  ```bash
    GF_GCFG_FILE=config.prod.toml; ./main
  ```

- `gevn` component

  ```go
  gevn.Set("GF_GCFG_FILE", "config.prod.toml")
  ```

## Config Directory

### Path Configuration

`gcfg` support multiple configuration directories scan, using the `SetPath` method can set a configuration directory as the only on to scan. And also we recommand using `AddPath` to add more configuration directories, `goframe` order the directories are added as a priority. It will return error if there is no configuration file in the directory.

### Default Path

`gcfg`'s will scan the following directories by default:

1. `config`, `manifest/config` directories under current project workspace root directory, like `{workspaceFolder}/`, `{workspaceFolder}/config, {workspaceFolder}/manifest/config`

2. `config`, `manifest/config` under current executable program directory, like the executable binary directory in `/tmp`, the default configuration directory will be `/tmp/`, `/tmp/config, /tmp/manifest/config`

## Configuration Content

The `gcfg` also supports direct content configuration, rather than reading from a configuration file, which is often used for dynamically modifying configuration content within the program. Global configuration can use below function to set configuration content.

```go
func (c *AdapterFile) SetContent(content string, file ...string)
func (c *AdapterFile) GetContent(file ...string) string
func (c *AdapterFile) RemoveContent(file ...string)
func (c *AdapterFile) ClearContent()
```

**Note** that content configuration takes effect globally, and has higher priority than file configuration. If we set the configuration content for `config.toml` using `SetContent("v = 1", "config.toml")`, and there is also a `config.toml` configuration file present, only the configuration set by `SetContent` will be used, and the content of the configuration file will be ignored.

## Hirarchy Access

`gcfg` support reading configuration data by hierarchy. Hieriarchy access defaults to using `.` as the separator.

```yaml
server:
  address:    ":8199"
  serverRoot: "resource/public"

database:
  default:
    link:   "mysql:root:12345678@tcp(127.0.0.1:3306)/focus"
    debug:  true
```

Reading the configuration like below:

```go
// :8199
g.Cfg().Get(ctx, "server.address")

// true
g.Cfg().Get(ctx, "database.default.debug")
```

## Notes

In `Golang`, the `map/slice` type is actually a `reference type` (or a `pointer type`). Therefore, when you modify the value of this type of variable, you will also modify the corresponding data. Considering efficiency, some of the methods in the `gcfg` do not make a value copy when the returned data type is `map/slice`. Therefore, when you modify the returned data, you will also modify the underlying data of `gcfg` at the same time.

Example:

Configuration file:

```bash
// config.json:
`{"map":{"key":"value"}, "slice":[59,90]}`
```

```go
var ctx = gctx.New()

m := g.Cfg().MustGet(ctx, "map").Map()
fmt.Println(m)

// Change the key-value pair.
m["key"] = "john"

// It changes the underlying key-value pair.
fmt.Println(g.Cfg().MustGet(ctx, "map").Map())

s := g.Cfg().MustGet(ctx, "slice").Slice()
fmt.Println(s)

// Change the value of specified index.
s[0] = 100

// It changes the underlying slice.
fmt.Println(g.Cfg().MustGet(ctx, "slice").Slice())

// output:
// map[key:value]
// map[key:john]
// [59 90]
// [100 90]
```

## Update Detection

The configuration manager using a caching mechanism. When a configuration file is read for the first time, it is cached in memory, and subsequent reads will directly access the cache to improve performance. Additionally, the configuration manager offers an automatic update detection mechanism for configuration files. If a configuration file is modified externally, the configuration manager can immediately refresh the cached content of the configuration file.
