# Data Validation - Types

## Single Data Validation

We can validate a given variable as a complete parameter, which is referred to as single data validation. If the variable is a complex type like `Struct/Map`, and we need to validate its internal properties/key-value pairs, this will be introduced in later chapters. For single data validation, the data to be validated must be provided through the `Data` method, and the validation rules must be given by the `Rule` method. Single data validation is relatively simple; let's look at a few examples.

### Default Error Message

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var (
        ctx  = gctx.New()
        rule = "length:6,16"
    )

    if err := g.Validator().Rules(rule).Data("123456").Run(ctx); err != nil {
        fmt.Println(err.String())
    }
    if err := g.Validator().Rules(rule).Data("12345").Run(ctx); err != nil {
        fmt.Println(err.String())
    }
}
```

Output:

```bash
The value '12345' length must be between 6 and 16
```

### Custom Error Message

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var (
        ctx      = gctx.New()
        rule     = "integer|between:6,16"
        messages = "Please enter an integer|The parameter size is not correct"
        value    = 5.66
    )

    if err := g.Validator().Rules(rule).Messages(messages).Data(value).Run(ctx); err != nil {
        g.Dump(err.Map())
    }
}
```

Outout:

```json
{
    "integer": "Please enter an integer",
    "between": "The parameter size is not correct",
}
```

It can be seen that multiple rules and multiple custom error messages are separated by the `|` symbol. Note that the order of custom error messages corresponds to the order of multiple rules. The `messages` parameter supports not only the `string` type but also the `map[string]string` type. See the following example:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var (
        ctx      = gctx.New()
        rule     = "url|min-length:11"
        value    = "goframe.org"
        messages = map[string]string{
            "url":        "Please enter the correct URL address",
            "min-length": "The address length must be at least {min} characters",
        }
    )

    if err := g.Validator().Rules(rule).Messages(messages).Data(value).Run(ctx); err != nil {
        g.Dump(err.Map())
    }
}
```

Output:

```json
{
    "url": "Please enter the correct URL address",
}
```

### Custom Regular Expression

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var (
        ctx  = gctx.New()
        rule = `regex:\d{6,}|\D{6,}|max-length:16`
    )

    if err := g.Validator().Rules(rule).Data(`123456`).Run(ctx); err != nil {
        fmt.Println(err)
    }

    if err := g.Validator().Rules(rule).Data(`abcde6`).Run(ctx); err != nil {
        fmt.Println(err)
    }
}
```

Output:

```bash
The value 'abcde6' must be in regex of: \d{6,}|\D{6,}
```

## Struct Validation

The `Struct` validation often uses the following chain operation method:

```go
g.Validator().Data(object).Run(ctx)
```

### Tag Rule

Before introducing the `Struct` parameter type validation, let's explain the commonly used validation `tag` rules. The rules are as follows:

```text
[Attribute-Alias@]Validation-Rules[#][Error-Message]
```

- `Attribute alias` and `Error message` are **optional fields**, while `Validation rules` are **required fields**.
- `Attribute alias` is an optional field that specifies the alias used for the corresponding `struct` property during validation, and the alias will also be used in the returned `error` object after validation. This is particularly useful when processing request forms, as the names of form fields often do not match the names of `struct` properties. In most cases, there is no need to set an attribute alias; the default is to use the property name directly.
- `Validation rules` are the rules for the current property, and multiple validation rules should be combined using the `|` symbol, for example: `required|between:1,100`.
- `Error message` is an optional field that represents custom error message information, which overrides the default error message when the rule is validated.

### Tag Usage Example

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

type User struct {
    Uid   int    `v:"uid      @integer|min:1#|Please enter your user ID"`
    Name  string `v:"name     @required|length:6,30#Please enter your user name|User name length is illegal"`
    Pass1 string `v:"password1@required|password3"`
    Pass2 string `v:"password2@required|password3|same:Pass1#|Password format is illegal|The passwords do not match, please re-enter"`
}

