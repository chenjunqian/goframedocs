# Context - gctx

## Introduction

The `gctx` component provides a wrapper for context operations, simplifying link tracking and management of process initialization context objects.

## Common Methods

This section briefly introduces a few commonly used methods. For more details, please refer to the component's API documentation or source code.

### New

Creates a new context object with link tracking capabilities.

### GetInitCtx

Used in process startup or `init` package methods to obtain a context object with link tracking capabilities for the current process. It is also used for passing link tracking information between processes.
