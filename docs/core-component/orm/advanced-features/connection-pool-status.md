# ORM - Advanced Features - Connection Pool Status

## Introduction

You can use the `DB.Stats` method to retrieve the connection pool status of the ORM object. This feature allows you to monitor and manage the state of database connections effectively.

## Example Usage

Below is a complete example demonstrating how to get and display the connection pool status:

```go
package main

import (
    _ "github.com/gogf/gf/contrib/drivers/mysql/v2"

    "github.com/gogf/gf/v2/database/gdb"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var ctx = gctx.New()
    db, err := gdb.New(gdb.ConfigNode{
        Link: "mysql:root:12345678@tcp(127.0.0.1:3306)/test",
    })
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    err = db.PingMaster()
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    stats := db.Stats(ctx)
    g.Dump(stats)
}
```

## Output

After running the example code, the terminal will display the connection pool status, including information about each database node and its connection pool state:

```bash
[
    {
        node:  {
            Host:                 "127.0.0.1",
            Port:                 "3306",
            User:                 "root",
            Pass:                 "12345678",
            Name:                 "test",
            Type:                 "mysql",
            Link:                 "",
            Extra:                "",
            Role:                 "",
            Debug:                false,
            Prefix:               "",
            DryRun:               false,
            Weight:               0,
            Charset:              "utf8",
            Protocol:             "tcp",
            Timezone:             "",
            Namespace:            "",
            MaxIdleConnCount:     0,
            MaxOpenConnCount:     0,
            MaxConnLifeTime:      0,
            QueryTimeout:         0,
            ExecTimeout:          0,
            TranTimeout:          0,
            PrepareTimeout:       0,
            CreatedAt:            "",
            UpdatedAt:            "",
            DeletedAt:            "",
            TimeMaintainDisabled: false,
        },
        stats: {
            MaxOpenConnections: 0,
            OpenConnections:    1,
            InUse:              0,
            Idle:               1,
            WaitCount:          0,
            WaitDuration:       0,
            MaxIdleClosed:      0,
            MaxIdleTimeClosed:  0,
            MaxLifetimeClosed:  0,
        },
    },
]
```
