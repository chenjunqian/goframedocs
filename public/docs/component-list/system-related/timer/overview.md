# Timer - gtimer

## Overview

`gtimer` is a concurrent-safe, high-performance timer similar to Java's `Timer`. It is implemented using a priority queue (`PriorityQueue`).

***Use Cases***

- Any scheduled task scenario.
- High-volume scheduled tasks or delayed tasks.
- Timeout control or frequency control in business scenarios where precise timing is not critical.

***How to Use***

```go
import "github.com/gogf/gf/v2/os/gtimer"
```

***API Documentation***

You can view the full API documentation here: [gtimer API Documentation](https://pkg.go.dev/github.com/gogf/gf/v2/os/gtimer)

***Brief Explanation***

- The `New` method is used to create a custom task timer object. You can pass parameters using `TimerOptions` during creation:
  - `Interval` specifies the minimum tick interval for the timer.
  - `Quick` specifies whether the timer should execute immediately upon starting (default is `false`).

- The `Add` method is used to add scheduled tasks:
  - The `interval` parameter specifies the time interval at which the method should be executed.
  - The `job` parameter is the task function that needs to be executed.

- The `AddEntry` method allows for more control when adding scheduled tasks.

- The `AddSingleton` method adds a singleton task, meaning only one instance of this task can be running at any given time.

- The `AddOnce` method adds a task that only runs once. The task is automatically destroyed after it has been executed.

- The `AddTimes` method adds a task that runs for a specified number of times. After the `times` number of executions, the task is automatically destroyed.

- The `Search` method is used to search for a scheduled task by its name (returns a pointer to the `Entry` object of the task).

- The `Start` method starts the timer (when you create a timer using `New`, it automatically starts).

- The `Stop` method stops the timer.

- The `Close` method closes the timer.

---

## Default Timer

In most scenarios, using the default timer is sufficient. The default time-check interval for the `gtimer` is set to 100ms, meaning the theoretical timing error range is between 0 and 100ms. You can modify the default timer parameters in two ways:

***Using Startup Parameters***

- `gf.gtimer.interval=50`: Modify the default tick interval to 50 milliseconds.

***Using Environment Variables***

- `GF_GTIMER_INTERVAL=50`

**Note:** The shorter the default check interval, the greater the CPU usage.

---

## Important Notes

Since modern computers implement timers via software, **no timer is completely accurate**. Timers may have delays, and in some cases, they may even trigger slightly early, but they will not fail to execute. This is especially noticeable when the time intervals are large, or in systems with high concurrency and heavy load.

You can find more detailed discussions on this topic in this [GitHub issue](https://github.com/golang/go/issues/14410).

Since errors are inevitable, any timer implementation (including both framework timers and standard library timers) **does not rely on system time**, but instead uses a fixed tick interval. Therefore, it is meaningless to use system time to calculate logical intervals within timer tasks.

For example:

- If a task takes 3 minutes to complete and is scheduled to run every 5 minutes, there will be only 2 minutes of idle time between task executions.
  
Also, for **singleton** scheduled tasks, the task execution time affects when the task will run next. For example:

- If a task is set to execute every 1 second, but it takes 1 second to complete, the next task execution will start at the 3rd second (since the check for the next execution finds that the previous task is still running).

---

## Differences Between gtimer and gcron

For a detailed comparison between `gtimer` and `gcron`, please refer to the section: [Scheduled Tasks - gcron and gtimer](/docs/component-list/system-related/scheduled-tasks/gcron-and-gtimer).
