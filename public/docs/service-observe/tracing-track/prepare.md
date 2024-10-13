# Service Tracing - Prepare

## Introduction

After gaining a preliminary understanding of `OpenTelemetry`, we will demonstrate how to use it for distributed tracing in a program, using `Jaeger` as an example.

## Jaeger

`Jaeger`, pronounced "yā-gər", is an open-source distributed tracing system created by Uber. It is one of the systems that supports `OpenTelemetry` and is also a `CNCF` project. This guide will use `Jaeger` to demonstrate how to introduce distributed tracing into a system.

## Preparations

`Jaeger` provides an `all-in-one` image to facilitate quick testing:

```bash
docker run --rm --name jaeger \
  -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
  -p 6831:6831/udp \
  -p 6832:6832/udp \
  -p 5778:5778 \
  -p 16686:16686 \
  -p 4317:4317 \
  -p 4318:4318 \
  -p 14250:14250 \
  -p 14268:14268 \
  -p 14269:14269 \
  -p 9411:9411 \
  jaegertracing/all-in-one:1.55
```

After the image starts, you can open the Jaeger UI through [http://localhost:16686](http://localhost:16686).

## Example Code Location

Our example code is in the `gf` main repository, available at: [https://github.com/gogf/gf/tree/master/example/trace](https://github.com/gogf/gf/tree/master/example/trace)

## Jaeger Registration Wrapper (to be removed in version 2.6.0)

For the convenience of developers, we have encapsulated the initialization logic for `Jaeger` in the form of a community module. The code is available at: [https://github.com/gogf/gf/tree/master/contrib/trace/jaeger](https://github.com/gogf/gf/tree/master/contrib/trace/jaeger)

## OTLP HTTP Registration Wrapper

For the convenience of developers, we have encapsulated the initialization logic for `otelhttp` in the form of a community module. The code is available at: [https://github.com/gogf/gf/tree/master/contrib/trace/otlphttp](https://github.com/gogf/gf/tree/master/contrib/trace/otlphttp)

## OTLP GRPC Registration Wrapper

For the convenience of developers, we have encapsulated the initialization logic for `otelgrpc` in the form of a community module. The code is available at: [https://github.com/gogf/gf/tree/master/contrib/trace/otlpgrpc](https://github.com/gogf/gf/tree/master/contrib/trace/otlpgrpc)
