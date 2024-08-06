# Error - Function

This section will introduce some common functions of the `Goframe` `error` handling component, full error functions please refer: <https://pkg.go.dev/github.com/gogf/gf/v2/errors/gerror>

## Error Creation

**`New/Newf`**

Create an `error` object with error `message` and `stack` information.

```go
New(text string) error
Newf(format string, args ...interface{}) error
```

**`Wrap/Wrapf`**

Create an `error` object with error `message` and `stack` information.

```go
func Wrap(err error, text string) error
func Wrapf(err error, format string, args ...interface{}) error
```

**`NewSkip/NewSkipf`**

Create an `error` object with error `message` and ignore part of `stack` information (ignore from current method to top). This is an advanced function, nommaly not used.

```go
func NewSkip(skip int, text string) error
func NewSkipf(skip int, format string, args ...interface{}) error
```

## Error Code Function

```go
func NewCode(code int, text string) error
func NewCodef(code int, format string, args ...interface{}) error
func NewCodeSkip(code, skip int, text string) error
func NewCodeSkipf(code, skip int, format string, args ...interface{}) error
func WrapCode(code int, err error, text string) error
func WrapCodef(code int, err error, format string, args ...interface{}) error
```
