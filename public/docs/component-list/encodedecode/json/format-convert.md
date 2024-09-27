# Json - Format Conversion

There are many methods for data format conversion. For specific details, please refer to the [interface documentation](https://pkg.go.dev/github.com/gogf/gf/v2/encoding/gjson).

It is important to note that there are several `Must*` conversion methods. These methods ensure that the data is converted to the specified format; otherwise, they will directly trigger a panic.

## Example

```go
data :=
`{
    "users" : {
        "count" : 1,
        "array" : ["John", "Ming"]
    }
}`
if j, err := gjson.DecodeToJson(data); err != nil {
    panic(err)
} else {
    fmt.Println("JSON:")
    fmt.Println(j.MustToJsonString())
    fmt.Println("======================")

    fmt.Println("XML:")
    fmt.Println(j.MustToXmlString())
    fmt.Println("======================")

    fmt.Println("YAML:")
    fmt.Println(j.MustToYamlString())
    fmt.Println("======================")

    fmt.Println("TOML:")
    fmt.Println(j.MustToTomlString())
}

// Output:
// JSON:
// {"users":{"array":["John","Ming"],"count":1}}
// ======================
// XML:
// <users><array>John</array><array>Ming</array><count>1</count></users>
// ======================
// YAML:
// users:
//     array:
//       - John
//       - Ming
//     count: 1
//
// ======================
// TOML:
// [users]
//   array = ["John", "Ming"]
//   count = 1.0
```

`gjson` supports converting JSON to other common data formats. Currently, it supports conversions between the following formats: `JSON, XML, INI, YAML/YML, TOML, PROPERTIES`, and `Struct` data formats.
