# Debugging Functionality - gdebug

The `Goframe` framework provides extensive debugging functionality, implemented by the `gdebug` component.

> The term "debugging" here is mostly related to the development environment, including analysis of stack and call chain information, and often, the performance is not particularly high.

## Usage

```go
import "github.com/gogf/gf/v2/debug/gdebug"
```

## API Documentation

[https://pkg.go.dev/github.com/gogf/gf/v2/debug/gdebug](https://pkg.go.dev/github.com/gogf/gf/v2/debug/gdebug)

## Method List

```go
func BinVersion() string
func BinVersionMd5() string
func Caller(skip ...int) (function string, path string, line int)
func CallerDirectory() string
func CallerFileLine() string
func CallerFileLineShort() s
func CallerFilePath() string
func CallerFunction() string
func CallerPackage() string
func CallerWithFilter(filter string, skip ...int) (function string, path string, line int)
func FuncName(f interface{}) string
func FuncPath(f interface{}) string
func GoroutineId() int
func PrintStack(skip ...int)
func Stack(skip ...int) string
func StackWithFilter(filter string, skip ...int) string
func StackWithFilters(filters []string, skip ...int) string
func TestDataPath(names ...string) string
```

For those familiar with `PHP`, understanding these methods may be easier. Some methods here are quite similar to `PHP`'s "magic constants." For example:

- `CallerDirectory` corresponds to `__DIR__`
- `CallerFilePath` corresponds to `__FILE__`
- `CallerFunction` corresponds to `__FUNCTION__`
