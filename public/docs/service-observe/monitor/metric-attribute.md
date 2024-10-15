# Monitoring and Alerting - Metric Attributes

Metric attributes are used for high-level operations such as filtering, summarizing, and statistics in upper-layer metric usage. The monitoring and alerting component in the `GoFrame` framework provides three ways to inject attributes: `constant attributes`, `variable attributes`, and `global attributes`.

In `OpenTelemetry`, these are referred to as metric attributes, while in Prometheus, they are known as metric labels, but they convey the same meaning.

## Constant Attributes

`Constant attributes` are a set of fixed key-value pairs that can be bound to a `Meter` or directly to a metric object. If bound to a `Meter`, all metric objects created under that `Meter` will carry the attribute key-value pairs. If bound to a metric object, the attributes will only apply to that specific metric. Let's look at an example:

```go
package main

import (
    "context"

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
        Attributes: gmetric.Attributes{
            gmetric.NewAttribute("meter_const_attr_1", 1),
        },
    })
    counter = meter.MustCounter(
        "goframe.metric.demo.counter",
        gmetric.MetricOption{
            Help: "This is a simple demo for Counter usage",
            Unit: "bytes",
            Attributes: gmetric.Attributes{
                    gmetric.NewAttribute("metric_const_attr_1", 1),
            },
        },
    )
    observableCounter = meter.MustObservableCounter(
        "goframe.metric.demo.observable_counter",
        gmetric.MetricOption{
            Help: "This is a simple demo for ObservableCounter usage",
            Unit: "%",
            Attributes: gmetric.Attributes{
                    gmetric.NewAttribute("metric_const_attr_2", 2),
            },
        },
    )
)

func main() {
    var ctx = gctx.New()
    // Callback for observable metrics.
    meter.MustRegisterCallback(func(ctx context.Context, obs gmetric.Observer) error {
        obs.Observe(observableCounter, 10)
        return nil
    }, observableCounter)

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

In the example above, we specify constant attributes through the `Attributes` field in the `MeterOption` or `MetricOption` parameters when creating `Meter` or `Metric` objects.

After execution, access <http://127.0.0.1:8000/metrics> to see the results. You can observe that the constant attributes bound to the `Meter` have taken effect on both metrics, but the constant attributes bound to each metric only apply to the corresponding metric.

```bash
# HELP goframe_metric_demo_counter This is a simple demo for Counter usage
# TYPE goframe_metric_demo_counter counter
goframe_metric_demo_counter meter const attr 1="1",metric const attr 1="1",,otel_scope_name="github.com/gogf/gf/example/metric/basic",otel_scope_version="v1.0"} 11

# HELP software_metric_demo_observable_counter This is a simple demo for ObservableCounter usage
# TYPE goframe_metric_demo_observable_counter counter
goframe_metric_demo_observable_counter meter const attr 1="1",metric const attr 2="2"otel_scope_name="github.com/gogf/gf/example/metric/basic",otel_scope_version="v1.0"} 10

# HELP http_server_request_active Number of active server requests.
# TYPE http_server_request_active gauge
http:server_request_active{http_request_method="GET",http_route="/metrics",network_protocol_version="1.1",otel_scope_name="github.com/gogf/gf/v2/net/ghttp.Server",otel_scope_version="v2.6.4",server_address="127.0.0.1",server_port="8000",url_schema="http"} 1

# HELP http_server_request_body_size Incoming request bytes total.
# TYPE http_server_request_body_size counter
http_server_request_body_size{http_request_method="GET",http_route="/metrics",network_protocol_version="1.1",otel_scope_name="github.com/gogf/gf/v2/net/ghttp.Server",otel_scope_version="v2.6.4",server_address="127.0.0.1",server_port="8000",url_schema="http"} 0

# HELP otel_scope_info Instrumentation Scope metadata
# TYPE otel_scope_info gauge
otel_scope_info{otel_scope_name="github.com/gogf/gf/example/metric/basic",otel_scope_version="v1.0"} 1
otel_scope_info{otel_scope_name="github.com/gogf/gf/v2/net/ghttp.Server",otel_scope_version="v2.6.4"} 1

# HELP target_info Target metadata
# TYPE target_info gauge
target_info{service_name="unknown_service:__9go_build_github_com_goqf_gf_example_test",telemetry_sdk_language="go",telemetry_sdk_name="opentelemetry",telemetry_sdk_version="1.24.0"} 1
```

## Variable Attributes

`Variable attributes` are key-value pairs specified at metric runtime. They are typically determined at runtime and may vary depending on the execution scenario, hence the name `variable attributes`.

Here's an example:

```go
package main

