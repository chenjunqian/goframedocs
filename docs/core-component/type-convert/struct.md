# Type Convert: Struct

We often encounter a large number of `struct` and the need to convert/assign various data types to `struct` (especially `JSON`/`XML`/various protocol encodings). To improve coding efficiency and project maintenance, the `gconv` module offers great benefits to developers, providing greater flexibility in data parsing.

The `gconv` module performs struct type conversion through the `Struct` conversion method, which is defined as follows:

```go
// Struct maps the params key-value pairs to the corresponding struct object's attributes.
// The third parameter `mapping` is optional, indicating the mapping rules between the
// custom key name and the attribute name (case-sensitive).
//
// Note:
// 1. The `params` can be any type of map/struct, usually a map.
// 2. The `pointer` should be of type *struct/**struct, which is a pointer to a struct object
//    or a struct pointer.
// 3. Only the public attributes of the struct object can be mapped.
// 4. If `params` is a map, the key of the map `params` can be lowercase.
//    It will automatically convert the first letter of the key to uppercase
//    in the mapping procedure to do the matching.
//    It ignores the map key if it does not match.
func Struct(params interface{}, pointer interface{}, mapping ...map[string]string) (err error)
```

- **params**: The variable to be converted to a struct, which can be of any data type, commonly a map.
- **pointer**: The target struct object for conversion. This parameter must be a pointer to the struct object, and the object's attributes will be updated after a successful conversion.
- **mapping**: A custom mapping between the map keys and struct attributes. This parameter is meaningful only if `params` is of type `map`. In most cases, the default conversion rules can be used without providing this parameter.

