# Data Validation - Custom Rule

Although `gvalid` already includes dozens of common validation rules, there are certain business scenarios where we need to define custom validation rules, especially those that are related to business and can be reused. Of course, `gvalid` is so powerful and considerate that it has already thought of this for you. Custom validation rules can achieve flexible and highly reusable validation features

## Rule Registration

### Related Data Structures

The definition of custom rule methods and the corresponding input parameter data structures.

```go
// RuleFuncInput holds the input parameters that are passed to the custom rule function RuleFunc.
type RuleFuncInput struct {
    // Rule specifies the validation rule string, like "required", "between:1,100", etc.
    Rule string

    // Message specifies the custom error message or the configured i18n message for this rule.
    Message string

    // Value specifies the value for this rule to validate.
    Value *gvar.Var

    // Data specifies the `data` which is passed to the Validator. It might be a type of map/struct or a nil value.
    // You can ignore the parameter `Data` if you do not really need it in your custom validation rule.
    Data *gvar.Var
}

// RuleFunc is the custom function for data validation.
type RuleFunc func(ctx context.Context, in RuleFuncInput) error
```

Parameters Explanation:

1. The context parameter `ctx` is mandatory.
2. `RuleFuncInput` data structure description:
   - `Rule` represents the current validation rule, including the parameters of the rule, such as: `required`, `between:1,100`, `length:6`, etc.
   - `Message` parameter indicates the validation error message returned after the validation fails.
   - `Value` parameter indicates the data value being validated, noting that the type is a `*gvar.Var` generic, so you can pass any type of parameter.
   - `Data` parameter indicates the argument passed during validation, for example, when validating a `map` or `struct`, it is often useful in combined validations. Note that this value is input at runtime and may be `nil`.

> By default, custom errors already support the `i18n` feature, so you only need to configure the `i18n` translation information according to `gf.gvalid.rule.customRuleName`. This information will be automatically retrieved from the `i18n` manager and passed to your registered custom validation method through the `Message` parameter when the validation fails.

### Global Validation Rule Registration

Custom rules are divided into two types: global rule registration and local rule registration.

Global rules are rules that take effect globally. Once registered, you can use custom rules for data validation whether you are using methods or objects.

Registration of validation methods:

```go
// RegisterRule registers custom validation rule and function for the package.
func RegisterRule(rule string, f RuleFunc) {
    customRuleFuncMap[rule] = f
}

// RegisterRuleByMap registers custom validation rules using a map for the package.
func RegisterRuleByMap(m map[string]RuleFunc) {
    for k, v := range m {
        customRuleFuncMap[k] = v
    }
}
```

You need to implement a validation method according to the `RuleFunc` type method definition, and then register it globally in the `gvalid` module using `RegisterRule`. This registration logic is often performed during program initialization. This method will be automatically called when validating data, and the method returns `nil` to indicate that the validation is passed; otherwise, it should return a non-empty `error` type value.

Note: The registration method for custom rules does not support concurrent calls. You need to register it when the program starts (for example, handle it in the `boot` package), and you cannot register it dynamically at runtime, otherwise, it will cause concurrency safety issues.

### Order ID Existence Validation

In e-commerce business, when we operate orders, we can verify whether the given order ID exists through custom rules, so we can register a global rule `order-exist` to implement it.

```go
package main

import (
    "context"
    "fmt"
    "github.com/gogf/gf/v2/database/gdb"
    "github.com/gogf/gf/v2/errors/gerror"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/util/gvalid"
    "time"
)

type Request struct {
    OrderId     int64 `v:"required|order-exist"`
    ProductName string
    Amount      int64
    // ...
}

func init() {
    rule := "order-exist"
    gvalid.RegisterRule(rule, RuleOrderExist)
}

func RuleOrderExist(ctx context.Context, in gvalid.RuleFuncInput) error {
    // SELECT COUNT(*) FROM `order` WHERE `id` = xxx
    count, err := g.Model("order").
        Ctx(ctx).
        Cache(gdb.CacheOption{
            Duration: time.Hour,
            Name:     "",
            Force:    false,
        }).
        WhereNot("id", in.Value.Int64()).
        Count()
    if err != nil {
        return err
    }
    if count == 0 {
        return gerror.Newf(`invalid order id "%d"`, in.Value.Int64())
    }
    return nil
}

func main() {
    var (
        ctx = gctx.New()
        req = &Request{
            OrderId:     65535,
            ProductName: "HikingShoe",
            Amount:      10000,
        }
    )
    err := g.Validator().CheckStruct(ctx, req)
    fmt.Println(err)
}
```

