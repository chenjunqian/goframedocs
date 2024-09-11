# Template Engine - Variables

## Built-in Variables

For built-in variables in `WebServer`, please refer to the [Response Data - Template Parsing](/docs/core-component/response-data/template-parsing) section.

## Variable Objects

We can use custom objects in templates and access their properties or call their methods directly in the template.

```go
package main

import (
    "context"
    "github.com/gogf/gf/v2/frame/g"
)

type T struct {
    Name string
}

func (t *T) Hello(name string) string {
    return "Hello " + name
}

func (t *T) Test() string {
    return "This is test"
}

func main() {
    t := &T{"John"}
    v := g.View()
    content := `{{.t.Hello "there"}}, my name's {{.t.Name}}. {{.t.Test}}.`
    if r, err := v.ParseContent(context.TODO(), content, g.Map{"t": t}); err != nil {
        g.Dump(err)
    } else {
        g.Dump(r)
    }
}
```

In this example, the variables assigned to the template can be either object pointers or object variables. However, be aware of the object method definitions:  

- If the object is a pointer, only methods with a pointer receiver can be called.  
- If the object is a variable, only methods with a variable receiver can be called.

Output:

```bash
Hello there, my name's John. This is test.
```
