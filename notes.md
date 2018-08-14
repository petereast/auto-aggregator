# Notes

- Slight problem - the aggregator assumes that every field in each event is unique to the entity the event affects. This could be solved by specifying which attributes are unique in
  the event definition, or some other way? Maybe by leaving it as it is, and evaluating the strength of the relationship between selected events and the knowledge
