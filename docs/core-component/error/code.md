# Error - Code

## Code Creation

### `NewCode/NewCodef`

Same with `New/Newf`, create an `error` object with error `message` and `code` information.

```go
NewCode(code gcode.Code, text ...string) error
NewCodef(code gcode.Code, format string, args ...interface{}) error
```

Example:

```go
func ExampleNewCode() {
    err := gerror.NewCode(gcode.New(10000, "", nil), "My Error")
    fmt.Println(err.Error())
    fmt.Println(gerror.Code(err))

    // Output:
    // My Error
    // 10000
}

func ExampleNewCodef() {
    err := gerror.NewCodef(gcode.New(10000, "", nil), "It's %s", "My Error")
    fmt.Println(err.Error())
    fmt.Println(gerror.Code(err).Code())

    // Output:
    // It's My Error
    // 10000
}
```

### `WrapCode/WrapCodef`

Same with `Wrap/Wrapf`, wrap an error object with `error` object with error `message` and `code` information, and error code parameter.

```go
WrapCode(code gcode.Code, err error, text ...string) error
WrapCodef(code gcode.Code, err error, format string, args ...interface{}) error
```

Example:

```go
func ExampleWrapCode() {
    err1 := errors.New("permission denied")
    err2 := gerror.WrapCode(gcode.New(10000, "", nil), err1, "Custom Error")
    fmt.Println(err2.Error())
    fmt.Println(gerror.Code(err2).Code())

    // Output:
    // Custom Error: permission denied
    // 10000
}

func ExampleWrapCodef() {
    err1 := errors.New("permission denied")
    err2 := gerror.WrapCodef(gcode.New(10000, "", nil), err1, "It's %s", "Custom Error")
    fmt.Println(err2.Error())
    fmt.Println(gerror.Code(err2).Code())

    // Output:
    // It's Custom Error: permission denied
    // 10000
}
```

### `NewCodeSkip/NewCodeSkipf`

Advanced function, nommaly not used. Same with `NewSkip/NewSkipf`, create an `error` object with error `message` and ignore part of `stack` information (ignore from current method to top), and error code parameter.

```go
func NewCodeSkip(code, skip int, text string) error
func NewCodeSkipf(code, skip int, format string, args ...interface{}) error
```

### Get error `Code`

```go
func Code(err error) gcode.Code
```

When the `error` without error code, the default error code is `gcode.CodeNil`

## Code Interface

`goframe` provide `gcode` component, uses interface-based design for high extensibility

```go
// Code is universal error code interface definition.
type Code interface {
    // Code returns the integer number of current error code.
    Code() int

    // Message returns the brief message for current error code.
    Message() string

    // Detail returns the detailed information of current error code,
    // which is mainly designed as an extension field for error code.
    Detail() interface{}
}
```

### Default Implementation

`goframe` provide default implementation `gcode.Code`, which can be created by `New/WithCode`.

```go
// New creates and returns an error code.
// Note that it returns an interface object of Code.
func New(code int, message string, detail interface{}) Code
```

Example:

```go
func ExampleNew() {
    c := gcode.New(1, "custom error", "detailed description")
    fmt.Println(c.Code())
    fmt.Println(c.Message())
    fmt.Println(c.Detail())

    // Output:
    // 1
    // custom error
    // detailed description
}
```

You can implement `gcode.Code` interface by yourself for custom error code.

## Error Handling

We recommand use `Detail` paramenter to expend the error code.

### Error Code Definition

```go
type BizCode struct {
    User User
    // ...
}

type User struct {
    Id   int
    Name string
    // ...
}
```

### Error Code Usage

Extending error codes in most scenarios requires the use of the `WithCode` method:

```go
// WithCode creates and returns a new error code based on given Code.
// The code and message is from given `code`, but the detail if from given `detail`.
func WithCode(code Code, detail interface{}) Code
```

Then, the custom extension can be used in the following way:

```go
code := gcode.WithCode(gcode.CodeNotFound, BizCode{
    User: User{
        Id:   1,
        Name: "John",
    },
})
fmt.Println(code)
```

### Rewrite Middleware

We apply the above custom error codes to the request return middleware, and the top-level business logic can also obtain the details corresponding to the error codes for further business processing. The data structure returned by the middleware can also be customized and rewritten, for example, the returned `code` field does not necessarily have to be an integer value and can be fully customized.

```go
func ResponseHandler(r *ghttp.Request) {
 r.Middleware.Next()
    // There's custom buffer content, it then exits current handler.
    if r.Response.BufferLength() > 0 {
        return
    }
    var (
        err  = r.GetError()
        res  = r.GetHandlerResponse()
        code = gerror.Code(err)
    )
    if code == gcode.CodeNil && err != nil {
        code = gcode.CodeInternalError
    }
    if detail, ok := code.Detail().(BizCode); ok {
        g.Log().Errorf(r.Context(), `error caused by user "%+v"`, detail.User)
    }
    r.Response.WriteJson(ghttp.DefaultHandlerResponse{
        Code:    gcode.CodeOK.Code(),
        Message: gcode.CodeOK.Message(),
        Data:    res,
    })
}
```

`goframe` will print `Detail` in log by default.

## Error Code Customization

When project requires more complex error code definitions, we can customize and implement our own error codes, simply by implementing the `gcode.Code` related interface.

Define structure and implement `gcode.code` interface:

```go
type BizCode struct {
    code    int
    message string
    detail  BizCodeDetail
}
type BizCodeDetail struct {
    Code     string
    HttpCode int
}

func (c BizCode) BizDetail() BizCodeDetail {
    return c.detail
}

func (c BizCode) Code() int {
    return c.code
}

func (c BizCode) Message() string {
    return c.message
}

func (c BizCode) Detail() interface{} {
    return c.detail
}

func New(httpCode int, code string, message string) gcode.Code {
    return BizCode{
        code:    0,
        message: message,
        detail: BizCodeDetail{
            Code:     code,
            HttpCode: httpCode,
        },
    }
}
```

Define error code:

```go
var (
    CodeNil      = New(200, "OK", "")
    CodeNotFound = New(404, "Not Found", "Resource does not exist")
    CodeInternal = New(500, "Internal Error", "An error occurred internally")
    // ...
)
```

## Built in Error Codes

`goframe` provide some common error code, please refer: <https://github.com/gogf/gf/blob/master/errors/gcode/gcode.go>

*Notes*: Error code `<1000` is reserved for internal use.
