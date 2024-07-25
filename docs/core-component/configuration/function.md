# Configuration - Function

Below is a list of common methods. The documentation may not update in time for the new features in the code. For more methods and examples, please refer to the code documentation: <https://pkg.go.dev/github.com/gogf/gf/v2/os/gcfg>

## `GetWithEnv`

The `GetWithEnv` function first reads configuration data from the default configuration file. If the retrieval is empty, it will then obtain it from the current environment variables. Note the naming conversion rules:

- Environment variables will convert names to uppercase, and the period `.` character in the name is converted to an underscore `_` character.

- Parameter names will convert names to lowercase, and the underscore `_` character in the name is converted to a period `.` character.

```go
GetWithEnv(ctx context.Context, pattern string, def ...interface{}) (*gvar.Var, error)
```

Example:

```go
func ExampleConfig_GetWithEnv() {
    var (
        key = `env.test`
        ctx = gctx.New()
    )
    v, err := g.Cfg().GetWithEnv(ctx, key)
    if err != nil {
        panic(err)
    }
    fmt.Printf("env:%s\n", v)
    if err = genv.Set(`ENV_TEST`, "gf"); err != nil {
        panic(err)
    }
    v, err = g.Cfg().GetWithEnv(ctx, key)
    if err != nil {
        panic(err)
    }
    fmt.Printf("env:%s", v)

    // Output:
    // env:
    // env:gf
}
```

## `GetwithCmd`

`GetWithCmd` is similar to the `GetWithEnv` function. It also first retrieves configuration data from the default configuration object. However, when the retrieval is empty, it obtains configuration information from the command line.

```go
GetWithCmd(ctx context.Context, pattern string, def ...interface{}) (*gvar.Var, error)
```

Example:

```go
func ExampleConfig_GetWithCmd() {
    var (
        key = `cmd.test`
        ctx = gctx.New()
    )
    v, err := g.Cfg().GetWithCmd(ctx, key)
    if err != nil {
        panic(err)
    }
    fmt.Printf("cmd:%s\n", v)
    // Re-Initialize custom command arguments.
    os.Args = append(os.Args, fmt.Sprintf(`--%s=yes`, key))
    gcmd.Init(os.Args...)
    // Retrieve the configuration and command option again.
    v, err = g.Cfg().GetWithCmd(ctx, key)
    if err != nil {
        panic(err)
    }
    fmt.Printf("cmd:%s", v)

    // Output:
    // cmd:
    // cmd:yes
}
```

## `MustGetWithCmd`

The `MustGetWithCmd` is similar to the `GetWithCmd` method. This method only returns the configuration content, and if any internal errors occur, it will result in a panic.

```go
MustGetWithCmd(ctx context.Context, pattern string, def ...interface{}) *gvar.Var
```

Example:

```go
func ExampleConfig_MustGetWithCmd() {
    var (
        key = `cmd.test`
        ctx = gctx.New()
    )
    v := g.Cfg().MustGetWithCmd(ctx, key)

    fmt.Printf("cmd:%s\n", v)
    // Re-Initialize custom command arguments.
    os.Args = append(os.Args, fmt.Sprintf(`--%s=yes`, key))
    gcmd.Init(os.Args...)
    // Retrieve the configuration and command option again.
    v = g.Cfg().MustGetWithCmd(ctx, key)

    fmt.Printf("cmd:%s", v)

    // Output:
    // cmd:
    // cmd:yes
}
```

## `MustGetWithEnv`

The `MustGetWithEnv` is similar to the `GetWithEnv` method. This method only returns the configuration content, and if any internal errors occur, it will result in a panic.

```go
MustGetWithEnv(ctx context.Context, pattern string, def ...interface{}) *gvar.Var
```

Example:

```go
func ExampleConfig_MustGetWithEnv() {
    var (
        key = `env.test`
        ctx = gctx.New()
    )
    v := g.Cfg().MustGetWithEnv(ctx, key)

    fmt.Printf("env:%s\n", v)
    if err := genv.Set(`ENV_TEST`, "gf"); err != nil {
        panic(err)
    }
    v = g.Cfg().MustGetWithEnv(ctx, key)

    fmt.Printf("env:%s", v)

    // Output:
    // env:
    // env:gf
}
```

## Data

The `Data` method returns the configuration data in the form of `map[string]interface{}`.

