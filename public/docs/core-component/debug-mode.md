# Debug Mode

## Overview

The components of the `goframe` print some debugging information at some key component, which were originally only used by the framework's internal developers during the development phase, and starting from version `v1.10.0` of the `goframe` framework.

The debugging information printed in the framework's debug mode will be output to the terminal standard output with the log prefix [INTE], and the name of the source file and the code line number will also be printed, for example:

```bash
2021-04-14 15:24:52.954 [INTE] gdb_driver_mysql.go:49 Open: root:12345678@tcp(127.0.0.1:3306)/test
2021-04-14 15:24:52.954 [INTE] gdb.go:492 open new connection success, master:false, config:&gdb.ConfigNode{Host:"", Port:"", User:"", Pass:"", Name:"", Type:"mysql", Role:"", Debug:false, Prefix:"", DryRun:false, Weight:0, Charset:"", LinkInfo:"root:12345678@tcp(127.0.0.1:3306)/test", MaxIdleConnCount:0, MaxOpenConnCount:0, MaxConnLifeTime:0, QueryTimeout:0, ExecTimeout:0, TranTimeout:0, PrepareTimeout:0, CreatedAt:"", UpdatedAt:"", DeletedAt:"", TimeMaintainDisabled:false}, node:&gdb.ConfigNode{Host:"", Port:"", User:"", Pass:"", Name:"", Type:"mysql", Role:"", Debug:false, Prefix:"", DryRun:false, Weight:0, Charset:"utf8", LinkInfo:"root:12345678@tcp(127.0.0.1:3306)/test", MaxIdleConnCount:0, MaxOpenConnCount:0, MaxConnLifeTime:0, QueryTimeout:0, ExecTimeout:0, TranTimeout:0, PrepareTimeout:0, CreatedAt:"", UpdatedAt:"", DeletedAt:"", TimeMaintainDisabled:false}
```

## Feature Activation

These debugging messages are turned off by default and do not affect framework performance. Developers and users of the framework can turn them on in the following ways:

- Command line startup argument: `-gf.debug=true`.

- Specified environment variable: `GF_DEBUG=true`.

- In `Goframe` `v1.14.0` and later versions, use the `g.SetDebug` method to manually turn on/off in the boot package during program startup. This method is not concurrency-safe, which means you should not call this method asynchronously in multiple goroutines to dynamically set the debug mode.

- You may notice that many functional modules of the `goframe` are also configured according to certain rules in the form of `command line` **startup arguments + environment variables**.

It should be noted that the key debugging information of the framework's various modules will only be output to the **terminal standard output** and does not support output to log files.

## Debug Mode in Command Line

Add `--gf.debug=true` to the command line startup arguments.

```bash
./app --gf.debug=true
```

```bash
./app --gf.debug true
```

Or

```bash
./app --gf.debug=1
```

```bash
./app --gf.debug 1
```
