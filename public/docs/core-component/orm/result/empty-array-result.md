# ORM - Empty Array Result

## Pain Points

As explained in the previous sections, if an uninitialized array (value is `nil`) is provided and no data is found by the `ORM` based on the given conditions, the array will not be automatically initialized. Thus, if this uninitialized array result is encoded in `JSON`, it will be converted to a `null` value.

```go
package main

import (
    _ "github.com/gogf/gf/contrib/drivers/mysql/v2"
    "fmt"
    "github.com/gogf/gf/v2/encoding/gjson"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gtime"
)

func main() {
    type User struct {
        Id        uint64      // Primary key
        Passport  string      // Account
        Password  string      // Password
        NickName  string      // Nickname
        CreatedAt *gtime.Time // Creation time
        UpdatedAt *gtime.Time // Update time
    }
    type Response struct {
        Users []User
    }
    var res = &Response{}
    err := g.Model("user").WhereGT("id", 10).Scan(&res.Users)
    fmt.Println(err)
    fmt.Println(gjson.MustEncodeString(res))
}
```

After execution, the output on the terminal is:

```bash
<nil>
{"Users":null}
```

In most scenarios, the data queried by the ORM needs to be rendered on a browser page, which means the returned data needs to be processed by front-end JavaScript. To make it more convenient for front-end JavaScript to handle the data returned from the backend, it is desirable to return an empty array structure instead of a `null` value when no data is found.

## Improvement Solution

To handle this scenario, you can provide an initialized empty array to the `Scan` method of the `ORM`. When no data is found by the ORM, the array property remains an empty array rather than `nil`. After `JSON` encoding, it will not be a `null` value.

```go
package main

import (
    _ "github.com/gogf/gf/contrib/drivers/mysql/v2"
    "fmt"
    "github.com/gogf/gf/v2/encoding/gjson"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gtime"
)

func main() {
    type User struct {
        Id        uint64      // Primary key
        Passport  string      // Account
        Password  string      // Password
        NickName  string      // Nickname
        CreatedAt *gtime.Time // Creation time
        UpdatedAt *gtime.Time // Update time
    }
    type Response struct {
        Users []User
    }
    var res = &Response{
        Users: make([]User, 0),
    }
    err := g.Model("user").WhereGT("id", 10).Scan(&res.Users)
    fmt.Println(err)
    fmt.Println(gjson.MustEncodeString(res))
}
```

After execution, the output on the terminal is:

```bash
<nil>
{"Users":[]}
```

By initializing the array as an empty array (`make([]User, 0)`), the `JSON` encoded result is an empty array (`[]`) instead of `null`, which is more friendly for front-end handling.
