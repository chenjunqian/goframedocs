# Data Validation - Result

## Overview

Validation results are encapsulated within an `error` object, implemented internally with the `gvalid.Error` object. When data rule validation is successful, the validation method returns a `nil` result. When data rule validation fails, the returned object contains a structured hierarchical `map` that includes multiple fields, their rules, and corresponding error messages, facilitating precise error rule location by the receiver. The relevant data structure and methods documentation: [gvalid Package on pkg.go.dev](https://pkg.go.dev/github.com/gogf/gf/v2/util/gvalid)

```go
type Error interface {
    Code() gcode.Code
    Current() error
    Error() string
    FirstItem() (key string, messages map[string]error)
    FirstRule() (rule string, err error)
    FirstError() (err error)
    Items() (items []map[string]map[string]error)
    Map() map[string]error
    Maps() map[string]map[string]error
    String() string
    Strings() (errs []string)
}
```

You can understand this data structure with the following examples. We can obtain the original error information data structure `map` through the `Maps()` method. However, most of the time, we can conveniently retrieve specific error information using other methods from the `Error` interface.

> In most cases, we are not concerned with the specific validation rule that failed and can directly return all error information using the `Error/String` methods. The order of the results returned by most methods may vary depending on whether the validation rules are sequential or not.

**Explanation:**

You can obtain validation result values through various validation result methods. To provide developers with a comprehensive understanding, the following is a detailed explanation:

| Method | Description |
| --- | --- |
| `Code` | Common method. Implements the `gerror.Code` interface, and in the validation component, this method always returns the error code `gcode.CodeValidationFailed`. |
| `Error` | Common method. Implements the standard library's `error.Error` interface, obtaining a string of all validation errors. The internal logic is the same as the `String` method. |
| `Current` | Common method. Implements the `gerror.Current` interface, used to retrieve the first error object in the validation error. |
| `Items` | In sequential validation, it returns an array of validation errors in the order of validation rules. The sequential order is only valid during sequential validation; otherwise, the result is random. |
| `Map` | Returns the error rule and corresponding error information `map` from `FirstItem`. |
| `Maps` | Returns all error keys and their corresponding error rules and error information ( `map[string]map[string]error` ). |
| `String` | Returns all error information as a single string, with multiple rule error messages separated by a `;` symbol. The order is only valid when using sequential validation rules; otherwise, the result is random. |
| `Strings` | Returns all error information as a `[]string` type. The order is only valid when using sequential validation rules; otherwise, the result is random. |
| `FirstItem` | When there are multiple key/attribute validation errors, it is used to obtain the first key name and its corresponding error rule and error message. The order is only valid when using sequential validation rules; otherwise, the result is random. |
| `FirstRule` | Returns the first error rule and error message from `FirstItem`. The order is only valid when using sequential validation rules; otherwise, the result is random. |
| `FirstString` | Returns the first rule error message from `FirstRule`. The order is only valid when using sequential validation rules; otherwise, the result is random. |

## gerror Current Support

We can see that `gvalid.Error` implements the `Current() error` interface, so we can obtain its first error message through the `gerror.Current` method, which is very convenient when returning error information upon interface validation failure. Let's look at an example:

```go
package main

import (
    "github.com/gogf/gf/v2/errors/gerror"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/util/gvalid"
)

func main() {
    type User struct {
        Name string `v:"required#Please enter user name"`
        Type int    `v:"required|min:1#Please select user type"`
    }
    var (
        err  error
        ctx  = gctx.New()
        user = User{}
    )
    if err = g.Validator().Data(user).Run(ctx); err != nil {
        g.Dump(err.(gvalid.Error).Maps())
        g.Dump(gerror.Current(err))
    }
}
```

Here, `gerror.Current(err)` is used to obtain the first validation error message. After execution, the terminal output is:

```bashe
{
    "Name": {
        "required": "Please enter user name",
    },
    "Type": {
        "min": "Please select user type",
    },
}
"Please enter user name"
```

It should be noted that there are **sequential validations** and **non-sequential validations** during data validation, which will affect the result of obtaining the first error message. For more information on sequential and non-sequential validations, please refer to the following chapters.
