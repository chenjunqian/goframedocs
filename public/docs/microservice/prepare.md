# Environment Preparation

The following chapters mainly focus on microservice development using the **GRPC** protocol, including the development process, components, and tools.

## Dependency Installation

Before diving into further learning, please familiarize yourself with GRPC-related concepts and install the corresponding tools in your local development environment.

- [GRPC Official Website](https://grpc.io/)
- [GRPC Go Quickstart Guide](https://grpc.io/docs/languages/go/quickstart/)

***MacOS Installation***

If you're working in a MacOS environment, you can use the `brew` tool to install the necessary dependencies:

```bash
brew install grpc protoc-gen-go protoc-gen-go-grpc
```

After installing the required tools, please refer to the [GRPC Go Quickstart Guide](https://grpc.io/docs/languages/go/quickstart/) to learn how to use the basic `protoc` tool for generating GRPC code.

## Framework Tools

Make sure the CLI development tool for the **GoFrame framework** is version `>= v2.4`. For installation or upgrade instructions, please refer to the chapter: [Development Tools](/docs/development-tools).

The `GoFrame` CLI tool provides additional command support specifically for the `GRPC` protocol, greatly simplifying microservice development based on `GRPC`.
