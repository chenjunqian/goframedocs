# Type Convert - Structs

## Introduction

In a previous discussion, we introduced the `Struct` method, which is used for converting data into struct objects. Similarly, we can also convert arrays of structs using the `Structs` method. The `Structs` method builds upon the `Struct` method, applying the same conversion rules but extending support to arrays of structs. Before diving into the `Structs` method, it is recommended to familiarize yourself with the `Struct` method: [Type Convert - Struct](/docs/core-component/type-convert/struct).

## Method Definition

The `Structs` method is defined as follows:

```go
// Structs converts any slice to the given struct slice.
func Structs(params interface{}, pointer interface{}, mapping ...map[string]string) (err error)
```

- **params**: The variable or slice to be converted.
- **pointer**: The target struct array or array of struct pointers for conversion. This must be of type `*[]struct` or `*[]*struct`.
- **mapping**: An optional parameter for custom mapping between the slice keys and struct attributes, similar to the `Struct` method.

## Example Usage

Let’s look at a simple example to understand how it works.

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/util/gconv"
)

func main() {
    type User struct {
        Uid  int
        Name string
    }
    params := g.Slice{
        g.Map{
            "uid":  1,
            "name": "john",
        },
        g.Map{
            "uid":  2,
            "name": "smith",
        },
    }
    var users []*User
    if err := gconv.Structs(params, &users); err != nil {
        panic(err)
    }
    g.Dump(users)
}
```

**Output:**

```json
[
    {
        "Uid":  1,
        "Name": "john"
    },
    {
        "Uid":  2,
        "Name": "smith"
    }
]
```
