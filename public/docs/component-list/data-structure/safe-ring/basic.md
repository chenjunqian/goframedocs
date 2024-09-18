# Safe Ring - Basic Usage

## Josephus Problem

Let's use the `ring` data structure to simulate the Josephus problem:

> The famous Jewish historian Josephus told the following story: After the Romans captured Jotapata, 39 Jews, along with Josephus and his friend, hid in a cave. The 39 Jews decided they would rather die than be captured by the enemy, so they devised a suicide plan. The 41 people formed a circle, and starting with the first person, every third person had to commit suicide. The counting would restart with the next person, continuing until everyone had died. However, Josephus and his friend didn't want to follow through. The process was as follows: starting with the first person, they skipped over `k-2` people (since the first one was already skipped) and killed the `kth` person. Then, they would skip over `k-1` people and kill the `kth` person again. This process continued around the circle until only one person was left alive. The question is: given the initial conditions, where should one stand to avoid being executed?

The following example demonstrates the scenario without concurrency safety.

### Code Example

```go
package main

import (
    "fmt"
    "github.com/gogf/gf/v2/container/gring"
)

type Player struct {
    position int  // Position in the circle
    alive    bool // Whether the player is still alive
}

const (
    playerCount = 41  // Total number of players
    startPos    = 1   // Starting position for counting
)

var (
    deadline = 3  // The number to count to before a player is eliminated
)

func main() {
    // Create a new ring with a total of playerCount positions
    r := gring.New(playerCount)

    // Set initial values for all players
    for i := 1; i <= playerCount; i++ {
        r.Put(&Player{i, true})
    }

    // Set the starting position for counting if it's not 1
    if startPos > 1 {
        r.Move(startPos - 1)
    }

    counter   := 1  // Start counting from 1, since the loop below will start from the second count
    deadCount := 0  // Initial number of dead players, starting at 0

    // Keep looping until all players are dead
    for deadCount < playerCount {
        // Move to the next player
        r.Next()

        // If the player is still alive, count
        if r.Val().(*Player).alive {
            counter++
        }

        // If the count reaches the deadline, this player is eliminated
        if counter == deadline {
            r.Val().(*Player).alive = false
            fmt.Printf("Player %d died!\n", r.Val().(*Player).position)
            deadCount++
            counter = 0
        }
    }
}
```

***Execution Output***

Upon executing the above program, the output will be as follows:

```bash
Player 3 died!
Player 6 died!
Player 9 died!
Player 12 died!
Player 15 died!
Player 18 died!
Player 21 died!
Player 24 died!
Player 27 died!
Player 30 died!
Player 33 died!
Player 36 died!
Player 39 died!
Player 1 died!
Player 5 died!
Player 10 died!
Player 14 died!
Player 19 died!
Player 23 died!
Player 28 died!
Player 32 died!
Player 37 died!
Player 41 died!
Player 7 died!
Player 13 died!
Player 20 died!
Player 26 died!
Player 34 died!
Player 40 died!
Player 8 died!
Player 17 died!
Player 29 died!
Player 38 died!
Player 11 died!
Player 25 died!
Player 2 died!
Player 22 died!
Player 4 died!
Player 35 died!
Player 16 died!
Player 31 died!
```

As seen in the output, players 16 and 31 are the last two to be eliminated. Therefore, Josephus arranged for himself and his friend to stand at positions 16 and 31, ensuring their safety.
