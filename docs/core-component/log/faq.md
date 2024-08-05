# Log - FAQ

When we want to print `error` message, and it prints the `stack` information instead of the `error` information, we can use the following code:

```go
g.Log().Error(ctx, err)
```

If you want to print the `error` stack information, we can use the following code:

```go
g.Log().Errorf(ctx, "%+v", err)
```

Related link:

- <https://github.com/gogf/gf/issues/1640>
