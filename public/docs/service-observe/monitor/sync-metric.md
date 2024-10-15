# Monitoring and Alerting - Synchronous Metrics

## Basic Introduction

`Synchronous types` are used to quickly expose monitoring metrics. Regardless of whether the `metrics reader` uses these monitoring metrics, the calculation results of the metrics are completed and ready to be read. For instance, the total number of HTTP requests, the size of requests; these values must be recorded in the corresponding monitoring metric values during the request execution process, making them suitable for management as synchronous metrics.

The synchronous metric types provided by `gmetric` include: `Counter`, `UpDownCounter`, and `Histogram`.

Let's illustrate the basic usage of synchronous metrics with a simple example.

```go
package main

import (
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
    counter = meter.MustCounter(
        "goframe.metric.demo.counter",
        gmetric.MetricOption{
            Help: "This is a simple demo for Counter usage",
            Unit: "bytes",
        },
    )
    upDownCounter = meter.MustUpDownCounter(
        "goframe.metric.demo.updown_counter",
        gmetric.MetricOption{
            Help: "This is a simple demo for UpDownCounter usage",
            Unit: "%",
        },
    )
    histogram = meter.MustHistogram(
    "goframe.metric.demo.histogram",
        gmetric.MetricOption{
            Help:    "This is a simple demo for histogram usage",
            Unit:    "ms",
            Buckets: []float64{0, 10, 20, 50, 100, 500, 1000, 2000, 5000, 10000},
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
    provider := otelmetric.MustProvider(otelmetric.WithReader(exporter))
    provider.SetAsGlobal()
    defer provider.Shutdown(ctx)

    // Counter.
    counter.Inc(ctx)
    counter.Add(ctx, 10)

    // UpDownCounter.
    upDownCounter.Inc(ctx)
    upDownCounter.Add(ctx, 10)
    upDownCounter.Dec(ctx)

    // Record values for histogram.
    histogram.Record(1)
    histogram.Record(20)
    histogram.Record(30)
    histogram.Record(101)
    histogram.Record(2000)
    histogram.Record(9000)
    histogram.Record(20000)

    // HTTP Server for metrics exporting.
    otelmetric.StartPrometheusMetricsServer(8000, "/metrics")
}
```

## Counter & UpDownCounter

`Counter` and `UpDownCounter` are relatively straightforward, so we won't go into detail about them. It's important to note that although `Counter` and `UpDownCounter` look similar and indeed are, they are designed to be more rigorous and to differentiate usage scenarios. If you map these two data types to classic `Prometheus` metric types, `Counter` corresponds to `Prometheus`'s Counter metric type, while `UpDownCounter` corresponds to `Prometheus`'s Gauge metric type.

## Histogram

A `Histogram` is a statistical type that allows for quick calculation of percentile statistics such as `p95`, `p99`, and histograms for metrics like time consumption, success/failure rates, etc. However, it's important to note that this type of metric is memory and space-intensive, and you should not add too many dynamic attributes to it, as different attributes will spawn different stored values for the same `Histogram` metric.

## Prometheus Exporter

In this example, we used the commonly used `Prometheus` protocol to output metric content, typically used to expose metrics for external components to scrape. The following route exposes metrics through the `Prometheus` protocol:

```go
otelmetric.StartPrometheusMetricsServer(8000, "/metrics")
```

After execution, you can visit `http://127.0.0.1:8000/metrics` to view the exposed metrics.
