# HTTPServer - Monitoring Metrics

The `HTTP Server` supports monitoring `metric` capabilities, which are turned off by default and do not affect performance. The monitoring `metrics` calculation and generation features are enabled by default only when the metric feature is globally activated.

## Metric List

### http.server.request.duration

- **Type**: Histogram
- **Unit**: ms
- **Description**: Groups the time spent on request execution on the server side.

### http.server.request.duration_total

- **Type**: Counter
- **Unit**: ms
- **Description**: The total time spent on executing each request.

### http.server.request.total

- **Type**: Counter
- **Description**: The total number of requests that have been executed, excluding the number of requests currently being executed.

### http.server.request.active

- **Type**: Gauge
- **Description**: The number of requests currently being processed.

### http.server.request.body_size

- **Type**: Counter
- **Unit**: bytes
- **Description**: The total size in bytes of the requests.

### http.server.response.body_size

- **Type**: Counter
- **Unit**: bytes
- **Description**: The total size in bytes of the responses returned.

## Attribute List

### server.address

- **Description**: The address that accepts requests. Sourced from `Request.Host`, it could be a domain name or an IP address.

**Example**: `goframe.org`, `10.0.1.132`

### server.port

- **Description**: The service port that accepts requests. A service may have multiple port addresses; the port connected to the current request is recorded.

**Example**: `8000`

### http.route

- **Description**: The routing rule of the request.

**Example**: `/api/v1/user/:id`

### url.schema

- **Description**: The name of the request protocol.

**Example**: `http`, `https`

### network.protocol.version

- **Description**: The version of the request protocol.

**Example**: `1.0`, `1.1`

### http.request.method

- **Description**: The name of the request method.

**Example**: `GET`, `POST`, `DELETE`

### error.code

- **Description**: The business-defined error code returned by the request, which is of string type to enhance compatibility.

**Example**: `-1`, `0`, `51`

### http.response.status_code

- **Description**: The HTTP status code returned by the processing.

**Example**: `200`
