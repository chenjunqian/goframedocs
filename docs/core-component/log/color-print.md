# Log - Color Print

Enhance the readability of logs by highlighting error level text with font color when printing logs.

## Configuration

The console supports colored output, while file logs are default without color.

If you want the logs in the file to also have color, you can add configurations to the configuration file.

```yaml
logger:
  stdoutColorDisabled: false # Whether to disable color printing in the terminal. Default is no, indicating color output in the terminal is enabled.
  writerColorEnable:   false # Whether to enable color printing for the Writer. Default is no, indicating no color output to the custom Writer or file.
```

By code:

```go
g.Log().SetWriterColorEnable(true)
```

## Default Color Configuration

```go
// \v2\os\glog\glog_logger_color.go
var defaultLevelColor = map[int]int{
    LEVEL_DEBU: COLOR_YELLOW,
    LEVEL_INFO: COLOR_GREEN,
    LEVEL_NOTI: COLOR_CYAN,
    LEVEL_WARN: COLOR_MAGENTA,
    LEVEL_ERRO: COLOR_RED,
    LEVEL_CRIT: COLOR_HI_RED,
    LEVEL_PANI: COLOR_HI_RED,
    LEVEL_FATA: COLOR_HI_RED,
}
```
