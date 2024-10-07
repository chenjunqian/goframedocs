# Service Configuration - Template

All configuration items refer to the `ServerConfig` object properties: [ghttp.ServerConfig](https://pkg.go.dev/github.com/gogf/gf/v2/net/ghttp#ServerConfig)

## Template

Below is the configuration file template:

```yaml
server:
    # Basic Configuration
    address:             ":80"                        # Local listening address. Default ":80", separate multiple addresses with ",". Example: "192.168.2.3:8000,10.0.3.10:8001"
    httpsAddr:           ":443"                       # TLS/HTTPS configuration, also requires configuring certificates and keys. Default disabled. Configuration format is the same as above.
    httpsCertPath:       ""                           # TLS/HTTPS certificate file local path, absolute path recommended. Default disabled
    httpsKeyPath:        ""                           # TLS/HTTPS key file local path, absolute path recommended. Default disabled
    readTimeout:         "60s"                        # Request read timeout duration, generally no need to configure. Default is 60 seconds
    writeTimeout:        "0"                          # Data return write timeout duration, generally no need to configure. Default is no timeout (0)
    idleTimeout:         "60s"                        # Only effective when Keep-Alive is enabled, request idle duration. Default is 60 seconds
    maxHeaderBytes:      "10240"                      # Request Header size limit (Byte). Default is 10KB
    keepAlive:           true                         # Whether to enable Keep-Alive feature. Default true
    serverAgent:         "GoFrame HTTP Server"        # Server side Agent information. Default is "GoFrame HTTP Server"

    # API Documentation
    openapiPath: "/api.json" # OpenAPI interface documentation address
    swaggerPath: "/swagger"  # Built-in SwaggerUI display address

    # Static Service Configuration
    indexFiles:          ["index.html","index.htm"]   # Automatic home page static file search. Default ["index.html", "index.htm"]
    indexFolder:         false                        # When accessing a static file directory, whether to display the list of files in the directory. Default disabled, then the request will return 403
    serverRoot:          "/var/www"                   # The root directory of the static file service, automatically enables static file service when configured. Default disabled
    searchPaths:         ["/home/www","/var/lib/www"] # Additional file search paths when providing static file service, if the root path is not found then search in the search directories in order. Default disabled
    fileServerEnabled:   false                        # Static file service master switch. Default false

    # Cookie Configuration
    cookieMaxAge:        "365d"             # Cookie validity period. Default is 365 days
    cookiePath:          "/"                # Cookie valid path. Default is "/" which means it is valid for all paths on the site
    cookieDomain:        ""                 # Cookie valid domain. Default is the domain name where the Cookie is configured

    # Sessions Configuration
    sessionMaxAge:       "24h"              # Session validity period. Default is 24 hours
    sessionIdName:       "gfsessionid"      # The key name of SessionId. Default is gfsessionid
    sessionCookieOutput: true               # When Session feature is enabled, whether to return SessionId to Cookie. Default true
    sessionPath:         "/tmp/gsessions"   # The file directory path where Session is stored. Default to the gsessions directory under the system's temporary directory

    # Basic Log Configuration
    # This configuration is similar to nginx, mainly for recording request logs
    logPath:             ""                 # Log file storage directory path, absolute path recommended. Default empty, means disabled
    logStdout:           true               # Whether logs are output to the terminal. Default true
    errorStack:          true               # When Server captures an exception, whether to record stack information to logs. Default true
    errorLogEnabled:     true               # Whether to record exception log information to logs. Default true
    errorLogPattern:     "error-{Ymd}.log"  # Exception error log file format. Default "error-{Ymd}.log"
    accessLogEnabled:    false              # Whether to record access logs. Default false
    accessLogPattern:    "access-{Ymd}.log" # Access log file format. Default "access-{Ymd}.log"

    # Log Extension Configuration (Parameter Log Component Configuration)
    # This configuration mainly affects server (ghttp module) logs, such as web service listening port number, web service route, and does not affect g.Log
    logger:
        path:                  "/var/log/"           # Log file path. Default empty, means disabled, only output to terminal
        file:                  "{Y-m-d}.log"         # Log file format. Default "{Y-m-d}.log"
        prefix:                ""                    # Log content output prefix. Default empty
        level:                 "all"                 # Log output level
        timeFormat:            "2006-01-02T15:04:05" # Custom log output time format, use Go standard time format configuration
        ctxKeys:               []                    # Custom Context context variable names, automatically print Context variables to logs. Default empty
        header:                true                  # Whether to print log header information. Default true
        stdout:                true                  # Whether logs are also output to the terminal. Default true
        rotateSize:            0                     # Log file rolling cut according to log file size. Default 0, means disabled rolling cut feature
        rotateExpire:          0                     # Log file rolling cut according to log file time interval. Default 0, means disabled rolling cut feature
        rotateBackupLimit:     0                     # Clean up the number of rolled files according to the number of rolled files when the rolling cut feature is enabled. Default 0, means no backup, delete on cut
        rotateBackupExpire:    0                     # Clean up the validity period of rolled files according to the validity period of rolled files when the rolling cut feature is enabled. Default 0, means no backup, delete on cut
        rotateBackupCompress:  0                     # Compression ratio of rolled cut files (0-9). Default 0, means no compression
        rotateCheckInterval:   "1h"                  # Time detection interval for rolling cut, generally no need to set. Default 1 hour
        stdoutColorDisabled:   false                 # Turn off terminal color printing. Default on
        writerColorEnable:     false                 # Whether the log file has color. Default false, means no color

    # PProf Configuration
    pprofEnabled:        false              # Whether to enable PProf performance debugging feature. Default is false
    pprofPattern:        ""                 # Valid when PProf is enabled, indicating the page access path of the PProf feature, effective for all domains bound to the current Server.

    # Smooth Restart Feature
    graceful:                false          # Whether to enable smooth restart feature, when enabled, it will increase the local TCP port of 10000 for inter-process communication. Default is false
    gracefulTimeout:         2               # After the parent process smooth restarts, how many seconds to exit, default is 2 seconds. If the request takes longer than this value, it may cause the request to be interrupted
    gracefulShutdownTimeout: 5               # When closing the Server, if there are ongoing HTTP requests, how many seconds the Server waits before forcibly closing

    # Other Configurations
    clientMaxBodySize:   810241024          # Maximum client Body upload limit size, affecting file upload size (Byte). Default is 8*1024*1024=8MB
    formParsingMemory:   1048576            # Buffer size when parsing forms (Byte), generally no need to configure. Default is 1024*1024=1MB
    nameToUriType:       0                  # Route registration uses object registration when the route generation rule is used. Default is 0
    routeOverWrite:      false              # When encountering duplicate route registration, whether to overwrite forcibly. Default is false, when duplicate routes exist, it will exit at startup with an error
    dumpRouterMap:       true               # Whether to print all route lists when the Server starts. Default is true
```
