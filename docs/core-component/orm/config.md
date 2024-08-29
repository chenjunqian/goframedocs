# ORM - Configuration

## Configuration Files

We recommend using the configuration component to manage database settings and use the method `g.DB("Database Group Name")` from the `g` object management module to obtain the database operation object. The database object will automatically read the corresponding configuration items from the configuration component and initialize the singleton database object automatically. The database configuration management uses the configuration management component (interface-based design, by default, using the file system), and supports multiple data formats such as: `toml`, `yaml`, `json`, `xml`, `ini`, `properties`. The default and recommended data format for configuration files is `yaml`.

### Simple Configuration

Starting from version `v2.2.0`, the database component standardizes the configuration format for different database types using `link` to simplify configuration management.

The simplified configuration is specified by the configuration item `link`, in the format as follows:

```txt
type:username:password@protocol(address)[/dbname][?param1=value1&...&paramN=valueN]
```

Which means:

```txt
type:username:password@protocol(address)/database_name?special_configuration
```

Where:

- `database_name` and `special_configuration` are optional parameters, while other parameters are required.
- `protocol` can be: `tcp`, `udp`, `file`, and the common option is `tcp`.
- `special_configuration` is defined by the underlying third-party driver implementation for different database types. Refer to the third-party driver's website for specifics. For example, for MySQL, the third-party driver used is [go-sql-driver/mysql](https://github.com/go-sql-driver/mysql), which supports configurations like `multiStatements`, `loc`, etc.

***Example***:

```yaml
database:
  default:
    link:  "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
  user:
    link:  "sqlite::@file(/var/data/db.sqlite3)"
```

***Examples for Different Data Types***:

```txt
| Database Type   | Link Example                                                                      | Third-Party Driver |
| --------------- | --------------------------------------------------------------------------------- | ------------------ |
| MySQL           | `mysql:root:12345678@tcp(127.0.0.1:3306)/test?loc=Local&parseTime=true`           | `mysql`            |
| MariaDB         | `mariadb:root:12345678@tcp(127.0.0.1:3306)/test?loc=Local&parseTime=true`         | `mysql`            |
| TiDB            | `tidb:root:12345678@tcp(127.0.0.1:3306)/test?loc=Local&parseTime=true`            | `mysql`            |
| PostgreSQL      | `pgsql:root:12345678@tcp(127.0.0.1:5432)/test`                                    | `pq`               |
| MSSQL           | `mssql:root:12345678@tcp(127.0.0.1:1433)/test?encrypt=disable`                    | `go-mssqldb`       |
| SQLite          | `sqlite::@file(/var/data/db.sqlite3)` (can use relative path, e.g., `db.sqlite3`) | `go-sqlite3`       |
| Oracle          | `oracle:root:12345678@tcp(127.0.0.1:5432)/test`                                   | `go-oci8`          |
| ClickHouse      | `clickhouse:root:12345678@tcp(127.0.0.1:9000)/test`                               | `clickhouse-go`    |
| DM              | `dm:root:12345678@tcp(127.0.0.1:5236)/test`                                       | `dm`               |
```