import (
    "context"

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
        Attributes: gmetric.Attributes{
            gmetric.NewAttribute("meter_const_attr_1", 1),
        },
    })
    counter = meter.MustCounter(
        "goframe.metric.demo.counter",
        gmetric.MetricOption{
            Help: "This is a simple demo for Counter usage",
            Unit: "bytes",
            Attributes: gmetric.Attributes{
                    gmetric.NewAttribute("metric_const_attr_1", 1),
            },
        },
    )
    observableCounter = meter.MustObservableCounter(
        "goframe.metric.demo.observable_counter",
        gmetric.MetricOption{
            Help: "This is a simple demo for ObservableCounter usage",
            Unit: "%",
            Attributes: gmetric.Attributes{
                    gmetric.NewAttribute("metric_const_attr_2", 2),
            },
        },
    )
)

func main() {
    var ctx = gctx.New()
    // Callback for observable metrics.
    meter.MustRegisterCallback(func(ctx context.Context, obs gmetric.Observer) error {
        obs.Observe(observableCounter, 10, gmetric.Option{
            Attributes: gmetric.Attributes{
                    gmetric.NewAttribute("dynamic_attr_1", 1),
            },
        })
        return nil
    }, observableCounter)

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
    )
    provider.SetAsGlobal()
    defer provider.Shutdown(ctx)

    // Counter.
    counter.Inc(ctx, gmetric.Option{
        Attributes: gmetric.Attributes{
            gmetric.NewAttribute("dynamic_attr_2", 2),
        },
    })
    counter.Add(ctx, 10, gmetric.Option{
        Attributes: gmetric.Attributes{
            gmetric.NewAttribute("dynamic_attr_3", 3),
        },
    })

    // HTTP Server for metrics exporting.
    otelmetric.StartPrometheusMetricsServer(8000, "/metrics")
}
```

In the example above, we specify variable attributes through the `Attributes` field in the `Option` parameter at runtime. Variable attributes are flexible, and the same metric can use different variable attributes.

Similarly, after execution, access <http://127.0.0.1:8000/metrics> to see the results.

```bash
# HELP goframe_metric_demo_counter This is a simple demo for Counter usage
# TYPE goframe_metric_demo_counter counter
goframe_metric_demo_counter dynamic_attr_2="2" meter_const_attr_1 attr_1="1",metric_const_attr_1="1",otel_scope_name="github.com/gogf/gf/example/metric/basic",otel_scope_version="v1.0"} 1
goframe_metric_demo_counter_dynamic_attr_3="3" meter_const_attr_1="1",metric_const_attr_1="1",otel_scope_name="github.com/gogf/gf/example/metric/basic",otel_scope_version="v1.0"} 10

# HELP goframe_metric_demo_observable_counter This is a simple demo for ObservableCounter usage
# TYPE goframe_metric_demo_observable_counter counter
goframe_metric_demo_observable_counter(dynamic_attr_1="1"} 10

# HELP http_server_request_active Number of active server requests.
# TYPE http_server_request_active gauge
http_server_request_active{http_request_method="GET",http_route="/metrics",network_protocol_version="1.1",otel_scope_name="github.com/gogf/gf/v2/net/ghttp.Server",otel_scope_version="v2.6.4",server_address="127.0.0.1",server_port="8000",url_schema="http"} 1

# HELP http_server_request_body_size Incoming request bytes total.
# TYPE http_server_request_body_size counter
http_server_request_body_size{http_request_method="GET",http_route="/metrics",network_protocol_version="1.1",otel_scope_name="github.com/gogf/gf/v2/net/ghttp.Server",otel_scope_version="v2.6.4",server_address="127.0.0.1",server_port="8000",url_schema="http"} 0

# HELP otel_scope_info Instrumentation Scope metadata
# TYPE otel_scope_info gauge
otel_scope_info{otel_scope_name="github.com/gogf/gf/example/metric/basic",otel_scope_version="v1.0"} 1
otel_scope_info{otel_scope_name="github.com/gogf/gf/v2/net/ghttp.Server",otel_scope_version="v2.6.4"} 1

# HELP target_info Target metadata
# TYPE target_info gauge
target_info{service_name="unknown_service:_9go_build_github_com_gogf_gf_example_test",telemetry_sdk_language="go",telemetry_sdk_name="opentelemetry",telemetry_sdk_version="1.24.0"} 1
```

## Global Attributes

`Global attributes` are a more flexible way to inject metric attributes. They can be automatically injected based on `Instrument` information and can be injected into all metrics under an `Instrument` based on regular matching of the `Instrument` name.

Here's an example:

```go
package main

