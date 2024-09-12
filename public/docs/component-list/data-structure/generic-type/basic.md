# Generic Type - Basic Usage

## Basic Usage

The following example demonstrates the basic usage of the `gvar` package in the GoFrame framework:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "fmt"
)

func main() {
    // Declare a variable of type g.Var
    var v g.Var

    // Set a value to the variable
    v.Set("123")

    // Retrieve the original value
    fmt.Println(v.Val())

    // Basic type conversions
    fmt.Println(v.Int())
    fmt.Println(v.Uint())
    fmt.Println(v.Float64())

    // Convert to slices
    fmt.Println(v.Ints())
    fmt.Println(v.Floats())
    fmt.Println(v.Strings())
}
```

After execution, the output will be:

```bash
123
123
123
123
[123]
[123]
[123]
```

## JSON Serialization and Deserialization

The `gvar.Var` container implements the standard library's JSON serialization and deserialization interfaces.

### Marshal

```go
package main

import (
    "encoding/json"
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    // Define a Student struct with fields of type g.Var
    type Student struct {
        Id     *g.Var
        Name   *g.Var
        Scores *g.Var
    }

    // Initialize the struct with values
    s := Student{
        Id:     g.NewVar(1),
        Name:   g.NewVar("john"),
        Scores: g.NewVar([]int{100, 99, 98}),
    }

    // Serialize the struct to JSON format
    b, _ := json.Marshal(s)
    fmt.Println(string(b))
}
```

After execution, the output will be:

```json
{"Id":1,"Name":"john","Scores":[100,99,98]}
```

### Unmarshal

```go
package main

import (
    "encoding/json"
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    // JSON data to be deserialized
    b := []byte(`{"Id":1,"Name":"john","Scores":[100,99,98]}`)

    // Define a Student struct with fields of type g.Var
    type Student struct {
        Id     *g.Var
        Name   *g.Var
        Scores *g.Var
    }

    // Initialize an empty struct
    s := Student{}

    // Deserialize the JSON data into the struct
    json.Unmarshal(b, &s)
    fmt.Println(s)
}
```

After execution, the output will be:

```bash
{1 john [100,99,98]}
```
