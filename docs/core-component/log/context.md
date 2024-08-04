# Log - Context

In `v2` version, `glog` require `ctx` context as a parameter to print log.

## Customize `CtxKeys`

Log component support print customize key value, and read it through `ctx` context.

### Config

```yaml
# 日志组件配置
logger:
  Level:   "all"
  Stdout:  true
  CtxKeys: ["RequestId", "UserId"]
```

The `CtxKeys` is used to configure the key names that need to be read from the `context.Context` interface object and output.

### Output Log

When print log, output the configured key value through `ctx` context.

```go
2024-01-17 21:12:12.182 [ERRO] {123456789, 10000} runtime error
Stack:
1.  main.main
    /Users/goframe/Workspace/gogf/gf/example/os/log/ctx_keys/main.go:13

```

## Handler

If you have customized log `Handler`, the log component will pass the `ctx` context to the `Handler` function.

## Chain Trace

`glog` component supports the `OpenTelemetry` standard for trace tracking, and this support is built-in, requiring no setup from developers.
