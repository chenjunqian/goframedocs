# Moduler Design

In this chapter, we will first discuss the principles of design and reuse in modular software architecture, and then introduce the modular design of the `Goframe` framework, to help everyone gain a better understanding of the concepts behind `Goframe`'s modular design philosophy.

## 1. What is Module

A module, also known as a component, is the unit of reusable functional logic encapsulation in a software system. The concept of a module can vary somewhat at different software architectural levels. At the development framework level, a module is the smallest unit of encapsulation for a certain type of functional logic. In the context of Golang code, we can also refer to a `package` as a module.

## 2. Purpose of Moduler

The purpose of modular design in software is to achieve the utmost `decoupling` and `reuse` of software functionality and logic, with the ultimate goal of ensuring the efficiency and quality of software development and maintenance.

## 3. Module Resuse Principle

### REP Reuse/Release Equivalence Principle

The `Reuse/Release Equivalency Principle`: The granularity of software reuse should be equivalent to the granularity of its release.

If you want to reuse a piece of code, it should be extracted into a module.

### CCP Common Closure Principle

The `Common Closure Principle`: Classes that are changed for the same reason should be placed within the same module.

For most applications, `maintainability` is far more important than `reusability`. Code modifications caused by the same reason should be located in the same module; if scattered across multiple modules, the costs of development, commitment, and deployment will increase.

### CRP Common Reuse Principle

The `Common Reuse Principle`: Do not force a module to depend on something it does not need.

You've probably experienced this: you integrated module A, but module A depends on modules B and C. Even if you don't need modules B and C at all, you have to integrate them as well. This is because you only used part of module A's capabilities, and the extra capabilities in module A brought extra dependencies. If you follow the Common Reuse Principle, you would need to split A, retaining only the parts you intend to use.

### Principle of Reuse Competition

The principles of `REP`, `CCP`, and `CRP` are in a competitive relationship with each other. `REP` and `CCP` are cohesive principles that can make modules larger, while the `CRP` principle is an exclusive principle that can make modules smaller. Adhering to `REP` and `CCP` while ignoring `CRP` may result in dependencies on many modules and classes that are not used, and changes in these modules or classes can lead to too many unnecessary releases of your own module. Adhering to `REP` and `CRP` while ignoring `CCP` can lead to modules being too finely divided, and a single requirement change may require modifications across multiple modules, which also brings significant costs.

## 4. Framework Module Design

After the introduction to the principles of `modular` design and `reuse`, we should have a general understanding of the principles involved in module development and management. With this foundation, it will be easier to understand the modular design of the framework.

### Single Repository Package Design

Based on the `REP` principle, we understand that a reusable module supports independent version management, and single repository package design is just that. In `Golang`, there are many such single repository packages, where one package constitutes an independent module. According to the `CRP` principle, single repository packages can be further decoupled and split.

Let's take an example of common package dependency situations in the development of complex business project scenarios, similar to this:

```go
module business

go 1.16

require (
    business.com/golang/strings v1.0.0
    business.com/golang/config v1.15.0
    business.com/golang/container v1.1.0
    business.com/golang/encoding v1.2.0
    business.com/golang/files v1.2.1
    business.com/golang/cache v1.7.3
    business.com/framework/utils v1.30.1
    github.com/pkg/errors v0.9.0
    github.com/goorm/orm v1.2.1
    github.com/goredis/redis v1.7.4
    github.com/gokafka/kafka v0.1.0
    github.com/gometrics/metrics v0.3.5
    github.com/gotracing/tracing v0.8.2
    github.com/gohttp/http v1.18.1
    github.com/google/grpc v1.16.1
    github.com/smith/env v1.0.2
    github.com/htbj/command v1.1.1
    github.com/kmlevel1/pool v1.1.4
    github.com/anolog/logging v1.16.2
    github.com/bgses123/session v1.5.1
    github.com/gomytmp/template v1.3.4
    github.com/govalidation/validate v1.19.2
    github.com/yetme1/goi18n v0.10.0
    github.com/convman/convert v1.20.0
    github.com/google/uuid v1.1.2
    // ...
)
```

Developers who have used `Golang` to work on complex business projects will be no stranger to such scenarios. A typical software company often has at least hundreds of such projects, and the real module dependency relationships are more complex than the examples given here. In `Golang` project development, maintaining module dependencies presents a significant challenge, and we often encounter some pain points:

- There are many modules that implement the same functionality, increasing the cost of choice.
- Excessive project dependencies can affect the overall stability of the project.
- With too many project dependencies, it's difficult to decide whether to upgrade the versions of these modules.
- Modules are designed in a scattered way, without a systematic approach, making it hard to standardize.

## Module Aggregation Design

`Goframe`'s modular management philosophy places greater emphasis on the `CCP` principle, valuing `maintainability` over `reusability`. Since `Goframe` is considered from the perspective of a development framework, the overall framework design is not a single-point design but a top-down design.

As previously mentioned, the more fundamental the underlying module, the more dependent the top-level modules are on it, and the greater the impact. Therefore, the framework centrally maintains some general-purpose core modules. The purpose of this is to form a closure among these modules, ensuring the stability of the basic modules, and by unified version management, it improves development efficiency and maintainability, reducing the cost of integration and maintenance.

From the perspective of `Goframe`'s framework modular design, the dependency situation in the previous example should become the following:

```go
module business

go 1.16

require (
    github.com/gogf/gf v1.16.0
    github.com/goorm/orm v1.15.1
    github.com/goredis/redis v1.7.4
    github.com/gokafka/kafka v0.1.0
    github.com/google/grpc v1.16.1
    // ...
)
```

`Goframe` only maintains some general-purpose core modules. For other non-core general-purpose modules or modules with high stability, it is still recommended to use the single repository package form for dependency introduction, just as the `REP` and `CRP` principles of module reuse advocate. In this design pattern:

- The framework core maintains a comprehensive set of general basic modules, reducing the selection cost of basic modules.
- We only need to maintain a unified framework version, instead of dozens of module versions.
- We only need to be aware of the content changes of a single framework, instead of the content changes of dozens of modules.
- When upgrading, it is only necessary to upgrade a single framework version, instead of the versions of dozens of modules.
- This reduces the cognitive load on developers, improves the maintainability of modules, and makes it easier to ensure the consistency of module versions across various business projects.
