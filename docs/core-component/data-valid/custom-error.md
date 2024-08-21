# Data Validation - Custom Error

The data validation component supports the `i18n` feature, which is implemented using the unified i18n component of the GoFrame framework. It defaults to using the default `i18n` singleton object, that is, the `g.I18n()` object.

Before proceeding with further use, please refer to the section on `I18N` internationalization for configuration and usage of the i18n internationalization feature: [I18N](https://temperory.net).

## Configuration

### Default i18n Error Message

The defaul English error message is as follows:

<https://github.com/gogf/gf/tree/master/util/gvalid/i18n/en>

### Chinese Error Message

The Chinese error message is as follows:

<https://github.com/gogf/gf/tree/master/util/gvalid/i18n/cn>

### Default Error Message

When an error message corresponding to the rule cannot be found in `i18n`, the error message configured for `__default__` will be used. This is often utilized in custom rules.

## Example

### Project Structure

```text
├── main.go
└── i18n
    ├── en.toml
    └── zh-CN.toml
```

### i18n File

`en.toml`

```toml
"ReuiredUserName" = "Please input user name"
"ReuiredUserType" = "Please select user type"
```

`zh-CN.toml`

```toml
"ReuiredUserName" = "请输入用户名"
"ReuiredUserType" = "请选择用户类型"
```

### Code

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/i18n/gi18n"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/util/gconv"
)

func main() {
    type User struct {
        Name string `v:"required#ReuiredUserName"`
        Type int    `v:"required#ReuiredUserType"`
    }
    var (
        ctx  = gctx.New()
        data = g.Map{
        "name": "john",
    }
    user  = User{}
        ctxEn = gi18n.WithLanguage(ctx, "en")
        ctxCh = gi18n.WithLanguage(ctx, "zh-CN")
    )

    if err := gconv.Scan(data, &user); err != nil {
        panic(err)
    }
    // English 
    if err := g.Validator().Assoc(data).Data(user).Run(ctxEn); err != nil {   
        g.Dump(err.String())
    }
    // Chinese
    if err := g.Validator().Assoc(data).Data(user).Run(ctxCh); err != nil {   
        g.Dump(err.String())
    }
}
```

Output:

```bash
Please select user type
请选择用户类型
```
