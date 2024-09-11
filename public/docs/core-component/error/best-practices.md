# Error - Best Practices

## Print Stack

By default `fmt/glog` or other log printing methods to print error messages, the stack information is not printed.

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/encoding/gjson"
)

func main() {
    _, err := gjson.Encode(func() {})
    fmt.Printf("err: %v", err)
}
```

Output:

```bash
err: json.Marshal failed: json: unsupported type: func()
```

To print the stack information, we can use the `%+v` to format the error message.

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/encoding/gjson"
)

func main() {
    _, err := gjson.Encode(func() {})
    fmt.Printf("err: %+v", err)
}
```

Output:

```bash
err: json.Marshal failed: json: unsupported type: func()
1. json.Marshal failed
   1).  github.com/gogf/gf/v2/internal/json.Marshal
        /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/internal/json/json.go:30
   2).  github.com/gogf/gf/v2/encoding/gjson.Encode
        /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/encoding/gjson/gjson_stdlib_json_util.go:41
   3).  main.main
        /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/.test/main.go:10
2. json: unsupported type: func()
```

## Wrap Error

When wrapping an error object, do not print the error object into the wrapped error message, because the `Wrap` itself will enclose the target error object inside the newly created error object. If the error message is included in the error string again, there will be a repetition of the error message when printing the error stack. For example (to simplify the example, stack information is not printed here):

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/encoding/gjson"
    "github.com/gogf/gf/v2/errors/gerror"
)

func main() {
    _, err1 := gjson.Encode(func() {})
    err2 := gerror.Wrapf(err1, `error occurred: %v`, err1)
    fmt.Printf("err: %v", err2)
}
```

Output:

```bash
err: error occurred: json.Marshal failed: json: unsupported type: func(): json.Marshal failed: json: unsupported type: func()
```

The right way:

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/encoding/gjson"
    "github.com/gogf/gf/v2/errors/gerror"
)

func main() {
    _, err1 := gjson.Encode(func() {})
    err2 := gerror.Wrap(err1, `error occurred`)
    fmt.Printf("err: %v", err2)
}
```

Output:

```bash
err: error occurred: json.Marshal failed: json: unsupported type: func()
```
