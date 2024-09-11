# I18N - Usage Guide

## Object Creation

### Singleton Object

In most cases, we recommend using the `g.I18n` singleton object, which allows for the customization of different singleton objects. However, please note that any configuration changes to a singleton object are globally effective. For example:

```go
g.I18n().T(context.TODO(), "{#hello} {#world}")
```

> In all translation methods, the first parameter requires a `Context` variable to pass the context variables, specify the translation language, and support future extensibility. Although passing `nil` directly is possible, we recommend using `context.TODO()` or `context.Background()` when you are unsure or have no specific requirements, to ensure program robustness.

### Independent Object

Alternatively, you can independently use the `gi18n` module by creating an independent `i18n` object with the `gi18n.New()` method and managing it yourself. For example:

```go
i18n := gi18n.New()
i18n.T(context.TODO(), "{#hello} {#world}")
```

## Language Settings

There are two ways to set the translation language: by using the `SetLanguage` method to set the unified translation language of the current `I18N` object, or by setting the language of the current translation execution through the context.

### SetLanguage

For example, `g.I18n().SetLanguage("zh-CN")` sets the translation language for the current translation object. All subsequent translations using this object will be in `zh-CN`. Note that the configuration methods of components are generally not thread-safe, and the same applies here. This method should be used during program initialization and should not be changed at runtime.

### WithLanguage

The `WithLanguage` method creates a new context variable and temporarily sets the current translation language. Since this method operates on the `Context`, it is thread-safe and is commonly used for runtime language settings. Let's look at an example:

```go
ctx := gi18n.WithLanguage(context.TODO(), "zh-CN")
i18n.Translate(ctx, `hello`)
```

The `WithLanguage` method is defined as follows:

```go
// WithLanguage appends the language setting to the context and returns a new context.
func WithLanguage(ctx context.Context, language string) context.Context
```

This method sets the translation language in the context variable and returns a new context variable that can be used in subsequent translation methods.

## Common Methods

### T Method

The `T` method is an alias for the `Translate` method and is the recommended method name in most cases. The `T` method can accept either a keyword name or a template content directly, which will be automatically translated and return the translated string.

Additionally, the `T` method can specify the target language for translation using a second language parameter. This name must match the name in the configuration file/path and is often a standardized international language abbreviation, such as `en`, `ja`, `ru`, `zh-CN`, `zh-TW`, etc. Otherwise, the translation will use the language set in the Manager translation object.

Method definition:

```go
// T translates <content> with the configured language and returns the translated content.
func T(ctx context.Context, content string)
```

***Keyword Translation***

To translate a keyword, pass the keyword directly to the `T` method, such as `T(context.TODO(), "hello")` or `T(context.TODO(), "world")`. The I18N component will prioritize translating the provided keyword and return the translated content; otherwise, it will display the original content.

***Template Content Translation***

The `T` method supports template content translation. Keywords in templates are enclosed by `{#` and `}` by default. During template parsing, the keyword content within these tags will be automatically replaced. Example:

1. **Directory Structure**

    ```txt
    ├── main.go
    └── i18n
        ├── en.toml
        ├── ja.toml
        ├── ru.toml
        └── zh-CN.toml
    ```

2. **Translation Files**

    `ja.toml`:

    ```toml
    hello = "こんにちは"
    world = "世界"
    ```

    `ru.toml`:

    ```toml
    hello = "Привет"
    world = "мир"
    ```

    `zh-CN.toml`:

    ```toml
    hello = "你好"
    world = "世界"
    ```

