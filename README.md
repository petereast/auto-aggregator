# auto-aggregator
Something to asynchronously aggregate events based on documentation
[![Build Status](https://travis-ci.com/petereast/auto-aggregator.svg?token=EWWgC6LaBqjXrVpoahqn&branch=master)](https://travis-ci.com/petereast/auto-aggregator)

This whole thing works on the concept of *knowledge representation*, we can represent what we know,
and we can use this information to expand what we know repeatedly. This means we can explore an eventsourced
data store with little starting knowledge.

## Benefits of using this
- The programmer does not need to spend time writing a bespoke aggregate to perform a simple read operation.
- These bespoke aggregates are fragile, they are not able to cope with new events, or changes to existing events.
- As a result, bespoke aggregators are a place in which tech-debt can easilt accumulate.
- This system will prevent that.
- Also it's good to document events somehow.
