# Type Convert

## Basic Introduction

The GoFrame framework provides a very powerful and easy-to-use type conversion package `gconv`, which can convert common data types into specified data types. It seamlessly facilitates conversions between common basic data types and also supports conversions from any type to struct objects. Since the `gconv` module internally uses assertions rather than reflection wherever possible, it is highly efficient in execution.

## Precautions

The primary goal of the `gconv` package is to offer convenient and efficient type conversion functionality. Developers should pay attention to the input parameters for conversion and the business scenario in which they are used. Some methods, if they fail to convert, do not return an error or cause a panic but instead return the value resulting from a failed conversion. Therefore, developers often need to judge the correctness of the results in combination with the return value and the business scenario.

## Usage

```go
import "github.com/gogf/gf/v2/util/gconv"
```

### Package Documentation

[GoDoc for gconv](https://pkg.go.dev/github.com/gogf/gf/v2/util/gconv)

### Method List

The method list may be outdated relative to the code, for detailed information, please refer to the package documentation.
