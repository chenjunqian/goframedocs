# Object Management

`Goframe` encapsulates some commonly used data types and object acquisition methods, which can be obtained through `g.*`.

`g` is a tightly coupled module, designed to provide convenience for developers when calling frequently used types/objects.

Usage:

```go
import "github.com/gogf/gf/v2/frame/g"
```

## Data Types

Some commonly used data types.

```go
type (
 Var = gvar.Var        // Var is a universal variable interface, like generics.
 Ctx = context.Context // Ctx is alias of frequently-used context.Context.
)

type (
 Map        = map[string]interface{}      // Map is alias of frequently-used map type map[string]interface{}.
 MapAnyAny  = map[interface{}]interface{} // MapAnyAny is alias of frequently-used map type map[interface{}]interface{}.
 MapAnyStr  = map[interface{}]string      // MapAnyStr is alias of frequently-used map type map[interface{}]string.
 MapAnyInt  = map[interface{}]int         // MapAnyInt is alias of frequently-used map type map[interface{}]int.
 MapStrAny  = map[string]interface{}      // MapStrAny is alias of frequently-used map type map[string]interface{}.
 MapStrStr  = map[string]string           // MapStrStr is alias of frequently-used map type map[string]string.
 MapStrInt  = map[string]int              // MapStrInt is alias of frequently-used map type map[string]int.
 MapIntAny  = map[int]interface{}         // MapIntAny is alias of frequently-used map type map[int]interface{}.
 MapIntStr  = map[int]string              // MapIntStr is alias of frequently-used map type map[int]string.
 MapIntInt  = map[int]int                 // MapIntInt is alias of frequently-used map type map[int]int.
 MapAnyBool = map[interface{}]bool        // MapAnyBool is alias of frequently-used map type map[interface{}]bool.
 MapStrBool = map[string]bool             // MapStrBool is alias of frequently-used map type map[string]bool.
 MapIntBool = map[int]bool                // MapIntBool is alias of frequently-used map type map[int]bool.
)

type (
 List        = []Map        // List is alias of frequently-used slice type []Map.
 ListAnyAny  = []MapAnyAny  // ListAnyAny is alias of frequently-used slice type []MapAnyAny.
 ListAnyStr  = []MapAnyStr  // ListAnyStr is alias of frequently-used slice type []MapAnyStr.
 ListAnyInt  = []MapAnyInt  // ListAnyInt is alias of frequently-used slice type []MapAnyInt.
 ListStrAny  = []MapStrAny  // ListStrAny is alias of frequently-used slice type []MapStrAny.
 ListStrStr  = []MapStrStr  // ListStrStr is alias of frequently-used slice type []MapStrStr.
 ListStrInt  = []MapStrInt  // ListStrInt is alias of frequently-used slice type []MapStrInt.
 ListIntAny  = []MapIntAny  // ListIntAny is alias of frequently-used slice type []MapIntAny.
 ListIntStr  = []MapIntStr  // ListIntStr is alias of frequently-used slice type []MapIntStr.
 ListIntInt  = []MapIntInt  // ListIntInt is alias of frequently-used slice type []MapIntInt.
 ListAnyBool = []MapAnyBool // ListAnyBool is alias of frequently-used slice type []MapAnyBool.
 ListStrBool = []MapStrBool // ListStrBool is alias of frequently-used slice type []MapStrBool.
 ListIntBool = []MapIntBool // ListIntBool is alias of frequently-used slice type []MapIntBool.
)

type (
 Slice    = []interface{} // Slice is alias of frequently-used slice type []interface{}.
 SliceAny = []interface{} // SliceAny is alias of frequently-used slice type []interface{}.
 SliceStr = []string      // SliceStr is alias of frequently-used slice type []string.
 SliceInt = []int         // SliceInt is alias of frequently-used slice type []int.
)

type (
 Array    = []interface{} // Array is alias of frequently-used slice type []interface{}.
 ArrayAny = []interface{} // ArrayAny is alias of frequently-used slice type []interface{}.
 ArrayStr = []string      // ArrayStr is alias of frequently-used slice type []string.
 ArrayInt = []int         // ArrayInt is alias of frequently-used slice type []int.
)
```

## Common Objects

Common objects are typically managed through the `singleton` pattern, allowing you to retrieve corresponding object instances based on different singleton names. During object initialization, the corresponding configuration items in the configuration file are automatically retrieved. For specific configuration items, please refer to the section introduction of the corresponding object.

Note: During the runtime phase, every time a singleton object is obtained through the `g` module, there is an internal global locking mechanism to ensure the concurrency safety of operations and data. In principle, there may be lock contention in scenarios with high concurrency, but in most business scenarios, developers do not need to worry too much about the performance loss caused by lock contention. Additionally, developers can save the obtained singleton objects to internal variables of specific modules for repeated use, thereby avoiding lock contention during runtime.

### HTTP Client

```go
func Client() *ghttp.Client
```

### Validator Object

```go
func Validator() *gvalid.Validator
```

### (Singleton) Configuration Object

```go
func Cfg(name ...string) *gcfg.Config
```

`Goframe` will scan the configuration files which with the following file extensions: `toml`, `yaml`, `yml`, `json`, `ini`, `xml`, `properties`. By default, it will automatically search for the following configuration files:

- `config`

- `config.toml`

- `config.yaml`

- `config.yml`

- `config.json`

- `config.ini`

- `config.xml`

- `config.properties`

The object will automatically refresh the cache when the configuration file is modified externally.

To facilitate configuration file calls in scenarios with multiple files and to simplify usage and improve development efficiency, the singleton object will automatically search for files using the singleton name when created. For example, `g.Cfg("redis")` retrieves a singleton object that will automatically search for the following files by default:

- `redis`

- `redis.toml`

- `redis.yaml`

- `redis.yml`

- `redis.json`

- `redis.ini`

- `redis.xml`

- `redis.properties`

If the file is loaded into memory cache, they will be directly read from memory. If the file does not exist, the default configuration file (`config.toml`) is used.

### (Singleton) Logger Object

```go
func Log(name ...string) *glog.Logger
```

It will automatically read the default configuration file (`config.toml`) when it is created.

### (Singleton) Template Engine

```go
func View(name ...string) *gview.View
```

It will automatically read the `viewer` configuration item from the default configuration file and will only initialize the template engine once. It uses a `lazy initialization` design internally; when obtaining the template engine, only a lightweight template management object is created. The actual initialization only occurs when the template file is parsed.

### (Singleton) `Web Server`

```go
func Server(name ...interface{}) *ghttp.Server
```

This singleton object will automatically read the default `server` configuration when it is created, and only initialize the web server once.

### (Singletion) `TCP Server`

```go
func TcpServer(name ...interface{}) *gtcp.Server
```

### (Singleton) `UDP Server`

```go
func UdpServer(name ...interface{}) *gudp.Server
```

### (Singleton) Database `ORM` Object

```go
func DB(name ...string) *gorm.DB
```

The singleton object will automatically read the `database` configuration item from the default configuration file and will only initialize the `DB` object once.

Additionally, you can create a `Model` object on the default database with the following method:

```go
func Model(tables string, db ...string) *gdb.Model
```

### (Singleton) `Redis` Client

```go
func Redis(name ...string) *gredis.Redis
```

The singleton object will automatically read the `redis` configuration item from the default configuration file and will only initialize the `Redis` object once.

### (Singleton) Resource Object

```go
func Res(name ...string) *gres.Resource
```

### (Singleton) Internationalization Object

```go
func I18n(name ...string) *gi18n.Manager
```
