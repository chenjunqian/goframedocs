# HTTPClient - Common Issues

## Should I Save and Reuse the Created gclient.Client Object?

Whether you create a `gclient.Client` object through the `g.Client` or `gclient.New` method, you should save and reuse this object instead of creating a new `Client` object each time. This practice improves efficiency, reduces resource usage, and is friendly to `garbage collection` (GC). The object has a built-in connection pool design that can fully manage a large number of short-lived connection requests. Since the `Client` object does not consume many resources, many developers may not pay much attention to this point.

When Should I Create a New `gclient.Client` Object Instead of Reusing One?

You can design each business module to manage and maintain its own `gclient.Client` object according to the decoupling design of the business module. Alternatively, when different scenarios require different `Client` configurations, you can create different `Clients` for use.

## Invalid Semicolon Separator in Query

Cause of the Problem

By default, semicolons (;) in form requests are illegal (they need to be `URL encoded`). For more details, please refer to the discussion: [GoLang GitHub Issue 25192](https://github.com/golang/go/issues/25192)

***Incorrect Example***

```bash
curl localhost:8000/Execute -d '{
    "Component": "mysql",
    "ResourceId": "cdb-gy6hm0ee",
    "Port": 6379,
    "SQL": "show databases;",
    "UserName": "root",
    "Password": ""
}'
```

***Corrected Example***

When submitting a request, it is necessary to specify the `ContentType`, for example, here it should be indicated that it is a `JSON` request.

```bash
curl -X POST -H "Content-Type: application/json" localhost:8000/Execute -d '{
    "Component": "mysql",
    "ResourceId": "cdb-gy6hm0ee",
    "Port": 6379,
    "SQL": "show databases;",
    "UserName": "root",
    "Password": ""
}'
```