3. **Example Code**

    ```go
    package main

    import (
        "fmt"
        "github.com/gogf/gf/v2/os/gctx"
        "github.com/gogf/gf/v2/i18n/gi18n"
    )

    func main() {
        var (
            ctx  = gctx.New()
            i18n = gi18n.New()
        )

        i18n.SetLanguage("en")
        fmt.Println(i18n.Translate(ctx, `hello`))
        fmt.Println(i18n.Translate(ctx, `GF says: {#hello}{#world}!`))

        i18n.SetLanguage("ja")
        fmt.Println(i18n.Translate(ctx, `hello`))
        fmt.Println(i18n.Translate(ctx, `GF says: {#hello}{#world}!`))

        i18n.SetLanguage("ru")
        fmt.Println(i18n.Translate(ctx, `hello`))
        fmt.Println(i18n.Translate(ctx, `GF says: {#hello}{#world}!`))

        ctx = gi18n.WithLanguage(ctx, "zh-CN")
        fmt.Println(i18n.Translate(ctx, `hello`))
        fmt.Println(i18n.Translate(ctx, `GF says: {#hello}{#world}!`))
    }
    ```

Execution will output:

```bash
Hello
GF says: HelloWorld!
こんにちは
GF says: こんにちは世界!
Привет
GF says: Приветмир!
你好
GF says: 你好世界!
```

### Tf Method

The `Tf` method is an alias for `TranslateFormat`. This method supports formatted translation content. The string formatting syntax follows the `Sprintf` method of the standard library's `fmt` package.

Method definition:

```go
// Tf translates, formats, and returns the <format> with the configured language and given <values>.
func Tf(ctx context.Context, format string, values ...interface{}) string
```

Here is a simple example:

1. **Directory Structure**

    ```txt
    ├── main.go
    └── i18n
        ├── en.toml
        └── zh-CN.toml
    ```

2. **Translation Files**

    `en.toml`:

    ```toml
    OrderPaid = "You have successfully completed order #%d payment, paid amount: ￥%0.2f."
    ```

    `zh-CN.toml`:

    ```toml
    OrderPaid = "您已成功完成订单号 #%d 支付，支付金额￥%.2f。"
    ```

3. **Example Code**

    ```go
    package main

    import (
        "fmt"
        "github.com/gogf/gf/v2/i18n/gi18n"
        "github.com/gogf/gf/v2/os/gctx"
    )

    func main() {
        var (
            ctx         = gctx.New()
            orderId     = 865271654
            orderAmount = 99.8
        )

        i18n := gi18n.New()
        i18n.SetLanguage("en")
        fmt.Println(i18n.Tf(ctx, `{#OrderPaid}`, orderId, orderAmount))

        i18n.SetLanguage("zh-CN")
        fmt.Println(i18n.Tf(ctx, `{#OrderPaid}`, orderId, orderAmount))
    }
    ```

Execution will output:

```bash
You have successfully completed order #865271654 payment, paid amount: ￥99.80.
您已成功完成订单号 #865271654 支付，支付金额￥99.80。
```

### Context Based

We will modify the previous example to demonstrate:

1. **Directory Structure**

    ```txt
    ├── main.go
    └── i18n
        ├── en.toml
        └── zh-CN.toml
    ```

2. **Translation Files**

    `en.toml`:

    ```toml
    OrderPaid = "You have successfully completed order #%d payment, paid amount: ￥%0.2f."
    ```

    `zh-CN.toml`:

    ```toml
    OrderPaid = "您已成功完成订单号 #%d 支付，支付金额￥%.2f。"
    ```

3. **Example Code**

    ```go
    package main

    import (
        "context"
        "fmt"
        "github.com/gogf/gf/v2/frame/g"
        "github.com/gogf/gf/v2/i18n/gi18n"
    )

    func main() {
        var (
            orderId     = 865271654
            orderAmount = 99.8
        )
        fmt.Println(g.I18n().Tf(
            gi18n.WithLanguage(context.TODO(), `en`),
            `{#OrderPaid}`, orderId, orderAmount,
        ))
        fmt.Println(g.I18n().Tf(
            gi18n.WithLanguage(context.TODO(), `zh-CN`),
            `{#OrderPaid}`, orderId, orderAmount,
        ))
    }
    ```

Execution will output:

```bash
You have successfully completed order #865271654 payment, paid amount: ￥99.80.
您已成功完成订单号 #865271654 支付，支付金额￥99.80。
```

## I18N and View Engine

The `gi18n` module is integrated into the GoFrame framework's view engine by default. You can use `gi18n` keywords directly in the template files or content. You can also set the translation language of the current request using a context variable.

> Additionally, you can set the template variable `I18nLanguage` to control the parsing language of different template content according to different international languages.

### Example

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/i18n/gi18n"
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := g.Server()
    s.Group("/", func(group *ghttp.RouterGroup) {
        group.Middleware(func(r *ghttp.Request) {
            r.SetCtx(gi18n.WithLanguage(r.Context(), r.GetString("lang", "zh-CN")))
            r.Middleware.Next()
        })
        group.ALL("/", func(r *ghttp.Request) {
            r.Response.WriteTplContent(`{#hello}{#world}!`)
        })
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution, visiting the following pages will output:

- `http://127.0.0.1:8199` → "你好世界!"
- `http://127.0.0.1:8199/?lang=ja` → "こんにちは世界!"
