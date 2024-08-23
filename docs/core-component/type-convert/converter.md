# Type Convert - Converter

## Introduction

Starting from version `v2.6.2` of the framework, the `Converter` feature is available, allowing developers to customize conversion methods for specific type conversions.

## Conversion Method Definition

A conversion method is defined as follows:

```go
func(T1) (T2, error)
```

`T1` must be a non-pointer type, and `T2` must be a pointer type. If the types are incorrect, registering the conversion method will result in an error.

> The input parameter (`T1`) must be a non-pointer object to ensure the safety of the input parameters and to avoid modifying them within the conversion method, which could lead to issues outside the scope.

## Registering Conversion Methods

To register a custom converter function, use the following function:

```go
// RegisterConverter registers a custom converter.
// It must be registered before using this custom converting feature.
// It is suggested to do this in the boot procedure of the process.
//
// Note:
//  1. The parameter `fn` must be defined as pattern `func(T1) (T2, error)`.
//     It will convert type `T1` to type `T2`.
//  2. The `T1` should not be a pointer type, but the `T2` should be a pointer type.
func RegisterConverter(fn interface{}) (err error)
```

## Struct Type Conversion

A common custom data structure conversion involves converting between structs. Here are two examples:

### Example Custom Struct Conversion

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/util/gconv"
)

type Src struct {
    A int
}

type Dst struct {
    B int
}

type SrcWrap struct {
    Value Src
}

type DstWrap struct {
 Value Dst
}

func SrcToDstConverter(src Src) (dst *Dst, err error) {
    return &Dst{B: src.A}, nil
}

func main() {
    // Register custom converter function.
    err := gconv.RegisterConverter(SrcToDstConverter)
    if err != nil {
        panic(err)
    }

    // Custom struct conversion.
    var (
        src = Src{A: 1}
        dst *Dst
    )
    err = gconv.Scan(src, &dst)
    if err != nil {
        panic(err)
    }

    fmt.Println("src:", src)
    fmt.Println("dst:", dst)

    // Custom struct attributes conversion.
    var (
        srcWrap = SrcWrap{Src{A: 1}}
        dstWrap *DstWrap
    )
    err = gconv.Scan(srcWrap, &dstWrap)
        if err != nil {
        panic(err)
    }

    fmt.Println("srcWrap:", srcWrap)
    fmt.Println("dstWrap:", dstWrap)
}
```

In this example, two scenarios of type conversion are demonstrated: custom struct conversion and automatic conversion of structs as attributes. The conversion method uses the general struct conversion method `gconv.Scan`, which automatically prefers custom conversion functions if available, otherwise it uses the default conversion logic.

After execution, the terminal output will be:

```bash
src: {1}
dst: &{1}
srcWrap: {{1}}
dstWrap: &{{1}}
```

### Example Using gconv ConvertWithRefer

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/util/gconv"
)

type Src struct {
    A int
}

type Dst struct {
    B int
}

type SrcWrap struct {
    Value Src
}

type DstWrap struct {
    Value Dst
}

func SrcToDstConverter(src Src) (dst *Dst, err error) {
    return &Dst{B: src.A}, nil
}

func main() {
    // Register custom converter function.
    err := gconv.RegisterConverter(SrcToDstConverter)
    if err != nil {
        panic(err)
    }

    // Custom struct conversion.
    var src = Src{A: 1}
    dst := gconv.ConvertWithRefer(src, Dst{})
    fmt.Println("src:", src)
    fmt.Println("dst:", dst)

    // Custom struct attributes conversion.
    var srcWrap = SrcWrap{Src{A: 1}}
    dstWrap := gconv.ConvertWithRefer(srcWrap, &DstWrap{})
    fmt.Println("srcWrap:", srcWrap)
    fmt.Println("dstWrap:", dstWrap)
}
```

The `gconv.ConvertWithRefer` method can also be used for type conversion, and it produces the same result as `gconv.Scan`.

## Alias Type Conversion

The Converter feature can also handle alias type conversions. Alias types are not limited to structs but can include basic types such as `int`, `string`, etc. Here are two examples:

### Example Alias Type Conversion

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/os/gtime"
    "github.com/gogf/gf/v2/util/gconv"
)

type MyTime = *gtime.Time

type Src struct {
    A MyTime
}

type Dst struct {
    B string
}

type SrcWrap struct {
    Value Src
}

type DstWrap struct {
    Value Dst
}

func SrcToDstConverter(src Src) (dst *Dst, err error) {
    return &Dst{B: src.A.Format("Y-m-d")}, nil
}

func main() {
    // Register custom converter function.
    err := gconv.RegisterConverter(SrcToDstConverter)
    if err != nil {
        panic(err)
    }

    // Custom struct conversion.
    var (
        src = Src{A: gtime.Now()}
        dst *Dst
    )
    err = gconv.Scan(src, &dst)
    if err != nil {
        panic(err)
    }

    fmt.Println("src:", src)
    fmt.Println("dst:", dst)

    // Custom struct attributes conversion.
    var (
        srcWrap = SrcWrap{Src{A: gtime.Now()}}
        dstWrap *DstWrap
    )
    err = gconv.Scan(srcWrap, &dstWrap)
    if err != nil {
        panic(err)
    }

    fmt.Println("srcWrap:", srcWrap)
    fmt.Println("dstWrap:", dstWrap)
}
```

The `type xxx = yyy` syntax is used for alias types, such as `*gtime.Time` in this case. Basic types like `int` and `string` do not require alias syntax.

After execution, the terminal output will be:

```bash
src: {2024-01-22 21:45:28}
dst: &{2024-01-22}
srcWrap: {{2024-01-22 21:45:28}}
dstWrap: &{{2024-01-22}}
```

### Example Using gconv ConvertWithRefer for Alias Types

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/os/gtime"
    "github.com/gogf/gf/v2/util/gconv"
)

type MyTime = *gtime.Time

type Src struct {
    A MyTime
}

type Dst struct {
    B string
}

type SrcWrap struct {
 Value Src
}

type DstWrap struct {
    Value Dst
}

func SrcToDstConverter(src Src) (dst *Dst, err error) {
    return &Dst{B: src.A.Format("Y-m-d")}, nil
}

func main() {
    // Register custom converter function.
    err := gconv.RegisterConverter(SrcToDstConverter)
    if err != nil {
        panic(err)
    }

    // Custom struct conversion.
    var src = Src{A: gtime.Now()}
    dst := gconv.ConvertWithRefer(src, &Dst{})
    fmt.Println("src:", src)
    fmt.Println("dst:", dst)

    // Custom struct attributes conversion.
    var srcWrap = SrcWrap{Src{A: gtime.Now()}}
    dstWrap := gconv.ConvertWithRefer(srcWrap, &DstWrap{})
    fmt.Println("srcWrap:", srcWrap)
    fmt.Println("dstWrap:", dstWrap)
}
```

Again, the `gconv.ConvertWithRefer` method produces the same result as `gconv.Scan`.
