# Template Engine - XSS

By default, the template engine in GoFrame does not apply HTML encoding to the output of all variables. This means that if not properly handled, it may result in XSS (Cross-Site Scripting) vulnerabilities.

Do not worry, the GoFrame framework has taken this into full consideration and provides developers with flexible configuration options to control whether to enable or disable automatic HTML escaping for variable output. This feature can be enabled or disabled through the `AutoEncode` configuration option or the `SetAutoEncode` method.

**Note**: This feature does not affect the built-in `include` function of templates.

## Usage Example

### Configuration File

```ini
[viewer]
    delimiters  =  ["${", "}"]
    autoencode  =  true
```

### Example Code

```go
package main

import (
    "context"
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    result, _ := g.View().ParseContent(context.TODO(), "Name: ${.name}", g.Map{
        "name": "<script>alert('john');</script>",
    })
    fmt.Println(result)
}
```

Output:

```bash
Name: &lt;script&gt;alert(&#39;john&#39;);&lt;/script&gt;
```
