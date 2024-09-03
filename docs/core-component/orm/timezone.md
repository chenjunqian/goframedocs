# ORM - Timezone

## Introduction

Due to the frequent inquiries regarding this issue, we have created a separate section to explain how timezone handling in ORM works. Here, we use the `MySQL` database as an example to explain timezone conversion. Let's assume the local timezone is set to `+8`, and the database timezone is also set to `+8`.

The most commonly used `MySQL` database driver is this third-party package: [https://github.com/go-sql-driver/mysql](https://github.com/go-sql-driver/mysql). In this third-party package, there is a parameter:

This parameter is used to convert the timezone of the time argument when the submitted time parameter is `time.Time`. If the `loc=Local` parameter is passed when connecting to the database, the driver will automatically convert the submitted `time.Time` parameter to the timezone set in the local program. If not set manually, the timezone defaults to UTC. Let's look at two examples.

## Conversion Example

**Example 1: Setting `loc=Local`**

- **Configuration File:**

```yaml
database:
  link: "mysql:root:12345678@tcp(127.0.0.1:3306)/test?loc=Local"
```

- **Code Example:**

```go
t1, _ := time.Parse("2006-01-02 15:04:05", "2020-10-27 10:00:00")
t2, _ := time.Parse("2006-01-02 15:04:05", "2020-10-27 11:00:00")
db.Model("user").Ctx(ctx).Where("create_time>? and create_time<?", t1, t2).One()
// SELECT * FROM `user` WHERE create_time>'2020-10-27 18:00:00' AND create_time<'2020-10-27 19:00:00'
```

Since the `time.Time` object created by `time.Parse` is in UTC, it will be modified to the +8 timezone by the underlying driver when submitted to the database.

```go
t1, _ := time.ParseInLocation("2006-01-02 15:04:05", "2020-10-27 10:00:00", time.Local)
t2, _ := time.ParseInLocation("2006-01-02 15:04:05", "2020-10-27 11:00:00", time.Local)
db.Model("user").Ctx(ctx).Where("create_time>? and create_time<?", t1, t2).One()
// SELECT * FROM `user` WHERE create_time>'2020-10-27 10:00:00' AND create_time<'2020-10-27 11:00:00'
```

Since the `time.Time` object created by `time.ParseInLocation` is in the +8 timezone, which matches `loc=Local`, it will not be modified by the underlying driver when submitted to the database.

**Note:** When writing data containing the `time.Time` parameter, be aware of timezone conversion issues.

**Example 2: Not Setting the `loc` Parameter**

- **Configuration File:**

```yaml
database:
  link: "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
```

- **Code Example:**

```go
t1, _ := time.Parse("2006-01-02 15:04:05", "2020-10-27 10:00:00")
t2, _ := time.Parse("2006-01-02 15:04:05", "2020-10-27 11:00:00")
db.Model("user").Ctx(ctx).Where("create_time>? and create_time<?", t1, t2).One()
// SELECT * FROM `user` WHERE create_time>'2020-10-27 10:00:00' AND create_time<'2020-10-27 11:00:00'
```

Since the `time.Time` object created by `time.Parse` is in UTC, it will not be modified by the underlying driver when submitted to the database.

```go
t1, _ := time.ParseInLocation("2006-01-02 15:04:05", "2020-10-27 10:00:00", time.Local)
t2, _ := time.ParseInLocation("2006-01-02 15:04:05", "2020-10-27 11:00:00", time.Local)
db.Model("user").Ctx(ctx).Where("create_time>? and create_time<?", t1, t2).One()
// SELECT * FROM `user` WHERE create_time>'2020-10-27 02:00:00' AND create_time<'2020-10-27 03:00:00'
```

Since the `time.Time` object created by `time.ParseInLocation` is in the +8 timezone, it will be modified to the UTC timezone by the underlying driver when submitted to the database.

**Note:** When writing data containing the `time.Time` parameter, be aware of timezone conversion issues.

## Improvement

It is recommended to consistently add the `loc` configuration, such as (for MySQL): `loc=Local&parseTime=true`. Below is a configuration for reference:

```yaml
database:
  logger:
    level:  "all"
    stdout: true
  default:
    link:  "mysql:root:12345678@tcp(192.168.1.10:3306)/mydb?loc=Local&parseTime=true"
    debug: true
  order:
    link:  "mysql:root:12345678@tcp(192.168.1.20:3306)/order?loc=Local&parseTime=true"
    debug: true
```
