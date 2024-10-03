# Middleware/Interceptor - Common Questions

## How to Modify Request Parameters via Middleware

Before understanding how to modify request parameters, it's important to grasp some details about request parameter input: [Request Input](/docs/web-development/request).

### Custom Parameter Override

The simplest way to modify request parameters is by using ***custom parameters*** to override those submitted by the client. ***Custom parameters*** have the highest priority in parameter parsing, so when you retrieve request parameters in their `entirety` (not through a specific submission method), ***custom parameters*** are used to override parameters submitted by other methods. This modification method is quite common, especially when using standard routing, where receiving parameters is done through a struct object, which is converted from a full parameter retrieval.

However, if users retrieve parameters via `r.GetQuery` or `r.GetForm`, the custom parameter override will not work. But parameters obtained through `r.Get` or `r.GetRequest` can also achieve the effect of parameter override.

### Modifying Parameters for Specific Request Methods

You can also modify the original parameters in middleware by changing `r.URL.RawQuery` or `r.Body`, but after modification, you need to call `r.ReloadParams()` to indicate that the next time request parameters are retrieved, they will be re-parsed.

## Notes on Modifying Request Body via Middleware

A common issue encountered when modifying `r.Body` through middleware is that `r.Body` can only be read once, and subsequent reads will not retrieve any data. This is by design of the standard library `http.Request`. In the GoFrame framework's `ghttp.Request` object, it is possible to continuously read Body content through the framework's `GetBody`, `GetBodyString` methods.

However, if you directly read `r.Body` through the standard library `http.Request` object in middleware, it is recommended to reassign `r.Body` or wrap and reassign it with `io.NopCloser` to facilitate further reading of Body content by subsequent middleware or processes.
