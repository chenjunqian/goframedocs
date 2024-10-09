# HTTPClient - Overview

## Basic Introduction

The `GoFrame` framework provides a powerful, convenient, and easy-to-use `HTTP client` implemented by the gclient component. The object can be created through the `gclient.New()` package method or through the `g.Client()` method call. It is recommended to use `g.Client()` for conveniently creating `HTTP client` objects. Since the `gclient.Client` internally encapsulates and extends the standard library's `http.Client` object, any features that `http.Client` supports are also supported by `gclient.Client`.

For a list of methods, see: [gclient package documentation](https://pkg.go.dev/github.com/gogf/gf/v2/net/gclient)

***Brief Explanation***

We can create a custom `HTTP client` object `Client` using `New`, and then use this object to make requests. The object uses a connection pool design underneath, so there is no `Close` method to close it. `HTTP client` objects can also be quickly created using the `g.Client()` shortcut method.

The client provides a series of methods named after HTTP methods. Calling these methods will initiate the corresponding HTTP method request. Commonly used methods are `Get` and `Post`, and `DoRequest` is the core request method that users can call to implement custom HTTP method requests.

The request returns a `*ClientResponse` object, through which you can obtain the corresponding return results. You can use `ReadAll`/`ReadAllString` methods to get the returned content. This object needs to be closed using the `Close` method to prevent memory overflow after use.

The `*Bytes` method is used to obtain the binary data returned by the server; if the request fails, it returns `nil`. The `*Content` method is used to request string result data; if the request fails, it returns an empty string. `Set*` methods are used for parameter settings of the `Client`.

The `*Var` method directly requests and obtains HTTP interface results as a generic type for easy conversion. If the request fails or the request result is empty, it will return an empty `g.Var` generic object, without affecting the conversion method call.

It can be seen that the data parameter `data` of the client's request parameters is of type `interface{}`, which means any data type can be passed. Common parameter data types are `string`/`map`; if the parameter is of type `map`, the parameter values will be automatically URL-encoded.

> Please use the given methods to create `Client` objects, and do not use `new(ghttp.Client)` or `&ghttp.Client{}` to create client objects, otherwise...

## Chaining Operations

The `GoFrame` framework's client supports convenient chaining operations. Common methods are as follows (the document method list may lag behind the source code; it is recommended to view the interface documentation or source code):

```go
func (c *Client) Timeout(t time.Duration) *Client
func (c *Client) Cookie(m map[string]string) *Client
func (c *Client) Header(m map[string]string) *Client
func (c *Client) HeaderRaw(headers string) *Client
func (c *Client) ContentType(contentType string) *Client
func (c *Client) ContentJson() *Client
func (c *Client) ContentXml() *Client
func (c *Client) BasicAuth(user, pass string) *Client
func (c *Client) Retry(retryCount int, retryInterval time.Duration) *Client
func (c *Client) Prefix(prefix string) *Client
func (c *Client) Proxy(proxyURL string) *Client
func (c *Client) RedirectLimit(redirectLimit int) *Client
func (c *Client) Dump(dump ...bool) *Client
func (c *Client) Use(handlers ...HandlerFunc) *Client
```

***Brief Explanation***

- `Timeout` method is used to set the timeout duration for the current request.
- `Cookie` method is used to set custom Cookie information for the current request.
- `Header*` methods are used to set custom Header information for the current request.
- `Content*` methods are used to set the `Content-Type` information for the current request and support automatic inspection and encoding of submission parameters based on this information.
- `BasicAuth` method is used to set HTTP Basic Auth verification information.
- `Retry` method is used to set the number of retries and the interval between retries when a request fails.
- `Proxy` method is used to set the HTTP access proxy.
- `RedirectLimit` method is used to limit the number of redirect jumps.
- `Dump` method is used to dump the request and response information, which can be handy for debugging.

## Return Object

`gclient.Response` is the return result object for HTTP corresponding requests, inheriting from `http.Response`, and all methods of `http.Response` can be used. In addition to this, the following methods are added:

```go
func (r *Response) GetCookie(key string) string
func (r *Response) GetCookieMap() map[string]string
func (r *Response) Raw() string
func (r *Response) RawDump()
func (r *Response) RawRequest() string
func (r *Response) RawResponse() string
func (r *Response) ReadAll() []byte
func (r *Response) ReadAllString() string
func (r *Response) Close() error
```

It is also important to note that the `Response` needs to be manually closed by calling the `Close` method. That is to say, regardless of whether you use the returned `Response` object or not, you need to assign the returned object to a variable and manually call its `Close` method for closing (often using `defer r.Close()`), otherwise, it will cause file handle overflow or memory overflow.

## Important Note

- The `ghttp` client defaults to disabling the `KeepAlive` feature and the verification of the server's `TLS` certificate. If you need to enable these, you can customize the client's `Transport` property.
- Advanced features such as ***connection pool*** parameter settings and ***connection proxy*** settings can also be implemented by customizing the client's `Transport` property, which inherits from the standard library's `http.Transport` object.
