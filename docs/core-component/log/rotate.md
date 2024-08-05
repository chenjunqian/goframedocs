# Log - Rotate

Log file rotating is currently an experimental feature. If you encounter any issues, please feel free to provide feedback at any time.

`glog` component supports outputting log files by date by setting the log file name. Starting from `GF version v1.12`, the `glog` component also supports the feature of rolling file splitting. This feature involves the following configuration items in the log configuration:

```yaml
RotateSize           int64          // Rotate the logging file if its size > 0 in bytes.
RotateExpire         time.Duration  // Rotate the logging file if its mtime exceeds this duration.
RotateBackupLimit    int            // Max backup for rotated files, default is 0, means no backups.
RotateBackupExpire   time.Duration  // Max expire for rotated files, which is 0 in default, means no expiration.
RotateBackupCompress int            // Compress level for rotated files using gzip algorithm. It's 0 in default, means no compression.
RotateCheckInterval  time.Duration  // Asynchronizely checks the backups and expiration at intervals. It's 1 hour in default.
```

- `RotateSize` is used to set the file size for rolling file splitting, and the unit of this property is bytes. The rolling split feature is only enabled when the value of this property is greater than 0.

- `RotateExpire` is used to set the rolling split based on the file not being modified for a certain period of time. The rolling split feature is only enabled when the value of this property is greater than 0.

- `RotateBackupLimit` is used to set the number of files to keep for rolling splits. The default is 0, which means no files are retained; typically, this value should be set to greater than 0. Split files exceeding this number will be deleted from oldest to newest.

- `RotateBackupExpire` is used to set the cleanup based on expiration time. Split files that exceed the specified time will be deleted.

- `RotateBackupCompress` is used to set the compression level for split files, with a default of 0 indicating no compression. The range of compression levels is from 1 to 9, with 9 being the highest level of compression.

- `RotateCheckInterval` is used to set the interval for the timer's scheduled checks, with the default being 1 hour, which usually does not need to be set.

## Enable Rotate

The feature will be enable when the `RotateSize` or `RotateExpire` configuration item is set, it is disable by default.

## File Format

The log output file of the `glog` component has a fixed format of `*.log`, that is, `.log` is used as the suffix for the log file name. For the convenience of unified standard management, the format of the split file is also fixed, and user cannot customize it. When the log file is rotated, the current split log file will be renamed according to the format of `*.split-time.log`. The format of the split time is: `year month day hour minute second millisecond microsecond`, for example:

```log
access.log          -> access.20200326101301899002.log
access.20200326.log -> access.20200326.20200326101301899002.log
```

## Configuration

***Example 1***

Base on the size to rotate log file

```yaml
logger:
     Path:                  "/var/log"
     Level:                 "all"
     Stdout:                false
     RotateSize:            "100M"
     RotateBackupLimit:     2
     RotateBackupExpire:    "7d"
     RotateBackupCompress:  9
```

- The `RotateSize` configuration item supports being set in the form of a string in the configuration file, for example: `100M, 200MB, 500KB, 1Gib, etc`. In this example, we set the log file to rotate when it exceeds `100M`.

- The `RotateBackupExpire` configuration item also supports string configuration, for example: `1h, 30m, 1d6h, 7d, etc`. In this example, we set the expiration time of the split file to `7d`, which means the split file will be automatically deleted automatically after seven days.

- Setting `RotateBackupCompress` to `9` indicates the use of the maximum compression level, making the split file as small as possible. However, it should be noted that splitting and compressing are two different operations. File compression is an asynchronous operation, so when the file is automatically split, the timer regularly checks at certain time intervals and then automatically compresses it into a `*.gz` file. The higher the compression level set, the more `CPU` resources will be used.

***Example 2***

Base on date to rotate log file

```yaml
logger:
     Path:                  "/var/log"
     Level:                 "all"
     Stdout:                false
     RotateExpire:          "1d"
     RotateBackupLimit:     1
     RotateBackupExpire:    "7d"
     RotateBackupCompress:  9
```

In this example, the `RotateExpire` configuration item is set to `1d`, if the log file is not modified for one day, it will be automatically rotated.

## Notes

Because different log objects may have different rotate configurations, if multiple log objects have the same log directory and have all enabled the rotate feature, the rotate configuration items of multiple log objects will conflict, casue unexpected results. Therefore, we suggest you have two choices:

1. Use the same default log singleton object globally (`g.Log()`), and set the output log file to different directories or file names through the `Cat` or `File` method.

2. Set the output directory (`Path` configuration item) of different log objects (`g.Log(name)`) to different file directories, and there is no hierarchical relationship between the log directories of multiple log objects.

For example: We have two types of business log files, `order` and `promo`, corresponding to order business and promotion business, and we assume they belong to the same service program.

If the log path is /var/log, we can:

1. Output order logs through `g.Log().Cat("order").Print(xxx)`. The generated log file, for example: `/var/log/order/2020-03-26.log`.

2. Output promotion logs through `g.Log().Cat("promo").Print(xxx)`. The generated log file, for example: `/var/log/promo/2020-03-26.log`.

Alternatively:

1. Output order logs through `g.Log("order").Print(xxx)`. The generated log file, for example: `/var/log/order.log`.

2. Output promotion logs through `g.Log("promo").Print(xxx)`. The generated log file, for example: `/var/log/promo.log`.
