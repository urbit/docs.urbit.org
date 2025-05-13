# Khan

Khan is the "control plane" and thread-runner vane. Its main purpose is to allow external applications to run [threads](../../../userspace/threads) via a Unix Socket and receive the result.

At this stage, Khan's external interface is still experimental, and there are not yet proper libraries for other languages that can make use of it. Therefore, these documents will only touch on Khan's internal interface.

Khan's internal interface lets you run threads via Khan rather than having to poke [Spider](../../../userspace/threads/reference/api.md) and subscribe for the result. This interface is simpler and more ergonomic than Spider's, so is usually preferable.

There are two `task`s for running threads from userspace: [`%fard`](reference/tasks.md#fard) and [`%lard`](reference/tasks.md#lard). The former is for running a thread from file and the latter is for running an "in-line" thread, where you pass Khan the thread directly.