```go
Data(ctx context.Context) (data map[string]interface{}, err error)
```

Example:

```go
func ExampleConfig_Data() {
    ctx := gctx.New()
    content := `
        v1    = 1
        v2    = "true"
        v3    = "off"
        v4    = "1.23"
        array = [1,2,3]
        [redis]
            disk  = "127.0.0.1:6379,0"
            cache = "127.0.0.1:6379,1"
    `
    c, err := gcfg.New()
    if err != nil{
        panic(err)
    }
    c.GetAdapter().(*gcfg.AdapterFile).SetContent(content)
    data, err := c.Data(ctx)
    if err != nil{
        panic(err)
    }

    fmt.Println(data)

    // Output:
    // map[array:[1 2 3] redis:map[cache:127.0.0.1:6379,1 disk:127.0.0.1:6379,0] v1:1 v2:true v3:off v4:1.23]
}
```

## MustData

The `MustData` method returns the configuration data in the form of `map[string]interface{}`. If any internal errors occur, it will result in a panic.

```go
MustData(ctx context.Context) map[string]interface{}
```

Example:

```go
func ExampleConfig_MustData() {
    ctx := gctx.New()
    content := `
        v1    = 1
        v2    = "true"
        v3    = "off"
        v4    = "1.23"
        array = [1,2,3]
        [redis]
            disk  = "127.0.0.1:6379,0"
            cache = "127.0.0.1:6379,1"
    `
    c, err := gcfg.New()
    if err != nil{
        panic(err)
    }

    c.GetAdapter().(*gcfg.AdapterFile).SetContent(content)
    data := c.MustData(ctx)

    fmt.Println(data)

    // Output:
    // map[array:[1 2 3] redis:map[cache:127.0.0.1:6379,1 disk:127.0.0.1:6379,0] v1:1 v2:true v3:off v4:1.23]
}
```

## `Get`

The `Get` method retrieves configuration data and return `gvar` generic object.

```go
Get(ctx context.Context, pattern string, def ...interface{}) (*gvar.Var, error)
```

Example:

```go
func ExampleConfig_Get() {
    ctx := gctx.New()
    content := `
        v1    = 1
        v2    = "true"
        v3    = "off"
        v4    = "1.23"
        array = [1,2,3]
        [redis]
            disk  = "127.0.0.1:6379,0"
            cache = "127.0.0.1:6379,1"
    `
    c, err := gcfg.New()
    if err != nil{
        panic(err)
    }

    c.GetAdapter().(*gcfg.AdapterFile).SetContent(content)
    data,err := c.Get(ctx,"redis")

    if err != nil {
        panic(err)
    }
    fmt.Println(data)

    // Output:
    // {"cache":"127.0.0.1:6379,1","disk":"127.0.0.1:6379,0"}
}
```

## `MustGet`

The `MustGet` method retrieves configuration data and return `*gvar.Var`. If any internal errors occur, it will result in a panic.

```go
MustGet(ctx context.Context, pattern string, def ...interface{}) *gvar.Var
```

Example:

```go
func ExampleConfig_MustGet() {
    ctx := gctx.New()
    content := `
        v1    = 1
        v2    = "true"
        v3    = "off"
        v4    = "1.23"
        array = [1,2,3]
        [redis]
            disk  = "127.0.0.1:6379,0"
            cache = "127.0.0.1:6379,1"
    `
    c, err := gcfg.New()
    if err != nil{
        panic(err)
    }

    c.GetAdapter().(*gcfg.AdapterFile).SetContent(content)
    data := c.MustGet(ctx,"redis")

    fmt.Println(data)

    // Output:
    // {"cache":"127.0.0.1:6379,1","disk":"127.0.0.1:6379,0"}
    }
```

## `GetAdapter`

`GetAdapter` returns the runtime `gcfg` adapter information.

```go
GetAdapter() Adapter
```

Example:

```go
func ExampleConfig_GetAdapter() {
    c, err := gcfg.New()
    if err != nil{
        panic(err)
    }

    fmt.Println(c.GetAdapter())

    // Output:
    // &{config.toml 0xc00014d720 0xc000371880 false}
}
```

## `SetAdapter`

`SetAdapter` sets the runtime `gcfg` adapter information.

```go
SetAdapter(adapter Adapter)
```
