# HTTPClient - Custom ContentType

## Example 1: Submitting a JSON Request

```go
g.Client().ContentJson().PostContent(ctx, "http://order.svc/v1/order", g.Map{
    "uid"         : 1,
    "sku_id"      : 10000,
    "amount"      : 19.99,
    "create_time" : "2020-03-26 12:00:00",
})
```

By calling the `ContentJson` chain operation method, the request will set the `Content-Type` to `application/json` and automatically encode the submission parameters as JSON:

```json
{"uid":1,"sku_id":10000,"amount":19.99,"create_time":"2020-03-26 12:00:00"}
```

## Example 2: Submitting an XML Request

```go
g.Client().ContentXml().PostContent(ctx, "http://order.svc/v1/order", g.Map{
    "uid"         : 1,
    "sku_id"      : 10000,
    "amount"      : 19.99,
    "create_time" : "2020-03-26 12:00:00",
})
```

By calling the `ContentXml` chain operation method, the request will set the `Content-Type` to `application/xml` and automatically encode the submission parameters as XML:

```xml
<doc><amount>19.99</amount><create_time>2020-03-26 12:00:00</create_time><sku_id>10000</sku_id><uid>1</uid></doc>
```

## Example 3: Custom ContentType

We can customize the `ContentType` of the client request through the `ContentType` method. If the given parameter is of type `string` or `[]byte`, the client will directly submit the parameter to the server; if it is another data type, the parameter will be automatically URL-encoded before being submitted to the server.

***Example 1***

```go
g.Client().ContentType("application/json").PostContent(
    ctx, 
    "http://order.svc/v1/order",  
    `{"uid":1,"sku_id":10000,"amount":19.99,"create_time":"2020-03-26 12:00:00"}`,
)
```

or

```go
g.Client().ContentType("application/json; charset=utf-8").PostContent(
    ctx, 
    "http://order.svc/v1/order",  
    `{"uid":1,"sku_id":10000,"amount":19.99,"create_time":"2020-03-26 12:00:00"}`,
)
```

The submitted parameters are as follows:

```json
{"uid":1,"sku_id":10000,"amount":19.99,"create_time":"2020-03-26 12:00:00"}
```

***Example 2***

```go
g.Client().ContentType("application/x-www-form-urlencoded; charset=utf-8").GetContent(
    ctx, 
    "http://order.svc/v1/order",  
    g.Map{
        "category" : 1,
        "sku_id"   : 10000,
    },
)
```

The submitted parameters are as follows:

```bash
category=1&sku_id=10000
```
