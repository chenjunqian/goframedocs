# Microservice - Configuration Management

## Basic Introduction

The GoFrame framework provides a configuration management component that is designed with decoupling and interface-based design principles. This allows it to easily integrate with various third-party configuration management centers. By default, the configuration management component offers an implementation based on local system files. For additional implementations, please refer to the community components: [Goframe Config Community Components](https://github.com/gogf/gf/tree/master/contrib/config).

The community components provide implementations for several commonly used configuration centers, including Polaris, Apollo, Nacos, Consul, and Kubernetes ConfigMap.

## Enabling the Component

The configuration management component is enabled through package initialization. Since the configuration management functionality is relatively low-level, it is essential to ensure that the community package is imported at the very top of the main package to avoid issues. Here, we take Polaris as an example. For usage instructions of the community component, refer to: [Polaris Documentation](https://github.com/gogf/gf/tree/master/contrib/config/polaris).

You need to provide a separate import package, for example, `boot`:

```go
package boot

import (
    "github.com/gogf/gf/contrib/config/polaris/v2"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func init() {
    var (
        ctx       = gctx.GetInitCtx()
        namespace = "default"
        fileGroup = "TestGroup"
        fileName  = "config.yaml"
        path      = "manifest/config/polaris.yaml"
        logDir    = "/tmp/polaris/log"
    )
    // Create Polaris Client that implements gcfg.Adapter.
    adapter, err := polaris.New(ctx, polaris.Config{
        Namespace: namespace,
        FileGroup: fileGroup,
        FileName:  fileName,
        Path:      path,
        LogDir:    logDir,
        Watch:     true,
    })
    if err != nil {
        g.Log().Fatalf(ctx, `%+v`, err)
    }
    // Change the adapter of the default configuration instance.
    g.Cfg().SetAdapter(adapter)
}
```

***Configuration Parameters***

- **Namespace**: Specifies the namespace in the Polaris configuration.
- **FileGroup**: Specifies the file group in Polaris.
- **FileName**: Specifies the name of the configuration file to be read in Polaris.
- **Path**: Specifies the server configuration for Polaris, including the connection address, listening address, and the path for component output logs.

***Sample Polaris Configuration File***

```yaml
global:
  serverConnector:
    addresses:
      - 127.0.0.1:8091
config:
  configConnector:
    addresses:
      - 127.0.0.1:8093
consumer:
  localCache:
    persistDir: "/tmp/polaris/backup"
```

Subsequently, import the `boot` package at the top of `main.go`, ensuring that this import is placed before all other components:

```go
package main

import (
    _ "github.com/gogf/gf/example/config/polaris/boot"
    
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
)

func main() {
    var ctx = gctx.GetInitCtx()
    
    // Available checks.
    g.Dump(g.Cfg().Available(ctx))
    
    // All key-value configurations.
    g.Dump(g.Cfg().Data(ctx))
    
    // Retrieve a certain value by key.
    g.Dump(g.Cfg().MustGet(ctx, "server.address"))
}
```

***Important Import Statement***

Note the import statement at the top:

```go
_ "github.com/gogf/gf/example/config/polaris/boot"
```

## Common Components

```markdown
| File      | Framework Built-in                                                            | Default Implementation                             |
|-----------|-------------------------------------------------------------------------------|----------------------------------------------------|
| Apollo    | [Apollo Link](https://github.com/gogf/gf/tree/master/contrib/config/apollo)   |                                                    |
| KubeCM    | [KubeCM Link](https://github.com/gogf/gf/tree/master/contrib/config/kubecm)   | Commonly used in container deployment environments |
| Nacos     | [Nacos Link](https://github.com/gogf/gf/tree/master/contrib/config/nacos)     |                                                    |
| Polaris   | [Polaris Link](https://github.com/gogf/gf/tree/master/contrib/config/polaris) |                                                    |
| Consul    | [Consul Link](https://github.com/gogf/gf/tree/master/contrib/config/consul)   |                                                    |
```

For more components, please refer to: [Goframe Config Documentation](https://github.com/gogf/gf/tree/master/contrib/config).

## Usage Example

For a usage example, refer to: [Polaris Usage Example](https://github.com/gogf/gf/tree/master/example/config/polaris).

### Running Polaris

You can run Polaris using the following Docker command:

```bash
docker run -d --name polaris -p 8080:8080 -p 8090:8090 -p 8091:8091 -p 8093:8093 loads/polaris-server-standalone:1.11.2
```

### Running the Example

Run the following command:

```bash
go run main.go 
```

***Expected Output***

The output will be:

```bash
true
{}
"failed to update local value: config file is empty"
panic: failed to update local value: config file is empty

goroutine 1 [running]:
github.com/gogf/gf/v2/os/gcfg.(*Config).MustGet(0x0?, {0x1c1c4f8?, 0xc0000c2000?}, {0x1ac11ad?, 0x0?}, {0x0?, 0xc000002340?, 0xc000064738?})
        /Users/john/Workspace/gogf/gf/os/gcfg/gcfg.go:167 +0x5e
main.main()
        /Users/john/Workspace/gogf/gf/example/config/polaris/main.go:20 +0x1b8
```

You can see that the final `MustGet` method execution results in an error because the specified namespace, configuration group, and configuration file are not defined in `Polaris`. Even if no data is found, it returns an error due to configuration issues. Since the `Must*` method is used here, it will directly panic on error instead of returning it.
