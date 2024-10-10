# WebSocket Service

Using the `GoFrame` framework for `WebSocket` development is quite straightforward. Below, we demonstrate the use of `GoFrame`'s `WebSocket` by implementing a simple `echo` server (the client is implemented using HTML5).

## HTML5 Client

First, here's the code for the `H5` client:

```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <title>gf websocket echo server</title>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
    <link rel="stylesheet" href="//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <script src="//cdn.bootcss.com/jquery/1.11.3/jquery.min.js"></script>
</head>
<body>
<div class="container">
    <div class="list-group" id="divShow"></div>
    <div>
        <div><input class="form-control" id="txtContent" autofocus placeholder="Please enter the content to send"></div>
        <div><button class="btn btn-default" id="btnSend" style="margin-top:15px">Send</button></div>
    </div>
</div>
</body>
</html>

<script type="application/javascript">
    // Display informational messages
    function showInfo(content) {
        $("<div class=\"list-group-item list-group-item-info\">" + content + "</div>").appendTo("#divShow")
    }
    // Display warning messages
    function showWarning(content) {
        $("<div class=\"list-group-item list-group-item-warning\">" + content + "</div>").appendTo("#divShow")
    }
    // Display success messages
    function showSuccess(content) {
        $("<div class=\"list-group-item list-group-item-success\">" + content + "</div>").appendTo("#divShow")
    }
    // Display error messages
    function showError(content) {
        $("<div class=\"list-group-item list-group-item-danger\">" + content + "</div>").appendTo("#divShow")
    }

    $(function () {
        const url = "ws://127.0.0.1:8199/ws";
        let ws  = new WebSocket(url);
        try {
            // WebSocket connection established successfully
            ws.onopen = function () {
                showInfo("WebSocket Server [" + url + "] connected successfully!");
            };
            // WebSocket connection closed
            ws.onclose = function () {
                if (ws) {
                    ws.close();
                    ws = null;
                }
                showError("WebSocket Server [" + url + "] connection closed!");
            };
            // WebSocket connection error
            ws.onerror = function () {
                if (ws) {
                    ws.close();
                    ws = null;
                }
                showError("WebSocket Server [" + url + "] connection closed!");
            };
            // WebSocket data return processing
            ws.onmessage = function (result) {
                showWarning(" > " + result.data);
            };
        } catch (e) {
            alert(e.message);
        }

        // Button click to send data
        $("#btnSend").on("click", function () {
            if (ws == null) {
                showError("WebSocket Server [" + url + "] connection failed, please refresh the page with F5!");
                return;
            }
            const content = $.trim($("#txtContent").val()).replace("/[\n]/g", "");
            if (content.length <= 0) {
                alert("Please enter the content to send!");
                return;
            }
            $("#txtContent").val("")
            showSuccess(content);
            ws.send(content);
        });

        // Trigger send click event with the Enter key
        $("#txtContent").on("keydown", function (event) {
            if (event.keyCode === 13) {
                $("#btnSend").trigger("click");
            }
        });
    })

</script>
```

Note that our server connection address here is: `ws://127.0.0.1:8199/ws`.

The client's functionality is quite simple, mainly implementing these features:

- Maintaining connection status with the server and displaying information;
- Inputting content on the interface and sending messages to the `WebSocket` server;
- Displaying messages received from the `WebSocket` server on the interface;

## WebSocket Server

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/gfile"
    "github.com/gogf/gf/v2/os/glog"
)

var ctx = gctx.New()

