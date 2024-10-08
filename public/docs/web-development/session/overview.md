# Session

The `GoFrame` framework provides comprehensive `Session` management capabilities, implemented by the `gsession` component. Since the `Session` mechanism is most commonly used in HTTP services, the following sections will focus on introducing the use of `Sessions` with HTTP services as examples.

## Basic Introduction

For detailed interface documentation, please refer to: [gsession package](https://pkg.go.dev/github.com/gogf/gf/v2/os/gsession)

You can obtain the `Session` object at any time through `ghttp.Request`, as both `Cookies` and `Sessions` are related to request `sessions` and are therefore member objects of `Request`, exposed externally. The default expiration time for `Sessions` in the `GoFrame` framework is `24 hours`.

The `SessionId` is passed through Cookies by default and also supports the client passing the `SessionId` through Headers. The identification name of `SessionId` can be modified through `ghttp.Server`'s `SetSessionIdName`. Session operations are `concurrent-safe`, which is why the framework does not use direct map operations for Session data. In the HTTP request process, we can obtain the `Session` object through the `ghttp.Request` object and perform corresponding data operations.

Additionally, the `SessionId` in `ghttp.Server` is generated using the client's `RemoteAddr` + Header request information through the `guid` module, ensuring randomness and uniqueness: [ghttp_request.go](https://github.com/gogf/gf/blob/master/net/ghttp/ghttp_request.go)

## gsession Module

The `Session` management functionality is implemented by the independent `gsession` module and has been perfectly integrated into `ghttp.Server`. Since this module is decoupled and independent, it can be applied to many different scenarios, such as TCP communication, gRPC interface services, etc. There are three important objects/interfaces in the `gsession` module:

- `gsession.Manager`: Manages `Session` objects, Storage persistent storage objects, and expiration time control.
- `gsession.Session`: A single `Session` management object for managing `Session` parameters, data addition, deletion, querying, and modification operations.
- `gsession.Storage`: This is an interface definition for the persistent storage of `Session` objects, data writing/reading, and expiration updates. Developers can implement custom persistent storage features based on this interface. For more details on this interface definition, see: [gsession_storage.go](https://github.com/gogf/gf/blob/master/os/gsession/gsession_storage.go)

## Storage Implementation Methods

The `gsession` implements and provides four common `Session` storage implementation methods for developers:

- **StorageFile**: Based on file storage (default). An efficient persistent storage method for `single-node` deployment: [Session-File](/docs/web-development/session/file).
- **StorageMemory**: Based on pure memory storage. `Single-node` deployment with the highest performance, but it does not persist data, and data is lost upon restart: [Session-Memory](/docs/web-development/session/memory).
- **StorageRedis**: Based on `Redis` storage (Key-Value). Remote `Redis` node storage of `Session` data, supporting multi-node deployment of applications: [Session-Redis-KeyValue](/docs/web-development/session/redis-key-value).
- **StorageRedisHashTable**: Based on `Redis` storage (HashTable). Remote `Redis` node storage of `Session` data, supporting multi-node deployment of applications: [Session-Redis-HashTable](/docs/web-development/session/redis-hashtable).

Each method has its advantages and disadvantages, and detailed introductions can be found in the corresponding sections.

## Session Initialization

Taking a common HTTP request as an example, the Session object in `ghttp.Request` uses a "lazy initialization" design approach. By default, there is a Session attribute object in the Request, but it is not initialized (an empty object). Initialization is only performed when the methods of the Session attribute object are used. This design ensures both the execution performance of requests that do not use the Session feature and the ease of use of the component.

## Session Destruction and Cancellation

When a user's Session is no longer needed, such as when a user cancels their login status and needs to be hard deleted from storage, the `RemoveAll` method can be called.

```go
// Example of destroying a session
err := storage.RemoveAll(ctx, "session-id")
if err != nil {
    // handle error
}
```

This will completely remove the session data from the storage, effectively logging the user out and destroying their session.
