# Monitoring and Alerting - Built-in Metrics

## Basic Introduction

The framework includes built-in `Go` metrics that are disabled by default. They can be enabled manually by creating a `Provider` with the `otelmetric.WithBuiltInMetrics()` parameter.

```go
package main

import (
    "go.opentelemetry.io/otel/exporters/prometheus"

    "github.com/gogf/gf/contrib/metric/otelmetric/v2"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf/v2/os/gmetric"
)

const (
    instrument        = "github.com/gogf/gf/example/metric/basic"
    instrumentVersion = "v1.0"
)

var (
    meter = gmetric.GetGlobalProvider().Meter(gmetric.MeterOption{
        Instrument:        instrument,
        InstrumentVersion: instrumentVersion,
    })
    counter = meter.MustCounter(
        "goframe.metric.demo.counter",
        gmetric.MetricOption{
            Help: "This is a simple demo for Counter usage",
            Unit: "bytes",
        },
    )
)

func main() {
    var ctx = gctx.New()

    // Prometheus exporter to export metrics as Prometheus format.
    exporter, err := prometheus.New(
        prometheus.WithoutCounterSuffixes(),
        prometheus.WithoutUnits(),
    )
    if err != nil {
        g.Log().Fatal(ctx, err)
    }

    // OpenTelemetry provider.
    provider := otelmetric.MustProvider(
        otelmetric.WithReader(exporter),
        otelmetric.WithBuiltInMetrics(),
    )
    provider.SetAsGlobal()
    defer provider.Shutdown(ctx)

    // Counter.
    counter.Inc(ctx)
    counter.Add(ctx, 10)

    // HTTP Server for metrics exporting.
    otelmetric.StartPrometheusMetricsServer(8000, "/metrics")
}
```

After execution, visit <http://127.0.0.1:8000/metrics> to view the results.

```bash
# HELP goframe_metric_demo_counter This is a simple demo for Counter usage
# TYPE goframe_metric_demo_counter counter
goframe_metric_demo_counter{totel_scope_name="github.com/goqf/qf/example/metric/basic",otel_scope_version="v1.0"} 11

# HELP http_server_request_active Number of active server requests.
# TYPE http_server_request_active gauge
http_server_request_active{http_request_method="GET",http_route="/metrics",network_protocol_version="1.1",otel_scope_name="github.com/gogf/gf/v2/net/ghttp.Server",otel_scope_version="v2.6.4",server_address="127.0.0.1",server_port="8000",url_schema="http"} 1

# HELP http_server_request_body_size Incoming request bytes total.
# TYPE http_server_request_body_size counter
http_server_request_body_size{http_request_method="GET",http_route="/metrics",network_protocol_version="1.1",otel_scope_name="github.com/gogf/gf/v2/net/ghttp.Server",otel_scope_version="v2.6.4",server_address="127.0.0.1",server_port="8000",url_schema="http"} 0

# HELP otel_scope_info Instrumentation Scope metadata
# TYPE otel_scope_info gauge
otel_scope_info{otel_scope_name="github.com/goqf/gf/example/metric/basic",otel_scope_version="v1.0"} 1
otel_scope_info{otel_scope_name="github.com/goqf/gf/example/metric/basic",otel_scope_version="v1.0"} 1
otel_scope_info{otel_scope_name="github.com/gogf/gf/v2/net/ghttp.Server",otel_scope_version="v2.6.4"} 1

# HELP process_runtime_go_cgo_calls Number of cgo calls made by the current process
# TYPE process_runtime_go_cgo_calls gauge
process_runtime_go_cgo_calls{otel_scope_name="go.opentelemetry.io/contrib/instrumentation/runtime",otel_scope_version="0.49.0"} 1

# HELP process_runtime_go_gc_count Number of completed garbage collection cycles
# TYPE process_runtime_go_gc_count count
process_runtime_go_gc_count{otel_scope_name="go.opentelemetry.io/contrib/instrumentation/runtime",otel_scope_version="0.49.0"} 0

# HELP process_runtime_go_gc_pause_total_ns Cumulative nanoseconds in GC stop-the-world pauses since the program started
# TYPE process_runtime_go_gc_pause_total_ns counter
process_runtime_go_gc_pause_total_ns{otel_scope_name="go.opentelemetry.io/contrib/instrumentation/runtime",otel_scope_version="0.49.0"} 0

# HELP process_runtime_go_goroutines Number of goroutines that currently exist
# TYPE process_runtime_go_goroutines gauge
process_runtime_go_goroutines{otel_scope_name="go.opentelemetry.io/contrib/instrumentation/runtime",otel_scope_version="0.49.0"} 11

# HELP process_runtime_go_mem_heap_alloc Bytes of allocated heap objects
# TYPE process_runtime_go_mem_heap_alloc gauge
process_runtime_go_mem_heap_alloc{otel_scope_name="go.opentelemetry.io/contrib/instrumentation/runtime",otel_scope_version="0.49.0"} 1.645952e+06

# HELP process_runtime_go_mem_heap_idle Bytes in idle (unused) spans
# TYPE process_runtime_go_mem_heap_idle gauge
process_runtime_go_mem_heap_idle{otel_scope_name="go.opentelemetry.io/contrib/instrumentation/runtime",otel_scope_version="0.49.0"} 548864

# HELP process_runtime_go_mem_heap_inuse Bytes in in-use spans
# TYPE process_runtime_go_mem_heap_inuse gauge
process_runtime_go_mem_heap_inuse{otel_scope_name="go.opentelemetry.io/contrib/instrumentation/runtime",otel_scope_version="0.49.0"} 3.088384e+06

# HELP process_runtime_go_mem_heap_objects Number of allocated heap objects
# TYPE process_runtime_go_mem_heap_objects gauge
process_runtime_go_mem_heap_objects{otel_scope_name="go.opentelemetry.io/contrib/instrumentation/runtime",otel_scope_version="0.49.0"} 9669

# HELP process_runtime_go_mem_heap_released Bytes of idle spans whose physical memory has been returned to the OS
# TYPE process_runtime_go_mem_heap_released gauge
process_runtime_go_mem_heap_released{otel_scope_name="go.opentelemetry.io/contrib/instrumentation/runtime",otel_scope_version="0.49.0"} 548864

# HELP process_runtime_go_mem_heap_sys Bytes of heap memory obtained from the OS
# TYPE process_runtime_go_mem_heap_sys gauge
process_runtime_go_mem_heap_sys{otel_scope_name="go.opentelemetry.io/contrib/instrumentation/runtime",otel_scope_version="0.49.0"} 3.637248e+06

# HELP process_runtime_go_mem_live_objects Number of live objects is the number of cumulative Mallocs - Frees
# TYPE process_runtime_go_mem_live_objects gauge
process_runtime_go_mem_live_objects{otel_scope_name="go.opentelemetry.io/contrib/instrumentation/runtime",otel_scope_version="0.49.0"} 9669

# HELP process_runtime_go_mem_lookups Number of pointer lookups performed by the runtime
# TYPE process_runtime_go_mem_lookups counter
process_runtime_go_mem_lookups{otel_scope_name="go.opentelemetry.io/contrib/instrumentation/runtime",otel_scope_version="0.49.0"} 0

# HELP process_runtime_uptime Milliseconds since application was initialized
# TYPE process_runtime_uptime counter
process_runtime_uptime{otel_scope_name="go.opentelemetry.io/contrib/instrumentation/runtime",otel_scope_version="0.49.0"} 3128

# HELP target_info target metadata
# TYPE target_info gauge
target_info{service_name="unknown_service:_9go_build_github_com_gogf_gf_example_test",telemetry_sdk_language="go",telemetry_sdk_name="opentelemetry",telemetry_sdk_version="1.24.0"} 1
```

