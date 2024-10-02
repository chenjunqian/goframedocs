# Standard Routing - Frequently Asked Questions

## Supporting Multiple HTTP Methods for the Same Interface

In standard routing, how can the same interface support multiple `HTTP Method` submission types?

Firstly, an interface should only do one thing, and `HTTP Method` is meaningful (for example, in `RESTful` interface style design). Supporting multiple `HTTP Method` types for an interface is usually a sign of a poor interface design, and it is recommended to re-examine the interface design.

There is generally no scenario where an `API` needs to bind multiple `HTTP Methods`. For instance, taking a user interface, a `CURD` interface in a `RESTful` implementation should have `4-5` API definitions to achieve different business logics. There might be the following `API` definitions for a `RESTful` interface:

```markdown
| Interface Name  | Method | Path          |
|-----------------|--------|---------------|
| Create User     | PUT    | /user         |
| List Users      | GET    | /user         |
| User Details    | GET    | /user/{uid}   |
| Update User     | POST   | /user/{uid}   |
| Delete User     | DELETE | /user/{uid}   |
```

If there is indeed a scenario where an interface needs to support multiple `HTTP Method`s, you can separate each `HTTP Method` in the method attribute of the Meta tag with an English comma, like this:

```go
type SaveReq struct {
 g.Meta `path:"/user/{uid}" method:"put,post" summary:"Save user" tags:"User Management"`
 Uid    int64  `dc:"User ID"`
 Name   string `dc:"Username"`
 // ...
}
```

## Using the Default Provided Response Structure to Return Only Arrays

How can you make the Data field return only arrays without specifying named key-value pairs when using the default provided Response structure?

You can use a type alias to achieve this.

**Source Code Location**: [gf/example/httpserver/response-with-json-array at master · gogf/gf](https://github.com/gogf/gf/tree/master/example/httpserver/response-with-json-array)

```json
{
  "code": 0,
  "data": [
    {"Id": 1, "Name": "john"},
    {"Id": 2, "Name": "smith"},
    {"Id": 3, "Name": "alice"},
    {"Id": 4, "Name": "katyusha"}
  ],
  "message": ""
}
```