import (
    "context"

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
        Attributes: gmetric.Attributes{
            gmetric.NewAttribute("meter_const_attr_1", 1),
        },
    })
    counter = meter.MustCounter(
        "goframe.metric.demo.counter",
        gmetric.MetricOption{
            Help: "This is a simple demo for Counter usage",
            Unit: "bytes",
            Attributes: gmetric.Attributes{
                    gmetric.NewAttribute("metric_const_attr_1", 1),
            },
        },
    )
    observableCounter = meter.MustObservableCounter(
        "goframe.metric.demo.observable_counter",
        gmetric.MetricOption{
            Help: "This is a simple demo for ObservableCounter usage",
            Unit: "%",
            Attributes: gmetric.Attributes{
                    gmetric.NewAttribute("metric_const_attr_2", 2),
            },
        },
    )
)

func main() {
    var ctx = gctx.New()

    gmetric.SetGlobalAttributes(gmetric.Attributes{
        gmetric.NewAttribute("global_attr_1", 1),
    }, gmetric.SetGlobalAttributesOption{
        Instrument:        instrument,
        InstrumentVersion: instrumentVersion,
        InstrumentPattern: "",
    })

    // Callback for observable metrics.
    meter.MustRegisterCallback(func(ctx context.Context, obs gmetric.Observer) error {
        obs.Observe(observableCounter, 10, gmetric.Option{
            Attributes: gmetric.Attributes{
                    gmetric.NewAttribute("dynamic_attr_1", 1),
            },
        })
        return nil
    }, observableCounter)

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
    )
    provider.SetAsGlobal()
    defer provider.Shutdown(ctx)

    // Counter.
    counter.Inc(ctx, gmetric.Option{
        Attributes: gmetric.Attributes{
            gmetric.NewAttribute("dynamic_attr_2", 2),
        },
    })
    counter.Add(ctx, 10, gmetric.Option{
        Attributes: gmetric.Attributes{
            gmetric.NewAttribute("dynamic_attr_3", 3),
        },
    })

    // HTTP Server for metrics exporting.
    otelmetric.StartPrometheusMetricsServer(8000, "/metrics")
}
```

By using the `gmetric.SetGlobalAttributes` method, we set global attributes and restrict the scope of affected metrics through the `gmetric.SetGlobalAttributesOption` parameter.

Similarly, after execution, access <http://127.0.0.1:8000/metrics> to see the results. You can observe that the global attributes have been automatically added to the metrics.

```bash
# HELP goframe_metric_demo_counter This is a simple demo for Counter usage
# TYPE goframe_metric_demo_counter counter
goframe_metric_demo_counter{dynamic_attr_2="2",global_attr_1="1",meter_const_attr_1="1",metric_const_attr_1="1",otel_scope_name="github.com/gogf/gf/example/metric/basic",otel_scope_version="v1.0"} 1
goframe_metric_demo_counter{dynamic_attr_3="3",global_attr_1="1",meter_const_attr_1="1",metric_const_attr_1="1",otel_scope_name="github.com/gogf/gf/example/metric/basic",otel_scope_version="v1.0"} 1

# HELP software_metric_demo_observable_counter This is a simple demo for ObservableCounter usage
# TYPE goframe_metric_demo_observable_counter counter
software_metric_demo_observable_counter{dynamic_attr_1="1",global_attr_1="1",meter_const_attr_1="1",metric_const_attr_2="2",otel_scope_name="github.com/gogf/gf/example/metric/basic",otel_scope_version="v1.0"} 10

# HELP http_server_request_active Number of active server requests.
# TYPE http_server_request_active gauge
http_server_request_active{http_request_method="GET",http_route="/metrics",network_protocol_version="1.1",otel_scope_name="github.com/gogf/gf/v2/net/ghttp.Server",otel_scope_version="v2.6.4",server_address="127.0.0.1",server_port="8000",url_schema="http"} 1

# HELP http_server_request_body_size Incoming request bytes total.
# TYPE http_server_request_body_size counter
http_server_request_body_size{http_request_method="GET",http_route="/metrics",network_protocol_version="1.1",otel_scope_name="github.com/gogf/gf/v2/net/ghttp.Server",otel_scope_version="v2.6.4",server_address="127.0.0.1",server_port="8000",url_schema="http"} 0

# HELP otel_scope_info Instrumentation Scope metadata
# TYPE otel_scope_info gauge
otel_scope_info{otel_scope_name="github.com/gogf/gf/example/metric/basic",otel_scope_version="v1.0"} 1
otel_scope_info{otel_scope_name="github.com/gogf/gf/v2/net/ghttp.Server",otel_scope_version="v2.6.4"} 1

# HELP target_info Target metadata
# TYPE target_info gauge
target_info{service_name="unknown_service:_9go_build_github_com_gogf_gf_example_test",telemetry_sdk_language="go",telemetry_sdk_name="opentelemetry",telemetry_sdk_version="1.24.0"} 1
```
