# Json - Hierarchical Access

## Hierarchical Access

`gjson` supports hierarchical retrieval access to data content, with the default hierarchical separator being `"."`. This feature allows developers to flexibly access unknown data structure contents with ease.

### Example 1: Basic Usage

```go
func main() {
 data :=
  `{
    "users" : {
        "count" : 2,
        "list"  : [
            {"name" : "Ming", "score" : 60},
            {"name" : "John", "score" : 99.5}
        ]
    }
}`
 if j, err := gjson.DecodeToJson(data); err != nil {
  panic(err)
 } else {
  fmt.Println("John Score:", j.Get("users.list.1.score"))
 }
 // Output:
 // John Score: 99.5
}
```

As we can see, the `gjson.Json` object can flexibly retrieve corresponding variable information using hierarchical filtering functionality (e.g., `j.GetFloat32("users.list.1.score")`).

### Example 2: Custom Hierarchical Separator

```go
func main() {
 data :=
  `{
    "users" : {
        "count" : 2,
        "list"  : [
            {"name" : "Ming", "score" : 60},
            {"name" : "John", "score" : 99.5}
        ]
    }
}`
 if j, err := gjson.DecodeToJson(data); err != nil {
  panic(err)
 } else {
  j.SetSplitChar('#')
  fmt.Println("John Score:", j.Get("users#list#1#score"))
 }
 // Output:
 // John Score: 99.5
}
```

In this example, we can see that we can set our custom separator using the `SetSplitChar` method.

### Example 3: Handling Key Names with Hierarchical Separator

```go
func main() {
 data :=
  `{
        "users" : {
            "count" : 100
        },
        "users.count" : 101
    }`
 if j, err := gjson.DecodeToJson(data); err != nil {
  glog.Error(gctx.New(), err)
 } else {
  j.SetViolenceCheck(true)
  fmt.Println("Users Count:", j.Get("users.count"))
 }
 // Output:
 // Users Count: 101
}
```

After running this, the printed result is `101`. When the key name contains the “.” character, we can use `SetViolenceCheck` to set up conflict detection. The retrieval priority will follow: key name -> hierarchy, avoiding any ambiguity. However, when the conflict detection switch is enabled, the retrieval efficiency will decrease, and it is off by default.

## Important Notes

It is well known that in `Golang`, the `map/slice` type is actually a "reference type" (also known as "pointer type"). Therefore, when you modify the key-value pairs or index items of this type of variable, it will also modify the corresponding underlying data.

From an efficiency perspective, when certain retrieval methods of the `gjson` package return data types as `map/slice`, they do not perform value copying. Therefore, when you modify the returned data, it will also modify the underlying data of `gjson`.

```go
func main() {
    jsonContent := `{"map":{"key":"value"}, "slice":[59,90]}`
    j, _ := gjson.LoadJson(jsonContent)
    m := j.Get("map")
    mMap := m.Map()
    fmt.Println(mMap)

    // Change the key-value pair.
    mMap["key"] = "john"

    // It changes the underlying key-value pair.
    fmt.Println(j.Get("map").Map())

    s := j.Get("slice")
    sArray := s.Array()
    fmt.Println(sArray)

    // Change the value of specified index.
    sArray[0] = 100

    // It changes the underlying slice.
    fmt.Println(j.Get("slice").Array())

    // output:
    // map[key:value]
    // map[key:john]
    // [59 90]
    // [100 90]
}
```
