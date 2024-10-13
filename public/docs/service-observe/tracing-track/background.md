# Service Tracing - Background Knowledge

## OpenTelemetry

The concept of `Distributed Tracing` was originally proposed by `Google` and has since matured with established protocol standards for reference. Currently, two influential open-source frameworks in the field of tracing are `OpenTracing`, open-sourced by `Netflix`, and `OpenCensus`, open-sourced by `Google`. Both frameworks boast significant developer communities. To form a unified technical standard, these two frameworks have merged to form the `OpenTelemetry` project, often abbreviated as "otel". For more details, refer to the `OpenTelemetry` project.

## Introduction to OpenTracing and OpenCensus

Therefore, our `tracing` technology solution adopts `OpenTelemetry` as the implementation standard. Here are some open-source `Golang` projects that implement the protocol standards:

- [OpenTelemetry Go](https://github.com/open-telemetry/opentelemetry-go)
- [OpenTelemetry Go Contrib](https://github.com/open-telemetry/opentelemetry-go-contrib)

Other third-party frameworks and systems (such as `Jaeger`, `Prometheus`, `Grafana`, etc.) will also interface with `OpenTelemetry` according to standardized specifications, significantly reducing the cost of system development and maintenance.

## Key Concepts

For semantic conventions, see the [OpenTelemetry Specification](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/api.md).

### TracerProvider

It is primarily responsible for creating `Tracers`, which usually requires a third-party distributed tracing management platform to provide specific implementations. By default, it is an empty `TracerProvider` (`NoopTracerProvider`). Although `Tracers` can be created, the internal logic for data transfer does not execute.

### Tracer

A `Tracer` represents a complete trace, composed of one or more `spans`. The following diagram shows an example of a `Tracer` composed of `8 spans`:

```bash
[Span A]  ←←←(the root span)
    |
+------+------+
|             |
[Span B]      [Span C] ←←←(Span C is a `ChildOf` Span A)
    |             |
[Span D]      +---+-------+
              |           |
          [Span E]    [Span F] >>> [Span G] >>> [Span H]
                                  ↑
                                  ↑
                                  ↑
                    (Span G `FollowsFrom` Span F)
```

The timeline representation is easier to understand:

––|–––––––|–––––––|–––––––|–––––––|–––––––|–––––––|–––––––|–> time

[Span A···················································]
[Span B··············································]
[Span D··········································]
[Span C········································]
[Span E·······]        [Span F··] [Span G··] [Span H··]

Usually, we create a `Tracer` like this:

```golang
gtrace.NewTracer(tracerName)
```

### Span

A `Span` is a basic element of a trace, representing an independent unit of work, such as a function call or an HTTP request. A `span` records the following basic elements:

- Service name (`operation name`)
- Start and end times of the service
- `Tags` in `K/V` format
- `Logs` in `K/V` format

### Attributes

`Attributes` are saved in the form of `key-value` pairs and are primarily used for querying and filtering the results of distributed tracing. For example: `http.method="GET", http.status_code=200`. The `key` must be a string, and the `value` can be a string, boolean, or numeric type. `Attributes` within a span are only visible to that span itself and are not passed to subsequent spans through `SpanContext`. Here's an example of setting `Attributes`:

```go
span.SetAttributes(
    label.String("http.remote", conn.RemoteAddr().String()),
    label.String("http.local", conn.LocalAddr().String()),
)
```

### Events

`Events` are similar to `Attributes`, also in the form of `key-value` pairs. Unlike `Attributes`, `Events` record the time when they are written, making them suitable for logging the occurrence of specific `events`. The `key` for an Event must be a string, but there is no restriction on the `value`'s type. For instance:

```go
span.AddEvent("http.request", trace.WithAttributes(
    label.Any("http.request.header", headers),
    label.Any("http.request.baggage", gtrace.GetBaggageMap(ctx)),
    label.String("http.request.body", bodyContent),
))
```

### SpanContext

`SpanContext` carries data for cross-service communication (`across processes`), mainly including:

- Sufficient information to identify the `span` in the system, such as: `span_id`, `trace_id`.
- `Baggage` - saves custom `K/V` data across services (`across processes`) for the entire trace. `Baggage`, similar to Attributes, is also in `K/V` format. Unlike `Attributes`:
  - The `key` and `value` must be strings.
  - `Baggage` is visible not only to the current span but also passed to all subsequent child spans via SpanContext. Use `Baggage` cautiously, as passing these `K/V` pairs in all spans can cause significant network and CPU overhead.

### Propagator

`Propagators` are used for end-to-end data encoding/decoding, such as data transfer from `Client` to `Server`. `TraceId`, `SpanId`, and `Baggage` also need to be managed through `propagators` for data transfer. Developers often do not need to be aware of `Propagators`, only developers of middleware/interceptors need to understand their function. The standard protocol implementation library of OpenTelemetry provides commonly used `TextMapPropagators` for common text data end-to-end transfer. Additionally, to ensure compatibility of transmitted data in `TextMapPropagators`, special characters should not be included. Refer to the [OpenTelemetry Specification](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/context/api-propagators.md) for details.

The `GoFrame` framework uses the following propagator objects through the `gtrace` module and sets them globally in `OpenTelemetry`:

```go
// defaultTextMapPropagator is the default propagator for context propagation between peers.
defaultTextMapPropagator = propagation.NewCompositeTextMapPropagator(
    propagation.TraceContext{},
    propagation.Baggage{},
)
```

## Supported Components

> All core components of `GoFrame` have fully supported the `OpenTelemetry` standard and automatically enabled the tracing feature, without the need for developers to explicitly call or be aware of it. In the absence of an injected external `TracerProvider`, the framework will use the default `TracerProvider`, which only automatically creates `TraceID` and `SpanID` to connect request logs without executing complex logic.

These include, but are not limited to, the following core components:

- **HTTP Client** (`gclient`): The `HTTP` client automatically enables the tracing feature. For specific usage examples, refer to the subsequent example sections.
- **HTTP Server** (`ghttp`): The `HTTP` server automatically enables the tracing feature. For specific usage examples, refer to the subsequent example sections.
- **gRPC Client** (`contrib/rpc/grpcx`): The `gRPC` client automatically enables the tracing feature. For specific usage examples, refer to the subsequent example sections.
- **gRPC Server** (`contrib/rpc/grpcx`): The `gRPC` server automatically enables the tracing feature. For specific usage examples, refer to the subsequent example sections.
- **Logging** (`glog`): The log content needs to inject the current request's `TraceId` to quickly locate the problem point through logs. This feature is implemented by the glog component, which requires developers to call the Ctx chain operation method to pass the `context.Context` variable to the current log output operation chain when outputting logs. Failure to pass the `context.Context` variable will result in the loss of `TraceId` in the log content.
- **ORM** (`gdb`): The execution of the database is an important link in the trace. The `ORM` component needs to deliver its own execution situation to the trace as part of the execution link.
- **NoSQL Redis** (`gredis`): The execution of `Redis` is also an important link in the trace. `Redis` needs to deliver its own execution situation to the trace as part of the execution link.

## Utilities

For the management of tracing features, some encapsulation is needed, mainly considering extensibility and ease of use. This encapsulation is implemented by the gtrace module. For more information, visit the [gtrace documentation](https://pkg.go.dev/github.com/gogf/gf/v2/net/gtrace).

## Reference Materials

- [OpenTracing](https://opentracing.io)
- [OpenCensus](https://opencensus.io)
- [OpenTelemetry](https://opentelemetry.io)
- [OpenTelemetry Specification](https://github.com/open-telemetry/opentelemetry-specification/tree/main/specification)
