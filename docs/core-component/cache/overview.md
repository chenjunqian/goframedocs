# Cache - Introduction

## Overview

**gcache** is a unified cache management module that provides developers with a customizable and flexible cache adapter interface. By default, it offers a high-speed memory cache adapter implementation.

## Usage

```go
import "github.com/gogf/gf/v2/os/gcache"
```

For detailed API documentation, please visit:  
[https://pkg.go.dev/github.com/gogf/gf/v2/os/gcache](https://pkg.go.dev/github.com/gogf/gf/v2/os/gcache)

## Basic

`gcache` provides a default high-speed memory cache object. You can interact with this memory cache via package methods or create a new memory cache object using the `New` method. When using package methods, you are operating on a globally available `gcache.Cache` object, so be cautious of global key name collisions.

The key type used in `gcache` is `interface{}` instead of `string`, which means you can use any type of variable as a key. However, it is recommended to use `string` or `[]byte` for key names and maintain consistency in key name data types for easier maintenance.

The value type stored in `gcache` is `interface{}`, which means you can store any data type. When retrieving data, the return type is also `interface{}`, and you can use `gcache`'s `Get*` methods to conveniently get common types. If you are certain that you are using memory cache, you can directly use type assertion to convert the returned `interface{}` variable to your desired type. Otherwise, it's advisable to use the corresponding method for type conversion.

Additionally, note that the cache expiration time parameter `duration` is of type `time.Duration`. When setting a cache variable, if `duration = 0`, it means the cache never expires. If `duration < 0`, it expires immediately, and if `duration > 0`, it expires after the specified time.

## Notes

### Key Name Data Types

In the cache component, both key and value data types are `interface{}`. This design choice is made for generality and ease of use. However, when using `interface{}`, it's important to note that comparison will only succeed if both the data and the type are exactly the same. Here's an example:

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/os/gcache"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var (
        ctx           = gctx.New()
        key1  int32   = 1
        key2  float64 = 1
        value         = `value`
    )
    _ = gcache.Set(ctx, key1, value, 0)
    fmt.Println(gcache.MustGet(ctx, key1).Val())
    fmt.Println(gcache.MustGet(ctx, key2).Val())
}
```

When you run this code, the output will be:

```bash
value
<nil>
```

As you can see, even though `key1` and `key2` have the same numeric value, they are different types. Therefore, you cannot retrieve the value using `key2`.

### Retrieving Object Values

Since the key and value types are `interface{}`, you often need to convert them to the required data type after retrieval. A common approach is to use type assertion, but this carries some risks. The `gcache` component uses an adapter interface design pattern, so the underlying implementation (other than the default memory adapter) might change the original data type, especially when it involves serialization/deserialization. Therefore, it is not recommended to use type assertion directly for data type conversion.

To address this, the cache component has improved the way it returns values. Instead of returning an `interface{}` type directly, it returns a framework generic `*gvar.Var` object, which developers can convert to the required data type based on their business needs. This is particularly useful for scenarios involving object caching and retrieval. Here’s an example:

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/os/gcache"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    type User struct {
        Id   int
        Name string
        Site string
    }
    var (
        ctx   = gctx.New()
        user  *User
        key   = `UserKey`
        value = &User{
            Id:   1,
            Name: "GoFrame",
            Site: "https://goframe.org",
        }
    )
    err := gcache.Set(ctx, key, value, 0)
    if err != nil {
        panic(err)
    }
    v, err := gcache.Get(ctx, key)
    if err != nil {
        panic(err)
    }
    if err = v.Scan(&user); err != nil {
        panic(err)
    }
    fmt.Printf(`%#v`, user)
}
```

When you run this code, the output will be:

```go
&main.User{Id:1, Name:"GoFrame", Site:"https://goframe.org"}
```
