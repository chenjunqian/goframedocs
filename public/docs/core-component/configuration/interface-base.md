# Configuration - Interface-Base Design

The `gcfg` component adopts interface-based design to achieve high extensibility. Through the interface-based design, users can customize the how to read configuration, such as `etcd`, `zookeeper`, `consul`, `kubernetes configmap`, `apollo`, and so on.

## Interface Definition

<https://github.com/gogf/gf/blob/master/os/gcfg/gcfg_adaper.go>

```go
// Adapter is the interface for configuration retrieving.
type Adapter interface {
    // Available checks and returns the configuration service is available.
    // The optional parameter `resource` specifies certain configuration resource.
    //
    // It returns true if configuration file is present in default AdapterFile, or else false.
    // Note that this function does not return error as it just does simply check for backend configuration service.
    Available(ctx context.Context, resource ...string) (ok bool)

    // Get retrieves and returns value by specified `pattern`.
    Get(ctx context.Context, pattern string) (value interface{}, err error)

    // Data retrieves and returns all configuration data as map type.
    // Note that this function may lead lots of memory usage if configuration data is too large,
    // you can implement this function if necessary.
    Data(ctx context.Context) (data map[string]interface{}, err error)
}
```

## Interface Implementation

Use `SetAdapter` to implement the interface.

```go
// SetAdapter sets the adapter of current Config object.
func (c *Config) SetAdapter(adapter Adapter)
```

## Get Implementation

Use `GetAdapter` to get the adapter of current Config object.

```go
// GetAdapter returns the adapter of current Config object.
func (c *Config) GetAdapter() Adapter
```