## Description of Built-in Metrics

***process.runtime.go.cgo.calls***

- **Type:** Counter
- **Description:** The number of cgo calls made by the current process.

***process.runtime.go.gc.count***

- **Type:** Counter
- **Description:** The number of completed GC (Garbage Collection) cycles.

***process.runtime.go.gc.pause_ns***

- **Type:** Histogram
- **Unit:** ns (nanoseconds)
- **Description:** The amount of time in nanoseconds that the application paused during GC stop-the-world events.

***process.runtime.go.gc.pause_total_ns***

- **Type:** Counter
- **Unit:** ns (nanoseconds)
- **Description:** The cumulative time in nanoseconds that the application has been paused for GC stop-the-world events since the program started.

***process.runtime.go.goroutines***

- **Type:** Gauge
- **Description:** The current number of goroutines running.

***process.runtime.go.lookups***

- **Type:** Counter
- **Description:** The number of pointer lookups executed by the runtime.

process.runtime.go.mem.heap_alloc

- **Type:** Gauge
- **Unit:** bytes
- **Description:** The number of bytes allocated and still in use on the heap.

***process.runtime.go.mem.heap_idle***

- **Type:** Gauge
- **Unit:** bytes
- **Description:** The number of bytes in the heap that are unused and available for use.

***process.runtime.go.mem.heap_inuse***

- **Type:** Gauge
- **Unit:** bytes
- **Description:** The number of bytes in the heap that are in use by live objects.

***process.runtime.go.mem.heap_objects***

- **Type:** Gauge
- **Description:** The number of allocated heap objects.

***process.runtime.go.mem.live_objects***

- **Type:** Gauge
- **Description:** The number of live objects (Mallocs - Frees).

***process.runtime.go.mem.heap_released***

- **Type:** Gauge
- **Unit:** bytes
- **Description:** The number of bytes of heap memory returned to the operating system.

***process.runtime.go.mem.heap_sys***

- **Type:** Gauge
- **Unit:** bytes
- **Description:** The number of bytes of heap memory obtained from the operating system.

***process.runtime.uptime***

- **Type:** Counter
- **Unit:** ms (milliseconds)
- **Description:** The number of milliseconds since the application was initialized.
