# Microservices and Boundaries

The framework's support for microservices projects is achieved through basic components, development standards, and development tools.

While the framework supports the development of microservices projects, as a code development framework, it has its own boundaries of responsibility. The following microservices-related content is not involved in the code framework:

- CI/CD

- Service Governance

- Monitoring and Alerting

- Specific technical solutions

    such as service layering, service splitting, log collection, distributed locks, distributed caching, distributed transactions, etc.

- Data service selection

    such as choosing which message queue service to use, should be decided based on specific business scenarios.

## Interface Protocols

Microservices do not restrict the communication protocols between services. For example, HTTP is commonly used, and in the Golang development stack, gRPC is often the primary choice.

## Interface Adaptation

Regardless of the communication protocol used at the upper layer, the framework provides components and tools for interface adaptation, which hides the differences in interface protocols, allowing various protocols to be converted into the framework's internal interface format before entering the framework. Adaptation for different upper-layer interface protocols is implemented in the form of tools (code generation), and no changes are needed for the business interfaces or business logic code within the framework. At the same time, because the upper-layer interface protocols are converted to internal interface formats, the framework can provide unified interface delivery documentation for different protocols.

## Service Components

The framework provides commonly used core foundational components related to microservices. Service components are designed with interfaces in the main library of the framework to ensure a lightweight and decoupled design, with specific implementation logic provided by community components.

## Core Components

The framework's core components are the lowest-level project components used to build upper-level service components or business components.

## Data Services

At the bottom of the service stack are various data services, such as MySQL, MongoDB, and other data storage solutions, or message queues like Kafka, RocketMQ, etc.
