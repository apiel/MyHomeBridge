Should UI display item or actions or both?

actions is a set of item
actions could be handle by timers

actually actions should may be just be a way to set a bunch of task (timer) 
and should display the current timer table 
and also all the timer achieved since the request was running

All item could run inside a queue? async and sync...?

ACTION would became ====> TASK

Therefor we could have a single task or a set of task
Could it be possible to have anonymous task??? for example switch off this light in 10min --> YES

An action should be able to call item or other action
If a timer is set, it should run the item with delay. If an action has a timer, all the items contained in the child action will be delay.
But the timer/delay does not support action, only item.


