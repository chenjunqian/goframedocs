# Project Package Design

This is the package design of the `Goframe` framework for business projects. The main idea come from the three-tier architecture, but in the specific implementation, it has been improved and refined to better conform to engineering practices and the progress of the times.

## 1. Overview

`Goframe` basic package structure is as follows:

```text
/
├── api
├── hack
├── internal
│   ├── cmd
│   ├── consts
│   ├── controller
│   ├── dao
│   ├── logic
│   ├── model
│   |   ├── do
│   │   └── entity
│   └── service
├── manifest
├── resource
├── utility
├── go.mod
└── main.go
```

**Important Note**: The framework's project directory adopts a **universal design** to meet the needs of business projects of varying complexities. However, in actual projects, you can **appropriately add or remove the default directories** according to the project's requirements. For example, if there is no need for `i18n`, `template`, or `protobuf` features, simply **delete the corresponding directories**. Also, for very simple business projects (such as `verification/demo projects`), if you do not intend to use strict `dao/logic/model` directories and features, then **delete the corresponding directories**; you can directly implement the business logic in the controller. Developers can flexibly choose and assemble everything as needed!

- `api` Definitions of input/output data structures for services provided externally. Often exists in the form of `api/xxx/v1...` considering the need for version management.
- `hack` Directory for storing project development tools, scripts, etc. For example, configurations for `CLI` tools, various `shell/bat` scripts, and other files.
- `internal` Directory for business logic. Visibility is hidden from the outside using the internal feature of `Golang`.

  - `cmd` Directory for command-line management. Can manage and maintain multiple command lines.
  - `consts` Definition of all project constants.
  - `controller` Entry/interface layer for receiving/parsing user input parameters.
  - `dao` Data Access Objects, which are a layer of abstract objects for interacting with the underlying database, containing only the most basic `CURD` methods.
  - `logic` Business logic encapsulation management, implementation and encapsulation of specific business logic. It is often the most complex part of the project.
  - `model` Data structure management module, managing data entity objects, as well as definitions of input and output data structures.
  - `do` Used for the conversion between business models and instance models in `dao` data operations, maintained by tools, users cannot modify.
  - `entity` Data models represent a one-to-one relationship with data collections, maintained by tools, users cannot modify.
  - `service` Layer for defining interfaces for business module decoupling. The specific interface implementation is injected in the `logic`.
- `manifest` Contains files for program compilation, deployment, running, and configuration. Common contents are as follows:
- `config` Directory for configuration files.
- `docker`  `Docker` image-related dependency files, script files, etc.
- `deploy` Deployment-related files. Default provides `Kubernetes` cluster deployment `Yaml` templates managed by `kustomize`.
- `protobuf` Protobuf protocol definition files used when using `GRPC` protocols. After compiling the `protocol` files, go files are generated into the `api` directory.
- `resource` Static resource files. These files can often be injected into the release files in the form of resource packaging/image compilation.

## 2. External Interface

The external interface consists of two parts: interface definition (`api`) + interface implementation (`controller`).

The responsibility of the service interface is similar to that of the `UI` presentation layer in the `three-tier` architectural design, responsible for receiving and responding to client input and output, including filtering, converting, and validating input parameters, maintaining the output data structure, and calling the `service` to implement business logic processing.

### Interface Definition - `api`

The `api` package is used for defining the input and output data structures agreed upon with the client, which are often strongly bound to specific business scenarios.

### Interface Implementation - `controller`

The `controller` is used to receive the input from the api. Business logic can be directly implemented in the controller, or one or more service packages can be called to implement the business logic, encapsulating the execution results as agreed-upon api output data structures.

## 3. Business Implementation

The business implementation consists of two parts: business interface (`service`) + business encapsulation (`logic`).

The responsibility of the business implementation is similar to that of the `BLL` (Business Logic Layer) in the three-tier architectural design, responsible for the actual implementation and encapsulation of business logic.

In the subsequent chapters, we will collectively refer to the business implementation as `service`; please note that it actually includes two parts.

### Business Interface - `service`

The `service` package is used to decouple the calls between business modules. Business modules will not directly call the corresponding business module resources to implement business logic; instead, they call `service` interfaces. The `service` layer only has interface definitions, with the specific implementations injected into each business module.

### Business Encapsulation - `logic`

The `logic` package is responsible for the actual implementation and encapsulation of business `logic`. In the project, code at various levels will not directly call the business modules in the `logic` layer but will call them through the `service` interface layer.

## 4. Structural Model

The responsibility of the `model` package is similar to that of the `Model` definition layer in the `three-tier` architecture. The `model` definition code layer contains only globally public data structure definitions and usually does not include method definitions.

It should be noted that the `model` here is not only responsible for maintaining the structure definition of data entity objects (`entity`) but also includes all `input`/`output` data structure definitions, which are commonly referenced by `api`/`dao`/`service`. The advantage of doing this is that, in addition to uniformly managing public data structure definitions, it can also fully reuse the same business domain data structures to reduce code redundancy.

### Data Model - `entity`

The definition of program data structures bound to data collections, usually corresponding one-to-one with data tables.

### Business Model - `model`

The definition of common data structures related to business, which includes most of the method input and output definitions.

### Data Access Object - `dao`

`dao` package is similar to that of the `DAL` (Data Access Layer) in the three-tier architecture, responsible for the data access.
