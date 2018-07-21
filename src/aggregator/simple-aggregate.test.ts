import {
  simple_aggregate,
} from '.';
import {
  read_events,
} from '../parser';

import test from 'ava';
import {store} from '../test-helper';

const test_events = store.readAll() as any[];

test("The aggregate returns an acceptable result", async (t) => {
  const example_query = {
    select: [
      'invite_token',
      'organisation_id',
      'user_id',
      'membership_status',
    ],
    where: {
      email: 'peter@repositive.io',
    },
  };
  const result = simple_aggregate(read_events(), example_query)
    (test_events);

  t.deepEqual(
    result,
    {
      invite_token: '1',
      organisation_id: '2',
      user_id: '4',
      membership_status: 'REVOKED',
    },
  );
});

test.failing('The aggregator returns an acceptable result when grouping events', async (t) => {
  const example_query = {
    select: [
      'invite_token',
      'organisation_id',
      'user_id',
    ],
    where: {
      email: 'peter"repositive.io',
    },
    group_by: [
      'name',
    ],
  };

  t.fail();
});
