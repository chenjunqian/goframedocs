# ORM Best Practices

## Overview

Database operations are often the most complex part of any business project. The `GoFrame` database component provides a powerful and flexible way to handle these operations. Here, we provide some best practice examples to help you understand and use these features effectively.

## Flexible API Implementation Using Pointer Properties and do Object

GoFrame's built-in development tools can generate `do` (data object) code, which is primarily used to automatically filter out `nil` fields during query, update, and insert operations.

Today, we'll explore a new approach using pointers in combination with `do` objects to create flexible and convenient APIs for update operations.

***Data Structure***

Here's the structure of the user table we'll be working with:

```sql
CREATE TABLE `user` (
    `id`        INT(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'User ID',
    `passport`  VARCHAR(32) NOT NULL COMMENT 'Account',
    `password`  VARCHAR(32) NOT NULL COMMENT 'Password',
    `nickname`  VARCHAR(32) NOT NULL COMMENT 'Nickname',
    `status`    VARCHAR(32) NOT NULL COMMENT 'Status',
    `brief`     VARCHAR(512) NOT NULL COMMENT 'Remarks',
    `create_at` DATETIME DEFAULT NULL COMMENT 'Creation Time',
    `update_at` DATETIME DEFAULT NULL COMMENT 'Modification Time',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uniq_passport` (`passport`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

For user status, we use a custom type to implement enumerated values:

```go
type Status string

const (
    StatusEnabled  = "enabled"
    StatusDisabled = "disabled"
)
```

Using the `gf gen dao` command, the following `do` object is automatically generated:

```go
type User struct {
    g.Meta    `table:"user" orm:"do:true"`
    Id        interface{}
    Passport  interface{}
    Password  interface{}
    Nickname  interface{}
    Status    interface{}
    Brief     interface{}
    CreatedAt interface{}
    UpdatedAt interface{}
}
```

***API Definition***

Now, let's implement an API for updating user information. This is an administration API that allows modification of user information based on the user's account name. The API is defined as follows:

```go
type UpdateReq struct {
    g.Meta   `path:"/user/{Id}" method:"post" summary:"Update User Information"`
    Passport string  `v:"required" dc:"User Account"`
    Password *string `dc:"New Password"`
    Nickname *string `dc:"New Nickname"`
    Status   *Status `dc:"New Status"`
    Brief    *string `dc:"New Description"`
}
```

The modifiable user information includes the password, nickname, status, and description, and any or all of these can be updated simultaneously. Here, we use pointer types for the fields to implement this behavior: if a parameter is provided, it will be updated; if not, no change will be made.

***Business Logic Implementation***

To simplify the example, we directly pass the pointer parameters to the `do` object in the controller. If a parameter is not provided by the client, it will be `nil`. When this `nil` value is passed to the `do` object, it will automatically be filtered out during the database update operation.

```go
func (c *Controller) Update(ctx context.Context, req *v1.UpdateReq) (res *v1.UpdateRes, err error) {
    _, err = dao.User.Ctx(ctx).Data(do.User{
        Password: req.Password,
        Nickname: req.Nickname,
        Status:   req.Status,
        Brief:    req.Brief,
    }).Where(do.User{
        Passport: req.Passport,
    }).Update()
    return
}
```

In this example, we use the `Ctx` method to provide the context, and the pointer parameters are directly mapped to the `do.User` object. The `nil` fields are automatically filtered out during the update, making the API flexible and convenient to use.

## Using JSON for Complex Types Automatic Conversion

When working with complex data types, storing them in JSON format can simplify data handling and minimize the need for custom parsing. By using Go's `Scan` functionality, we can automatically convert JSON data into the corresponding Go structures, making our code more efficient and easier to maintain.

***Example Product Selling Specifications***

Suppose we want to implement a product selling specification that includes selectable shard counts, shard capacities, and replica counts. Here’s an example table structure designed for this purpose:

```sql
CREATE TABLE `sell_spec` (
    `id`            INT(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
    `product`       VARCHAR(45) NOT NULL COMMENT 'Product Name',
    `resources`     JSON NOT NULL COMMENT 'Resource specifications (cpu:memory), e.g., ["0:0.25", "0:1", "1:2"]',
    `disk_min`      INT(10) DEFAULT NULL COMMENT 'Minimum Disk Capacity',
    `disk_max`      INT(10) DEFAULT NULL COMMENT 'Maximum Disk Capacity',
    `disk_step`     INT(10) DEFAULT NULL COMMENT 'Disk Increment Size',
    `shards`        JSON NOT NULL COMMENT 'Shard specifications, e.g., [1,3,5,8,12,16,24,32,40,48,64,80,96,128]',
    `replicas`      JSON NOT NULL COMMENT 'Replica specifications, e.g., [1,2,3,4,5,6,7,8,9,12]',
    `created_at`    DATETIME DEFAULT NULL COMMENT 'Creation Time',
    `updated_at`    DATETIME DEFAULT NULL COMMENT 'Update Time',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Selling Specifications Configuration';
```

In this table, the `resources`, `shards`, and `replicas` fields are defined as JSON format to allow custom, non-sequential storage of resources, shards, and replica specifications.

***Go Struct Definition***

The `Go structure` corresponding to this table might look like this:

```go
// SellSpec is a data structure generated by GoFrame tools and maintained by the tool.
type SellSpec struct {
    Id        uint        `description:"Primary Key"`
    Product   string      `description:"Product Name"`
    Resources string      `description:"Resource specifications (cpu:memory), e.g., [\"0:0.25\", \"0:1\", \"1:2\"]"`
    DiskMin   int         `description:"Minimum Disk Capacity"`
    DiskMax   int         `description:"Maximum Disk Capacity"`
    DiskStep  int         `description:"Disk Increment Size"`
    Shards    string      `description:"Shard specifications, e.g., [1,3,5,8,12,16,24,32,40,48,64,80,96,128]"`
    Replicas  string      `description:"Replica specifications, e.g., [1,2,3,4,5,6,7,8,9,12]"`
    CreatedAt *gtime.Time `description:"Creation Time"`
    UpdatedAt *gtime.Time `description:"Update Time"`
}

// SellSpecItem is a custom extension of the entity data structure,
// where some fields like Resources/Shards/Replicas are overridden as array types to facilitate 
// automatic type conversion during ORM operations.
type SellSpecItem struct {
    entity.SellSpec
    Resources []string `dc:"Resource Specifications"`
    Shards    []int    `dc:"Shard Specifications"`
    Replicas  []int    `dc:"Replica Specifications"`
}
```

To insert and query records in the program, we can proceed as follows:

**Data Insertion:**

```go
_, err = dao.SellSpec.Ctx(ctx).Data(v1.SellSpecItem{
    SellSpec: entity.SellSpec{
        Product:  "redis",
        DiskMin:  50,
        DiskMax:  1000,
        DiskStep: 10,
    },
    Resources: []string{"1:2", "2:4", "4:8"},
    Shards:    []int{1, 3, 5, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128},
    Replicas:  []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 12},
}).Insert()
```

**Data Query:**

The `ORM` component will automatically convert the records from the database into the corresponding `Go struct` with array-type properties:

```go
var items []v1.SellSpecItem
err = dao.SellSpec.Ctx(ctx).Scan(&items)
```

## Avoiding Object Initialization and SQL ErrNoRows Handling in Queries

When executing `SQL` queries, avoid initializing the result object beforehand to prevent the influence of default values in the struct object and to avoid unnecessary object memory creation. Instead, use a nil pointer to determine if the result object is empty, which reduces the complexity of error handling by eliminating the need for `sql.ErrNoRows` checks and standardizes how empty query results are handled throughout the project.

***Anti-Pattern Example***

Here is an example of a less efficient approach:

```go
func (s *sTask) GetOne(ctx context.Context, id uint64) (out *entity.ResourceTask, err error) {
    // Object initialization here leads to default values being set regardless of the query result.
    out = new(model.TaskDetail)
    err = dao.ResourceTask.Ctx(ctx).WherePri(id).Scan(out)
    if err != nil {
        if err == sql.ErrNoRows {
            err = gerror.Newf(`record not found for "%d"`, id)
        }
        return
    }
    return
}
```

In this example:

- The `out` object is initialized before the query, which leads to it having default values (even if no data is retrieved from the query).
- The use of `sql.ErrNoRows` increases the complexity of error handling logic in the code.

***Suggested Improvement***

A more efficient way to handle this is as follows:

```go
func (s *sTask) GetOne(ctx context.Context, id uint64) (out *entity.ResourceTask, err error) {
    // Scan directly into the pointer to avoid unnecessary object initialization.
    err = dao.ResourceTask.Ctx(ctx).WherePri(id).Scan(&out)
    if err != nil {
        return
    }
    // Check if out is nil to determine if no records were found.
    if out == nil {
        err = gerror.Newf(`record not found for "%d"`, id)
    }
    return
}
```

Key improvements:

- The use of `&out` avoids the need for initializing the object beforehand, reducing memory allocation and avoiding default value issues.
- By checking if `out` is `nil`, you can simplify the code and unify the handling of empty query results without explicitly using `sql.ErrNoRows`.

This approach makes your code more concise, avoids unnecessary memory allocations, and reduces complexity by standardizing how you handle empty results across your project. For more details, refer to the section on [ORM - Empty Result](/docs/core-component/orm/result/empty-result).
