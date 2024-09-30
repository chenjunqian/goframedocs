# Metadata - gmeta

## Basic Introduction

The `gmeta` package is mainly used to embed into user-defined structs, and custom tag content (metadata) can be added to the structs through tags. During runtime, these custom tags can be dynamically retrieved through specific methods.

***Usage***

```go
import "github.com/gogf/gf/v2/util/gmeta"
```

***API Documentation***

[https://pkg.go.dev/github.com/gogf/gf/v2/util/gmeta](https://pkg.go.dev/github.com/gogf/gf/v2/util/gmeta)

### Method List

- `func Data(object interface{}) map[string]interface{}`
- `func Get(object interface{}, key string) *gvar.Var`

## Usage Examples

### Data Method

The `Data` method is used to retrieve the metadata tags of a specified struct object and return them as a map.

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/util/gmeta"
)

func main() {
    type User struct {
        gmeta.Meta `orm:"user" db:"mysql"`
        Id         int
        Name       string
    }
    g.Dump(gmeta.Data(User{}))
}
```

***Output after execution in the terminal***

```json
{
    "db": "mysql",
    "orm": "user"
}
```

### Get Method

The `Get` method is used to retrieve specific metadata tag information from a struct object by name.

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/util/gmeta"
)

func main() {
    type User struct {
        gmeta.Meta `orm:"user" db:"mysql"`
        Id         int
        Name       string
    }
    user := User{}
    fmt.Println(gmeta.Get(user, "orm").String())
    fmt.Println(gmeta.Get(user, "db").String())
}
```

***Output after execution in the terminal***

```bash
user
mysql
```
