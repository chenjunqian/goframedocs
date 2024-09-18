# Memory Lock - gmlock

The memory lock module, also known as the dynamic mutex lock module, supports dynamically generating mutex locks based on a given key. It is thread-safe and supports the `TryLock` feature.

When managing a large number of dynamic mutex locks, if a lock is no longer needed, it is recommended to manually call the `Remove` method to delete the mutex lock object.

***Usage***

To use the `gmlock` module, import it as follows:

```go
import "github.com/gogf/gf/v2/os/gmlock"
```

***Suitable Scenarios***

This module is useful when you need to dynamically create mutex locks or manage a large number of dynamic locks.

***API Documentation***

You can refer to the API documentation at the following link:  
[https://pkg.go.dev/github.com/gogf/gf/v2/os/gmlock](https://pkg.go.dev/github.com/gogf/gf/v2/os/gmlock)

***Functions***

```go
func Lock(key string)
func LockFunc(key string, f func())
func RLock(key string)
func RLockFunc(key string, f func())
func RUnlock(key string)
func Remove(key string)
func TryLock(key string) bool
func TryLockFunc(key string, f func()) bool
func TryRLock(key string) bool
func TryRLockFunc(key string, f func()) bool
func Unlock(key string)
```

***Locker Type***

```go
type Locker
    func New() *Locker
    func (l *Locker) Clear()
    func (l *Locker) Lock(key string)
    func (l *Locker) LockFunc(key string, f func())
    func (l *Locker) RLock(key string)
    func (l *Locker) RLockFunc(key string, f func())
    func (l *Locker) RUnlock(key string)
    func (l *Locker) Remove(key string)
    func (l *Locker) TryLock(key string) bool
    func (l *Locker) TryLockFunc(key string, f func()) bool
    func (l *Locker) TryRLock(key string) bool
    func (l *Locker) TryRLockFunc(key string, f func()) bool
    func (l *Locker) Unlock(key string)
```

---

## Example 1: Basic Usage

The following example demonstrates basic usage of the `gmlock` module, where 10 goroutines are launched simultaneously, but only one can obtain the lock at any given time.

```go
package main

import (
    "time"
    "sync"
    "github.com/gogf/gf/v2/os/glog"
    "github.com/gogf/gf/v2/os/gmlock"
)

func main() {
    key := "lock"
    wg  := sync.WaitGroup{}
    for i := 0; i < 10; i++ {
        wg.Add(1)
        go func(i int) {
            gmlock.Lock(key)
            glog.Println(i)
            time.Sleep(time.Second)
            gmlock.Unlock(key)
            wg.Done()
        }(i)
    }
    wg.Wait()
}
```

***Explanation***

In this example, `10` `goroutines` are launched, but at any one time, only one `goroutine` can acquire the lock. The `goroutine` that acquires the `lock` holds it for `1` second before releasing it, allowing the next `goroutine` to obtain the lock.

***Output***

```bash
2018-10-15 23:57:28.295 9
2018-10-15 23:57:29.296 0
2018-10-15 23:57:30.296 1
2018-10-15 23:57:31.296 2
2018-10-15 23:57:32.296 3
2018-10-15 23:57:33.297 4
2018-10-15 23:57:34.297 5
2018-10-15 23:57:35.297 6
2018-10-15 23:57:36.298 7
2018-10-15 23:57:37.298 8
```

---

## Example 2: Non-Blocking TryLock

The `TryLock` method returns a boolean indicating whether the lock was successfully acquired. If the lock is already held by another goroutine, it returns `false`.

```go
package main

import (
    "sync"
    "github.com/gogf/gf/v2/os/glog"
    "time"
    "github.com/gogf/gf/v2/os/gmlock"
)

func main() {
    key := "lock"
    wg  := sync.WaitGroup{}
    for i := 0; i < 10; i++ {
        wg.Add(1)
        go func(i int) {
            if gmlock.TryLock(key) {
                glog.Println(i)
                time.Sleep(time.Second)
                gmlock.Unlock(key)
            } else {
                glog.Println(false)
            }
            wg.Done()
        }(i)
    }
    wg.Wait()
}
```

***Explanation***

In this example, only one `goroutine` can successfully acquire the lock. The other `gorouting` will fail and immediately exit at `TryLock`.

***Output***

```plaintext
2018-10-16 00:01:59.172 9
2018-10-16 00:01:59.172 false
2018-10-16 00:01:59.172 false
2018-10-16 00:01:59.172 false
2018-10-16 00:01:59.172 false
2018-10-16 00:01:59.172 false
2018-10-16 00:01:59.172 false
2018-10-16 00:01:59.172 false
2018-10-16 00:01:59.172 false
2018-10-16 00:01:59.176 false
```
