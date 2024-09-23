# Cron - gcron and gtimer

## Differences Between gcron and gtimer

***Overview***

- **gcron**: A scheduling tool that supports classic crontab syntax for scheduling tasks, with the minimum time interval set to seconds. It is built on top of the gtimer module.
- **gtimer**: A high-performance module that serves as a core component of the framework. It provides the foundation for any scheduled tasks, with execution times measured in nanoseconds. It is suitable for various scenarios, such as TCP communication and game development.

### Key Features

```markdown
| Feature        | gcron                          | gtimer                                                   |
|----------------|--------------------------------|----------------------------------------------------------|
| Task Type      | Scheduled tasks                | Timer                                                    |
| Time Scale     | Natural seconds                | Custom time slots                                        |
| Performance    | General efficiency             | High efficiency                                          |
| Support        | Based on gtimer                | Not supported                                            |
| Implementation | Built on gtimer                | Custom implementation using PriorityQueue data structure |
```

## Summary

- **gcron** is designed for high-level scheduling tasks with a focus on usability and simplicity, providing a more user-friendly interface for defining tasks based on a natural time scale.
- **gtimer**, on the other hand, is a lower-level component that operates with high efficiency and allows for more granular control over time slots, but does not provide the same scheduling syntax as gcron.

This differentiation helps users choose the appropriate tool based on their specific needs in terms of performance and ease of use.
