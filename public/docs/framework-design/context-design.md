# Process Shared Variables

`Context` refers to the standard library's `context.Context`, which is an interface object commonly used for asynchronous `I/O` control and the transmission of context process variables. This article will introduce how to use `Context` to pass shared variables between processes.

In the execution process of `Go`, especially in `HTTP`/`RPC` execution processes, there is no way to obtain request parameters through "global variables"; only the `Context` variable can be passed to subsequent processes, and the `Context` variable contains all the shared variables that need to be passed. Moreover, the shared variables in this `Context` should be pre-agreed and are often stored in the form of object pointers.

Sharing variables through `Context` is very simple, and we will demonstrate how to pass and use common shared variables in a practical project through an example in a project.

## Structure Definition

The context object often stores some variables that need to be shared, and these variables are usually stored in a structured object for easy maintenance. For example, we define shared variables in the `model` context:

```go
const (
    ContextKey = "ContextKey"
)

type Context struct {
    Session *ghttp.Session 
    User    *ContextUser
    Data    g.Map
}

type ContextUser struct {
    Id       uint
    Passport string
    Nickname string
    Avatar   string
}
```

- `model.ContextKey` is a constant representing the key name stored in the `context.Context` for context variables. This key name is used to store/retrieve business-defined shared variables from the passed `context.Context` variable.

- The `Session` in the `model.Context` structure represents the current request's session object. In the `Goframe` , every `HTTP` request object has an empty session object, which is designed with lazy initialization and is only initialized when actual read/write operations are performed.

- The `User` in the `model.Context` structure represents the basic information of the currently logged-in user. It only contains data after the user logs in; otherwise, it is `nil`.

- The `Data` property in the `model.Context` structure is used to store custom KV (key-value) variables. Therefore, developers generally do not need to add custom key-value pairs to the `context.Context` context variable, but can directly use the `Data` property of the `model.Context` object.

## Logical Encapsulation

Since the `context` object is also related to business logic, we need to encapsulate the `context` variable through the service object to facilitate its use by other modules.

```go

var Context = new(contextService)

type contextService struct{}

func (s *contextService) Init(r *ghttp.Request, customCtx *model.Context) {
    r.SetCtxVar(model.ContextKey, customCtx)
}

func (s *contextService) Get(ctx context.Context) *model.Context {
    value := ctx.Value(model.ContextKey)
    if value == nil {
        return nil
    }
    if localCtx, ok := value.(*model.Context); ok {
        return localCtx
    }
        return nil
}

func (s *contextService) SetUser(ctx context.Context, ctxUser *model.ContextUser) {
    s.Get(ctx).User = ctxUser
}
```

## Context Variable Injection

The `context` variables must be injected into the request process at the very beginning of the request to facilitate calls by other methods. In `HTTP` requests, we can implement this using `Goframe`'s middleware. In `GRPC` requests, we can also use interceptors to achieve this. In the `service` layer's `middleware` management object, we can define it as follows:

```go
func (s *middlewareService) Ctx(r *ghttp.Request) {

    customCtx := &model.Context{
        Session: r.Session,
        Data:    make(g.Map),
    }

    service.Context.Init(r, customCtx)
    if userEntity := Session.GetUser(r.Context()); userEntity != nil {
        customCtx.User = &model.ContextUser{
            Id:       userEntity.Id,
            Passport: userEntity.Passport,
            Nickname: userEntity.Nickname,
            Avatar:   userEntity.Avatar,
        }
    }

    r.Assigns(g.Map{
        "Context": customCtx,
    })

    r.Middleware.Next()
}
```

This middleware initializes the objects shared by the user's execution process and stores them in the `context.Context` variable as a pointer type `*model.Context`. This way, any place that obtains this pointer can both access the data inside and directly modify the data inside.

In the case where there is stored information in the `Session` after the user logs in, the necessary shared user basic information will also be written into `*model.Context`.

## Context Variable Usage

Method Definition

By convention, the first input parameter of a method definition is often reserved for the context.Context type parameter to accept context variables, especially in service layer methods. For example:

```go
func (s *userService) Login(ctx context.Context, loginReq *define.UserServiceLoginReq) error {
    ...
}

func (s *contentService) GetList(ctx context.Context, r *define.ContentServiceGetListReq) (*define.ContentServiceGetListRes, error) {
    ...
}

func (s *replyService) Create(ctx context.Context, r *define.ReplyServiceCreateReq) error {
    ...
}
```

## Context Object Retrieval

You can pass the `context.Context` variable by encapsulating it in the following methods within the `service`. The `context.Context` variable can be obtained in the `Goframe` `HTTP` request through the `r.Context()` method. In `GRPC` requests, the first parameter of the executed method in the compiled pb file is always `context.Context`.

```go
service.Context.Get(ctx)
```

## Custom Key-Value

Set or retrieve custom `key-value` pairs in the following manner.

```go
// set key-value pair
service.Context.Get(ctx).Data[key] = value

......

// get key-value pair
service.Context.Get(ctx).Data[key]
```
