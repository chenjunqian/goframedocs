# JSON - Object Creation

The `GJSON` module not only supports creating JSON objects from basic JSON data formats but also allows creating JSON objects from commonly used data formats. The supported data formats include `JSON, XML, INI, YAML, TOML, and PROPERTIES`. Additionally, it supports creating JSON objects directly from struct objects.

## Object Creation Methods

The commonly used methods for object creation are `New` and `Load*`. For more methods, please refer to the [API Documentation](https://pkg.go.dev/github.com/gogf/gf/v2/encoding/gjson).

## Using the New Method

### Creating from JSON Data

```go
jsonContent := `{"name":"john", "score":"100"}`
j := gjson.New(jsonContent)
fmt.Println(j.Get("name"))
fmt.Println(j.Get("score"))
// Output:
// john
// 100
```

### Creating from XML Data

```go
jsonContent := `<?xml version="1.0" encoding="UTF-8"?><doc><name>john</name><score>100</score></doc>`
j := gjson.New(jsonContent)
// Note that there's a root node in the XML content.
fmt.Println(j.Get("doc.name"))
fmt.Println(j.Get("doc.score"))
// Output:
// john
// 100
```

### Creating from Struct Objects

```go
type Me struct {
    Name  string `json:"name"`
    Score int    `json:"score"`
}
me := Me{
    Name:  "john",
    Score: 100,
}
j := gjson.New(me)
fmt.Println(j.Get("name"))
fmt.Println(j.Get("score"))
// Output:
// john
// 100
```

### Custom Struct Conversion Tags

```go
type Me struct {
    Name  string `tag:"name"`
    Score int    `tag:"score"`
    Title string
}
me := Me{
    Name:  "john",
    Score: 100,
    Title: "engineer",
}
// The parameter <tags> specifies custom priority tags for struct conversion to map,
// multiple tags are joined with a comma ','.
j := gjson.NewWithTag(me, "tag")
fmt.Println(j.Get("name"))
fmt.Println(j.Get("score"))
fmt.Println(j.Get("Title"))
// Output:
// john
// 100
// engineer
```

## Using Load Methods

The most commonly used methods are `Load` and `LoadContent`. The former reads from a file path, while the latter creates a JSON object from given content. The methods automatically recognize the data format and parse it into a JSON object.

### Creating with the Load Method

#### From a JSON File

```go
jsonFilePath := gtest.DataPath("json", "data1.json")
j, _ := gjson.Load(jsonFilePath)
fmt.Println(j.Get("name"))
fmt.Println(j.Get("score"))
```

#### From an XML File

```go
jsonFilePath := gtest.DataPath("xml", "data1.xml")
j, _ := gjson.Load(jsonFilePath)
fmt.Println(j.Get("doc.name"))
fmt.Println(j.Get("doc.score"))
```

### Creating with LoadContent

```go
jsonContent := `{"name":"john", "score":"100"}`
j, _ := gjson.LoadContent(jsonContent)
fmt.Println(j.Get("name"))
fmt.Println(j.Get("score"))
// Output:
// john
// 100
```