func main() {
    s := g.Server()
    s.BindHandler("/ws", func(r *ghttp.Request) {
        ws, err := r.WebSocket()
        if err != nil {
            glog.Error(ctx, err)
   r.Exit()
  }
        for {
            msgType, msg, err := ws.ReadMessage()
            if err != nil {
                return
            }
            if err = ws.WriteMessage(msgType, msg); err != nil {
                return
            }
        }
    })
    s.SetServerRoot(gfile.MainPkgPath())
    s.SetPort(8199)
    s.Run()
}
```

The server code is quite simple. Here are the key points to note:

- `WebSocket` Method: The `WebSocket` server route registration method is the same as the regular `HTTP` callback function registration method. However, in the interface processing, we need to convert the request to a `WebSocket` operation through `ghttp.Request.WebSocket` method (here we directly use the pointer object `r.WebSocket()`) and return a `WebSocket` object, which is used for subsequent `WebSocket` communication operations. Of course, if the client request is not a `WebSocket` operation, the conversion will fail, and this method will return an error message. Please pay attention to the `error` return value of the method when using it.

- `ReadMessage` & `WriteMessage`: Reading messages and writing messages correspond to `WebSocket` data reading and writing operations (`ReadMessage` & `WriteMessage`). Note that both of these methods have a `msgType` variable indicating the type of data requested for reading and writing, which are commonly either string data or binary data. Since both parties of the interface will agree on a unified data format, the reading and writing `msgType` are almost always consistent. Therefore, in this example, when returning messages, the data type parameter directly uses the `msgType` that was read.

## Https WebSocket

If you need to support `WebSocket` services over HTTPS, simply rely on the WebServer supporting HTTPS, and the `WebSocket` address accessed needs to use the `wss://` protocol. The WebSocket access address in the above client HTML5 page needs to be changed to: `wss://127.0.0.1:8199/wss`. Server example code:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/gfile"
    "github.com/gogf/gf/v2/os/glog"
)

var ctx = gctx.New()

func main() {
    s := g.Server()
    s.BindHandler("/wss", func(r *ghttp.Request) {
        ws, err := r.WebSocket()
        if err != nil {
            glog.Error(ctx, err)
   r.Exit()
  }
        for {
            msgType, msg, err := ws.ReadMessage()
            if err != nil {
                return
            }
            if err = ws.WriteMessage(msgType, msg); err != nil {
                return
            }
        }
    })
    s.SetServerRoot(gfile.MainPkgPath())
    s.EnableHTTPS("../../https/server.crt", "../../https/server.key")
    s.SetPort(8199)
    s.Run()
}
```

## Example Result Display

We first execute the example code `main.go`, then visit the page [http://127.0.0.1:8199/](http://127.0.0.1:8199/), enter any request content, and submit it. Then, shut down the program on the server side. You can see that the page will display the submitted content information and immediately show changes in the `WebSocket` connection status. When the server is shut down, the client will also print the closure information in real-time.

## WebSocket Security Verification

`GoFrame`'s `WebSocket` module does not perform `origin` checks, which means that WebSocket allows complete cross-domain access under these conditions.

Security verification needs to be handled by the business layer and mainly includes the following aspects:

- `Origin` verification: The business layer needs to perform `origin` same-origin request verification before executing `r.WebSocket()`; or perform custom processing for request verification (if request submission parameters); if the verification fails, call `r.Exit()` to terminate the request.
- `WebSocket` communication data verification: Data communication often has some custom data structures, and authentication processing logic is added to these communication data.

## WebSocket Client

```go
package main

import (
    "crypto/tls"
    "fmt"
    "net/http"
    "time"

    "github.com/gogf/gf/v2/net/gclient"
    "github.com/gorilla/websocket"
)

func main() {
    client := gclient.NewWebSocket()
    client.HandshakeTimeout = time.Second    // Set timeout
    client.Proxy = http.ProxyFromEnvironment // Set proxy
    client.TLSClientConfig = &tls.Config{}   // Set tls configuration

    conn, _, err := client.Dial("ws://127.0.0.1:8199/ws", nil)
    if err != nil {
        panic(err)
    }
    defer conn.Close()

    err = conn.WriteMessage(websocket.TextMessage, []byte("hello word"))
    if err != nil {
        panic(err)
    }

    mt, data, err := conn.ReadMessage()
    if err != nil {
        panic(err)
    }
    fmt.Println(mt, string(data))
}
```