func main() {
    var (
        ctx  = gctx.New()
        user = &User{
            Name:  "john",
            Pass1: "Abc123!@#",
            Pass2: "123",
        }
    )

    err := g.Validator().Data(user).Run(ctx)
    if err != nil {
        g.Dump(err.Items())
    }
}
```

You can see that we used the `gvalid tag` of `gvalid` when defining the `struct` to bind the validation rules and error message information. In this example, the `same:password1` rule has the same effect as using the `same:Pass1` rule. **That is to say, in data validation, you can use both the original `struct` property names and aliases. However, only aliases will be used in the returned results, which is also the main purpose of aliases.** In addition, when validating a `struct` object, you can also pass validation or error message parameters, which will override the corresponding parameters bound when the `struct` is defined.

The output result after executing the above example is:

```json
[
    {
        "uid": {
            "min": "Please enter your user ID"
        }
    },
    {
        "name": {
            "length": "User name length is illegal"
        }
    },
    {
        "password2": {
            "password3": "Password format is illegal"
        }
    },
]
```

### Map Rules

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    type User struct {
        Age  int
        Name string
    }
    var (
        ctx   = gctx.New()
        user  = User{Name: "john"}
        rules = map[string]string{
            "Name": "required|length:6,16",
            "Age":  "between:18,30",
        }
        messages = map[string]interface{}{
            "Name": map[string]string{
                "required": "Name cannot be empty",
                "length":   "Name length should be between {min} and {max} characters",
            },
            "Age": "Age should be between 18 and 30 years old",
        }
    )

    err := g.Validator().Rules(rules).Messages(messages).Data(user).Run(ctx)
    if err != nil {
        g.Dump(err.Maps())
    }
}
```

In the above example, the `Age` property will trigger the `required` rule due to the default value of `0`, so the `required` rule is not used here. Instead, the `between` rule is used for validation. After executing the example code, the terminal output is:

```json
{
    "Age": {
        "between": "Age should be between 18 and 30 years old"
    },
    "Name": {
        "length": "Name length should be between 6 and 16 characters"
    }
}
```

### Recursive Struct Validation

Support for recursive struct validation (nested validation) is available, meaning that if a property is also a struct (also supports nested structs with `embedded`), it will automatically perform recursive validation on that property. Usage example:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    type Pass struct {
        Pass1 string `v:"password1@required|same:password2#Please enter your password|The passwords you entered twice do not match"`
        Pass2 string `v:"password2@required|same:password1#Please re-enter your password|The passwords you entered twice do not match"`
    }
    type User struct {
        Pass
        Id   int
        Name string `valid:"name@required#Please enter your name"`
    }
    var (
        ctx  = gctx.New()
        user = &User{
            Name: "john",
            Pass: Pass{
                Pass1: "1",
                Pass2: "2",
            },
        }
    )
    err := g.Validator().Data(user).Run(ctx)
    g.Dump(err.Maps())
}
```

Or for properties that are nested structs (`embedded`) scenarios:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    type Pass struct {
        Pass1 string `v:"password1@required|same:password2#Please enter your password|The passwords you entered twice do not match"`
        Pass2 string `v:"password2@required|same:password1#Please re-enter your password|The passwords you entered twice do not match"`
    }
    type User struct {
        Id   int
        Name string `valid:"name@required#Please enter your name"`
        Pass Pass
    }
    var (
        ctx  = gctx.New()
        user = &User{
            Name: "john",
            Pass: Pass{
                Pass1: "1",
                Pass2: "2",
            },
        }
    )
    err := g.Validator().Data(user).Run(ctx)
    g.Dump(err.Maps())
}
```

After execution, the terminal output is:

```json
{
    "password1": {
        "same": "The passwords you entered twice do not match"
    },
    "password2": {
        "same": "The passwords you entered twice do not match"
    },
}
```

For more information on recursive validation, please refer to the section: Data Validation - [Recursive Validation](/docs/core-component/data-valid/recursive).

## Struct Association

To avoid confusion caused by the default values of structs, starting from `GoFrame v2.0`, we have added an `Assoc` method. This method is used for struct validation to strictly adhere to the given parameters instead of the struct's property values (avoiding the impact of default values of struct properties), while the validation rules will still automatically read the `gvalid` `tag` within the struct.

