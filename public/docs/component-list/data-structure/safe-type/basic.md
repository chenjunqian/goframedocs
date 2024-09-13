# Safe Type - Basic Usage

Using the `gtype` concurrency-safe basic types is very straightforward. Here are some common methods, using the `gtype.Int` type as an example:

```go
func NewInt(value ...int) *Int
func (v *Int) Add(delta int) (new int)
func (v *Int) Cas(old, new int) bool
func (v *Int) Clone() *Int
func (v *Int) Set(value int) (old int)
func (v *Int) String() string
func (v *Int) Val() int
```

## Basic Usage

```go
package main

import (
    "github.com/gogf/gf/v2/container/gtype"
    "fmt"
)

func main() {
    // Create a concurrency-safe basic type object of type Int
    i := gtype.NewInt()

    // Set a value
    fmt.Println(i.Set(10))

    // Get the value
    fmt.Println(i.Val())

    // Subtract 1 from the value and return the new value
    fmt.Println(i.Add(-1))
}
```

After execution, the output is:

```bash
0
10
9
```

## JSON Serialization and Deserialization

All container types under the `gtype` module implement the standard library `JSON` serialization and deserialization interfaces.

### Marshal

```go
package main

import (
    "encoding/json"
    "fmt"
    "github.com/gogf/gf/v2/container/gtype"
)

func main() {
    type Student struct {
        Id     *gtype.Int
        Name   *gtype.String
        Scores *gtype.Interface
    }
    s := Student{
        Id:     gtype.NewInt(1),
        Name:   gtype.NewString("john"),
        Scores: gtype.NewInterface([]int{100, 99, 98}),
    }
    b, _ := json.Marshal(s)
    fmt.Println(string(b))
}
```

After execution, the output is:

```bash
{"Id":1,"Name":"john","Scores":[100,99,98]}
```

### Unmarshal

```go
package main

import (
    "encoding/json"
    "fmt"
    "github.com/gogf/gf/v2/container/gtype"
)

func main() {
    b := []byte(`{"Id":1,"Name":"john","Scores":[100,99,98]}`)
    type Student struct {
        Id     *gtype.Int
        Name   *gtype.String
        Scores *gtype.Interface
    }
    s := Student{}
    json.Unmarshal(b, &s)
    fmt.Println(s)
}
```

After execution, the output is:

```bash
{1 john [100,99,98]}
```
