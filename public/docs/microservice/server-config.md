# Microservice - Server Configuration

## Basic Introduction

The server supports configuration files, and all configurations will automatically map to configuration objects. The configuration object is as follows:

```go
// GrpcServerConfig is the configuration for the server.
type GrpcServerConfig struct {
    Address          string              // (optional) Address for server listening.
    Name             string              // (optional) Name for current service.
    Logger           *glog.Logger        // (optional) Logger for server.
    LogPath          string              // (optional) LogPath specifies the directory for storing log files.
    LogStdout        bool                // (optional) LogStdout specifies whether to print logging content to stdout.
    ErrorStack       bool                // (optional) ErrorStack specifies whether to log stack information when an error occurs.
    ErrorLogEnabled  bool                // (optional) ErrorLogEnabled enables error logging content to files.
    ErrorLogPattern  string              // (optional) ErrorLogPattern specifies the error log file pattern, e.g., error-{Ymd}.log.
    AccessLogEnabled bool                // (optional) AccessLogEnabled enables access logging content to file.
    AccessLogPattern string              // (optional) AccessLogPattern specifies the access log file pattern, e.g., access-{Ymd}.log.
}
```

The automatic reading logic for configuration files is consistent with the framework. For more details, please refer to the section: [Configuration Management](/docs/core-component/configuration/).

## Configuration Template

An example of a complete configuration template:

```yaml
grpc:
  name:             "demo"  # Service name
  address:          ":8000" # Custom service listening address
  logPath:          "./log" # Log storage directory path
  logStdout:        true    # Whether to output logs to the terminal
  errorLogEnabled:  true    # Whether to enable error log recording
  accessLogEnabled: true    # Whether to enable access log recording
  errorStack:       true    # Whether to log error stack when an error occurs
  
  # Log extension configuration (parameter log component configuration)
  logger:
    path:                  "/var/log/"   # Log file path. Default is empty, indicating off, and only outputs to the terminal.
    file:                  "{Y-m-d}.log" # Log file format. Default is "{Y-m-d}.log".
    prefix:                ""            # Log content output prefix. Default is empty.
    level:                 "all"         # Log output level.
    stdout:                true          # Whether logs are also output to the terminal. Default is true.
    rotateSize:            0             # File rotation based on log file size. Default is 0, indicating off.
    rotateExpire:          0             # File rotation based on log file time interval. Default is 0, indicating off.
    rotateBackupLimit:     0             # Cleans split files according to the number of split files when the rotation feature is enabled. Default is 0, indicating no backup; splits will delete.
    rotateBackupExpire:    0             # Cleans split files based on file expiration when the rotation feature is enabled. Default is 0, indicating no backup; splits will delete.
    rotateBackupCompress:  0             # Compression ratio for rotated split files (0-9). Default is 0, indicating no compression.
    rotateCheckInterval:   "1h"          # Time detection interval for rotation, generally does not need to be set. Default is 1 hour.
```

The log configuration is consistent with the HTTP server and can independently use the log component configuration options to configure the gRPC server's logs. For detailed information on log component configuration, refer to the document: [Log Component - Configuration Management](/docs/core-component/log/config).

> In the absence of a configured address, the gRPC server will use all IP addresses of the local network card plus a randomly available port to start (default configuration: 0). If you want to specify an IP but start the gRPC server with a random available port, you can use the format `ip:0` to configure the address, for example: `192.168.1.1:0`, `10.0.1.1:0`.
