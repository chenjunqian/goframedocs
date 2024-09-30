# Unit Testing- gtest

The `gtest` module provides simplified, lightweight, and commonly used methods for unit testing. It is an extension and wrapper based on the standard `testing` package, offering the following key features:

- Isolation of multiple test cases within a unit test.
- Addition of a series of commonly used assertion methods.
- Assertion methods support various common assertion formats, improving usability.
- Unified error message format when tests fail.

`gtest` is designed to be easy to use and can meet most unit testing scenarios. For more complex testing needs, consider third-party testing frameworks such as `testify` or `goconvey`.

## Usage

```go
import "github.com/gogf/gf/v2/test/gtest"
```

## API Documentation

You can refer to the official API documentation at:

[https://pkg.go.dev/github.com/gogf/gf/v2/test/gtest](https://pkg.go.dev/github.com/gogf/gf/v2/test/gtest)

## Functions

```go
func C(t *testing.T, f func(t *T))
func Assert(value, expect interface{})
func AssertEQ(value, expect interface{})
func AssertGE(value, expect interface{})
func AssertGT(value, expect interface{})
func AssertIN(value, expect interface{})
func AssertLE(value, expect interface{})
func AssertLT(value, expect interface{})
func AssertNE(value, expect interface{})
func AssertNI(value, expect interface{})
func Error(message ...interface{})
func Fatal(message ...interface{})
```

### Brief Description

- Use the `C` function to create a **Case**, which represents a unit test case. A single unit test function can contain multiple `C` calls. Each `C` represents a different possibility or condition for that method.
- The assertion method `Assert` supports the comparison of variables of any type. `AssertEQ` performs strict assertions by comparing both the value and type.
- For size comparison assertion methods such as `AssertGE`, the parameters support string and numeric comparisons, with string comparison being case-sensitive.
- The inclusion assertion methods `AssertIN` and `AssertNI` support slice type parameters, but do not currently support map type parameters.
- The package used for unit testing can either be named with `_test` as a suffix (e.g., `mypackage_test`), or the package name itself can be used. Both approaches are common, and examples exist in the official Go standard library. However, when testing private methods or variables, the package name form must be used. Also, when using the package name directly, methods intended only for unit testing (non-`Test*` methods) should be defined as private and not be exposed.

## Example Usage

### Example 1

Here's a unit test case from the `gstr` module:

```go
package gstr_test

import (
    "github.com/gogf/gf/v2/test/gtest"
    "github.com/gogf/gf/v2/text/gstr"
    "testing"
)

func Test_Trim(t *testing.T) {
    gtest.C(t, func(t *gtest.T) {
        t.Assert(gstr.Trim(" 123456\n "),      "123456")
        t.Assert(gstr.Trim("#123456#;", "#;"), "123456")
    })
}
```

### Example 2

Alternatively, you can write it as:

```go
package gstr_test

import (
    . "github.com/gogf/gf/v2/test/gtest"
    "github.com/gogf/gf/v2/text/gstr"
    "testing"
)

func Test_Trim(t *testing.T) {
    C(t, func() {
        Assert(gstr.Trim(" 123456\n "),      "123456")
        Assert(gstr.Trim("#123456#;", "#;"), "123456")
    })
}
```

## Notes on Unit Tests

A unit test case can contain multiple `C` calls, and each `C` can perform multiple assertions. If an assertion succeeds, it simply passes. However, if an assertion fails, an error message like the one below will be printed, and the current unit test case will stop executing (though other test cases will still continue to run):

```bash
=== RUN   Test_Trim
[ASSERT] EXPECT 123456#; == 123456
1. /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/text/gstr/gstr_z_unit_trim_test.go:20
2. /Users/john/Workspace/Go/GOPATH/src/github.com/gogf/gf/v2/text/gstr/gstr_z_unit_trim_test.go:18
--- FAIL: Test_Trim (0.00s)
FAIL
```
