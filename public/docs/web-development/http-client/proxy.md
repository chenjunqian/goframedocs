# HTTPClient - Proxy Setting

## Proxy Setting

When the HTTP client initiates a request, it can set the proxy server address `proxyURL`. This feature is implemented using the `SetProxy*` related methods. Proxies mainly support two forms: `http` and `socks5`, with formats `http://USER:PASSWORD@IP:PORT` or `socks5://USER:PASSWORD@IP:PORT` respectively.

## Method List

```go
func (c *Client) SetProxy(proxyURL string)
func (c *Client) Proxy(proxyURL string) *Client
```

Let's look at an example of setting `proxyURL` on the client.

## Normal Invocation Example

Using the `SetProxy` configuration method.

```go
client := g.Client()
client.SetProxy("http://127.0.0.1:1081") 
client.SetTimeout(5 * time.Second)
response, err := client.Get(gctx.New(), "https://api.ip.sb/ip") 
if err != nil {
    fmt.Println(err)
}
response.RawDump()
```

## Chaining Invocation Example

Using the `Proxy` chaining method.

```go
client := g.Client()
response, err := client.Proxy("http://127.0.0.1:1081").Get(gctx.New(),  "https://api.ip.sb/ip") 
if err != nil {
    fmt.Println(err)
}
fmt.Println(response.RawResponse())
```
