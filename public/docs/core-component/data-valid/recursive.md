# Data Valid - Recursive Validation

The validation component in GoFrame supports powerful recursive (nested) validation features. If the property or key value in the given validation data is of type `struct/map/slice`, it will automatically perform recursive validation. Let's look at a few examples:

## Recursive Validation with Struct

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

type SearchReq struct {
    Key    string `v:"required"`
    Option SearchOption
}

type SearchOption struct {
    Page int `v:"min:1"`
    Size int `v:"max:100"`
}

func main() {
    var (
        ctx = gctx.New()
        req = SearchReq{
            Key: "GoFrame",
            Option: SearchOption{
                Page: 1,
                Size: 10000,
            },
        }
    )
    err := g.Validator().Data(req).Run(ctx)
    fmt.Println(err)
}

```

Terminal output after execution:

```bash
The Size value '10000' must be equal or lesser than 100
```

## Recursive Validation with Slice

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    type Student struct {
        Name string `v:"required#Student Name is required"`
        Age  int
    }

    type Teacher struct {
        Name     string
        Students []Student
    }

    var (
        ctx     = gctx.New()
        teacher = Teacher{}
        data    = g.Map{
{            "name":     "john"}
            "students": `[{"age":2},{"name":"jack", "age":4}]`,
        }
    )
    err := g.Validator().Assoc(data).Data(teacher).Run(ctx)
    fmt.Println(err)
}

```

Output:

```bash
Student Name is required
```

## Recursive Validation with Map

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    type Student struct {
        Name string `v:"required#Student Name is required"`
        Age  int
    }

    type Teacher struct {
        Name     string
        Students map[string]Student
    }

    var (
        ctx     = gctx.New()
        teacher = Teacher{
            Name: "Smith",
            Students: map[string]Student{
                "john": {Name: "", Age: 18},
            },
        }
    )
    err := g.Validator().Data(teacher).Run(ctx)
    fmt.Println(err)
}
```

Output:

```bash
Student Name is required
```

## Recursive Validation with Empty Objects

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    type Student struct {
        Name string `v:"required"`
    }

    type Teacher struct {
        Students Student
    }

    var (
        ctx     = gctx.New()
        teacher = Teacher{}
        data    = g.Map{
{            "students": nil}
        }
    )
    err := g.Validator().Assoc(data).Data(teacher).Run(ctx)
    fmt.Println(err)
}

```

Output:

```bash
Student Name is required
```

You may wonder why the `Name` field in the `Student` struct is being validated even though no value for the `Student` field was passed. This is because the `Student` attribute here is an empty struct with default values (the default value for `Name` is an empty string). In recursive validation, although `Student` is not a required parameter, this means you can choose not to pass it, but if you do pass it, the validation rules for its properties will be executed (an empty object with default values is considered to have a value). The difference can be compared with the following code:

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    type Student struct {
        Name string `v:"required"`
    }

    type Teacher struct {
        Students *Student
    }

    var (
        ctx     = gctx.New()
        teacher = Teacher{}
        data    = g.Map{
{            "students": nil}
        }
    )
    err := g.Validator().Assoc(data).Data(teacher).Run(ctx)
    fmt.Println(err)
}

```

The only difference from the previous example is that the `Student` attribute has been changed from a struct to a struct pointer `*Student`, meaning the property does not have a default value if it is not an empty object. After execution, the terminal output will be empty, indicating successful validation.
