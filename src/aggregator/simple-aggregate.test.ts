import {
  simple_aggregate,
} from '.';
import {
  read_events,
} from '../parser';

import test from 'ava';

const test_events = [
  {
    type: "AccountInvitedToOrg",
    payload: {
      invite_token: '1',
      name: 'stev',
      organisation_id: '2',
      organisation_type: 'something',
    },
  },
  {
    type: "AccountCreated",
    payload: {
      name: 'stev',
      email: 'peter@repositive.io',
      user_id: '3',
    },
  },
  {
    type: "AccountInviteToOrgRevoked",
    payload: {
      invite_token: '1',
    },
  },
  {
    type: "AccountCreated",
    payload: {
      name: 'john',
      email: 'john@repositive.io',
      user_id: '4',
    },
  },
];

test("The aggregate returns an acceptable result", async (t) => {
  const example_query = {
    select: [
      'invite_token',
      'organisation_id',
      'user_id',
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
    },
  );
});

test('The aggregator returns an acceptable result when grouping events', async (t) => {
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
