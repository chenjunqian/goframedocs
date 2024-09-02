# ORM Result Handling - Result Types

## Data Structures

The data structure for query results is as follows:

```go
type Value = *gvar.Var              // Represents a single record value from a data table.
type Record map[string]Value        // Represents a key-value pair of a data table record.
type Result []Record                // Represents a list of data table records.
```

`Value`, `Record`, and `Result` are used as result data types for ORM operations.  

- `Result` represents a list of data table records.
- `Record` represents a single data table record.
- `Value` represents a single key-value data in a record.

`Value` is an alias for the `*gvar.Var` type, a runtime generic that supports different field types of a data table and facilitates subsequent data type conversions.

## Record

Related document: <https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb>

`gdb` provides great flexibility and convenience for operating on data table `records`. In addition to supporting data table `record` access and manipulation in the form of a `map`, it also allows converting data table `records` into `struct` for processing. The following example demonstrates this feature.

The structure of our user table is as follows (a simple design for demonstration purposes):

```sql
CREATE TABLE `user` (
  `uid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL DEFAULT '' COMMENT 'Nickname',
  `site` varchar(255) NOT NULL DEFAULT '' COMMENT 'Homepage',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
```

The table data is as follows:

```sql
| uid | name | site                  |
|-----|------|-----------------------|
| 1   | john | <https://goframe.org>   |
```

The example code:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

type User struct {
    Uid  int
    Name string
}

func main() {
    var (
        user *User
        ctx  = gctx.New()
    )
    err := g.DB().Model("user").Where("uid", 1).Scan(&user)
    if err != nil {
        g.Log().Header(false).Fatal(ctx, err)
    }
    if user != nil {
        g.Log().Header(false).Print(ctx, user)
    }
}
```

Output:

```json
{"Uid":1,"Name":"john"}
```

In this example, a custom struct is defined with only the `Uid` and `Name` fields, demonstrating the flexibility of the ORM feature: it supports selecting specific attributes.

The `gdb.Model.Scan` method can convert the query result into a struct object or an array of struct objects. When the parameter is `&user` (a `User` type), it will be converted into a struct object; if the parameter is `[]*User`, it will be converted into an array of struct objects. For more information, see the "Chained Operations" section.

### Field Mapping Rules

Note that the map contains keys like `uid`, `name`, `site`, while the struct has properties like `Uid`, `Name`. How do they match? The rules are:

- The properties to be matched in the struct must be public (first letter capitalized).
- The keys in the record result are matched with struct properties in a **case-insensitive** way and ignore `-`, `_`, or spaces.
- If matched, the value is assigned to the property; otherwise, the key-value is ignored.

Examples of matching:

```sql
| Record Key  | Struct Property | Match Status |
|-------------|-----------------|--------------|
| name        | Name            | Match        |
| Email       | Email           | Match        |
| nickname    | NickName        | Match        |
| NICKNAME    | NickName        | Match        |
| Nick-Name   | NickName        | Match        |
| nick_name   | NickName        | Match        |
| nick_name   | Nick_Name       | Match        |
| NickName    | Nick_Name       | Match        |
| Nick-Name   | Nick_Name       | Match        |
```

> Since converting a database result set to a `struct` relies on the `gconv.Struct` method, for customized attribute conversions and more detailed mapping rules, refer to the [Type Convert - Struct](/docs/core-component/type-convert/struct).

## Result

The `Result` and `Record` data types, based on the needs of result set operations, often require data retrieval using specific fields as keys. They include methods for converting to `Map`/`List` formats and also methods for converting to common data structures like JSON/XML.

For more information, see the [interface documentation](https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb).

Since the methods are relatively simple, examples are not provided here. Pay attention to the two frequently used methods: `Record.Map` and `Result.List`, which convert ORM query results into displayable data types. Since the field values of the result set are in `[]byte` format, although encapsulated in the new `Value` type and many common type conversion methods are provided (see the "Generic Type - gvar" section), you usually need to convert the `Result` or `Record` directly into JSON or XML data structures for output.

### Example Usage

```go
package main

import (
    "database/sql"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

type User struct {
    Uid  int
    Name string
    Site string
}

func main() {
    var (
        user []*User
        ctx  = gctx.New()
    )
    err := g.DB().Model("user").Where("uid", 1).Scan(&user)
    if err != nil && err != sql.ErrNoRows {
        g.Log().Header(false).Fatal(ctx, err)
    }
    if user != nil {
        g.Log().Header(false).Print(ctx, user)
    }
}
```

Output:

```json
[{"Uid":1,"Name":"john","Site":"https://goframe.org"}]
```
