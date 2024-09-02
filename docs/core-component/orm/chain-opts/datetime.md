# ORM Chain Operation - Datetime

> **Note**: This feature is only effective for chain operation.

The `gdb` module supports automatic filling of timestamps for record insertion, updating, and deletion to improve development and maintenance efficiency. To maintain consistency in field names and types, it is recommended that:

1. Fields should allow `NULL` values.
2. Fields must be of a date/time type, such as `date`, `datetime`, or `timestamp`. Numeric fields, such as `int`, are not supported.
3. The default field names are:
   - `created_at` for recording the creation time; it is written only once.
   - `updated_at` for recording the update time; it is updated each time the record changes.
   - `deleted_at` for soft deletion; it is written only once when the record is deleted.

Field names are case-insensitive and can ignore special characters. For example, `CreatedAt`, `UpdatedAt`, and `DeletedAt` are also supported. Additionally, field names can be customized via configuration files, and the feature can be completely disabled using the `TimeMaintainDisabled` configuration. For more details, refer to the [ORM Configuration](/docs/core-component/orm/config) section.

## Enabling the Feature

The feature is automatically enabled when a table contains one or more of the following fields: `created_at`, `updated_at`, or `deleted_at`.

In the examples below, we assume that the data tables include all three fields.

## created_at Field

The `created_at` field is automatically filled during the execution of the `Insert`, `InsertIgnore`, `BatchInsert`, and `BatchInsertIgnore` methods and remains unchanged thereafter.

```go
// INSERT INTO `user`(`name`,`created_at`,`updated_at`) VALUES('john', '2020-06-06 21:00:00', '2020-06-06 21:00:00')
g.Model("user").Data(g.Map{"name": "john"}).Insert()

// INSERT IGNORE INTO `user`(`uid`,`name`,`created_at`,`updated_at`) VALUES(10000,'john', '2020-06-06 21:00:00', '2020-06-06 21:00:00')
g.Model("user").Data(g.Map{"uid": 10000, "name": "john"}).InsertIgnore()

// REPLACE INTO `user`(`uid`,`name`,`created_at`,`updated_at`) VALUES(10000,'john', '2020-06-06 21:00:00', '2020-06-06 21:00:00')
g.Model("user").Data(g.Map{"uid": 10000, "name": "john"}).Replace()

// INSERT INTO `user`(`uid`,`name`,`created_at`,`updated_at`) VALUES(10001,'john', '2020-06-06 21:00:00', '2020-06-06 21:00:00') ON DUPLICATE KEY UPDATE `uid`=VALUES(`uid`),`name`=VALUES(`name`),`updated_at`=VALUES(`updated_at`)
g.Model("user").Data(g.Map{"uid": 10001, "name": "john"}).Save()
```

> **Note**: The `Replace` method also updates this field because it essentially deletes any existing old data and inserts new data.

## updated_at Field

The `updated_at` field is automatically filled during the execution of `Insert`, `InsertIgnore`, `BatchInsert`, and `BatchInsertIgnore` methods, and updated during `Save` or `Update` operations. (Note: The `created_at` time will not be updated if the data already exists.)

```go
// UPDATE `user` SET `name`='john guo',`updated_at`='2020-06-06 21:00:00' WHERE name='john'
g.Model("user").Data(g.Map{"name" : "john guo"}).Where("name", "john").Update()

// UPDATE `user` SET `status`=1,`updated_at`='2020-06-06 21:00:00' ORDER BY `login_time` asc LIMIT 10
g.Model("user").Data("status", 1).Order("login_time asc").Limit(10).Update()

// INSERT INTO `user`(`id`,`name`,`update_at`) VALUES(1,'john guo','2020-12-29 20:16:14') ON DUPLICATE KEY UPDATE `id`=VALUES(`id`),`name`=VALUES(`name`),`update_at`=VALUES(`update_at`)
g.Model("user").Data(g.Map{"id": 1, "name": "john guo"}).Save()
```

> **Note**: The `Replace` method also updates this field because it deletes existing old data and inserts new data.

## deleted_at Field for Soft Deletion

Soft deletion can be more complex. When a soft deletion field is present, all queries automatically include the condition for `deleted_at`.

```go
// UPDATE `user` SET `deleted_at`='2020-06-06 21:00:00' WHERE uid=10
g.Model("user").Where("uid", 10).Delete()
```

During a query, the condition changes, for example:

```go
// SELECT * FROM `user` WHERE uid>1 AND `deleted_at` IS NULL
g.Model("user").Where("uid>?", 1).All()
```

When the `deleted_at` field is present in the table, all queries involving that table will automatically add the `deleted_at IS NULL` condition.

### Join Queries

If multiple tables involved in a join query have the soft delete feature enabled, the condition statement will include the soft deletion time check for all relevant tables.

```go
// SELECT * FROM `user` AS `u` LEFT JOIN `user_detail` AS `ud` ON (ud.uid=u.uid) WHERE u.uid=10 AND `u`.`deleted_at` IS NULL AND `ud`.`deleted_at` IS NULL LIMIT 1
g.Model("user", "u").LeftJoin("user_detail", "ud", "ud.uid=u.uid").Where("u.uid", 10).One()
```

### Ignore Datetime Features

`Unscoped` can be used in chain operations to ignore automatic time update features. For example, in the cases above, using the `Unscoped` method:

```go
// SELECT * FROM `user` WHERE uid>1
g.Model("user").Unscoped().Where("uid>?", 1).All()

// SELECT * FROM `user` AS `u` LEFT JOIN `user_detail` AS `ud` ON (ud.uid=u.uid) WHERE u.uid=10 LIMIT 1
g.Model("user", "u").LeftJoin("user_detail", "ud", "ud.uid=u.uid").Where("u.uid", 10).Unscoped().One()
```