For more struct-related conversion methods, please refer to the interface documentation: [Goframe gconv Documentation](https://pkg.go.dev/github.com/gogf/gf/v2/util/gconv)

---

## Conversion Rules

The `gconv` module’s struct conversion feature is very powerful, supporting the mapping and conversion of any data type to struct attributes. Without custom mapping rules, the default conversion rules are as follows:

1. The struct attributes to be matched must be **public attributes** (start with an uppercase letter).
2. Depending on the type of `params`, the logic varies:
    - **params as map**: The key names will be automatically matched with struct attributes in a case-insensitive and special-character-ignoring manner.
    - **params as other types**: The value of the variable will be matched with the first attribute of the struct.
  
   Furthermore, if a struct attribute is of a complex data type such as `slice`, `map`, or `struct`, recursive matching and assignment will occur.

3. If matching succeeds, the key-value pair is assigned to the attribute; if not, the key-value pair is ignored.

## Matching Priority

***for map-to-struct conversion only***

1. If the `mapping` parameter is provided, it maps the keys according to the mapping rules provided.
2. If a field has a tag, the tag is used to match the key in `params`.
   - If no tag is set, `gconv` will search in the following order: `gconv`, `param`, `c`, `p`, `json`.
3. It matches the field name directly.
4. If none of the above match, `gconv` will traverse all keys in `params` and match according to the following rules:
   - Field name: Case-insensitive and ignoring underscores.
   - Key: Case-insensitive and ignoring underscores and special characters.

**Tip:**
If possible, satisfy the first three rules as the fourth rule is less efficient.

---

### Examples of Map Key to Struct Attribute Name Matching

```bash
| Map Key    | Struct Attribute | Matching Result |
|------------|------------------|-----------------|
| name       | Name             | match           |
| Email      | Email            | match           |
| nickname   | NickName         | match           |
| NICKNAME   | NickName         | match           |
| Nick-Name  | NickName         | match           |
| nick_name  | NickName         | match           |
| nick name  | NickName         | match           |
| NickName   | Nick_Name        | match           |
| Nick-name  | Nick_Name        | match           |
| nick_name  | Nick_Name        | match           |
| nick name  | Nick_Name        | match           |
```

---

## Auto Creating Objects

When the given `pointer` parameter is of type `**struct`, the `Struct` method will automatically create the struct object and update the pointer address of the passed variable.

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
    if err := gconv.Struct(params, &user); err != nil {
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

---

## Struct Recursive Conversion

Recursive conversion refers to the ability to map the `params` data (the first parameter) to the sub-objects of a struct object when it contains `embedded` sub-objects. This is commonly used in `struct` with inheritance.

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/util/gconv"
)

func main() {
    type Ids struct {
        Id         int    `json:"id"`
        Uid        int    `json:"uid"`
    }
    type Base struct {
        Ids
        CreateTime string `json:"create_time"`
    }
    type User struct {
        Base
        Passport   string `json:"passport"`
        Password   string `json:"password"`
        Nickname   string `json:"nickname"`
    }
    data := g.Map{
        "id"          : 1,
        "uid"         : 100,
        "passport"    : "john",
        "password"    : "123456",
        "nickname"    : "John",
        "create_time" : "2019",
    }
    user := new(User)
    gconv.Struct(data, user)
    g.Dump(user)
}
```

**Output:**

```json
{
    "Id":         1,
    "Uid":        100,
    "CreateTime": "2019",
    "Passport":   "john",
    "Password":   "123456",
    "Nickname":   "John"
}
```

---

## Basic Usage Example

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/util/gconv"
)

type User struct {
    Uid      int
    Name     string
    SiteUrl  string
    NickName string
    Pass1    string `c:"password1"`
    Pass2    string `c:"password2"`
}

func main() {
    var user *User

    // Bind attribute values to the object using the default mapping rules
    user = new(User)
    params1 := g.Map{
        "uid":       1,
        "Name":      "john",
        "site_url":  "https://goframe.org",
        "nick_name": "johng",
        "PASS1":     "123",
        "PASS2":     "456",
    }
    if err := gconv.Struct(params1, user); err == nil {
        g.Dump(user)
    }

    // Bind attribute values to the object using struct tags
    user = new(User)
    params2 := g.Map{
        "uid":       2,
        "name":      "smith",
        "site-url":  "https://goframe.org",
        "nick name": "johng",
        "password1": "111",
        "password2": "222",
    }
    if err := gconv.Struct(params2, user); err == nil {
        g.Dump(user)
    }
}
```

**Output:**

```json
{
    "Uid":      1,
    "Name":     "john",
    "SiteUrl":  "https://goframe.org",
    "NickName": "johng",
    "Pass1":    "123",
    "Pass2":    "456"
}
{
    "Uid":      2,
    "Name":     "smith",
    "SiteUrl":  "https://goframe.org",
    "NickName": "johng",
    "Pass1":    "111",
    "Pass2":    "222"
}
```

We can directly bind a map to a struct using the `Struct` method with default rules, or use struct tags for flexible settings. Additionally, the `Struct` method has a third map parameter for specifying custom mappings between parameter names and attribute names.

---

## Complex Attribute Types Example

Attributes support the conversion of `struct` objects or `struct` object pointers (if the target is a pointer and is `nil`, it will be automatically initialized during conversion).

```go
package main

import (
    "github.com/gogf/gf/v2/util/gconv"
    "github.com/gogf/gf/v2/frame/g"
    "fmt"
)

func main() {
    type Score struct {
        Name   string
        Result int
    }
    type User1 struct {
        Scores Score
    }
    type User2 struct {
        Scores *Score
    }

    user1  := new(User1)
    user2  := new(User2)
    scores := g.Map{
        "Scores": g.Map{
        "Name":   "john",
        "Result": 100,
        },
    }

    if err := gconv.Struct(scores, user1); err != nil {
        fmt.Println(err)
    } else {
        g.Dump(user1)
    }
    if err := gconv.Struct(scores, user2); err != nil {
        fmt.Println(err)
    } else {
        g.Dump(user2)
    }
}
```

**Output:**

```json
{
    "Scores": {
        "Name":   "john",
        "Result": 100
    }
}
{
    "Scores": {
        "Name":   "john",
        "Result": 100
    }
}
```
