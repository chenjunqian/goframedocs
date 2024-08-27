# Template Engine - Customized Methods

## Introduction

The template engine can customize template functions and bind them globally to a specified view object. It is also possible to assign custom objects to templates and then call their encapsulated methods through the object.

## Usage Example

```go
package main

import (
    "context"
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
)

// A built-in function with parameters for testing
func funcHello(name string) string {
    return fmt.Sprintf(`Hello %s`, name)
}

func main() {
    // Bind a global template function
    g.View().BindFunc("hello", funcHello)

    // Pass arguments in the standard way
    parsed1, err := g.View().ParseContent(context.TODO(), `{{hello "GoFrame"}}`, nil)
    if err != nil {
        panic(err)
    }
    fmt.Println(string(parsed1))

    // Pass arguments through a pipeline
    parsed2, err := g.View().ParseContent(context.TODO(), `{{"GoFrame" | hello}}`, nil)
    if err != nil {
        panic(err)
    }
    fmt.Println(string(parsed2))
}
```

### Output Results

```bash
Hello GoFrame
Hello GoFrame
```
