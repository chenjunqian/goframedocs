# End-to-End Tracing Design

Observability is very important, and there is already a good standard for `OpenTelemetry`. It will be more convenient for various third-party components and vendors to expose and connect monitoring data according to this standard.

The `Goframe` has high foresight and has been paying close attention since the draft stage of the `OpenTelemetry` standard. When the `OTEL` standard released its alpha version, the framework began to support it. Currently, the `Golang` implementation of `OTEL` is stable. `Goframe` is currently the best-supported framework among many "frameworks" for the `OTEL` standard and its implementation, and using the `Goframe` implicitly comes with link tracing features. Moreover, observability is also a key feature for the framework's future development.

## Pain Point

### 1. Components Do Not Strictly Follow Standards**

Although there is an `OTEL` standard, third-party components do not strictly adhere to it. For instance, in log and `ORM` components, there is no strict enforcement of passing the context variable `ctx`.

### 2. Third-Party Components Are Disorganized

Projects often use a variety of third-party components, some of which do not support link tracing, let alone the `OTEL` standard. Common components such as command management, configuration management, cache management, data validation, and scheduled tasks often lack the provision for passing the context variable `ctx`. When the components used do not support link transmission, the link information is lost.

### 3. Business Logic Is Prone to Losing Link Information

In projects, there is no detection mechanism for link tracing, which means that link tracing can be inadvertently lost during development. For example, creating a new `ctx` or passing a `nil` `ctx` during link transmission. When strategic design encounters tactical implementation issues, it can be problematic to locate the issue, especially in B2B scenarios where there are strict deadlines for work orders.

## Framework Full-Chain Tracing

### 1. Unified Framework

As `Goframe` is a comprehensive engineering framework, it provides the common core foundational components needed for a project. This makes it very convenient to uniformly implement the link tracing standard for the basic components.

### 2. Standard Implementation

Support for the context variable `ctx` has been added to all core components of the framework, and the `OTEL` standard is strictly enforced to ensure the smooth implementation of the standard.

### 3. Logging Support

In engineering practice, logs are a very important component for link tracing. In most business scenarios, we need to use link tracing and log content to investigate and locate specific issues. The logging component of the `Goframe` framework also supports and strictly implements the `OTEL` standard. Therefore, as long as the framework's logging component is used, it will automatically print related link information.

### 4. Standard Compliance Detection Tools

The framework provides standard compliance detection functionality through development tools, which can automatically detect link loss issues in business projects. This further promotes the implementation of the `OTEL` standard and ensures project quality.

### 5. Link Propagation Support

Link propagation also requires a unified component. The most common protocols are `HTTP`/`GRPC`, so the framework also provides `HTTP` `Client`/`Server` and `GRPC` `Client`/`Server` components to ensure the propagation of links. To improve engagement and ease of use, complex low-level functional details are shielded. This kind of link propagation is `implicitly` implemented at the low level, and users are completely unaware of it.
