# ORM Chain Operation - Field Filtering

## Fields FieldsEx Field Filtering

- **Fields**: Used to specify the table fields to operate on, including filtering query fields, write fields, update fields, etc.
- **FieldsEx**: Used to specify exceptions for fields, which can also be used to filter query fields, write fields, update fields, etc.

### Fields Example

Suppose the `user` table has four fields: `uid`, `nickname`, `passport`, and `password`.

***Query Field Filtering***

```go
// SELECT `uid`,`nickname` FROM `user` ORDER BY `uid` asc
g.Model("user").Fields("uid, nickname").Order("uid asc").All()
```

***Write Field Filtering***

```go
m := g.Map{
     "uid"      : 10000,
     "nickname" : "John Guo",
     "passport" : "john",
     "password" : "123456",
}
g.Model(table).Fields("nickname,passport,password").Data(m).Insert()
// INSERT INTO `user`(`nickname`,`passport`,`password`) VALUES('John Guo','john','123456')
```

### FieldsEx Example

Suppose the `user` table has four fields: `uid`, `nickname`, `passport`, and `password`.

***Query Field Exclusion***

```go
// SELECT `uid`,`nickname` FROM `user`
g.Model("user").FieldsEx("passport, password").All()
```

***Write Field Exclusion***

```go
m := g.Map{
     "uid"      : 10000,
     "nickname" : "John Guo",
     "passport" : "john",
     "password" : "123456",
}
g.Model(table).FieldsEx("uid").Data(m).Insert()
// INSERT INTO `user`(`nickname`,`passport`,`password`) VALUES('John Guo','john','123456')
```

## OmitEmpty - Filtering Empty Values

When there are empty values such as `nil`, `""`, `0` in `map` or `struct`, by default, `gdb` treats them as normal input parameters, so these parameters will also be updated to the database table. The `OmitEmpty` feature can filter fields with empty values before writing data to the database.

### Related Methods

```go
func (m *Model) OmitEmpty() *Model
func (m *Model) OmitEmptyWhere() *Model
func (m *Model) OmitEmptyData() *Model 
```

The `OmitEmpty` method filters out empty values in both `Where` and `Data`, while `OmitEmptyWhere` and `OmitEmptyData` can be used to perform specific field filtering.

### Write and Update Operations

Empty values affect write/update operations such as `Insert`, `Replace`, `Update`, and `Save`. For example, the following operation (using `map` as an example, the same applies to `struct`):

```go
// UPDATE `user` SET `name`='john',update_time=null WHERE `id`=1
g.Model("user").Data(g.Map{
    "name"        : "john",
    "update_time" : nil,
}).Where("id", 1).Update()
```

To handle empty values, we can use the `OmitEmpty` method to filter them out. For example, the above operation can be modified to:

```go
// UPDATE `user` SET `name`='john' WHERE `id`=1
g.Model("user").OmitEmpty().Data(g.Map{
    "name"        : "john",
    "update_time" : nil,
}).Where("id", 1).Update()
```

For `struct` data parameters, we can also filter out empty values. Example:

```go
type User struct {
    Id         int    `orm:"id"`
    Passport   string `orm:"passport"`
    Password   string `orm:"password"`
    NickName   string `orm:"nickname"`
    CreateTime string `orm:"create_time"`
    UpdateTime string `orm:"update_time"`
}
user := User{
    Id        : 1,
    NickName  : "john",
    UpdateTime: gtime.Now().String(),
}
g.Model("user").OmitEmpty().Data(user).Insert()
// INSERT INTO `user`(`id`,`nickname`,`update_time`) VALUES(1,'john','2019-10-01 12:00:00')
```

> **Note:** The `OmitEmpty` method will be ineffective in batch write/update operations, because in batch operations, the fields for each write record must be uniform.

### About `omitempty` Tag vs. `OmitEmpty` Method

For `struct` empty value filtering, some may think of the `omitempty` tag. This tag is commonly used for JSON conversion empty value filtering and is used in some third-party ORM libraries for `struct` to database field empty value filtering (i.e., fields are not converted if their values are empty).

The effects of the `omitempty` tag and the `OmitEmpty` method are the same. In ORM operations, it is not recommended to use the `omitempty` tag on a `struct` to control field empty value filtering; instead, it is recommended to use the `OmitEmpty` method. This is because once the tag is added, it is bound to the `struct` and cannot be flexibly controlled. Using the `OmitEmpty` method allows developers to selectively filter `struct` fields based on the business scenario, offering greater flexibility.

## Data Query Operations

Empty values also affect data query operations, particularly in the `where` condition parameters. We can use the `OmitEmpty` method to filter out empty values in condition parameters.

**Usage Example:**

```go
// SELECT * FROM `user` WHERE `passport`='john' LIMIT 1
r, err := g.Model("user").Where(g.Map{
    "nickname" : "",
    "passport" : "john",
}).OmitEmpty().One()
```

For `struct` data:

```go
type User struct {
    Id         int    `orm:"id"`
    Passport   string `orm:"passport"`
    Password   string `orm:"password"`
    NickName   string `orm:"nickname"`
    CreateTime string `orm:"create_time"`
    UpdateTime string `orm:"update_time"`
}
user := User{
    Passport : "john",
}
r, err := g.Model("user").OmitEmpty().Where(user).One()
// SELECT * FROM `user` WHERE `passport`='john' LIMIT 1
```

## OmitNil - Filtering Nil Values

### Overview

When there are empty values such as `nil` in `map` or `struct`, by default, `gdb` treats them as normal input parameters, so these parameters will also be updated to the database table. The `OmitNil` feature can filter out fields with `nil` values before writing data to the database. Unlike the `OmitEmpty` feature, `OmitNil` only filters fields with `nil` values, while other empty values such as `""` and `0` are not filtered.

***Related Methods***

```go
func (m *Model) OmitNil() *Model
func (m *Model) OmitNilWhere() *Model
func (m *Model) OmitNilData() *Model 
```

The `OmitNil` method filters out `nil` values in both `Where` and `Data`, while `OmitNilWhere` and `OmitNilData` can be used to perform specific field filtering.

## Using do Object for Field Filtering

If you use the GoFrame project structure, the `gf gen dao` or `make dao` command will automatically generate the corresponding table `dao/entity/do` files according to the configured database. When using the `do` object in database operations, fields that are not assigned will be automatically filtered.

### Generated `do` Object Struct Definition

```go
// User is the golang structure of table user for DAO operations like Where/Data.
type User struct {
 g.Meta   `orm:"table:user, do:true"`
 Id       interface{} // User ID
 Passport interface{} // User Passport
 Password interface{} // User Password
 Nickname interface{} // User Nickname
 CreateAt *gtime.Time // Created Time
 UpdateAt *gtime.Time // Updated Time
}
```

### Data Insertion

```go
dao.User.Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
 _, err = dao.User.Ctx(ctx).Data(do.User{
  Passport: in.Passport,
  Password: in.Password,
  Nickname: in.Nickname,
 }).Insert()
 return err
})
```

### Data Query

```go
var user *entity.User
err = dao.User.Ctx(ctx).Where(do.User{
 Passport: in.Passport,
 Password: in.Password,
}).Scan(&user)
```
