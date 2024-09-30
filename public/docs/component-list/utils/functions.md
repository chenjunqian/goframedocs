# Utility Functions - gutil

## Overview

The `gutil` package provides a collection of commonly used utility methods that can simplify development.

### Usage

```go
import "github.com/gogf/gf/v2/util/gutil"
```

For more detailed API documentation, visit the [official documentation](https://pkg.go.dev/github.com/gogf/gf/v2/util/gutil).

## Common Methods

### Dump

**Description**:  
`Dump` outputs the provided values in a more readable format to the standard output.

**Syntax**:

```go
Dump(values ...interface{})
```

**Example**:

```go
type User struct {
    Name string
    Age  int
}

type Location struct {
    Province string
    City     string
}

type UserInfo struct {
    U User
    L Location
}

func main() {
    userList := make([]UserInfo, 0)
    userList = append(userList, UserInfo{
        U: User{
            Name: "Guo Qiang",
            Age:  18,
        },
        L: Location{
            Province: "Sichuan",
            City:     "Chengdu",
        },
    })
    userList = append(userList, UserInfo{
        U: User{
            Name: "Huang Qian",
            Age:  18,
        },
        L: Location{
            Province: "Jiangsu",
            City:     "Nanjing",
        },
    })

    gutil.Dump(userList)
}
```

**Output**:

```json
[
    {
        U: {
            Name: "Guo Qiang",
            Age:  18
        },
        L: {
            Province: "Sichuan",
            City:     "Chengdu"
        }
    },
    {
        U: {
            Name: "Huang Qian",
            Age:  18
        },
        L: {
            Province: "Jiangsu",
            City:     "Nanjing"
        }
    }
]
```

### DumpWithType

**Description**:  
`DumpWithType` is similar to `Dump`, but it includes additional type information for the values.

**Syntax**:

```go
DumpWithType(values ...interface{})
```

**Example**:

```go
type User struct {
    Name string
    Age  int
}

type Location struct {
    Province string
    City     string
}

type UserInfo struct {
    U User
    L Location
}

func main() {
    userList := make([]UserInfo, 0)
    userList = append(userList, UserInfo{
        U: User{
            Name: "Guo Qiang",
            Age:  18,
        },
        L: Location{
            Province: "Sichuan",
            City:     "Chengdu",
        },
    })
    userList = append(userList, UserInfo{
        U: User{
            Name: "Huang Qian",
            Age:  18,
        },
        L: Location{
            Province: "Jiangsu",
            City:     "Nanjing",
        },
    })

    gutil.DumpWithType(userList)
}
```

**Output**:

```go
[]main.UserInfo(2) [
    main.UserInfo(2) {
        U: main.User(2) {
            Name: string(6) "Guo Qiang",
            Age:  int(18),
        },
        L: main.Location(2) {
            Province: string(6) "Sichuan",
            City:     string(6) "Chengdu",
        },
    },
    main.UserInfo(2) {
        U: main.User(2) {
            Name: string(6) "Huang Qian",
            Age:  int(18),
        },
        L: main.Location(2) {
            Province: string(6) "Jiangsu",
            City:     string(6) "Nanjing",
        },
    }
]
```

### DumpTo

**Description**:  
`DumpTo` writes the provided values in a custom format to a specified writer.

**Syntax**:

```go
DumpTo(writer io.Writer, value interface{}, option DumpOption)
```

**Example**:

```go
package main

import (
    "bytes"
    "fmt"
    "github.com/gogf/gf/v2/util/gutil"
    "io"
)

type UserInfo struct {
    Name     string
    Age      int
    Province string
    City     string
}

type DumpWriter struct {
    Content string
}

func (d *DumpWriter) Write(p []byte) (n int, err error) {
    buffer := bytes.NewBuffer(nil)
    buffer.WriteString("I'm Start!\n")
    buffer.WriteString(string(p))
    buffer.WriteString("\nI'm End!\n")

    d.Content = buffer.String()

    return buffer.Len(), nil
}

func main() {
    u := UserInfo{
        Name:     "a",
        Age:      18,
        Province: "b",
        City:     "c",
    }

    var dw io.Writer = &DumpWriter{}

    gutil.DumpTo(dw, u, gutil.DumpOption{})

    fmt.Println(dw.(*DumpWriter).Content)
}
```

**Output**:

```bash
I'm Start!
{
    Name:     "a",
    Age:      18,
    Province: "b",
    City:     "c"
}
I'm End!
```
