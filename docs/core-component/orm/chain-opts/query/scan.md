# ORM Query - Scan

The `Scan` method supports converting query results into a struct or a struct array. The `Scan` method will automatically recognize the type of conversion to be executed based on the given parameter type.

## Struct Object

`Scan` supports converting query results into a struct object. The query result should be a specific record, and the `pointer` parameter should be the pointer address of the struct object (`*struct` or `**struct`). The usage is as follows:

```go
type User struct {
    Id         int
    Passport   string
    Password   string
    NickName   string
    CreateTime *gtime.Time
}
user := User{}
g.Model("user").Where("id", 1).Scan(&user)
```

Or

```go
var user = User{}
g.Model("user").Where("id", 1).Scan(&user)
```

The above two approaches involve pre-initializing the object (allocating memory in advance). The recommended approach is:

```go
var user *User
g.Model("user").Where("id", 1).Scan(&user)
```

This approach initializes and allocates memory only when data is found. Note the differences in usage, especially the difference in the type of parameter being passed (in the first two approaches, the parameter type passed is `*User`, whereas here, the parameter type is actually `**User`).

## Struct Array

`Scan` supports converting multiple query results into a `[]struct` or `[]*struct` array. The query result should be a result set composed of multiple records, and the `pointer` should be the pointer address of the array. The usage is as follows:

```go
var users []User
g.Model("user").Scan(&users)
```

Or

```go
var users []*User
g.Model("user").Scan(&users)
```
