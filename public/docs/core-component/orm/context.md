# ORM - Context

## Overview

The `ORM` supports passing custom `context` variables, which can be used for asynchronous `I/O` control, context information transmission (especially for tracing information transmission), and nested transaction support.

You can pass custom context variables to the `ORM` object using the `Ctx` method. The `Ctx` method is a chainable method, and the context passed in is only effective for the current `DB` interface object. The method is defined as follows:

```go
func Ctx(ctx context.Context) DB
```

## Request Timeout

Let's look at an example of controlling request timeout using context variables.

```go
ctx, cancel := context.WithTimeout(context.Background(), time.Second)
defer cancel()
_, err := db.Ctx(ctx).Query("SELECT SLEEP(10)")
fmt.Println(err)
```

In this example, the query will `sleep for 10 seconds`, which will inevitably cause a timeout. The output after execution is:

```bash
context deadline exceeded, SELECT SLEEP(10)
```

## Tracing Information

Context variables can also transmit tracing information and can be combined with the logging component to print trace information to logs (only when ORM logging is enabled). For more details, please refer to the specific section on service link tracing.

## Model Context Operations

Model objects also support the passing of context variables using the `Ctx` method. Here is a simple example that adjusts the example using model operations:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    _, err := g.DB().Model("user").Ctx(gctx.New()).All()
    if err != nil {
        panic(err)
    }
}
```

Upon execution, the terminal output is:

```bash
2020-12-28 23:46:56.349 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  5 ms] [default] [rows:0  ] SHOW FULL COLUMNS FROM `user`
2020-12-28 23:46:56.354 [DEBU] {38d45cbf2743db16f1062074f7473e5c} [  5 ms] [default] [rows:100] SELECT * FROM `user`
```

> The `SHOW FULL COLUMNS FROM user` query is performed by the ORM component to fetch the data table fields, and it only queries once for each table before performing operations, caching the results in memory.

## Nested Transaction Support

The support for nested transactions relies on the hierarchical transmission of the `Context` context variables. For more details, refer to the section on [ORM transaction](/docs/core-component/orm/transaction/).
