# Configuration

## Development Configuration

The development configuration is the tool set of `Goframe` configuration, used for project development. It is independent from the business logic, store in the root directory of the project `hack` folder, named as `config.yaml`. The `config.yaml` is auto generated in the template project, the development configuration file can be committed to the version control repository.

```yaml
# CLI tool, only in development environment.
gfcli:
  docker:
    build: "-a amd64 -s linux -p temp -ew"
    tagPrefixes:
      - my.image.pub/my-app
```

Related Code [hack/config.yaml](https://github.com/gogf/template-single/blob/main/hack/config.yaml)

## Application Configuration

Application configuration refers to the settings required for the operation of a business project, used for the deployment and running of the project.

Different environments often require different business configurations. The application configuration files are stored in the `manifest/config` directory. In collaborative development with multiple people, business configuration files are recommended to not committed to the version control repository to prevent local configuration files from being overwritten.

```yaml
server:
  # Basic Configuration
  address:             ":8000"                      # Local listening address. Default is ":80", separate multiple addresses with a comma. For example: "192.168.2.3:8000,10.0.3.10:8001"
  # httpsAddr:           ":443"                           # TLS/HTTPS configuration, requires certificate and key configuration. Default is closed. Configuration format is the same as above.
  # httpsCertPath:       ""                           # Local path for TLS/HTTPS certificate file, absolute path is recommended. Default is closed.
  # httpsKeyPath:        ""                           # Local path for TLS/HTTPS key file, absolute path is recommended. Default is closed.
  # readTimeout:         "60s"                        # Request read timeout duration, generally no need to configure. Default is 60 seconds.
  # writeTimeout:        "0"                          # Data return write timeout duration, generally no need to configure. Default is no timeout (0).
  # idleTimeout:         "60s"                        # Only valid when Keep-Alive is enabled, request idle duration. Default is 60 seconds.
  # maxHeaderBytes:      "10240"                      # Request Header size limit (Byte). Default is 10KB.
  # keepAlive:           true                         # Whether to enable the Keep-Alive feature. Default is true.
  # serverAgent:         "GoFrame HTTP Server"        # Server-side Agent information. Default is "GoFrame HTTP Server".

  # API Documentation
  openapiPath: "/api.json" # OpenAPI interface documentation address
  swaggerPath: "/swagger"  # Built-in SwaggerUI display address

  # Static Service Configuration
  # indexFiles:          ["index.html","index.htm"]   # Automatic home page static file search. Default is ["index.html", "index.htm"]
  # indexFolder:         false                        # Whether to display the file list in the directory when accessing static file directories. Default is closed, then the request will return 403
  # serverRoot:          ""                           # The root path of the directory for static file service, automatically opens static file service when configured. Default is closed
  # searchPaths:         []                           # Additional file search paths when providing static file service, when the root path cannot be found, search in the search directory in order. Default is closed
  # fileServerEnabled:   false                        # Overall switch for static file service. Default is false

  # Cookie Configuration
  # cookieMaxAge:        "365d"             # Cookie validity period. Default is 365 days
  # cookiePath:          "/"                # Cookie valid path. Default is "/" which means it is valid for all paths on the site
  # cookieDomain:        ""                 # Cookie valid domain. Default is the domain where the Cookie is configured

  # Sessions Configuration
  # sessionMaxAge:       "24h"              # Session validity period. Default is 24 hours
  # sessionIdName:       "gfsessionid"      # The key name of the SessionId. Default is gfsessionid
  # sessionCookieOutput: true               # When the Session feature is enabled, whether to return the SessionId to the Cookie. Default is true
  # sessionPath:         "/tmp/gsessions"   # The file directory path where the Session is stored. Default is the gsessions directory in the current system's temporary directory

  # Basic Log Configuration
  # This configuration is similar to nginx, mainly for recording request logs
  # logPath:             ""                 # Log file storage directory path, absolute path is recommended. Default is empty, indicating closed
  # logStdout:           true               # Whether to output logs to the terminal. Default is true
  # errorStack:          true               # When the Server catches an exception, whether to record the stack information to the log. Default is true
  # errorLogEnabled:     true               # Whether to record exception log information to the log. Default is true
  # errorLogPattern:     "error-{Ymd}.log"  # Exception error log file format. Default is "error-{Ymd}.log"
  # accessLogEnabled:    false              # Whether to record access logs. Default is false
  # accessLogPattern:    "access-{Ymd}.log" # Access log file format. Default is "access-{Ymd}.log"

  # Extended Log Configuration (Parameter Log Component Configuration)
  # This configuration mainly affects the server (ghttp module) logs, such as the web service listening port number, web service routes, and does not affect g.Log
  logger:
    # path:                  ""            # Log file path. Default is empty, indicating closed, only output to the terminal
    # file:                  "{Y-m-d}.log" # Log file format. Default is "{Y-m-d}.log"
    # prefix:                ""            # Prefix for log output. Default is empty
    # level:                 "all"         # Log output level
    # stdout:                true          # Whether to output logs to the terminal at the same time. Default is true
    # rotateSize:            0             # Log file rolling split according to log file size. Default is 0, indicating the rolling split feature is closed
    # rotateExpire:          0             # Log file rolling split according to log file time interval. Default is 0, indicating the rolling split feature is closed
    # rotateBackupLimit:     0             # Clean up the number of rolled files according to the number of rolled files, valid when the rolling split feature is enabled. Default is 0, indicating no backup, delete after rolling
    # rotateBackupExpire:    0             # Clean up the rolled files according to the validity period of the rolled files, valid when the rolling split feature is enabled. Default is 0, indicating no backup, delete after rolling
    # rotateBackupCompress:  0             # Compression ratio of rolled files (0-9). Default is 0, indicating no compression
    # rotateCheckInterval:   "1h"          # Time detection interval for rolling split, generally no need to set. Default is 1 hour

    # PProf Configuration
    # pprofEnabled:        false              # Whether to enable PProf performance debugging features. Default is false
    # pprofPattern:        ""                 # Valid when PProf is enabled, indicating the page access path for PProf features, effective for all domains bound to the current Server.

    # Other Configurations
    # clientMaxBodySize:   810241024          # Maximum client body upload limit size, affecting the size of file uploads (Byte). Default is 8*1024*1024=8MB
    # formParsingMemory:   1048576            # Buffer size when parsing forms (Byte), generally no need to configure. Default is 1024*1024=1MB
    # nameToUriType:       0                  # Routing generation rule when using object registration in route registration. Default is 0
    # routeOverWrite:      false              # Whether to overwrite when encountering duplicate route registration. Default is false, an error will exit at startup if duplicate routes exist
    # dumpRouterMap:       true               # Whether to print all route lists when the Server starts. Default is true
    # graceful:            false              # Whether to enable graceful restart feature, an additional local TCP port of 10000 will be added for inter-process communication when enabled. Default is false
    # gracefulTimeout:     2                  # How many seconds the parent process exits after a graceful restart, default is 2 seconds. If the request time is greater than this value, it may cause the request to be interrupted


   # Database Configuration
   # database:
     # default:
     # - link: "mysql:root:12345678@tcp(127.0.0.1:3306)/test"
     # database:
     # [Group Name]:
     # host: "Address"
     # port: "Port"
     # user: "Account"
     # pass: "Password"
     # name: "Database Name"
     # type: "Database Type (e.g., mariadb/tidb/mysql/pgsql/mssql/sqlite/oracle/clickhouse/dm)"
     # link: "(Optional) Custom database link information, when this field is set, the above link fields (Host,Port,User,Pass,Name) will be invalid, but type must have a value"
     # extra: "(Optional) Additional feature configuration for different databases, defined by the underlying database driver"
     # role: "(Optional) Database master-slave role (master/slave), set to master if not using the application layer's master-slave mechanism"
     # debug: "(Optional) Enable debug mode"
     # prefix: "(Optional) Table name prefix"
     # dryRun: "(Optional) ORM dry run (read-only, no write)"
     # charset: "(Optional) Database encoding (e.g., utf8/gbk/gb2312), generally set to utf8"
     # protocol: "(Optional) Database connection protocol, default is TCP"
     # weight: "(Optional) Load balancing weight, for load balancing control, leave blank if not using the application layer's load balancing mechanism"
     # timezone: "(Optional) Timezone configuration, e.g., Local"
     # namespace: "(Optional) To support the Catalog&Schema distinction issue of some database services, the original Schema represents the database name, and NameSpace represents the Schema of individual database services"
     # maxIdle: "(Optional) Maximum number of idle connections in the connection pool (default 10)"
     # maxOpen: "(Optional) Maximum number of open connections in the connection pool (default unlimited)"
     # maxLifetime: "(Optional) The time length that the connection object can be reused (default 30 seconds)"
     # queryTimeout: "(Optional) Query statement timeout duration (default unlimited, pay attention to the timeout setting of ctx)"
     # execTimeout: "(Optional) Write statement timeout duration (default unlimited, pay attention to the timeout setting of ctx)"
     # tranTimeout: "(Optional) Transaction processing timeout duration (default unlimited, pay attention to the timeout setting of ctx)"
     # prepareTimeout: "(Optional) Prepared SQL statement execution timeout duration (default unlimited, pay attention to the timeout setting of ctx)"
     # createdAt: "(Optional) Automatically create time field name"
     # updatedAt: "(Optional) Automatically update time field name"
     # deletedAt: "(Optional) Soft delete time field name"
     # timeMaintainDisabled: "(Optional) Whether to completely disable the time update feature, when true, CreatedAt/UpdatedAt/DeletedAt will all be invalid"
```

## Configuration Object

The `application configuration` can accessed through the framework's independent configuration component `g.Cfg()`. The singleton object `g.Cfg()` will automatically read the configuration files in the `manifest/config` directory

Although the framework's components are designed to be modular and loosely coupled, for the convenience of business projects, the framework also provides access to some commonly used singleton objects, such as: `g.Cfg()`, `g.DB()`, `g.Log()`, and so on.

For a more detailed introduction, please refer to: [Configuration Management](https://temperory.net)

The detail of the `g.Cfg()` pkg document [gcfg](https://pkg.go.dev/github.com/gogf/gf/v2/os/gcfg)
