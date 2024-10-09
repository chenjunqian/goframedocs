# HTTPClient - File Upload

`GoFrame` supports a very convenient form file upload feature, and the `HTTP` client has encapsulated and greatly simplified the upload functionality.

> Note: The size of the uploaded file is affected by the `ClientMaxBodySize` configuration of `ghttp.Server`: <https://pkg.go.dev/github.com/gogf/gf/v2/net/ghttp#ServerConfig>. The default upload file size supported is `8MB`.

## Server Side

On the server side, obtain the uploaded files through the `Request` object:

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
)

// Upload uploads files to /tmp.
func Upload(r *ghttp.Request) {
    files := r.GetUploadFiles("upload-file")
        names, err := files.Save("/tmp/")
        if err != nil {
            r.Response.WriteExit(err)
        }
    r.Response.WriteExit("upload successfully: ", names)
}

// UploadShow shows the upload single file page.
func UploadShow(r *ghttp.Request) {
    r.Response.Write(`
        <html>
        <head>
            <title>GF Upload File Demo</title>
        </head>
            <body>
                <form enctype="multipart/form-data" action="/upload" method="post">
                    <input type="file" name="upload-file" />
                    <input type="submit" value="upload" />
                </form>
            </body>
        </html>
        `)
}

// UploadShowBatch shows the upload multiple files page.
func UploadShowBatch(r *ghttp.Request) {
    r.Response.Write(`
        <html>
        <head>
            <title>GF Upload Files Demo</title>
        </head>
            <body>
                <form enctype="multipart/form-data" action="/upload" method="post">
                    <input type="file" name="upload-file" />
                    <input type="file" name="upload-file" />
                    <input type="submit" value="upload" />
                </form>
            </body>
        </html>
        `)
}

func main() {
    s := g.Server()
    s.Group("/upload", func(group *ghttp.RouterGroup) {
        group.POST("/", Upload)
        group.ALL("/show", UploadShow)
        group.ALL("/batch", UploadShowBatch)
    })
    s.SetPort(8199)
    s.Run()
}
```

This server provides three interfaces:

- `http://127.0.0.1:8199/upload/show` is used to display the H5 page for single file upload.
- `http://127.0.0.1:8199/upload/batch` is used to display the H5 page for multiple file uploads.
- `http://127.0.0.1:8199/upload` interface is used for actual form file uploads, which supports both single file and multiple file uploads.

Visit `http://127.0.0.1:8199/upload/show`, select the single file to upload, and after submission, you can see that the file has been successfully uploaded to the server.

***Key Code Explanation***

On the server side, we can obtain all uploaded file objects through `r.GetUploadFiles`, and we can also obtain a single uploaded file object through `r.GetUploadFile`.

In `r.GetUploadFiles("upload-file")`, the parameter "upload-file" is the form file name used in this example for the client-side upload. Developers can define it in the client according to the agreement with the front end to facilitate the server to receive the form file domain parameter.

Through `files.Save`, the uploaded multiple files can be conveniently saved to the specified directory and return the saved file names. If it is batch saving, as long as any one file save fails, it will immediately return an error. In addition, the second parameter of the `Save` method supports random automatic naming of uploaded files.

The route registered by `group.POST("/", Upload)` only supports `POST` method access.

## Client Side

### Single File Upload

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/glog"
)

func main() {
    var (
        ctx  = gctx.New()
        path = "/home/john/Workspace/Go/github.com/gogf/gf/v2/version.go"
    )
    result, err := g.Client().Post(ctx, "http://127.0.0.1:8199/upload", "upload-file=@file:"+path)
    if err != nil {
        glog.Fatalf(ctx, `%+v`, err)
    }
    defer result.Close()
    fmt.Println(result.ReadAllString())
}
```

Notice that the file upload parameter format uses the `parameter name=@file: file path`, and the HTTP client will automatically parse the file path corresponding to the file content and read and submit it to the server. The originally complex file upload operation is encapsulated and processed by `gf`, and users only need to use `@file:+file path` to form the parameter value. Please use the absolute path of the local file for the `file path`.

Run the server program first, and then run this upload client (note to modify the upload file path to the actual local file path), and after execution, you can see that the file has been successfully uploaded to the specified path on the server.

### Multiple File Upload

```go
package main

import (
    "fmt"

    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/glog"
)

func main() {
    var (
        ctx   = gctx.New()
        path1 = "/Users/john/Pictures/logo1.png"
        path2 = "/Users/john/Pictures/logo2.png"
    )
    result, err := g.Client().Post(
        ctx,
        "http://127.0.0.1:8199/upload", 
        fmt.Sprintf(`upload-file=@file:%s&upload-file=@file:%s`, path1, path2),
    )
    if err != nil {
        glog.Fatalf(ctx, `%+v`, err)
    }
    defer result.Close()
    fmt.Println(result.ReadAllString())
}
```

It can be seen that the multiple file upload submission parameter format is `parameter name=@file:xxx&parameter name=@file:xxx...`, and the format of `parameter name[]=@file:xxx&parameter name[]=@file:xxx...` can also be used.

Run the server program first, and then run this upload client (note to modify the upload file path to the actual local file path), and after execution, you can see that the files have been successfully uploaded to the specified path on the server.

## Custom File Name

It's very simple, just modify the `FileName` property.

```go
s := g.Server()
s.BindHandler("/upload", func(r *ghttp.Request) {
    file := r.GetUploadFile("TestFile")
    if file == nil {
        r.Response.Write("empty file")
        return
    }
    file.Filename = "MyCustomFileName.txt"
    fileName, err := file.Save(gfile.TempDir())
    if err != nil {
        r.Response.Write(err)
        return
    }
    r.Response.Write(fileName)
})
s.SetPort(8999)
s.Run()
```

## Standard Route Receiving Uploaded Files

If the server receives files through a standard route, it can obtain the uploaded files through structured parameters:

- The data type received by the parameter is `*ghttp.UploadFile`.
- If the interface documentation also needs to support the file type, then set the `type` to `file` type in the parameter label.
