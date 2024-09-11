# ORM Chain Operation - Field Retrieval

## FieldsStr/FieldsExStr Field Retrieval

- **FieldsStr**: Used to retrieve fields of a specified table, allowing for an optional field prefix. The fields are concatenated into a string separated by commas (`,`).  
- **FieldsExStr**: Used to retrieve fields of a specified table with exceptions, allowing for an optional field prefix. The fields are concatenated into a string separated by commas (`,`).

### FieldsStr Example

Suppose the `user` table has four fields: `uid`, `nickname`, `passport`, and `password`.

***Retrieve Fields***

```go
// uid,nickname,passport,password
g.Model("user").FieldsStr()
```

***Retrieve Fields with a Specified Prefix***

```go
// gf_uid,gf_nickname,gf_passport,gf_password
g.Model("user").FieldsStr("gf_")
```

### FieldsExStr Example

Suppose the `user` table has four fields: `uid`, `nickname`, `passport`, and `password`.

***Retrieve Fields with Exclusions***

```go
// uid,nickname
g.Model("user").FieldsExStr("passport, password")
```

***Retrieve Fields with Exclusions and a Specified Prefix***

```go
// gf_uid,gf_nickname
g.Model("user").FieldsExStr("passport, password", "gf_")
```
