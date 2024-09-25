# File Monitoring - gfsnotify

`gfsnotify` allows monitoring of changes to specified files or directories, such as file creation, deletion, modification, renaming, and more.

## Usage

```go
import "github.com/gogf/gf/v2/os/gfsnotify"
```

## Interface Documentation

[https://pkg.go.dev/github.com/gogf/gf/v2/os/gfsnotify](https://pkg.go.dev/github.com/gogf/gf/v2/os/gfsnotify)

It is recommended to use the `Add` and `Remove` methods provided by the `gfsnotify` module for adding and removing monitoring. The reasons for this recommendation are explained in the following sections.

Additionally, a monitoring management object can also be created using the `New` method, followed by managing the monitoring process. When adding monitoring, a callback function must be provided to trigger when the monitoring event occurs. The parameter type for this callback function is a pointer to a `*gfsnotify.Event` object.

## Adding Monitoring

```go
package main

import (
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/gfsnotify"
    "github.com/gogf/gf/v2/os/glog"
)

func main() {
    // /home/john/temp is a directory, but files can also be specified
    path := "/home/john/temp"
    ctx := gctx.New()

    _, err := gfsnotify.Add(path, func(event *gfsnotify.Event) {
        if event.IsCreate() {
            glog.Debug(ctx, "File Created: ", event.Path)
        }
        if event.IsWrite() {
            glog.Debug(ctx, "File Written: ", event.Path)
        }
        if event.IsRemove() {
            glog.Debug(ctx, "File Deleted: ", event.Path)
        }
        if event.IsRename() {
            glog.Debug(ctx, "File Renamed: ", event.Path)
        }
        if event.IsChmod() {
            glog.Debug(ctx, "File Permission Changed: ", event.Path)
        }
        glog.Debug(ctx, event)
    }, true)

    // Remove monitoring for this path
    // gfsnotify.Remove(path)

    if err != nil {
        glog.Fatal(ctx, err)
    } else {
        select {}
    }
}
```

In the example above, the `/home/john/temp` parameter specifies a directory. The `gfsnotify.Add` method enables recursive monitoring by default, meaning that when any file within the directory (including subdirectories) changes, the monitoring callback will be triggered.

When files are created, deleted, or modified under the `/home/john/temp` directory, `gfsnotify` captures these changes and outputs corresponding event information.

## Removing Monitoring

To remove monitoring, you can use the `Remove` method, which will stop monitoring the entire file or directory.

If multiple callback functions are attached to the same file or directory, you can remove specific callbacks using the `RemoveCallback` method. The `callbackId` is the unique ID of the `Callback` object returned when the listener was added.

***Example 1: Removing Specific Callbacks***

```go
package main

import (
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/gfsnotify"
    "github.com/gogf/gf/v2/os/glog"
    "github.com/gogf/gf/v2/os/gtimer"
    "time"
)

func main() {
    ctx := gctx.New()

    c1, err := gfsnotify.Add("/home/john/temp/log", func(event *gfsnotify.Event) {
        glog.Debug(ctx, "callback1")
    })
    if err != nil {
        panic(err)
    }

    c2, err := gfsnotify.Add("/home/john/temp/log", func(event *gfsnotify.Event) {
        glog.Debug(ctx, "callback2")
    })
    if err != nil {
        panic(err)
    }

    // Remove callback1 after 5 seconds, leaving only callback2
    gtimer.SetTimeout(5*time.Second, func() {
        gfsnotify.RemoveCallback(c1.Id)
        glog.Debug(ctx, "Removed callback c1")
    })

    // Remove callback2 after 10 seconds, all callbacks are removed, no further logs
    gtimer.SetTimeout(10*time.Second, func() {
        gfsnotify.RemoveCallback(c2.Id)
        glog.Debug(ctx, "Removed callback c2")
    })

    select {}
}
```

***Example 2: Monitoring with Timed Removal of Callbacks***

```go
package main

import (
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/gfsnotify"
    "github.com/gogf/gf/v2/os/glog"
    "github.com/gogf/gf/v2/os/gtimer"
    "time"
)

func main() {
    ctx := gctx.New()

    callback, err := gfsnotify.Add("/home/john/temp", func(event *gfsnotify.Event) {
        glog.Debug(ctx, "callback")
    })
    if err != nil {
        panic(err)
    }

    // During this time, create files, directories, modify files, or delete files

    // Remove the callback after 20 seconds, no further logs will be printed
    gtimer.SetTimeout(20*time.Second, func() {
        gfsnotify.RemoveCallback(callback.Id)
        glog.Debug(ctx, "Removed callback")
    })

    select {}
}
```

## System Limitations

On `*nix` systems, the `gfsnotify` module relies on the system's `inotify` feature to monitor files and directories. Therefore, this functionality is subject to two system kernel function limits:

- **fs.inotify.max_user_instances**: Specifies the number of `inotify` monitoring instances a user can create. Each `Watcher` object created by the `gfsnotify.New` method corresponds to one `inotify` instance. The default system value is typically **128**.
  
- **fs.inotify.max_user_watches**: Specifies the maximum number of files that can be monitored by a single `inotify` instance. If the number of files added to an `inotify` instance exceeds this limit, monitoring will fail, and an error will be logged in the system. The default system value is often **8192** (though this may vary across systems).
