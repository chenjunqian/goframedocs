# Type Convert - Scan

## Introduction

If you find the features for complex type conversions still insufficient, you might want to explore the `Scan` method. This method can handle conversion to structs, `struct` `arrays`, `maps`, and `arrays` of `maps`. It automatically identifies and executes the conversion based on the type of the target parameter provided by the developer.

The method is defined as follows:

```go
// Scan automatically calls MapToMap, MapToMaps, Struct, or Structs function according
// to the type of parameter `pointer` to implement the conversion.
// It calls MapToMap if `pointer` is of type *map to perform the conversion.
// It calls MapToMaps if `pointer` is of type *[]map or *[]*map to perform the conversion.
// It calls Struct if `pointer` is of type *struct or **struct to perform the conversion.
// It calls Structs if `pointer` is of type *[]struct or *[]*struct to perform the conversion.
func Scan(params interface{}, pointer interface{}, mapping ...map[string]string) (err error)
```

## Automatic Struct Conversion

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
    params := g.Map{
        "uid":  1,
        "name": "john",
    }
    var user *User
    if err := gconv.Scan(params, &user); err != nil {
        panic(err)
    }
    g.Dump(user)
}
```

**Output:**

```json
{
    "Uid":  1,
    "Name": "john"
}
```

## Automatic Struct Array Conversion

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
    if err := gconv.Scan(params, &users); err != nil {
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

## Automatic Map Conversion

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/util/gconv"
)

func main() {
    var (
        user   map[string]string
        params = g.Map{
            "uid":  1,
            "name": "john",
        }
    )
    if err := gconv.Scan(params, &user); err != nil {
        panic(err)
    }
    g.Dump(user)
}
```

**Output:**

```json
{
    "uid":  "1",
    "name": "john"
}
```

## Automatic Map Array Conversion

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/util/gconv"
)

func main() {
    var (
        users  []map[string]string
        params = g.Slice{
            g.Map{
                "uid":  1,
                "name": "john",
            },
            g.Map{
                "uid":  2,
                "name": "smith",
            },
        }
    )
    if err := gconv.Scan(params, &users); err != nil {
        panic(err)
    }
    g.Dump(users)
}
```

**Output:**

```json
[
    {
        "uid":  "1",
        "name": "john"
    },
    {
        "uid":  "2",
        "name": "smith"
    }
]
```
