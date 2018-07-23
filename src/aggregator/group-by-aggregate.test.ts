import test from 'ava';

import {
  group_by_aggregate,
  AggregationQuery,
} from '.';

import {
  read_events,
} from '../parser';
import {store} from '../test-helper';

test("The group by aggregate actually works", async (t) => {
  const example_query: AggregationQuery = {
    select: [
      'something',
    ],
    where: {
      email: 'peter@repositive.io',
    },
    group_by: [
      'organisation_id',
    ],
  };
  const result = group_by_aggregate(read_events(), example_query)
    (store);
  console.log(result);
  t.fail();
});
