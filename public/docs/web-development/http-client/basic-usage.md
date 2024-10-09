# HTTPClient - Basic Usage

## Basic Usage

The most basic use of the `HTTP` client is to send requests through several method call operators that have the same name as the `HTTP` method. However, it is important to note that the result object returned needs to perform Close to prevent memory overflow. Let's look at a few simple examples of `HTTP` client requests.

### Sending a GET request and printing the return value

```go
if r, err := g.Client().Get(ctx, "https://goframe.org"); err != nil {
    panic(err)
}
defer r.Close()
fmt.Println(r.ReadAllString())
```

### Sending a GET request to download a remote file

```go
if r, err := g.Client().Get(ctx, "https://goframe.org/cover.png"); err != nil {
    panic(err)
}
defer r.Close()
gfile.PutBytes("/Users/john/Temp/cover.png", r.ReadAll())
```

For file download operations, downloading small files is very simple. It should be noted that if the remote file is relatively large, the server will return data in batches, thus requiring the client to send multiple `GET` requests. Each time, it requests the range length of the file batch through the `Header`. Interested students can study the related details on their own.

### Sending a POST request and printing the return value

```go
if r, err := g.Client().Post(ctx, "http://127.0.0.1:8199/form", "name=john&age=18"); err != nil {
    panic(err)
}
defer r.Close()
fmt.Println(r.ReadAllString())
```

When passing multiple parameters, users can use the `&` symbol to connect. Note that parameter values often need to be encoded by `gurl.Encode`.

### Sending a POST request with map type parameters and printing the return value

```go
if r, err := g.Client().Post(
    ctx, 
    "http://127.0.0.1:8199/form", 
    g.Map{
        "submit": "1",
        "callback": "http://127.0.0.1/callback?url=http://baidu.com", 
    }
)); err != nil {
    panic(err)
}
defer r.Close()
fmt.Println(r.ReadAllString())
```

When passing multiple parameters, users can use the `&` symbol to connect, or they can directly use a `map` (as mentioned earlier, any data type is supported, including `struct`).

### Sending a POST request with JSON data and printing the return value

```go
if r, err := g.Client().Post(
    ctx,
    "http://user.svc/v1/user/create", 
    `{"passport":"john","password":"123456","password-confirm":"123456"}`,
); err != nil {
    panic(err)
}
defer r.Close()
fmt.Println(r.ReadAllString())
```

It can be seen that it is very convenient to send `JSON` data requests through the ghttp client, and it can be submitted directly through the Post method. When the `ContentType` is not explicitly set, the client will automatically identify the parameter type and set the request's `Content-Type` to `application/json`.

***Sending a DELETE request and printing the return value***

```go
if r, err := g.Client().Delete(ctx, "http://user.svc/v1/user/delete/1", "10000"); err != nil {
    panic(err)
}
defer r.Close()
fmt.Println(r.ReadAllString())
```

## Bytes and Content Methods

Request methods suffixed with `Bytes` and `Content` are shortcut methods for directly obtaining the returned content. These methods will automatically read the content returned by the server and automatically close the request connection. The `*Bytes` method is used to obtain `[]byte` type results, and the `*Content` method is used to obtain `string` type results. It should be noted that if the request fails, the returned content will be empty.

***Sending a GET request and printing the return value***

```go
// Returns content of type []byte
content := g.Client().GetBytes(ctx, "https://goframe.org") 
// Returns content of type string
content := g.Client().GetContent(ctx, "https://goframe.org") 
```

***Sending a POST request and printing the return value***

```go
// Returns content of type []byte
content := g.Client().PostBytes(
    ctx,
    "http://user.svc/v1/user/create",  
    `{"passport":"john","password":"123456","password-confirm":"123456"}`,
)

// Returns content of type string
content := g.Client().PostContent(
    ctx,
    "http://user.svc/v1/user/create",  
    `{"passport":"john","password":"123456","password-confirm":"123456"}`,
)
```

## Var Method

Request methods suffixed with `Var` directly request and obtain HTTP interface results as a `g.Var` generic type, which facilitates subsequent type conversion, especially when converting request results to struct objects. This is often used when the server returns a format of JSON/XML, and the returned `g.Var` generic object can be automatically parsed as needed. In addition, if the request fails or the request result is empty, an empty `g.Var` generic object will be returned, which does not affect the conversion method call.

***Usage Example***

```go
type User struct {
    Id   int
    Name string
}

// Struct
var user *User
g.Client().GetVar(ctx, url).Scan(&user)

// Struct array
var users []*User
g.Client().GetVar(ctx, url).Scan(&users)
```
