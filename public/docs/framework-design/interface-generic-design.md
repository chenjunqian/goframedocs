# Interface and Generic Design

## Overview

Interface design is a higher level of abstraction. The design of framework components uses interfaces as much as possible, rather than providing specific implementations. The biggest advantage of interface design is that it allows users to customize implementations to replace the underlying interface layer of components, achieving great flexibility and extensibility.

## Component Interface Design

The core components of the `Goframe` framework all adopt an interface-based design.

Most components use `Adapter` as the name of their interface layer, set the current interface implementation through the `SetAdapter` method, and obtain the current component's interface implementation object through the GetAdapter method. In addition, to improve usability, components also provide some default `Adapter` implementations for users to choose from.

For example, the `gsessin` in `Goframe`:

```go
// Storage is the interface definition for session storage.
type Storage interface {
 // New creates a custom session id.
 // This function can be used for custom session creation.
 New(ctx context.Context, ttl time.Duration) (sessionId string, err error)

 // Get retrieves and returns certain session value with given key.
 // It returns nil if the key does not exist in the session.
 Get(ctx context.Context, sessionId string, key string) (value interface{}, err error)

 // GetSize retrieves and returns the size of key-value pairs from storage.
 GetSize(ctx context.Context, sessionId string) (size int, err error)

 // Data retrieves all key-value pairs as map from storage.
 Data(ctx context.Context, sessionId string) (sessionData map[string]interface{}, err error)

 ......

}
```

## Interface and Generics

The interface design of components has high extensibility, but when it comes to practical implementation, generics need to be combined to achieve more flexible usage. Taking the `gsession` component as an example again, the return of parameters all uses generics, which can be converted to the corresponding data type as needed in project use.

### Enhancing Parameter Flexibility and Simplifying Usage Complexity

Without using generics, our interfaces would either provide methods of various types or return using the `interface{}` type, both of which are relatively complex to use. By uniformly returning through generic data types, the parameter type becomes more flexible, greatly reducing the complexity of usage.

```go
// Get retrieves session value with given key.
// It returns `def` if the key does not exist in the session if `def` is given,
// or else it returns nil.
func (s *Session) Get(key string, def ...interface{}) (value *gvar.Var, err error) {
    if s.id == "" {
        return nil, nil
    }
    if err = s.init(); err != nil {
        return nil, err
    }
    v, err := s.manager.storage.Get(s.ctx, s.id, key)
    if err != nil && err != ErrorDisabled {
        intlog.Errorf(s.ctx, `%+v`, err)
        return nil, err
    }
    if v != nil {
        return gvar.New(v), nil
    }
    if v = s.data.Get(key); v != nil {
        return gvar.New(v), nil
    }
    if len(def) > 0 {
        return gvar.New(def[0]), nil
    }
    return nil, nil
}
```

`gvar.Var`

```go
// Var is an universal variable type implementer.
type Var struct {
    value interface{} // Underlying value.
    safe  bool        // Concurrent safe or not.
}

```

### Uniform Usage, Shielding Low-Level Impact

For some complex interface scenarios, the underlying implementation of the interface may involve external storage and may also involve `serialization`/`deserialization` operations, which could change or lose data types. The use of generics can shield the impact of low-level implementation through a unified usage method. For example, in the following example, regardless of how the underlying `Session` implementation changes, the upper layer uses the generic `Scan` method to convert to the target object.

```go
func (s *Session) GetUser(ctx context.Context) *entity.User {
    customCtx := Context().Get(ctx)
    if customCtx != nil {
        v, _ := customCtx.Session.Get("keyword")
        if !v.IsNil() {
            var user *entity.User
            _ = v.Struct(&user)
            return user
        }
    }
    return &entity.User{}
}
```

Convert to the target object:

```go
var user *entity.User
_ = v.Struct(&user)
```

Although the framework provides generic design, it is not recommended to widely use generics in porject. The data structure design at the business layer, including interfaces and business model data structures, should be precise and definite.
