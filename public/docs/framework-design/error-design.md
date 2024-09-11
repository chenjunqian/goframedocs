# Framework Full Error Stack Design

## 1. Unified Error Component

The `Goframe` provides the most powerful error handling component in the industry, and this component is also widely used within the framework, reducing the choice cost for teams.

## 2. Unified Error Handling Scheme

The `Goframe` offers a robust set of engineering design specifications, including a necessary unified error handling scheme. With the unified framework's engineering design, some common pain points have been resolved through components and tools, allowing teams to focus on the business itself, making development work more efficient.

Under the unified error handling scheme, all method calls in the project will use the error return value as the basis for successful execution. If the error is not nil, return promptly and pass it up the chain, where it will be uniformly handled at the top level. Moreover, the framework's key components already provide default error handling logic.

## 3. All Components Support Error Handling

All basic components of the `Goframe` return an error object with a stack trace.

This is a challenging feature because the components provided by the framework cover almost all the needs of most projects, but the framework has indeed achieved it. Although the framework has invested a lot in this area (a separate version was implemented to add this feature), it is a one-time investment with long-term benefits. This means that if the project uses the unified GoFrame base framework, error handling will be more convenient, the risk of losing the error stack is greatly reduced, and the project will be more robust and easier to debug quickly.

## 4. Key Components Support Error Stack Printing

In the framework's key components, default handling for printing error stacks is provided to improve usability and reduce the burden on users. These key components are the entry points of the program, such as the `HTTP`/`GRPC` Server and `Command-line` interface.
