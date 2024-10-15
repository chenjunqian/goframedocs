# Monitoring and Alerting - Basic Introduction

Before diving into the monitoring and alerting features of the framework, we cannot avoid discussing the industry standards for observability, the design, and related specifications of `OpenTelemetry` regarding monitoring and alerting. `OpenTelemetry` has extensive content in this area, so we will highlight some key points for introduction.

## OpenTelemetry

### Components

Let's take a look at the relationship diagram of `OpenTelemetry` components. In the implementation of the `OpenTelemetry` Metrics standard, it mainly includes the following components:

```txt
+------------------+
| MeterProvider    |                 +-----------------+             +--------------+
|   Meter A        | Measurements... |                 | Metrics...  |              |
|     Instrument X +-----------------> In-memory state +-------------> MetricReader |
|     Instrument Y |                 |                 |             |              |
|   Meter B        |                 +-----------------+             +--------------+
|     Instrument Z |
|     ...          |                 +-----------------+             +--------------+
|     ...          | Measurements... |                 | Metrics...  |              |
|     ...          +-----------------> In-memory state +-------------> MetricReader |
|     ...          |                 |                 |             |              |
|     ...          |                 +-----------------+             +--------------+
+------------------+
```

When implementing standardized documentation, each component typically adopts an interface design to improve scalability:

#### Meter Provider

Used for interface-based management of global `Meter` creation, essentially acting as a global monitoring metrics management factory.

#### Meter

Used for interface-based creation and management of global `Instruments`. Different `Meters` can be seen as different program components. For example, different components in the framework can be considered different `Meters`, such as gclient and ghttp which are two different `Meters`.

#### Instrument

Used to manage various types of metrics under different components. For instance, under `ghttp`, there would be metrics like `http.server.request.duration`, `http.server.request.body_size`, etc.

#### Measurements

Correspond to the specific `DataPoint` metric data reported for metrics, which is a series of numerical items.

#### View

Enables operations such as computation, summarization, filtering, and modification of `Measurements`. Since metrics are usually of numeric types, the default `View` is typically used.

#### Metric Reader

Used to implement the reading of metric data streams, internally defining the specific data structure for operating on metrics. The official `OpenTelemetry` community provides various flexible `Reader` implementations, such as `PeriodicReader`, `ManualReader`, etc.

#### Metric Exporter

`Exporter` is used to expose local metrics to corresponding third-party vendors, defining whether the data transfer method is `push` or `pull`. `Exporters` require the use of `Readers`, which come in a few ways, but `Exporters` will vary depending on the vendor, with many options such as `Prometheus`, `Zipkin`, etc.

## Related Types

To meet different usage scenarios, the community implementation of `OpenTelemetry` has a fine-grained type design, divided into `int64` and `float64` data types, and includes both synchronous and asynchronous metric types.

### Synchronous Types

Synchronous types are used to quickly expose monitoring metrics. Regardless of whether the `metrics reader` uses these monitoring metrics, the calculation results of the metrics are completed and ready to be read. For example, the total number of HTTP requests, the size of requests, these values must be recorded in the corresponding monitoring metric values during the request execution process, making them suitable for management as synchronous metrics.

***Int64Counter***

An `int64` metric that only increases.

- Total number of requests
- Total size of request bytes

***Int64UpDownCounter***

An `int64` metric that can increase or decrease.

- Current active requests
- Queue size

***Float64Counter***

A `float64` metric that only increases.

- Total number of requests
- Total size of request bytes

***Float64UpDownCounter***

A `float64` metric that can increase or decrease.

- Total number of requests
- Total size of request bytes

***Int64Histogram***

An int64 metric that is divisible into groups.

- P99 of request execution time

***Float64Histogram***

A `float64` metric that is divisible into groups.

- P99 of request execution time

### Asynchronous Types

Asynchronous monitoring metrics only perform metric calculation logic when the `metrics reade`r starts using these monitoring metrics. Asynchronous monitoring metrics require setting a callback function, which is used to generate metric values and triggers the callback function only when the `metrics reader` reads the metrics. For example, metrics for machine CPU, memory, disk usage, calculating metric values in advance without a target end pull or use of the metric is meaningless and wastes computational resources, making them suitable for management as asynchronous metrics.

***Int64ObservableCounter***

An `int64` metric that only increases.

- CPU, memory, disk usage

***Int64ObservableUpDownCounter***

An `int64` metric that can increase or decrease.

- CPU, memory, disk usage

***Float64ObservableCounter***

A `float64` metric that only increases.

- CPU, memory, disk usage

***Float64ObservableUpDownCounter***

A `float64` metric that can increase or decrease.

- Current active requests
- Queue size

***Int64ObservableGauge***

An `int64` metric that can increase or decrease.

- CPU, memory, disk usage

***Float64ObservableGauge***

A `float64` metric that can dynamically increase or decrease.

- CPU, memory, disk usage

## Framework Monitoring Components

### Component Abstraction

The framework implements monitoring capabilities through the `gmetric` component. The internal design of the `gmetric` component's component hierarchy is similar to `OpenTelemetry` Metrics:

```markdown
                       -- Counter
                       -- UpDownCounter
                       -- Histogram
Provider --> Meter --  -- Provider
                       -- Meter
                       -- ObservableCounter
                       -- ObservableUpDownCounter
                       -- ObservableGauge
```

The `gmetric` component uses an ***abstract decoupled design***. On one hand, it is because the framework design needs to reduce external dependencies; on the other hand, it is to achieve the automatic switching capability of monitoring. By default, the component uses the `NoopPerform` implementation object, and monitoring capabilities are turned off by default, only automatically turning on when the monitoring interface implementation is truly introduced.

```markdown
                        -- CounterPerformer
                        -- UpDownCounterPerformer
                        -- HistogramPerformer
Provider --> Meter --   -- Provider
                        -- MeterPerformer
                        -- ObservableCounterPerformer
                        -- ObservableUpDownCounterPerformer
                        -- ObservableGaugePerformer
```

### Metric Types

Compared to the `OpenTelemetry` community implementation, the framework provides metric types that remove the `int64` numeric type in favor of a unified `float64` numeric type to simplify usage. However, developers need to be aware that when designing metric values, they should ***avoid decimal designs as much as possible to prevent precision issues in numerical calculations***. This is especially true when designing `Histogram` type `Buckets`, where the use of decimals is not recommended.

***Synchronous Types***

- **Counter**: A float64 metric that only increases.
  - Total number of requests
  - Total size of request bytes
- **UpDownCounter**: A float64 metric that can increase or decrease.
  - Total number of requests
  - Total size of request bytes
- **Histogram**: A float64 metric that is divisible into groups.
  - P99 of request execution time

***Asynchronous Types***

- **ObservableCounter**: A float64 metric that only increases.
  - Total number of requests
  - Total size of request bytes
- **ObservableUpDownCounter**: A float64 metric that can increase or decrease.
  - Total number of requests
  - Total size of request bytes
- **ObservableGauge**: A float64 metric that can dynamically increase or decrease.
  - CPU, memory, disk usage

## References

- [Prometheus Go Client](https://github.com/prometheus/client_golang)
- [OpenTelemetry Go Contrib](https://github.com/open-telemetry/opentelemetry-go-contrib)
- [OpenTelemetry Metrics API Specification](https://opentelemetry.io/docs/specs/otel/metrics/api/)
- [OpenTelemetry Metrics Data Model](https://opentelemetry.io/docs/specs/otel/metrics/data-model)
