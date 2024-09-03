# Advanced ORM Features - Embedded Struct Support

## Introduction

`GoFrame ORM` provides robust support for `embedded structs`, including parameter passing and result processing. This feature allows you to leverage embedded structures in your ORM models, facilitating cleaner and more organized code.

## Example

Consider the following example demonstrating the use of `embedded structs`:

```go
type Base struct {
    Uid        int         `orm:"uid"`
    CreateAt   *gtime.Time `orm:"create_at"`
    UpdateAt   *gtime.Time `orm:"update_at"`
    DeleteAt   *gtime.Time `orm:"delete_at"`
}

type User struct {
    Base
    Passport   string `orm:"passport"`
    Password   string `orm:"password"`
    Nickname   string `orm:"nickname"`
}
```

`GoFrame ORM` support for `embedded structs` simplifies the management of complex models by allowing for organized and reusable code. No matter how many levels of nesting are involved, `ORM` handles parameter passing and result processing efficiently. This support makes it easier to work with complex data structures and ensures that your models remain clean and maintainable.
