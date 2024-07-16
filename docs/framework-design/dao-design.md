# DAO - Pain Points and Improvements

The design of `DAO` (Data Access Object) is actually a relatively important part of the engineering practice in the `Goframe` framework.

The `DAO` design, combined with the performance and usability of `Goframe`'s `ORM` (Object-Relational Mapping) component, is powerful and it improves development and maintenance efficiency. After reading this section, you should be able to understand and appreciate the advantages of using `DAO` for database access object design.

Every year, I revisit this article to see if there are parts that can be removed. But every time, I am disappointed because this article is still applicable to the current situation. And this year, I have added new content.

## 1. ORM Example

### 1.1 Model Definition

```go
package model

type UserInfo struct {
    Id      unit32  `gorm:"column:id"`
    Avatar  string  `gorm:"column:avatar"`
    Type    int32   `gorm:"column:type"`
    Gender  int32   `gorm:"column:gender"`
    Phone   string  `gorm:"column:phone"`
    Email   string  `gorm:"column:email"`
}

```

### 1.2 GRPC Interface

A simple `GRPC` query example

```go
package service

import (
    "context"
    "github.com/....."
)

func (s *Service) GetDoctorInfo(ctx context.Context, r *api.GetDoctorInfoReq) (res *api.GetDoctorInfoRes, err error) {
    res = &api.GetDoctorInfoRes{
        UserInfo new(api.UserInfo),
        DoctorInfo new(api.DoctorInfo),
    }

    var (
        userInfoModel = &model.UserInfo{}
        doctorInfoModel = &model.DoctorInfo{}
    )

    err = s.dao.OrmDB.Table("doctorUser").Where("userId=?", r.Id).First(doctorInfoModel).Error
    if err != nil {
        return
    }
    err = s.dao.OrmDB.Table("userInfo").Where("id=?", r.Id).First(userInfoModel).Error
    if err != nil {
        return
    }

    err = copier.Copy(res.UserInfo, doctorInfoModel)
    if err != nil {
        return
    }
    err = copier.Copy(res.DoctorInfo, userInfoModel)
    if err != nil {
        return
    }

    err = s.dao.OrmDB.Table("user").Where("id=?", r.Id).First(userInfoModel).Error
    if err != nil {
        return
    }

    err = copier.Copy(res.DoctorInfo, userInfoModel)
    return
}
```

## 2. Existing Paint Points

### 1. Tags Definition

Have to define tags to associate table structures with struct properties, can not automatic mapping.

There is already a certain correlation between table fields and the property names of entity objects, so there is no need to define and maintain a large number of tag definitions.

### 2. Not Support specifying query fields via the retured object

It is not possible to specify the query fields through the structure of the returned object; one can only use `SELECT *`, or manually enter the query fields through an additional method, which is very inefficient.

```go
err = s.dao.OrmDB.Table("user").Where("id=?", r.Id).First(userInfoModel).Error
```

### 3. Unable to Automatically Filter Input Object Property Names

The input and output data structures have been defined, and the output data structure already includes the field names we need to query. Developers input the defined return object, expecting that only the required field names will be queried, and unnecessary properties will not be queried, automatically filtered out.

### 4. Need to Define Query Result Objects

The query results do not support intelligent struct conversion, requiring the definition of an additional model, and then copying through other tools, which is inefficient.

### 5. Need to Initialize Query Result Objects

Still need to initialize the return object in advance, regardless of whether data is queried or not.

This approach is not only inelegant but also affects performance and is not GC friendly. The expectation is to automatically create the return object when data is queried, and do nothing if no data is found.

```go
res = &api.GetDoctorInfoRes{
    UserInfo new(api.UserInfo),
    DoctorInfo new(api.DoctorInfo),
}
```

### 6. Raw DB Object Operations

Many `Golang` beginners seem to prefer using a global DB object, generating a Model object for a specific table through the `DB` object during queries, and then to the `CURD` operations. This lacks a layered design in the code, making data operations and `business logic highly coupled`.

```go
err = s.dao.OrmDB.Table("doctorUser").Where("userId=?", r.Id).First(doctorInfoModel).Error
```

Like above the, use raw DB object operations `OrmDB.Table("doctorUser")`.

### 7. Hard Code Table/Column Name

Just like the example, all the table and column names are defined by string hard code, typos may happen. Like `userId` may type as `UserId` or `userid`.

### 8. Too Many Pointer Definitions

Developer need to switch between pointer and value data all the time, especially for some basic types often require passing parameters by reassigning values. If the input parameter is of the `interface{}` type, it will cause more bugs.

### 9. Tracing / Metrics / Logging

`ORM` is the key component of a project, these support are esential.

### 10. Inconsistency Between Data Set And Struct not

When maintaining data entity structures manually,
 there is a risk of inconsistency between the data set and the struct, causing high maintenance costs.

## 3 Improvements

1. Query result objects do not require special tag definitions and are automatically associated and mapped.

2. Supports automatic identification of query fields based on specified objects, rather than using a full `SELECT *`.

3. Supports automatic filtering of non-existent field content based on specified objects.

4. Using `DAO` (Data Access Object) to operate on data tables through object-oriented methods.

5. `DAO` objects associate table names and field names, avoiding hard code of strings.

6. There is no need to define entity objects in advance to accept return results, nor is there a need to create entity objects for assignment conversion of interface return objects.

7. Query result objects are not initialized in advance; they are automatically created only when data is queried.

8. Built-in support for the `OpenTelemetry` standard, achieving observability, greatly improving maintenance efficiency.

9. Supports the ability to output `SQL` logs, with a toggle feature.

10. Decouples data models, data operations, and business logic, supports automatic generation of `DAO` and `Model` code tools, ensuring consistency between data collections and code data structures

```go
func (s *Service) GetDoctorInfo(ctx context.Context, req *api.GetDoctorInfoReq) (res *api.GetDoctorInfoRes, err error) {
    res = &api.GetDoctorInfoRes{}
    err = dao.DoctorInfo.Ctx(ctx).Field(res.DoctorInfo).Where(dao.DoctorInfo.Columns.Id, req.Id).Scan(&res.DoctorInfo)
    if err != nil {
        return
    }
    return
}
```

After the improvements:

`res = &api.GetDoctorInfoRes{}` no need to initialize the return object in advance

`dao.DoctorInfo` DAO object design

`Field(res.DoctorInfo)` automatically detect query columns

`Scan(&res.DoctorInfo)` automatically detect return columns

`Ctx(ctx)` support tracing.

`Where(dao.DoctorInfo.Columns.Id, req.Id)` Non-Hard-Coded Table / Column Name
