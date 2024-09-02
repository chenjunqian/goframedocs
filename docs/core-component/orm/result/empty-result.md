# ORM - Empty Result Checks

When using `GoFrame ORM`, checking for empty results is very straightforward. In most cases, you can directly check if the returned data is `nil` or has a length of `0`, or you can use the `IsEmpty` or `IsNil` methods.

## Multiple Data Record

```go
r, err := g.Model("order").Where("status", 1).All()
if err != nil {
    return err
}
if len(r) == 0 {
    // Result is empty
}
```

You can also use the `IsEmpty` method:

```go
r, err := g.Model("order").Where("status", 1).All()
if err != nil {
    return err
}
if r.IsEmpty() {
    // Result is empty
}
```

## Single Data Record

```go
r, err := g.Model("order").Where("status", 1).One()
if err != nil {
    return err
}
if len(r) == 0 {
    // Result is empty
}
```

Alternatively, use the `IsEmpty` method:

```go
r, err := g.Model("order").Where("status", 1).One()
if err != nil {
    return err
}
if r.IsEmpty() {
    // Result is empty
}
```

## Data Field Value

The return value is a "generic" variable, so you can only use `IsEmpty` to check if it is empty:

```go
r, err := g.Model("order").Where("status", 1).Value()
if err != nil {
    return err
}
if r.IsEmpty() {
    // Result is empty
}
```

## Field Value Array

The type of the returned field value array is `[]gdb.Value`, so you can directly check if its length is 0:

```go
// Array/FindArray
r, err := g.Model("order").Fields("id").Where("status", 1).Array()
if err != nil {
    return err
}
if len(r) == 0 {
    // Result is empty
}
```

## Struct Object

***Note:***

For `struct` conversion objects, there is a slight difference. Let's look at an example:

When the object passed is a `nil` pointer, if data is found, the object will be automatically created internally; if no data is found, the pointer remains `nil` without any processing.

```go
var user *User
err := g.Model("order").Where("status", 1).Scan(&user)
if err != nil {
    return err
}
if user == nil {
    // Result is empty
}
```

When the object passed is already initialized, if data is found, the data is assigned to the object internally. If no data is found, the object cannot be checked for `nil`. Therefore, `ORM` will return an `sql.ErrNoRows` error to notify the developer that no data was found, and no assignment was made, allowing further empty result checks.

```go
var user = new(User)
err := g.Model("order").Where("status", 1).Scan(&user)
if err != nil && err != sql.ErrNoRows {
    return err
}
if err == sql.ErrNoRows {
    // Result is empty
}
```

> We recommend that developers do not pass an initialized object to `ORM`. Instead, pass a pointer to the object (`**struct` type), and `ORM` will automatically initialize it based on the query results.

## Struct Array

When the passed object array is an empty array (length `0`), if data is found, the array is automatically populated; if no data is found, the empty array remains unchanged without any processing.

```go
var users []*User
err := g.Model("order").Where("status", 1).Scan(&users)
if err != nil {
    return err
}
if len(users) == 0 {
    // Result is empty
}
```

When the passed object array is not empty, if data is found, it will overwrite the array from index `0`. If no data is found, it is impossible to check if the array has a length of `0`. Therefore, `ORM` will return an `sql.ErrNoRows` error to notify the developer that no data was found, allowing further empty result checks.

```go
var users = make([]*User, 100)
err := g.Model("order").Where("status", 1).Scan(&users)
if err != nil {
    return err
}
if err == sql.ErrNoRows {
    // Result is empty
}
```

> Because struct conversion relies on Golang's reflection feature, there may be some performance loss. If you are dealing with a large number of query results and need to improve conversion performance, consider implementing the `UnmarshalValue` method for the corresponding struct. For more details, see the [Type Convert - UnmarshalValue](/docs/core-component/type-convert/unmarshal) section.
