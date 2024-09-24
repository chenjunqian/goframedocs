# Cron - gcron

## Overview

The `gcron` module provides functionality for managing scheduled tasks. It supports a configuration management style similar to **crontab** and allows scheduling tasks with a minimum granularity of one second.

***Usage***

To use the `gcron` module, import the following package:

go
import "github.com/gogf/gf/v2/os/gcron"

***API Documentation***

For more detailed API information, visit the following link:

[https://pkg.go.dev/github.com/gogf/gf/v2/os/gcron](https://pkg.go.dev/github.com/gogf/gf/v2/os/gcron)

## Key Features

- **New**:  
  Used to create a custom task management object.

- **Add**:  
  Used to add a scheduled task. It includes the following parameters:
  - `pattern`: Specifies the task schedule using **CRON syntax** (details on CRON syntax are provided later in this section).
  - `job`: The task method (or function pointer) that needs to be executed.
  - `name`: This is an optional parameter to assign a unique name to the scheduled task. **Note**: If a task with the same name already exists, adding the new task will fail.

- **AddSingleton**:  
  Adds a singleton scheduled task, meaning that at any given time, only one instance of this task can be running (internally managed using memory-based deduplication).

- **AddOnce**:  
  Adds a scheduled task that runs only **once**. After executing, the task is automatically destroyed.

- **AddTimes**:  
  Adds a task that runs for a specified number of times. After running the task `times` number of times, it is automatically destroyed.

- **Entries**:  
  Retrieves information about all currently registered scheduled tasks.

- **Remove**:  
  Removes (and stops) a scheduled task by its name.

- **Search**:  
  Searches for a scheduled task by name and returns a pointer to the task's `*Entry` object.

- **Start**:  
  Starts the scheduled task (automatically started after `Add`). You can specify the task to start by providing its name.

- **Stop**:  
  Stops the scheduled task. You can specify the task to stop by providing its name. **Note**: The `Remove` method will both stop and delete the task.

- **Close**:  
  Closes a custom task management object.

## Important Notes

***Impact of Global Process Time Zone***

Scheduled tasks rely heavily on time calculations, so the global time zone setting of the process can significantly affect task execution. When adding a scheduled task, ensure that the process's global time zone is set correctly. If no global time zone is set, the system's default time zone will be used. For more information on time zone settings, refer to the [Time Management - Time Zone Settings](/docs/component-list/system-related/time/setting) section.
