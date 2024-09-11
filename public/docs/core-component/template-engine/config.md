# Template Engine - Configuration

## Configuration Object

Configuration Object Definition:

[https://pkg.go.dev/github.com/gogf/gf/v2/os/gview#Config](https://pkg.go.dev/github.com/gogf/gf/v2/os/gview#Config)

## Configuration Files

The view component supports configuration files. When you use `g.View(singletonName)` to get the View singleton object, it automatically retrieves the corresponding View configuration from the default configuration management object. By default, it reads the `viewer.singletonName` configuration item. If this configuration item does not exist, it will read the `viewer` configuration item.

### Configuration File Options

The configuration file options and their descriptions are as follows. Configuration item names are case-insensitive:

```ini
[viewer]
    Paths       = ["/var/www/template"] # Template file search directory path, absolute paths are recommended. Default is the current working directory of the program.
    DefaultFile = "index.html"          # Default template file to parse. Default is "index.html".
    Delimiters  = ["${", "}"]           # Template engine variable delimiters. Default is ["{{", "}"].
    AutoEncode  = false                 # Whether to automatically XSS encode variable content. Default is false.
    [viewer.Data]                       # Custom global Key-Value pairs directly usable in template parsing.
        Key1 = "Value1"
        Key2 = "Value2"
```

### Default Configuration Items

```ini
[viewer]
    paths       = ["template", "/var/www/template"]
    defaultFile = "index.html"
    delimiters  = ["${", "}"]
    [viewer.data]
        name    = "gf"
        version = "1.10.0"
```

When you use `g.View()` to get the default singleton object, it will automatically retrieve and apply this configuration.

### Multiple Configuration Items

Example configuration for multiple View objects:

```ini
[viewer]
    paths       = ["template", "/var/www/template"]
    defaultFile = "index.html"
    delimiters  = ["${", "}"]
    [viewer.data]
        name    = "gf"
        version = "1.10.0"
    [viewer.view1]
        defaultFile = "layout.html"
        delimiters  = ["${", "}"]
    [viewer.view2]
        defaultFile = "main.html"
        delimiters  = ["#{", "}"]
```

You can get the corresponding View singleton objects using the singleton object names:

```go
// Corresponds to viewer.view1 configuration
v1 := g.View("view1")
// Corresponds to viewer.view2 configuration
v2 := g.View("view2")
// Corresponds to default configuration viewer
v3 := g.View("none")
// Corresponds to default configuration viewer
v4 := g.View()
```

## Configuration Methods

**Method List:**

[https://pkg.go.dev/github.com/gogf/gf/v2/os/gview](https://pkg.go.dev/github.com/gogf/gf/v2/os/gview)

**Brief Description:**

- You can use `SetConfig` and `SetConfigWithMap` to set configurations.
- You can also use the View object's `Set*` methods for specific configuration settings.
- Note that configuration items should be set before the View object performs view parsing to avoid concurrency issues.

### SetConfigWithMap

You can use the `SetConfigWithMap` method to set or modify specific configurations of the View using Key-Value pairs. Other configurations will use default settings. The Key names correspond to the properties in the `Config` struct, case-insensitive, and can use separators like `-`, `_`, or spaces between words. Refer to the section on Type Conversion - Struct Conversion for detailed rules.

**Simple Example:**

```go
package main

import (
    "context"
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gview"
)

func main() {
    view := gview.New()
    view.SetConfigWithMap(g.Map{
            "Paths":       []string{"template"},
            "DefaultFile": "index.html",
            "Delimiters":  []string{"${", "}"},
            "Data": g.Map{
            "name":    "gf",
            "version": "1.10.0",
        },
    })
    result, err := view.ParseContent(context.TODO(), "hello ${.name}, version: ${.version}")
    if err != nil {
        panic(err)
    }
    fmt.Println(result)
}
```

Here, `DefaultFile` represents the default template file to parse. The key name can also be `defaultFile`, `default-File`, `default_file`, or `default file`. Other configuration attributes follow the same rules.

## Notes

It's common for users to encounter issues where their template parsing doesn't work or their custom tags are displayed as-is.

In such cases, please check your configuration file for template tags. A common issue is that `delimiters` might be set to `["${", "}"]` while the template uses `["{{", "}}"]`.
