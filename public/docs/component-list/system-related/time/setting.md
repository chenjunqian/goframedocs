# Time - Time Zone Settings

## Setting Global Time Zone with SetTimeZone

Below is an example demonstrating how to set the global time zone for a process using `SetTimeZone`.

```go
package main

import (
    "fmt"
    "time"

    "github.com/gogf/gf/v2/os/gtime"
)

func main() {
    // Set global time zone for the process
    err := gtime.SetTimeZone("Asia/Tokyo")
    if err != nil {
        panic(err)
    }
    
    // Use gtime to get the current time
    fmt.Println(gtime.Now().String())

    // Use the standard library to get the current time
    fmt.Println(time.Now().String())
}
```

***Output***

```bash
2023-01-06 15:27:38
2023-01-06 15:27:38.753909 +0900 JST m=+0.002758145
```

## Notes on Time Zone Settings

### SetTimeZone Method Errors When Called Multiple Times

The `SetTimeZone` method only allows setting the global time zone once. If you call the method multiple times with different time zones, subsequent calls will fail and return an error.

### Time Package Initialization Issue in Business Projects

You must call the global time zone setting before importing the standard `time` package because the `time` package executes initialization upon import. After this initialization, you cannot change the global time zone, and time zone conversions will have to be performed on specific time objects using the `ToLocation` method (or the standard `In` method).

Below is an example demonstrating time zone conversion on a time object:

```go
package main

import (
    "fmt"
    "time"

    "github.com/gogf/gf/v2/os/gtime"
)

func main() {
    // Set global time zone for the process
    err := gtime.SetTimeZone("Asia/Tokyo")
    if err != nil {
        panic(err)
    }

    // Use gtime to get the current time
    fmt.Println(gtime.Now())

    // Use the standard library to get the current time
    fmt.Println(time.Now())

    // Perform time zone conversion on a specific time object
    local, err := time.LoadLocation("Asia/Shanghai")
    if err != nil {
        panic(err)
    }
    fmt.Println(gtime.Now().ToLocation(local))
}
```

***Output***

```bash
2023-01-06 15:37:38
2023-01-06 15:37:38.753909 +0900 JST m=+0.002758145
2023-01-06 14:37:38
```

### Handling Time Package Initialization in Business Projects

In many business projects, there are usually several package imports before the `main` package, which may cause initialization issues with the `time` package. Therefore, if you need to set a global time zone, it is recommended to call the `SetTimeZone` method through a separate package and import this package at the very beginning of the `main` package to avoid initialization conflicts with the `time` package.

***Example***

You can refer to the solution provided in the following StackOverflow thread: [Setting Timezone Globally in Golang](https://stackoverflow.com/questions/54363451/setting-timezone-globally-in-golang).

```go
package main

import (
    _ "boot/time"  // Import the time setting package first

    "fmt"
    "time"
)

func main() {
    // Use gtime to get the current time
    fmt.Println(gtime.Now().String())

    // Use the standard library to get the current time
    fmt.Println(time.Now().String())
}
```
