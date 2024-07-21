# Enum Management

## Implementing Enum Values in Go

`Go` language does not provide a definition for `enums`, so we can simulate enum types using `const`, which is also the conventional approach in `Go`.

For example, in the `Kubernetes` project, there are a large number of "enum values" defined as constants:

```go
// PodPhase is a label for the condition of a pod at the current time.
type PodPhase string

// These are the valid statuses of pods.
const (
    // PodPending means the pod has been accepted by the system, but one or more of the containers
    // has not been started. This includes time before being bound to a node, as well as time spent
    // pulling images onto the host.
    PodPending PodPhase = "Pending"
    // PodRunning means the pod has been bound to a node and all of the containers have been started.
    // At least one container is still running or is in the process of being restarted.
    PodRunning PodPhase = "Running"
    // PodSucceeded means that all containers in the pod have voluntarily terminated
    // with a container exit code of 0, and the system is not going to restart any of these containers.
    PodSucceeded PodPhase = "Succeeded"
    // PodFailed means that all containers in the pod have terminated, and at least one container has
    // terminated in a failure (exited with a non-zero exit code or was stopped by the system).
    PodFailed PodPhase = "Failed"
    // PodUnknown means that for some reason the state of the pod could not be obtained, typically due
    // to an error in communicating with the host of the pod.
    PodUnknown PodPhase = "Unknown"
)
```

## Maintain Enum

If enum values are only used within a single project, it's relatively simple; just define and use them internally. However, when it comes to cross-service calls or collaboration between front-end and back-end, the efficiency can be quite low. When a service needs to present its capabilities to external callers, it often needs to generate `API` documentation (or interface definition files, such as `proto`) and also generate client `SDK`s based on the interface documentation (files).

If it's an interface definition file, such as `proto`, it's usually not a problem to directly review the source code to solve this issue. What we mainly discuss here is the issue of maintaining enum values in interface documentation, especially the issue of maintaining enum values through the OpenAPI standard protocol when collaborating between front-end and back-end.
