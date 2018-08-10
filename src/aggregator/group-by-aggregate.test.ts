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

test("The group by aggregate actually works", async (t) => {
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

  const result = await aggregator({
      where: [
        {user_id: '3'},
      ],
    },
  );

  console.log("AGGREGATE RESULT:", result);

  t.deepEqual(
    result,
    {something: "else"},
  );
});
