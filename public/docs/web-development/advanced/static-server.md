# Static File Service

## Static File Service Configuration

By default, the `GoFrame` Server has the static file service functionality turned off. If developers configure a ***static file directory***, the static file service will automatically start.

The common configuration methods involved in the static file service are as follows:

```go
// Set HTTP server parameter - ServerRoot
func (s *Server) SetServerRoot(root string)

// Add a directory to search for static files, must provide the absolute path of the directory
func (s *Server) AddSearchPath(path string)

// Set HTTP server parameter - IndexFiles, default display files, such as: index.html, index.htm
func (s *Server) SetIndexFiles(index []string)

// Whether to allow displaying a list of files in the accessed directory
func (s *Server) SetIndexFolder(enabled bool)

// Add a mapping between URI and static directory
func (s *Server) AddStaticPath(prefix string, path string)

// Static file service master switch: whether to enable/disable static file service
func (s *Server) SetFileServerEnabled(enabled bool)

// Set URI rewrite rule
func (s *Server) SetRewrite(uri string, rewrite string)

// Set URI rewrite rules (batch)
func (s *Server) SetRewriteMap(rewrites map[string]string)
```

## Brief Introduction

- `IndexFiles` is a list of default file names to be searched when accessing a directory (searched in the order of the slice). If the searched file exists, the file content is returned; otherwise, the directory list is displayed (`SetIndexFolder` is true by default). The default `IndexFiles` are: index.html, index.htm.
- `SetIndexFolder` is used to set whether to display a list of files in the directory when a user accesses a file directory and does not find `IndexFiles` in the directory. By default, it is turned off.
- `SetServerRoot` is used to set the default static file directory that provides service. This directory will be automatically added to the first search path in `SearchPath`.
- `AddSearchPath` is used to add directories for static file searching. There can be multiple directories, and the priority search is executed in the order of file directory addition.
- `AddStaticPath` is used to add a mapping relationship between `URI` and directory path, allowing custom access URI rules for static file directories.
- `SetRewrite/SetRewriteMa`p is used for rewrite rule settings (similar to `nginx`'s `rewrite`). Strictly speaking, it is not only for static file service but also supports dynamic route registration `rewrites`.

> When setting the directory path for static file service, you can use absolute paths or relative paths. For example, setting the current running directory to provide static file service can use `SetServerRoot(".")`.
> Developers can set multiple file directories to provide static file services and can set the priority of directories and URIs. However, once the static service is turned off through `SetFileServerEnabled`, all access to static files/directories will be invalid.

## Example 1 Basic Usage

```go
package main

import "github.com/gogf/gf/v2/frame/g"

// Basic usage of the static file server
func main() {
    s := g.Server()
    s.SetIndexFolder(true)
    s.SetServerRoot("/Users/john/Temp")
    s.AddSearchPath("/Users/john/Documents")
    s.SetPort(8199)
    s.Run()
}
```

## Example 2 Static Directory Mapping

```go
package main

import "github.com/gogf/gf/v2/frame/g"

// Static file server, supports custom static directory mapping
func main() {
    s := g.Server()
    s.SetIndexFolder(true)
    s.SetServerRoot("/Users/john/Temp")
    s.AddSearchPath("/Users/john/Documents")
    s.AddStaticPath("/my-doc", "/Users/john/Documents")
    s.SetPort(8199)
    s.Run()
}
```

## Example 3 Static Directory Mapping with Priority Control

The priority of static directory mapping is controlled according to the precision of the bound `URI` (matched by depth first). The more precise the bound `URI` (depth-first matching), the higher the priority.

```go
package main

import "github.com/gogf/gf/v2/frame/g"

// Static file server, supports custom static directory mapping
func main() {
    s := g.Server()
    s.SetIndexFolder(true)
    s.SetServerRoot("/Users/john/Temp")
    s.AddSearchPath("/Users/john/Documents")
    s.AddStaticPath("/my-doc", "/Users/john/Documents")
    s.AddStaticPath("/my-doc/test", "/Users/john/Temp")
    s.SetPort(8199)
    s.Run()
}
```

Note: Accessing /my-doc/test has higher priority than /my-doc. Therefore, if there is a test directory under /Users/john/Documents (conflicting with the custom /my-doc/test), it will not be accessible.

## Example 4 URI Rewrite

`GoFrame`'s static file service supports rewriting any URI to a specified `URI` using the `SetRewrite/SetRewriteMap` methods.

Example: In the `/Users/john/Temp` directory, there are only two files, `test1.html` and `test2.html`.

```go
package main

import "github.com/gogf/gf/v2/frame/g"

func main() {
    s := g.Server()
    s.SetServerRoot("/Users/john/Temp")
    s.SetRewrite("/test.html", "/test1.html")
    s.SetRewriteMap(g.MapStrStr{
        "/my-test1": "/test1.html",
        "/my-test2": "/test2.html",
    })
    s.SetPort(8199)
    s.Run()
}
```

After execution:

- When we access `/test.html`, it is actually rewritten to `test1.html` and returns the content of that file.
- When we access `/my-test1`, it is actually rewritten to `test1.html` and returns the content of that file.
- When we access `/my-test2`, it is actually rewritten to `test2.html` and returns the content of that file.

## Example 5 Cross-Origin

```go
package main

import (
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/net/ghttp"
    "github.com/gogf/gf/v2/os/glog"
)

func beforeServeHook(r *ghttp.Request) {
    glog.Debugf(r.GetCtx(), "beforeServeHook [is file:%v] URI:%s", r.IsFileRequest(), r.RequestURI)
    r.Response.CORSDefault()
}

// Using hook to inject cross-origin configuration
func main() {
    s := g.Server()
    s.BindHookHandler("/*", ghttp.HookBeforeServe, beforeServeHook)
    s.SetServerRoot(".")
    s.SetFileServerEnabled(true)
    s.SetAddr(":8080")
    s.Run()
}
```