For more supported database types, refer to: [https://github.com/gogf/gf/tree/master/contrib/drivers](https://github.com/gogf/gf/tree/master/contrib/drivers)

### Full Configuration

A complete database configuration in `config.yaml` format looks like this:

```yaml
database:
  group_name:
    host:                  "address"
    port:                  "port"
    user:                  "username"
    pass:                  "password"
    name:                  "database_name"
    type:                  "database_type (e.g., mariadb/tidb/mysql/pgsql/mssql/sqlite/oracle/clickhouse/dm)"
    link:                  "(optional) custom database link information; when this field is set, the above link fields (Host, Port, User, Pass, Name) will be invalid, but the type must have a value."
    extra:                 "(optional) extra configuration for different databases, defined by the underlying database driver."
    role:                  "(optional) database role (master/slave), set to master if not using application layer master-slave mechanism."
    debug:                 "(optional) enable debug mode."
    prefix:                "(optional) table name prefix."
    dryRun:                "(optional) ORM dry run (read-only, no writes)."
    charset:               "(optional) database encoding (e.g., utf8/gbk/gb2312), generally set to utf8."
    protocol:              "(optional) database connection protocol, default is TCP."
    weight:                "(optional) load balancing weight, leave blank if not using application layer load balancing mechanism."
    timezone:              "(optional) time zone configuration, e.g., Local."
    namespace:             "(optional) supports database service catalog & schema differentiation; the original schema represents the database name, and namespace represents the schema of individual database services."
    maxIdle:               "(optional) maximum number of idle connections in the connection pool (default is 10)."
    maxOpen:               "(optional) maximum number of open connections in the connection pool (default is unlimited)."
    maxLifetime:           "(optional) duration a connection object can be reused (default is 30 seconds)."
    queryTimeout:          "(optional) timeout duration for query statements (default is unlimited; note the ctx timeout setting)."
    execTimeout:           "(optional) timeout duration for write statements (default is unlimited; note the ctx timeout setting)."
    tranTimeout:           "(optional) timeout duration for transaction processing (default is unlimited; note the ctx timeout setting)."
    prepareTimeout:        "(optional) timeout duration for executing prepared SQL statements (default is unlimited; note the ctx timeout setting)."
    createdAt:             "(optional) field name for auto-created time."
    updatedAt:             "(optional) field name for auto-updated time."
    deletedAt:             "(optional) field name for soft delete time."
    timeMaintainDisabled:  "(optional) disable all time update features; if set to true, CreatedAt/UpdatedAt/DeletedAt will be disabled."
```

#### Full Database Configuration Example (YAML)

```yaml
database:
  default:
    host:          "127.0.0.1"
    port:          "3306"
    user:          "root"
    pass:          "12345678"
    name:          "test"
    type:          "mysql"
    extra:         "parseTime=true"
    role:          "master"
    debug:         "true"
    dryRun:        0
    weight:        "100"
    prefix:        "gf_"
    charset:       "utf8"
    timezone:      "Local"
    maxIdle:       "10"
    maxOpen:       "100"
    maxLifetime:   "30s"
  protocol
```

When using this configuration method, for database security reasons, executing multiple SQL statements is not supported by default. For more configuration control options, refer to the recommended simplified configuration, and it is recommended to understand the function and role of each connection parameter in the simplified configuration.

### Cluster Mode

`gdb` configuration supports cluster mode, where each group configuration in the database configuration can consist of multiple nodes and supports load balancing weight strategy, such as:

```yaml
database:
  default:
  - link: "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
    role: "master"
  - link: "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
    role: "slave"

  user:
  - link: "mysql:root:12345678@tcp(127.0.0.1:3306)/user"
    role: "master"
  - link: "mysql:root:12345678@tcp(127.0.0.1:3306)/user"
    role: "slave"
  - link: "mysql:root:12345678@tcp(127.0.0.1:3306)/user"
    role: "slave"
```

In the above database configuration example, there are two database groups `default` and `user`, where the `default` group contains one master and one slave, and the `user` group contains one master and two slaves. In the code, you can use `g.DB()` and `g.DB("user")` to obtain the corresponding database connection objects.

### Log Configuration

`gdb` supports log output, internally using the `glog.Logger` object for log management, and can be configured through the configuration file. By default, `gdb` disables DEBUG log output. To enable DEBUG information, set the database's `debug` parameter to `true`. Here is a configuration file example:

```yaml
database:
  logger:
    path:    "/var/log/gf-app/sql"
    level:   "all"
    stdout:  true
  default:
    link:    "mysql:root:12345678@tcp(127.0.0.1:3306)/user_center"
    debug:   true
```

The `database.logger` is the log configuration for `gdb`. If this configuration does not exist, the default configuration of the logging component will be used.

 `gdb`'s log configuration parameters are:

- `path`: Specifies the log output directory. If empty, logs will not be output to a file.
- `level`: Specifies the log level (optional), e.g., `all`, `error`, `critical`, etc.
- `stdout`: Whether to output logs to the console (optional), defaults to `true`.

Here's the translated and formatted Markdown version of the Goframe documentation:

---

## Native Configuration

***Advanced, Optional***

The following introduces the underlying configuration management of the database. If you are interested in the management of database configurations, please continue reading the subsequent sections.

### Data Structure

The internal configuration management data structure of the gdb database management module is as follows:

- **ConfigNode**: Stores information for a single database node.
- **ConfigGroup**: Manages a group of database nodes (generally one group corresponds to a business database cluster).
- **Config**: Manages multiple ConfigGroup configurations.

### Configuration Management Features

- Supports multi-node database cluster management.
- Each node can be individually configured with connection properties.
- Uses the singleton pattern to manage database instantiation objects.
- Supports management of database cluster groups, and retrieves instantiated database operation objects by group name.
- Supports management of various relational databases, configurable via the `ConfigNode.Type` property.
- Supports Master-Slave read-write separation, configurable via the `ConfigNode.Role` property.
- Supports client-side load balancing, configurable via the `ConfigNode.Weight` property; higher values indicate higher priority.
  
```go
type Config map[string]ConfigGroup // Database configuration object
type ConfigGroup []ConfigNode       // Database group configuration

// Database configuration item (one group configuration corresponds to multiple configuration items)
type ConfigNode struct {
    Host             string        // Address
    Port             string        // Port
    User             string        // Account
    Pass             string        // Password
    Name             string        // Database name
    Type             string        // Database type: mysql, sqlite, mssql, pgsql, oracle
    Link             string        // (Optional) Custom connection information. If set, the above fields (Host, Port, User, Pass, Name) will be ignored (this is an extension feature)
    Extra            string        // (Optional) Additional feature configuration for different databases, defined by the underlying database driver
    Role             string        // (Optional, default is master) Database role, used for master-slave separation. At least one master is required. Parameter values: master, slave
    Debug            bool          // (Optional) Enable debug mode
    Charset          string        // (Optional, default is utf8) Encoding, default is utf8
    Prefix           string        // (Optional) Table name prefix
    Weight           int           // (Optional) Weight calculation for load balancing. Weight is meaningless when there is only one node in the cluster
    MaxIdleConnCount int           // (Optional) Maximum number of idle connections in the connection pool
    MaxOpenConnCount int           // (Optional) Maximum number of open connections in the connection pool
    MaxConnLifetime  time.Duration // (Optional, in seconds) The duration for which a connection object can be reused
}
```

**Note**: A key feature of gdb's configuration management is that all database cluster information (within the same process) is uniformly maintained using the same configuration management module. Database cluster configurations for different business applications use different group names for configuration and retrieval.

### Configuration Methods

This section describes how to configure and manage databases using the native gdb module. If developers wish to control database configuration management themselves, refer to the methods below. If not needed, you may skip this section.

**API Documentation**: [https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb](https://pkg.go.dev/github.com/gogf/gf/v2/database/gdb)

***Adding a Database Node to a Specific Group***

```go
// Add a database node to the specified group
func AddConfigNode(group string, node ConfigNode)
```

### Adding a Configuration Group

```go
// Add a configuration group to database configuration management (overwrite if the same name exists)
func AddConfigGroup(group string, nodes ConfigGroup)
```

### Adding a Database Node to the Default Group

```go
// Add a database node to the default group (default is "default", can be modified)
func AddDefaultConfigNode(node ConfigNode)
```

### Adding a Configuration Group to the Default Group

```go
// Add a configuration group to the default database configuration management (default group is "default", can be modified)
func AddDefaultConfigGroup(nodes ConfigGroup)
```

### Setting the Default Group Name

```go
// Set the default group name, which will be automatically read when retrieving the default database object
func SetDefaultGroup(groupName string)
```

### Setting Database Configuration

```go
// Set the database configuration to the defined information, which will overwrite the existing configuration
func SetConfig(c Config)
```

The default group means that if you do not specify a configuration group name when obtaining a database object, gdb will read the default group configuration. For example, `gdb.NewByGroup()` can be used to obtain a database object from the default group. To set global database configuration via `gdb` package:

```go
gdb.SetConfig(gdb.Config {
    "default" : gdb.ConfigGroup {
        gdb.ConfigNode {
            Host     : "192.168.1.100",
            Port     : "3306",
            User     : "root",
            Pass     : "123456",
            Name     : "test",
            Type     : "mysql",
            Role     : "master",
            Weight   : 100,
        },
        gdb.ConfigNode {
            Host     : "192.168.1.101",
            Port     : "3306",
            User     : "root",
            Pass     : "123456",
            Name     : "test",
            Type     : "mysql",
            Role     : "slave",
            Weight   : 100,
        },
    },
    "user-center" : gdb.ConfigGroup {
        gdb.ConfigNode {
            Host     : "192.168.1.110",
            Port     : "3306",
            User     : "root",
            Pass     : "123456",
            Name     : "test",
            Type     : "mysql",
            Role     : "master",
            Weight   : 100,
        },
    },
})
```

Subsequently, you can use `gdb.NewByGroup("GroupName")` to obtain a database operation object. This object is used for subsequent database methods and chain operations.

## Common Issues

***How to Encrypt Database Account Passwords in Configuration Files***

In some scenarios, database account passwords cannot be stored in plaintext within configuration files and need to be encrypted. When connecting to the database, these encrypted fields should be decrypted. This requirement can be addressed by implementing a custom driver (for more information on drivers, see the section: ORM Interface Development). For example, to encrypt passwords for MySQL, you can create a custom driver that wraps the MySQL driver in the framework community and overrides its `Open` method. Here is a code example:

```go
import (
    "database/sql"

    "github.com/gogf/gf/contrib/drivers/mysql/v2"
    "github.com/gogf/gf/v2/database/gdb"
)

type MyBizDriver struct {
    mysql.Driver
}

// Open creates and returns an underlying sql.DB object for mysql.
// Note that it converts time.Time argument to local timezone by default.
func (d *MyBizDriver) Open(config *gdb.ConfigNode) (db *sql.DB, err error) {
    config.User = d.decode(config.User)
    config.Pass = d.decode(config.Pass)
    return d.Driver.Open(config)
}

func (d *MyBizDriver) decode(s string) string {
    // Implement field decryption logic
    // ...
    return s
}
```
