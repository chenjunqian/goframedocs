# Json - FAQ

## Issue of Precision Loss for Large Numbers in JSON

### Problem Description

When handling large numbers in JSON using Goframe, you may encounter precision loss. For example, consider the following code:

```go
package main

import (
    "github.com/gogf/gf/v2/encoding/gjson"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    str := `{"Id":1492404095703580672,"Name":"Jason"}`
    strJson := gjson.New(str)
    g.Dump(strJson)
}
```

`Output`

After executing the above code, the output will be:

```bash
"{\"Id\":1492404095703580700,\"Name\":\"Jason\"}"
```

### Solution

To avoid this issue, you can use the `NewWithOptions` method to properly handle large numbers. Here’s the corrected code:

```go
package main

import (
    "github.com/gogf/gf/v2/encoding/gjson"
    "github.com/gogf/gf/v2/frame/g"
)

func main() {
    str := `{"Id":1492404095703580672,"Name":"Jason"}`
    strJson := gjson.NewWithOptions(str, gjson.Options{
        StrNumber: true,
    })
    g.Dump(strJson)
}
```

***Output***

The output after applying the solution will correctly show:

```bash
"{\"Id\":1492404095703580672,\"Name\":\"Jason\"}"
```

### Related Links

For more information, visit the following link: [Goframe Issue #1603](https://github.com/gogf/gf/issues/1603)
