# Monitoring and Alerting - Asynchronous Metrics

## Basic Introduction

`Asynchronous metrics` are only executed when the `metrics reader` begins to utilize these metrics. Asynchronous metrics require the setting of a callback function, which is utilized to generate metric values and is triggered only when the `metrics reader` reads the metrics. For instance, metrics for machine CPU, memory, and disk usage are meaningless to calculate in advance without a target endpoint to pull or use the metrics, as it wastes computational resources. This makes them suitable for management as asynchronous metrics.

The asynchronous metric types provided by `gmetric` include: `ObservableCounter`, `ObservableUpDownCounter`, and `ObservableGauge`. All asynchronous metric types are prefixed with `Observable`. The operations for these three types of asynchronous metrics are similar, each with different usage scenarios.

Let's demonstrate the basic usage of asynchronous metrics with a simple example.

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

var (
    meter = gmetric.GetGlobalProvider().Meter(gmetric.MeterOption{
        Instrument:        "github.com/gogf/gf/example/metric/basic",
        InstrumentVersion: "v1.0",
    })
    observableCounter = meter.MustObservableCounter(
        "goframe.metric.demo.observable_counter",
        gmetric.MetricOption{
            Help: "This is a simple demo for ObservableCounter usage",
            Unit: "%",
        },
    )
    observableUpDownCounter = meter.MustObservableUpDownCounter(
        "goframe.metric.demo.observable_updown_counter",
        gmetric.MetricOption{
            Help: "This is a simple demo for ObservableUpDownCounter usage",
            Unit: "%",
        },
    )
    observableGauge = meter.MustObservableGauge(
        "goframe.metric.demo.observable_gauge",
        gmetric.MetricOption{
            Help: "This is a simple demo for ObservableGauge usage",
            Unit: "%",
        },
    )
)

func main() {
    var ctx = gctx.New()

    // Callback for observable metrics.
    meter.MustRegisterCallback(func(ctx context.Context, obs gmetric.Observer) error {
        obs.Observe(observableCounter, 10)
        obs.Observe(observableUpDownCounter, 20)
        obs.Observe(observableGauge, 30)
        return nil
    }, observableCounter, observableUpDownCounter, observableGauge)

    // Prometheus exporter to export metrics as Prometheus format.
    exporter, err := prometheus.New(
        prometheus.WithoutCounterSuffixes(),
        prometheus.WithoutUnits(),
    )
    if err != nil {
        g.Log().Fatal(ctx, err)
    }

    // OpenTelemetry provider.
    provider := otelmetric.MustProvider(otelmetric.WithReader(exporter))
    provider.SetAsGlobal()
    defer provider.Shutdown(ctx)

    // HTTP Server for metrics exporting.
    otelmetric.StartPrometheusMetricsServer(8000, "/metrics")
}
```

## Meter Callback

Asynchronous metrics require a `callback` function to manage changes in metric values, which is only executed when the metric is requested or used. The `callback` function uses the `Observe` function to update the metric value, and the `Observe` function will produce different results for different types of asynchronous metrics.

- For `ObservableCounter` and `ObservableUpDownCounter` metric types, using the `Observe` function will increment or decrement the existing metric value.

- For the `ObservableGauge` metric type, using the `Observe` function will update the metric value to the given value.

## Metric Callback

In addition to using `Meter Callback` to implement updates to asynchronous metric values, you can also specify a `callback` function through `MetricOption` when creating a metric. For example:

```go
observableCounter = meter.MustObservableCounter(
    "goframe.metric.demo.observable_counter",
    gmetric.MetricOption{
        Help: "This is a simple demo for ObservableCounter usage",
        Unit: "%",
        Callback: func(ctx context.Context, obs gmetric.MetricObserver) error {
        obs.Observe(10)
            return nil
        },
    },
)
```

## Prometheus Exporter

Expose metrics through the `Prometheus` protocol via the following route:

```go
otelmetric.StartPrometheusMetricsServer(8000, "/metrics")
```

After execution, you can visit `http://127.0.0.1:8000/metrics` to view the exposed metrics.
