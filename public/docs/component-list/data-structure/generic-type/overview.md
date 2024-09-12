# Generic Type - GVar

## Introduction

`gvar` is a runtime generic implementation that enhances development convenience and efficiency with minimal runtime overhead. It supports various built-in data type conversions and can be used as an alternative to the `interface{}` type. Additionally, this type supports a concurrency-safe switch.

The framework also provides a `g.Var` data type, which is essentially an alias for the `gvar.Var` data type.

### Use Cases

- Situations where `interface{}` is typically used.
- Scenarios involving various data types that are not fixed.
- Cases where frequent data type conversion is required for variables.

### Usage

To use the `gvar` package, import it as follows:

```go
import "github.com/gogf/gf/v2/container/gvar"
```

### Documentation

For more detailed information, refer to the [API Documentation](https://pkg.go.dev/github.com/gogf/gf/v2/container/gvar).
