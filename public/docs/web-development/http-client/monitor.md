# HTTPClient - Monitoring Metrics

The `HTTP` client supports monitoring `metric` capabilities, which are close by default and do not affect performance. The monitoring `metrics` calculation and generation features are only enabled by default when the `metric` feature is globally activated.

## Metrics List

```markdown
| Metric Name                          | Type      | Unit   | Description                                           |
|--------------------------------------|-----------|--------|-------------------------------------------------------|
| `http.client.request.duration`       | Histogram | ms     | The time overhead of client request execution.        |
| `http.client.request.duration_total` | Counter   | ms     | The total time overhead used by each request.         |
| `http.client.connection.duration`    | Histogram | ms     | The time overhead used to establish a connection.     |
| `http.client.request.total`          | Counter   | -      | The total number of requests that have been executed. |
| `http.client.request.active`         | Gauge     | -      | The number of requests currently being processed.     |
| `http.client.request.body_size`      | Counter   | bytes  | The total size in bytes of the requests.              |
| `http.client.response.body_size`     | Counter   | bytes  | The total size in bytes of the responses.             |
```

## Attributes List

```markdown
| Attribute Name              | Description                                                                      | Example Values          |
|-----------------------------|----------------------------------------------------------------------------------|-------------------------|
| `server.address`            | The target service address of the request. Could be a domain name or IP address. | goframe.org, 10.0.1.132 |
| `server.port`               | The target service port of the request.                                          | 8000                    |
| `http.request.method`       | The name of the request method.                                                  | GET, POST, DELETE       |
| `http.response.status_code` | The HTTP status code returned by the response.                                   | 200                     |
| `url.schema`                | The protocol used in the request.                                                | http, https             |
| `network.protocol.version`  | The version of the request protocol.                                             | 1.0, 1.1                |
```
