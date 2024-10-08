# Unified Framework Design

The software industry is similar to the construction industry. If we consider our product to be a high-rise building, then the program code is the brick material for constructing the high-rise (our daily work is like continuously "moving bricks"). If the software architecture is the overarching plan, then the program code is the key component that ensures the accurate implementation of the software architecture.

Program code is so important that the significance of a development framework goes without saying. A development framework focuses on the code level, addressing general technical issues with the aim of allowing developers to concentrate on the business itself, assisting the software architecture in quickly responding to business changes, and improving the overall efficiency of software development and maintenance.

In this chapter, we mainly introduce the significance and necessity of building a unified development framework.

## 1. Technical Systematization

Systematization focuses more on the overall combat effectiveness of the framework rather than each module itself.

The notable features of a systematic framework design are:

- Comprehensive system, rich components
- Unified standards, consistent style
- Unified abstraction, rigorous design
- Efficient execution, no redundant logic

The systematization we refer to here is the micro-level unified design from the top down of the code development framework, making the design philosophy of the entire framework integrated rather than fragmented. Technically, solving a specific problem is relatively simple, and developing a specific module is also easy. However, abstracting and precipitating common issues, organizing and coordinating various independent modules according to a unified design philosophy, and generating strong comprehensive combat effectiveness is not a simple task. This requires the framework designer to have a certain technical heritage, experience accumulation, vision, and foresight, rather than focusing only on individual modules.

For example, even if we have not developed a framework, we should have used one to some extent and know what modules a framework will at least contain. When we need to write logs, we know that such a component framework must provide it, so we will look for it in the framework and get usage help from the official website. When we need capabilities such as WebServer, database access, template engines, etc., we can also anticipate that such component frameworks will provide them, so we will also look for them in the framework and get usage help from the official website.

For another example, when using various modules in the framework, although each module is designed with low coupling and used as needed, we find that their configuration management methods are consistent, all are structured configuration management objects, through the same configuration management module, through fixed configuration item to configuration object attribute mapping rules, through methods starting with `Get`/ `Set` for reading and setting (all component parameter acquisition and setting are also methods starting with `Get`/ `Set`), and the global environment variable/startup parameter settings are also similar. This allows developers to quickly recognize the behavior of the framework, achieving the goal of rapid access and reducing learning costs.

For another example, there is a great feature at the framework level - the full error stack feature. All components of the framework return errors with error stacks, which facilitates the top-level business in quickly locating problems through the error stack when an error occurs. Currently, only the `Goframe` framework has this capability under the `Golang` development language.

The above are just a few simple examples. If you are interested, you can discover more interesting points from the framework.

Finally, we can think about why we can subconsciously recognize the behavior of the framework, why the framework can provide extremely high convenience and extremely low access costs, and why the framework modules have a very high degree of organizational coordination under the design philosophy of `high cohesion, low coupling`. Why does this phenomenon occur? In fact, this is the difference between the framework adopting a systematic design and "piecing together" encapsulation.

## 2. Development Standardization

There also needs to be a series of development standards at the code level, such as basic code structure, layering models, encapsulation design, etc. For details, please refer to: [Engineering Development Design](https://temperory.net). A unified framework design will ensure that all business projects follow a consistent code design for coding, forming a unified development standard. In addition, the framework's development toolchain will also make it easier to quickly promote and implement development standards: [Development Tools](https://temperory.net).

## 3. Component Unification

There are two concepts of unification here:

- Multiple components with the same functionality are unified into a single component.
- Multiple components with different functionalities are managed under a unified framework.

Another pain point is the proliferation of development components:

- There are many modules that implement the same functionality logic, which increases the cost of choice.
- An excessive number of modules that a project depends on can affect the overall stability of the project.
- With too many modules that a project depends on, it becomes difficult to decide whether to upgrade these module versions.
- An excessive number of project dependencies can lead to different modules depending on different versions of the same third-party module, causing version compatibility issues.
- Each module is designed in isolation, and each module may have high replaceability when viewed individually. This makes it difficult to establish a development system and to unify development standards.

A unified development framework can bring the state of `each module operating independently` under `unified management`:

- The framework is designed from the top down, forming a systematic and unified module design, which is more conducive to the implementation of standardized development.
- The core of the framework maintains a comprehensive set of general basic modules, reducing the cost of choosing basic modules.
- We only need to maintain a single, unified framework version instead of dozens of module versions.
- We only need to be aware of the changes in a single framework, rather than the content changes of dozens of modules.
- When upgrading, it is only necessary to upgrade a single framework version, rather than the versions of dozens of modules.
- A unified modular design can reduce unnecessary logical implementations, improving module performance and usability.
- It lightens the cognitive load on developers, enhances the maintainability of modules, and makes it easier to ensure the consistency of module versions across various business projects.

## 4. Version Consistency

The issue of version consistency mainly stems from an excess of modules and versions that a project depends on, making it difficult to uniformly maintain and upgrade versions. Once the development framework centralizes the management of modules, it becomes easier to ensure the version consistency of project modules. However, it should be noted that this consistency is not a strong consistency; it merely reduces the complexity of module and version maintenance, but the issue of inconsistency still exists. We have discussed the pain points and improvements in previous chapters, and you can also refer to the section on [Modular Design](https://temperory.net). I will not repeat it here.

There are also some code management solutions in the industry that enforce strong version consistency, such as using a `Monorepo` for code management. Each has its pros and cons, which you can learn about on your own, and I will not elaborate on them here.

## 5. Avoiding Resource Waste

When every team is trying to reinvent the wheel, not only is it impossible to form a unified development standard, but there is also a great deal of resource waste.

> This phenomenon is particularly evident in the early days of the popularity of the `Golang` language, or in the early stages when a startup's technical system is not yet mature.

Allowing project teams to focus more on business is, I believe, a consensus among most technology companies. Using a unified development architecture allows for the extraction of common technical issues and the formation of general solutions. It prevents each project from having to tackle the various technical challenges it encounters on its own, effectively freeing up energy.
