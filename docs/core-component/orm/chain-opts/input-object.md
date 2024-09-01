# ORM Chain Operation - Input Object

## Object Input for Data Methods

The methods `Data`, `Where`, `WherePri`, `And`, and `Or` support input parameters of various data types, including `string`, `map`, `slice`, `struct`, and `*struct`. This feature provides great flexibility to `gdb`. When a `struct` or `*struct` object is used as an input parameter, it will be automatically parsed into a `map` type. Only the public properties of the struct can be converted, and it supports `orm`, `gconv`, and `json` tags to define the converted key names, which map to the corresponding table fields.

### Example

```go
type User struct {
    Uid      int    `orm:"user_id"`
    Name     string `orm:"user_name"`
    NickName string `orm:"nick_name"`
}
// Or
type User struct {
    Uid      int    `gconv:"user_id"`
    Name     string `gconv:"user_name"`
    NickName string `gconv:"nick_name"`
}
// Or
type User struct {
    Uid      int    `json:"user_id"`
    Name     string `json:"user_name"`
    NickName string `json:"nick_name"`
}
```

### Explanation

- The properties of the struct should be public (starting with an uppercase letter).
- The `orm` tag corresponds to the field names in the database table.
- The mapping relationship between table fields can use either the `orm`, `gconv`, or traditional `json` tags. However, when all three tags are present, the `orm` tag has the highest priority.
  
To avoid conflicts with JSON encoding tags when converting struct objects to JSON format, it is recommended to use the `orm` tag to implement the ORM mapping relationship for the database. For more detailed conversion rules, please refer to the [Type Conversion Map](/docs/core-component/type-convert/map) section.