### User Uniqueness Rule

When registering a user, we often need to verify whether the name/account submitted by the current user is unique, so we can register a global rule `unique-name` to achieve this.

```go
package main

import (
    "context"
    "fmt"
    "github.com/gogf/gf/v2/database/gdb"
    "github.com/gogf/gf/v2/errors/gerror"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/util/gvalid"
    "time"
)

type User struct {
    Id   int
    Name string `v:"required|unique-name#Please input your name|The name is already token by others"`
    Pass string `v:"required|length:6,18"`
}

func init() {
    rule := "unique-name"
    gvalid.RegisterRule(rule, RuleUniqueName)
}

func RuleUniqueName(ctx context.Context, in gvalid.RuleFuncInput) error {
    var user *User
    if err := in.Data.Scan(&user); err != nil {
        return gerror.Wrap(err, `Scan data to user failed`)
    }
    // SELECT COUNT(*) FROM `user` WHERE `id` != xxx AND `name` != xxx
    count, err := g.Model("user").
        Ctx(ctx).
        Cache(gdb.CacheOption{
            Duration: time.Hour,
            Name:     "",
            Force:    false,
        }).
        WhereNot("id", user.Id).
        WhereNot("name", user.Name).
        Count()
    if err != nil {
        return err
    }
    if count > 0 {
        if in.Message != "" {
            return gerror.New(in.Message)
        }
        return gerror.Newf(`user name "%s" is already token by others`, user.Name)
    }
    return nil
}

func main() {
    var (
        ctx  = gctx.New()
        user = &User{
            Id:   1,
            Name: "john",
            Pass: "123456",
        }
    )
    err := g.Validator().CheckStruct(ctx, user)
    fmt.Println(err)
}
```

### Local Validation Rule Registration

Local rules are rules that only take effect under the current validation object and are registered in the current chain operation process rather than globally.

Registration methods:

```go
// RuleFunc registers one custom rule function to the current Validator.
func (v *Validator) RuleFunc(rule string, f RuleFunc) *Validator

// RuleFuncMap registers multiple custom rule functions to the current Validator.
func (v *Validator) RuleFuncMap(m map[string]RuleFunc) *Validator
```

A brief introduction:

- The `RuleFunc` method is used to register a single custom validation rule to the current object.
- The `RuleFuncMap` method is used to register multiple custom validation rules to the current object.

Usage example:

```go
package main

import (
    "context"
    "fmt"
    "github.com/gogf/gf/v2/database/gdb"
    "github.com/gogf/gf/v2/errors/gerror"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/util/gvalid"
    "time"
)

type Request struct {
    OrderId     int64
    ProductName string
    Amount      int64
    // ...
}

func RuleOrderExist(ctx context.Context, in gvalid.RuleFuncInput) error {
    // SELECT COUNT(*) FROM `order` WHERE `id` = xxx
    count, err := g.Model("order").
        Ctx(ctx).
        Cache(gdb.CacheOption{
            Duration: time.Hour,
            Name:     "",
            Force:    false,
        }).
        WhereNot("id", in.Value.Int64()).
        Count()
    if err != nil {
        return err
    }
    if count == 0 {
        return gerror.Newf(`invalid order id "%d"`, in.Value.Int64())
    }
    return nil
}

func main() {
    var (
    ctx = gctx.New()
    req = &Request{
        OrderId:     65535,
        ProductName: "HikingShoe",
        Amount:      10000,
        }
    )
    err := g.Validator().RuleFunc("order-exist", RuleOrderExist).Data(req).Run(ctx)  
    fmt.Println(err)
}
```
