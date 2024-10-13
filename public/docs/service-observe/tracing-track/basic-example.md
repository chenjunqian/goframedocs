# Service Tracing - Basic Example

## Single-Process Tracing

Single-process tracing refers to the call chain relationship between methods within a single process. This scenario does not involve distributed tracing and is relatively simple. Let's use this example as an entry point for our introduction. The example code is available at: [https://github.com/gogf/gf/tree/master/example/trace/inprocess](https://github.com/gogf/gf/tree/master/example/trace/inprocess).

## Root Span

A `root span` is the first `span` object in a trace. In single-process scenarios, it often needs to be created manually. Subsequent `spans` created within methods are considered child `spans` of this `root span`.

> In distributed architecture service communication scenarios, developers typically do not need to manually create `root spans`; instead, they are automatically created by client/server request interceptors.

Creating a tracer and generating a `root span`:

```go
func main() {
    const (
        serviceName = "otlp-http-client"
        endpoint    = "tracing-analysis-dc-hz.aliyuncs.com"
        path        = "adapt_******_******/api/otlp/traces"
    )

    var ctx = gctx.New()
    shutdown, err := otlphttp.Init(serviceName, endpoint, path)
    if err != nil {
        g.Log().Fatal(ctx, err)
    }
    defer shutdown()

    ctx, span := gtrace.NewSpan(ctx, "main")
    defer span.End()

    // Trace 1.
    user1 := GetUser(ctx, 1)
    g.Dump(user1)

    // Trace 2.
    user100 := GetUser(ctx, 100)
    g.Dump(user100)
}
```

The above code creates a `root span` and passes this `span` through the context to the `GetUser` method to continue the trace chain within that method.

## Span Creation Between Methods

```go
// GetUser retrieves and returns hard coded user data for demonstration.
func GetUser(ctx context.Context, id int) g.Map {
    ctx, span := gtrace.NewSpan(ctx, "GetUser")
    defer span.End()
    m := g.Map{}
    gutil.MapMerge(
        m,
        GetInfo(ctx, id),
        GetDetail(ctx, id),
        GetScores(ctx, id),
    )
    return m
}

// GetInfo retrieves and returns hard coded user info for demonstration.
func GetInfo(ctx context.Context, id int) g.Map {
    ctx, span := gtrace.NewSpan(ctx, "GetInfo")
    defer span.End()
    if id == 100 {
        return g.Map{
            "id":     100,
            "name":   "john",
            "gender": 1,
        }
    }
    return nil
}

// GetDetail retrieves and returns hard coded user detail for demonstration.
func GetDetail(ctx context.Context, id int) g.Map {
    ctx, span := gtrace.NewSpan(ctx, "GetDetail")
    defer span.End()
    if id == 100 {
        return g.Map{
            "site":  "https://goframe.org", 
            "email": "john@goframe.org",
        }
    }
    return nil
}

// GetScores retrieves and returns hard coded user scores for demonstration.
func GetScores(ctx context.Context, id int) g.Map {
    ctx, span := gtrace.NewSpan(ctx, "GetScores")
    defer span.End()
    if id == 100 {
        return g.Map{
            "math":    100,
            "english": 60,
            "chinese": 50,
        }
    }
    return nil
}
```

This example code demonstrates the transmission of link information between multiple levels of methods. Simply pass the `ctx` context variable as the first method parameter. Within the methods, we create/start a `span` using a fixed syntax:

```go
ctx, span := gtrace.NewSpan(ctx, "xxx")
defer span.End()
```

And we end a `span` using `defer` to record the `span`'s lifecycle (beginning and ending) information, which will be displayed in the link tracking system. The second parameter of the `gtrace.NewSpan` method, `spanName`, can be directly set to the method's name, making it easily identifiable in the link display.