Example:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    type User struct {
        Name string `v:"required#Please enter your name"`
        Type int    `v:"required#Please select user type"`
    }
    var (
        ctx  = gctx.New()
        user = User{}
        data = g.Map{
        "name": "john",
    }
    )  
    err := g.Validator().Assoc(data).Data(user).Run(ctx)  
    if err != nil {
        g.Dump(err.Items())
    }
}
```

Output:

```bash
[
    {
        "Type": {
            "required": "Please select user type"
        }
    }
]
```

You can see that the `required` validation rule for the `Type` property in the struct was not affected by the default value and was executed with the expected validation check.

## Map Validation

### Default Error Messages

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var (
        ctx    = gctx.New()
        params = map[string]interface{}{
            "passport":  "",
            "password":  "123456",
            "password2": "1234567",
        }
        rules = map[string]string{
            "passport":  "required|length:6,16",
            "password":  "required|length:6,16|same:password2",
            "password2": "required|length:6,16",
        }
    )
    err := g.Validator().Rules(rules).Data(params).Run(ctx)
    if err != nil {
        g.Dump(err.Maps())
    }
}

```

After execution, the terminal output is:

```json
{
    "passport": {
        "required": "The passport field is required",
        "length":   "The passport value length must be between 6 and 16",
    },
    "password": {
        "same": "The password value '123456' must be the same as field password2",
    },
}
```

### Custom Error Messages

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var (
        ctx    = gctx.New()
        params = map[string]interface{}{
            "passport":  "",
            "password":  "123456",
            "password2": "1234567",
        }
        rules = map[string]string{
            "passport":  "required|length:6,16",
            "password":  "required|length:6,16|same:password2",
            "password2": "required|length:6,16",
        }
        messages = map[string]interface{}{
            "passport": "Account cannot be empty|Account length should be between {min} and {max}",
            "password": map[string]string{
                "required": "Password cannot be empty",
                "same":     "The two passwords do not match",
            },
        }
    )

    err := g.Validator().Messages(messages).Rules(rules).Data(params).Run(ctx)
    if err != nil {
        g.Dump(err.Maps())
    }
}

```

This example also demonstrates two types of data for custom error message passing: `string` or `map[string]string`. The `map[string]string` type parameter requires specifying the error message for the corresponding field and rule, which is a two-dimensional "associative array". After execution, the terminal output is:

```json
{
    "passport": {
        "length": "Account length should be between 6 and 16",
        "required": "Account cannot be empty"
    },
    "password": {
        "same": "The two passwords do not match"
    }
}
```

Certainly! Here is the translation of the provided Chinese content from the GoFrame technical documentation into English, formatted in Markdown:

## Map Ordered Validation

### Overview

After running the previous example code multiple times, you may notice that the returned results are not sorted, and the order of the fields and rules output is completely random. Even if we use other methods such as `FirstItem`, `FirstString()` to obtain the validation results, the returned validation results are also not fixed. This is because the validation rules we pass are of the `map` type, and the `map` type in `golang` does not have order, so the results of the validation are as random as the rules, and the same validation method may return different results for the same validation result multiple times.

### Ordered Validation

Let's improve the above example: in the validation results, if the `required` is not satisfied, then return the corresponding error message, otherwise it is the subsequent validation error message; that is to say, the error messages returned should be consistent with the order in which I set the rules. As follows:

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var (
        ctx = gctx.New()
        params = map[string]interface{}{
            "passport":  "",
            "password":  "123456",
            "password2": "1234567",
        }
        rules = []string{
            "passport@required|length:6,16#Account cannot be empty|Account length should be between {min} and {max}",
            "password@required|length:6,16|same:password2#Password cannot be empty|Password length should be between {min} and {max}|The two passwords do not match",
            "password2@required|length:6,16#",
        }
    )
    err := g.Validator().Rules(rules).Data(params).Run(ctx)
    if err != nil {
        fmt.Println(err.Map())
        fmt.Println(err.FirstItem())
        fmt.Println(err.FirstError())
    }
}

```

After execution, the terminal output is:

```bash
map[length:Account length should be between 6 to 16 required:Account cannot be empty]
passport map[length:Account length should be between 6 to 16 required:Account cannot be empty]
Account cannot be empty
```

It can be seen that, to satisfy the orderliness of the validation results, we only need to change the type of the `rules` parameter to `[]string`, and set it according to certain rules, and the `msgs` parameter can be defined in the `rules` parameter or passed separately (using the third parameter). For writing the validation rules in `rules`, please refer to the section Struct Validation - Basic Usage.
