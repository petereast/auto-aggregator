import test from 'ava';

import {
  AggregationQuery,
  staggered_group_by_aggregate,
} from '.';

import {
  read_events,
} from '../parser';
import {
  store,
  fake_event_defs,
} from '../test-helper';

test.failing("The group by aggregate actually works", async (t) => {
  const example_query: AggregationQuery = {
    select: [
      'email',
      'name',
      'organisation_id',
    ],
    where_keys: [
      'user_id',
    ],
    group_by: [
      'organisation_id',
    ],
  };

  const aggregator = staggered_group_by_aggregate(
    fake_event_defs,
    store,
    example_query,
  );

  console.log(aggregator({
    where: [
    {user_id: 'something'},
    ],
  },
  ));

  t.fail();
});
