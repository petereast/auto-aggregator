import * as R from 'ramda';

import events_by_payload from './events_by_payload';

export {events_by_payload};

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

// TODO: Write a query parser in parser
const simple_aggregate = (event_definitions: any[], query: any) => (events: any[]) => {
  // Get all the stuff related to what we need, then trim out the stuff we don't
  const events_of_interest: string[] = R.uniq(
    query.select.reduce((acc: any, attr: any) => {
      return [...acc, ...events_by_payload(event_definitions).get(attr)];
    }, [] as string[]),
  );

  const selected_events = R.filter((event) => {
    return R.contains(event.type)(events_of_interest);
  },
    events,
  );

  console.log(selected_events);

  return R.pick(query.select)(selected_events.reduce((acc, event) => {
    return {...acc, ...event.payload};
  }, {}));
};

export {
  simple_aggregate,
  test_events,
  example_query,
};
