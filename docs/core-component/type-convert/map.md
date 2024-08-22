# Type Convert - Map

The `gconv.Map` function in Goframe supports converting any `map` or `struct/*struct` type to the commonly used `map[string]interface{}` type. When the conversion parameter is of `struct/*struct` type, it automatically recognizes the struct's `c/gconv/json` tags. You can also specify custom conversion tags and the priority of multiple tag parsing through the second parameter `tags` of the `Map` method. If the conversion fails, it returns `nil`.

> When converting `struct/*struct` types, it supports `c/gconv/json` property tags and also supports the "-" and "omitempty" tag properties. When using the "-" tag property, it means the property is not converted; when using the "omitempty" tag property, it means the property is not converted when it is empty (empty pointer `nil`, number `0`, string `""`, empty array `[]`, etc.). Please refer to the following examples for details.

***Common Conversion Methods***

```go
func Map(value interface{}, tags ...string) map[string]interface{}
func MapDeep(value interface{}, tags ...string) map[string]interface{}
```

The `MapDeep` function supports recursive conversion, which means it will recursively convert struct/*struct objects within properties.

> For more map-related conversion methods, please refer to the [package documentation](https://pkg.go.dev/github.com/gogf/gf/v2/util/gconv).

## Basic Example

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/util/gconv"
)

func main() {
    type User struct {
        Uid  int    `c:"uid"`
        Name string `c:"name"`
    }
    // Object
    g.Dump(gconv.Map(User{
        Uid:  1,
        Name: "john",
    }))
    // Object pointer
    g.Dump(gconv.Map(&User{
        Uid:  1,
        Name: "john",
    }))

    // Arbitrary map type
    g.Dump(gconv.Map(map[int]int{
        100: 10000,
    }))
}
```

After execution, the terminal output is:

```json
{
    "name": "john",
    "uid": 1
}

{
    "name": "john",
    "uid": 1
}

{
    "100": 10000
}
```

## Attribute Tags

We can customize the map key names after conversion through `c/gconv/json` tags. When multiple tags exist, the priority recognition is made according to the tag order of `gconv/c/json`.

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/util/gconv"
)

func main() {
    type User struct {
        Uid      int
        Name     string `c:"-"`
        NickName string `c:"nickname, omitempty"`
        Pass1    string `c:"password1"`
        Pass2    string `c:"password2"`
    }
    user := User{
        Uid:   100,
        Name:  "john",
        Pass1: "123",
        Pass2: "456",
    }
    g.Dump(gconv.Map(user))
}
```

Output:

```json
{
    "Uid": 100,
    "password1": "123",
    "password2": "456",
    "nickname": "",
}
```

## Custom Tags

Additionally, we can assign custom tag names to the `struct`'s properties and specify the tag priority during map conversion through the second argument.

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/util/gconv"
)

func main() {
    type User struct {
        Id   int    `c:"uid"`
        Name string `my-tag:"nick-name" c:"name"`
    }
    user := &User{
        Id:   1,
        Name: "john",
    }
    g.Dump(gconv.Map(user, "my-tag"))
}
```

Output:

```json
{
    "nick-name": "john",
    "uid": 1,
}
```

## Recursive Conversion

When the parameter is of type `map/struct/*struct`, if the `key/value/property` is an object (or object pointer) and is not an `embedded` struct without any alias tag binding, the `Map` method will convert the object into a key-value result. We can use the `MapDeep` method to recursively convert the parameter's sub-objects, i.e., convert properties to `map` types as well.

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/util/gconv"
    "reflect"
)

func main() {
    type Base struct {
        Id   int    `c:"id"`
        Date string `c:"date"`
    }
    type User struct {
        UserBase Base   `c:"base"`
        Passport string `c:"passport"`
        Password string `c:"password"`
        Nickname string `c:"nickname"`
    }
    user := &User{
        UserBase: Base{
            Id:   1,
            Date: "2019-10-01",
        },
        Passport: "john",
        Password: "123456",
        Nickname: "JohnGuo",
    }
    m1 := gconv.Map(user)
    m2 := gconv.MapDeep(user)
    g.Dump(m1, m2)
    fmt.Println(reflect.TypeOf(m1["base"]))
    fmt.Println(reflect.TypeOf(m2["base"]))
}
```

Output:

```bash
{
    "base": {
        "id":   1,
        "date": "2019-10-01",
    },
    "passport": "john",
    "password": "123456",
    "nickname": "JohnGuo",
}
{
    "base": {
        "id":   1,
        "date": "2019-10-01",
    },
    "passport": "john",
    "password": "123456",
    "nickname": "JohnGuo",
}
main.Base
map[string]interface {}
```

Do you see the difference?
