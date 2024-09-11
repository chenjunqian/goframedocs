# ORM Advanced Features - Type Recognition

## Introduction to Type Recognition

When using `GoFrame ORM` to query data, the values of fields are treated as generic objects, and the returned data types will be automatically identified and mapped to the corresponding Go variable types. This mapping helps convert generic values into specific types.

For example:

- When the field type is `int(xx)`, the queried field value will be recognized as an `int` type.
- When the field type is `varchar(xxx)`, `char(xxx)`, `text`, etc., it will be automatically recognized as a `string` type.
- Other mappings follow a similar logic.

Below is an example of automatic type recognition between MySQL database types and Go variable types:

> Note: The version may be updated iteratively, and you can check the source code for the latest mapping: [GoFrame ORM Type Mapping Source Code](https://github.com/gogf/gf/blob/master/database/gdb/gdb_core_structure.go)

```bash
| MySQL Type        | Go Variable Type |
|-------------------|------------------|
| `char`            | `string`         |
| `text`            | `string`         |
| `binary`          | `[]byte`         |
| `blob`            | `[]byte`         |
| `int`             | `int`            |
| `money`           | `float64`        |
| `bit`             | `int`            |
| `bigint`          | `int64`          |
| `float`           | `float64`        |
| `double`          | `float64`        |
| `decimal`         | `float64`        |
| `bool`            | `bool`           |
| `date`            | `time.Time`      |
| `datetime`        | `time.Time`      |
| `timestamp`       | `time.Time`      |
| Other types       | `string`         |
```

## Benefits of Type Recognition

This feature is particularly useful when you need to encode query results and return them directly to the client in formats such as `JSON`. The automatic type recognition simplifies the conversion process, making it easier to handle data serialization and deserialization in web applications.
