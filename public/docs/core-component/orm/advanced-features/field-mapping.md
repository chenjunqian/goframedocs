# ORM Advanced Features - Field Mapping

## Basic Introduction

When using methods such as `Fields`, `Data`, or `Scan` to write or update data, if the given parameter is of the `map` or `struct` type, the keys or property names of the parameter will be automatically recognized and mapped to the corresponding fields of the database table, ignoring case sensitivity and special characters.

> This is why the database component executes the `SHOW FULL COLUMNS FROM 'xxx'` statement. This statement is executed only once per table and the result is then cached in memory.

**Examples of Matching Rules:**

```bash
| Map Key Name | Field Name | Match Status |
| ------------ | ---------- | ------------ |
| nickname     | nickname   | match        |
| NICKNAME     | nickname   | match        |
| Nick-Name    | nickname   | match        |
| nick_name    | nickname   | match        |
| nick name    | nickname   | match        |
| NickName     | nickname   | match        |
| Nick-name    | nickname   | match        |
| nick_name    | nickname   | match        |
| nick name    | nickname   | match        |
```

## Important Notes

### Interface Design

This feature relies on the `TableFields` interface defined in the `DB` package. If this interface is not implemented, the upper-level business logic needs to maintain the mapping relationship between property/key names and database table fields, which can be costly for non-business logic maintenance. The goal of the framework is to allow developers to focus as much as possible on business logic, so it adopts an automated design wherever possible. Currently, all drivers integrated with the framework support this interface.

```go
// TableFields retrieves and returns the fields' information of the specified table in the current schema.
//
// The `link` parameter is optional; if nil, it automatically retrieves a raw SQL connection to perform the necessary SQL query.
//
// The function returns a map containing the field names and their corresponding field properties.
// Since a map is unsorted, the `TableField` struct has an "Index" field that marks the sequence of the fields.
//
// This feature uses caching to enhance performance, which is never expired until the process restarts.
func (db DB) TableFields(ctx context.Context, table string, schema ...string) (fields map[string]*TableField, err error)
```

### Field Caching

The field information of each data table is queried and cached in memory during the first operation of the table. If you need to manually refresh the field cache, you can use the following methods:

```go
// ClearTableFields removes certain cached table fields of the current configuration group.
func (c *Core) ClearTableFields(ctx context.Context, table string, schema ...string) (err error)

// ClearTableFieldsAll removes all cached table fields of the current configuration group.
func (c *Core) ClearTableFieldsAll(ctx context.Context) (err error)
```

These methods are attached to the `Core` object, which is already exposed through the `DB` interface. You can get the `Core` object like this:

```go
g.DB().GetCore()
```

## Example of Usage

Let's look at an example where we implement an API to query basic user information. The user is a doctor.

1. We have two tables: a `user` table with about 30 fields, and a `doctor_user` table with over 80 fields.

2. The `user` table is the basic user table, containing the most basic user information; the `doctor_user` table is an extended business table based on the `user` table for specific user roles. The two tables have a one-to-one relationship.

3. We have a gRPC API with the following definition (simplified for demonstration purposes):

***GetDoctorInfoRes***

```go
// The response data structure for the query interface
type GetDoctorInfoRes struct {
    UserInfo             *UserInfo   `protobuf:"bytes,1,opt,name=UserInfo,proto3" json:"UserInfo,omitempty"`
    DoctorInfo           *DoctorInfo `protobuf:"bytes,2,opt,name=DoctorInfo,proto3" json:"DoctorInfo,omitempty"`
    XXX_NoUnkeyedLiteral struct{}    `json:"-"`
    XXX_unrecognized     []byte      `json:"-"`
    XXX_sizecache        int32       `json:"-"`
}
```

***UserInfo***

```go
// Basic user information
type UserInfo struct {
    Id                   uint32   `protobuf:"varint,1,opt,name=id,proto3" json:"id,omitempty"`
    Avatar               string   `protobuf:"bytes,2,opt,name=avatar,proto3" json:"avatar,omitempty"`
    Name                 string   `protobuf:"bytes,3,opt,name=name,proto3" json:"name,omitempty"`
    Sex                  int32    `protobuf:"varint,4,opt,name=sex,proto3" json:"sex,omitempty"`
    XXX_NoUnkeyedLiteral struct{} `json:"-"`
    XXX_unrecognized     []byte   `json:"-"`
    XXX_sizecache        int32    `json:"-"`
}
```

***DoctorInfo***

```go
// Doctor information
type DoctorInfo struct {
    Id                   uint32   `protobuf:"varint,1,opt,name=id,proto3" json:"id,omitempty"`
    Name                 string   `protobuf:"bytes,3,opt,name=name,proto3" json:"name,omitempty"`
    Hospital             string   `protobuf:"bytes,4,opt,name=hospital,proto3" json:"hospital,omitempty"`
    Section              string   `protobuf:"bytes,6,opt,name=section,proto3" json:"section,omitempty"`
    Title                string   `protobuf:"bytes,8,opt,name=title,proto3" json:"title,omitempty"`
    XXX_NoUnkeyedLiteral struct{} `json:"-"`
    XXX_unrecognized     []byte   `json:"-"`
    XXX_sizecache        int32    `json:"-"`
}
```

***Implementation Code for the Query Interface***

```go
// Query doctor information
func (s *Service) GetDoctorInfo(ctx context.Context, req *pb.GetDoctorInfoReq) (res *pb.GetDoctorInfoRes, err error) {
    // Protobuf response data structure
    res = &pb.GetDoctorInfoRes{}
    // Query doctor information
    // SELECT `id`,`avatar`,`name`,`sex` FROM `user` WHERE `user_id`=xxx
    err = dao.PrimaryDoctorUser.
        Ctx(ctx).
        Fields(res.DoctorInfo).
        Where(dao.PrimaryDoctorUser.Columns.UserId, req.Id).
        Scan(&res.DoctorInfo)
    if err != nil {
        return
    }
    // Query basic user information
    // SELECT `id`,`name`,`hospital`,`section`,`title` FROM `doctor_user` WHERE `id`=xxx
    err = dao.PrimaryUser.
        Ctx(ctx).
        Fields(res.DoctorInfo).
        Where(dao.PrimaryUser.Columns.Id, req.Id).
        Scan(&res.UserInfo)
    return res, err
}
```

When calling `GetDoctorInfo` to execute the query, two SQL queries will be sent to the database, such as:

```sql
SELECT `id`,`avatar`,`name`,`sex` FROM `user` WHERE `user_id`=1
SELECT `id`,`name`,`hospital`,`section`,`title` FROM `doctor_user` WHERE `id`=1
```

As shown:

- When using the `Fields` method, if the parameter type is `struct` or `*struct`, the ORM will automatically map the struct's property names to the database table's field names. When the mapping is successful, only the specific field data will be queried, and non-existent attribute fields will be automatically filtered out.
- When using the `Scan` method (or `Struct`/`Structs`), if the parameter type is `*struct` or `**struct`, the query result will be automatically mapped to the struct's properties. If the mapping is successful, the conversion and assignment will be done automatically; otherwise, no processing will be done on the parameter's properties.
