# Object Information - gstructs

## Basic Introduction

The `gstructs` component is used to easily retrieve information about structs.

This is a lower-level component, which is rarely used in general business development. However, it is often used when writing frameworks, foundational libraries, and middleware.

***Usage***

```go
import "github.com/gogf/gf/v2/os/gstructs"
```

***API Documentation***

[https://pkg.go.dev/github.com/gogf/gf/v2/os/gstructs](https://pkg.go.dev/github.com/gogf/gf/v2/os/gstructs)

## Common Methods

### Fields

**Description:**  
The `Fields` function returns the fields of the struct specified by the input parameter `in` in the form of a slice of `Field`.

**Format:**

```go
Fields(in FieldsInput) ([]Field, error)
```

**Example:**

```go
func main() {
    type User struct {
        Id   int
        Name string `params:"name"`
        Pass string `my-tag1:"pass1" my-tag2:"pass2" params:"pass"`
    }
    var user *User
    fields, _ := gstructs.Fields(gstructs.FieldsInput{
        Pointer:         user,
        RecursiveOption: 0,
    })

    g.Dump(fields)
}
```

**Output:**

```json
[
    {
        "Value":    "<int Value>",
        "Field":    {
            "Name":      "Id",
            "PkgPath":   "",
            "Type":      "int",
            "Tag":       "",
            "Offset":    0,
            "Index":     [0],
            "Anonymous": false
        },
        "TagValue": ""
    },
    {
        "Value":    {},
        "Field":    {
            "Name":      "Name",
            "PkgPath":   "",
            "Type":      "string",
            "Tag":       "params:\"name\"",
            "Offset":    8,
            "Index":     [1],
            "Anonymous": false
        },
        "TagValue": ""
    },
    {
        "Value":    {},
        "Field":    {
            "Name":      "Pass",
            "PkgPath":   "",
            "Type":      "string",
            "Tag":       "my-tag1:\"pass1\" my-tag2:\"pass2\" params:\"pass\"",
            "Offset":    24,
            "Index":     [2],
            "Anonymous": false
        },
        "TagValue": ""
    }
]
```

### TagMapName

**Description:**  
`TagMapName` retrieves tags from the struct specified by the `pointer` parameter and returns them as a `map[string]string`.

**Note:**

- The `pointer` parameter should be of type `struct` or `*struct`.
- Only exported fields (those with capitalized names) are returned.

**Format:**

```go
TagMapName(pointer interface{}, priority []string) (map[string]string, error)
```

**Example:**

```go
func main() {
    type User struct {
        Id   int
        Name string `params:"name"`
        Pass string `my-tag1:"pass1" my-tag2:"pass2" params:"pass"`
    }
    var user User
    m, _ := gstructs.TagMapName(user, []string{"params"})

    g.Dump(m)
}
```

**Output:**

```json
{
    "name": "Name",
    "pass": "Pass"
}
```
