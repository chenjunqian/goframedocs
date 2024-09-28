# URL Encoding/Decoding - gurl

## Introduction

The `gurl` package provides methods to build and parse `URL` parameters, as well as encode and decode URLs.

***How to Use***

To use the URL encoding and decoding features, you need to import the following package in your Go project:

```go
import "github.com/gogf/gf/v2/encoding/gurl"
```

***API Documentation***

You can find the complete API documentation for the `GUrl` package at this link:  
[API Documentation - GUrl](https://pkg.go.dev/github.com/gogf/gf/v2/encoding/gurl)

## URL Parameter Construction

The following example demonstrates how to construct URL parameters using the `GUrl` package:

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/encoding/gurl"
    "net/url"
)

func main() {
    // Construct URL parameters
    values := url.Values{}
    values.Add("name", "gopher")
    values.Add("limit", "20")
    values.Add("page", "7")

    // Generate URL-encoded query string: limit=20&name=gopher&page=7
    urlStr := gurl.BuildQuery(values)
    fmt.Println(urlStr)
}
```

***Output***

After running the above code, the output will be:

```bash
limit=20&name=gopher&page=7
```

## URL Parameter Encoding and Decoding

The following example demonstrates how to encode and decode URL parameters using the `GUrl` package:

```go
package main

import (
 "fmt"
 "github.com/gogf/gf/v2/encoding/gurl"
 "log"
)

func main() {
    // Encode a string for safe use in a URL query
    encodeStr := gurl.Encode("limit=20&name=gopher&page=7")
    fmt.Println(encodeStr)

    // Decode the URL-encoded string
    decodeStr, err := gurl.Decode("limit%3D20%26name%3Dgopher%26page%3D7")
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(decodeStr)
}
```

***Output***

After running the above code, the output will be:

```bash
limit%3D20%26name%3Dgopher%26page%3D7
limit=20&name=gopher&page=7
```

## URL Parsing

You can use the `GUrl` package to parse a URL and retrieve its various components. The `component` argument can take the following values to specify which part of the URL to retrieve:

- `-1` - All components
- `1` - Scheme
- `2` - Host
- `4` - Port
- `8` - User
- `16` - Password
- `32` - Path
- `64` - Query
- `128` - Fragment

The following example demonstrates how to parse a URL and retrieve its components:

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/encoding/gurl"
    "log"
)

func main() {
    // Parse a URL and return its components
    data, err := gurl.ParseURL("http://127.0.0.1:8199/goods?limit=20&name=gopher&page=7", -1)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(data)
    fmt.Println(data["host"])
    fmt.Println(data["query"])
    fmt.Println(data["path"])
    fmt.Println(data["scheme"])
    fmt.Println(data["fragment"])
}
```

***Output***

After running the above code, the output will be:

```bash
map[fragment: host:127.0.0.1 pass: path:/goods port:8199 query:limit=20&name=gopher&page=7 scheme:http user:]
127.0.0.1
limit=20&name=gopher&page=7
/goods
http
```
