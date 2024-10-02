# Routing Registration - Standard Routing

## Basic Introduction

Starting from version `v2.0`, the framework's `Server` component additionally provides a standardized routing registration method, which is more suitable for team-based standardized usage scenarios and projects with higher business complexity. Standard routing implements the following features:

- Structured programming design for standardized `API`
- Unified parameter style definition for standardized `API` interface methods
- Simplified routing registration and maintenance
- Unified interface response data format design
- Ensuring code and `API` documentation are maintained synchronously
- Automatic object-oriented reception and validation of `API` parameters
- Automatic generation of `API` documentation based on the standard `OpenAPIv3` protocol
- Automatic generation of `SwaggerUI` pages

> Please note: Standard routing coexists with the framework's `HTTP Server` component's supported routing registration methods, including the original function and object routing methods. It is designed to address scenarios requiring standardized and automated management of APIs and is more suitable for team collaboration. Other routing methods, especially the function and object registration methods from version `v1` of the framework, are also supported in the new version! Choose wisely based on personal usage habits.
