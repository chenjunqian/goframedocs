# Log - JSON Format

`glog` is very friendly to log analysis tools, supporting the output of log content in `JSON` format.

## `map/struct` Parameters

To output `JSON` format log content, we can just use `map` or `struct` parameters.

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    ctx := context.TODO()
    g.Log().Debug(ctx, g.Map{"uid": 100, "name": "john"})
    type User struct {
        Uid  int    `json:"uid"`
        Name string `json:"name"`
    }
    g.Log().Debug(ctx, User{100, "john"})
}
```

Output:

```bash
2019-06-02 15:28:52.653 [DEBU] {"name":"john","uid":100}
2019-06-02 15:28:52.653 [DEBU] {"uid":100,"name":"john"}
```

## With `gjson.MustEncode`

Use `gjson.MustEncode` to output `JSON` format log content.

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/encoding/gjson"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    ctx := context.TODO()
    type User struct {
        Uid  int    `json:"uid"`
        Name string `json:"name"`
    }
    g.Log().Debugf(ctx, `user json: %s`, gjson.MustEncode(User{100, "john"}))
}
```

```go
package main

import (
    "context"

    "github.com/gogf/gf/v2/encoding/gjson"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    ctx := context.TODO()
    type User struct {
        Uid  int    `json:"uid"`
        Name string `json:"name"`
    }
    g.Log().Debugf(ctx, `user json: %s`, gjson.MustEncode(User{100, "john"}))
}
```

Output:

```bash
2022-04-25 18:09:45.029 [DEBU] user json: {"uid":100,"name":"john"}
```
