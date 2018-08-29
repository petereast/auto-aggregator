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

test.failing("The aggregator selects correct information for a simple aggregation", async (t) => {
  const example_query: AggregationQuery = {
    select: [
      'email',
      'name',
      'organisation_id',
//      'membership_status',
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
    {
      name: 'stev',
      email: 'pater@repositive.io',
      organisation_id: '2',
    } as any,
  );
});

test.todo("The aggregator returns correct information for 'grouped' aggregations");

test.todo("The aggregator returns multiple possible values when necessary");
