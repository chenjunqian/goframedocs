# SameSite Settings

Created by Hai Liang, last modified on April 21, 2021.

## Introduction to SameSite

For detailed documentation, refer to the following links:

- [SameSite Cookies Explained](https://web.dev/samesite-cookies-explained/)
- [SameSite Cookie Recipes](https://web.dev/samesite-cookie-recipes/)
- [Schemeful SameSite](https://web.dev/schemeful-samesite/)

Starting with Chrome 89, requests with different protocols are also considered cross-site requests:

- [Chrome Feature Status](https://www.chromestatus.com/feature/5096179480133632)

## How to Set SameSite?

Here's how you can set the SameSite attribute in your GoFrame application:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "net/http"
)

func main() {
    s := g.Server()
    s.BindHandler("/", func(r *ghttp.Request) {
        r.Cookie.SetHttpCookie(&http.Cookie{
            Name:     "test",
            Value:    "1234",
            Secure:   true,
            SameSite: http.SameSiteNoneMode, // Custom SameSite attribute, used in conjunction with Secure
        })
    })
    s.SetAddr("127.0.0.1:8080")
    s.Run()
}
```
