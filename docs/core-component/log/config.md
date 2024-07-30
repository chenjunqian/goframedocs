# Log - Configuration

Log componenet is one of the core components of the `Goframe`. It supports configuration management with a unified configuration component.

## Configuration File

Log configuration is managed by the framework's unified configuration component, which supports multiple file formats and features such as configuration centers and interface-based extensions. For more details, please refer to the section on [Configuration Management](https://temperory.net).

The log component supports configuration files. When you obtain a `Logger` singleton object with `g.Log(instanceName)`, it will automatically read the corresponding `Logger` configuration through the default configuration management object. By default, it will read the `logger.instanceName` configuration item. If this configuration item does not exist, it will read the default `logger` configuration item. For the configuration item, please refer to the configuration object structure definition: <https://pkg.go.dev/github.com/gogf/gf/v2/os/glog#Config>

The complete configuration file options and their descriptions are as follows, with case-insensitive option names:

```yaml
logger:
  path:                  "/var/log/"           # Log file path. Default is empty, which means logging is disabled and only output to the terminal.
  file:                  "{Y-m-d}.log"         # Log file format. Default is "{Y-m-d}.log".
  prefix:                ""                    # Prefix for log content output. Default is empty.
  level:                 "all"                 # Log output level.
  timeFormat:            "2006-01-02T15:04:05" # Custom log output time format, using Golang's standard time format configuration.
  ctxKeys:               []                    # Custom context variable names for automatic printing of context variables to logs. Default is empty.
  header:                true                  # Whether to print the log header information. Default is true.
  stdout:                true                  # Whether logs are also output to the terminal. Default is true.
  rotateSize:            0                     # Log file rolling split based on file size. Default is 0, which means the rolling split feature is disabled.
  rotateExpire:          0                     # Log file rolling split based on time interval. Default is 0, which means the rolling split feature is disabled.
  rotateBackupLimit:     0                     # Clean up split files based on the number of split files when the rolling split feature is enabled. Default is 0, which means no backup, delete upon split.
  rotateBackupExpire:    0                     # Clean up split files based on the validity period of split files when the rolling split feature is enabled. Default is 0, which means no backup, delete upon split.
  rotateBackupCompress:  0                     # Compression ratio (0-9) of rolled split files. Default is 0, which means no compression.
  rotateCheckInterval:   "1h"                  # Time interval for rolling split checks, generally no need to set. Default is 1 hour.
  stdoutColorDisabled:   false                 # Disable color printing in the terminal. Default is enabled.
  writerColorEnable:     false                 # Whether the log file should have color. Default is false, which means no color.
```

The `level` configuration item uses string configuration and supports the following configurations according to the log levels: `DEBU` < `INFO` < `NOTI` < `WARN` < `ERRO` < `CRIT`. It also supports common deployment mode configuration names such as `ALL`, `DEV`, `PROD`. The `level` configuration item string is case-insensitive. For a detailed introduction to log levels, please refer to the [Log - Levels](https://temperory.net).

### Example Default Configuration

```yaml
logger:
  path:    "/var/log"
  level:   "all"
  stdout:  false
```

Then we can use `g.Log()` to obtain a `Logger` singleton object with the default configuration.

### Example Multiple Configuration

```yaml
logger:
  path:    "/var/log"
  level:   "all"
  stdout:  false
  logger1:
    path:    "/var/log/logger1"
    level:   "dev"
    stdout:  false
  logger2:
    path:    "/var/log/logger2"
    level:   "prod"
    stdout:  true
```

We can use the singleton object to get `Logger` by name.

```go
// logger.logger1
l1 := g.Log("logger1")
// logger.logger2
l2 := g.Log("logger2")
// defaul logger
l3 := g.Log("none")
// default logger
l4 := g.Log()
```

## Configuration Functions (Advanced Usage)

Configuration functions are used for modular `glog`, where developers manage their own configurations.

List of Brief Methods:

- Configuration can be set by `SetConfig` and `SetConfigWithMap`.

- The `Set*` functions of the `Logger` object can also be used to set specific configurations.

- It is important to note that configuration items should be set before the Logger object performs log output to avoid concurrency safety issues.

We can use the `SetConfigWithMap` method to set/modify specific configurations of the `Logger` using `Key-Value`, while the rest of the configurations can use default settings. The `key`s are the attribute names in the `Config` struct, case-insensitive, and support the use of `-`/ `_`/ `space` symbols for word connections. For details, refer to the conversion rules in the [Type Conversion](https://temperory.net).

Simple Example:

```go
logger := glog.New()
logger.SetConfigWithMap(g.Map{
    "path":     "/var/log",
    "level":    "all",
    "stdout":   false,
    "StStatus": 0,
})
logger.Print("test")
```

The `StStatus` indicates whether stack tracing is enabled; setting it to `0` means it is disabled. The key name can also be used as `stStatus`, `st-status`, `st_status`, `St Status`, and so on for other configuration properties.

## Notes

Why don't the configurations for the log component take effect on the logs printed by the `HTTP Server`, `GRPC Server`, and `ORM` components?

The `Goframe` adopts a modular design, and the log component is an independent component within the `Goframe`. The configurations introduced in this section only take effect for the log component used independently, such as the log components created using `g.Log()` or `glog.New()` methods. Other components have specific configuration items or log object setting methods to implement log configurations; please refer to the corresponding component documentation and `API` for details.
