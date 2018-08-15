// Test helper - provides testing methods and stuff
import * as R from 'ramda';

const fake_event_pool = [
  {
    type: "AccountInvitedToOrg",
    payload: {
      invite_token: '1',
      invited_name: 'stev',
      organisation_id: '2',
      organisation_type: 'something',
      email: 'peter@repositive.io',
    },
    time: 1,
  },
  {
    type: "AccountCreated",
    payload: {
      name: 'stev',
      email: 'peter@repositive.io',
      user_id: '3',
    },
    time: 2,
  },
  {
    type: "AccountEmailUpdated",
    payload: {
      user_id: '3',
      email: 'poter@repositive.io',
    },
    time: 3,
  },
  {
    type: "AccountInviteToOrgAccepted",
    payload: {
      user_id: '3',
      organisation_id: '2',
    },
    time: 4,
  },
  {
    type: "AccountEmailUpdated",
    payload: {
      user_id: '3',
      email: 'pater@repositive.io',
    },
    time: 5,
  },
  {
    type: "AccountInviteToOrgRevoked",
    payload: {
      invite_token: '1',
    },
    time: 6,
  },
  {
    type: "AccountCreated",
    payload: {
      name: 'john',
      email: 'john@repositive.io',
      user_id: '4',
    },
    time: 7,
  },
  {
    type: 'AccountCreated',
    payload: {
      name: 'orgng',
      email: 'never@trust.orang',
      user_id: '5',
    },
    time: 8,
  },
];

export const fake_event_defs = {
  AccountInvitedToOrg: {
    payload: [
      'invite_token',
      'invite_name',
      'organisation_id',
      'organisation_type',
    ],
    state: {
      membership_status: {
        type: 'string',
        value: 'PENDING',
      },
    },
  },
  AccountInviteToOrgAccepted: {
    payload: [
      'user_id',
      'organisation_id',
    ],
    state: {
      membership_status: {
        type: 'string',
        value: 'ACCEPTED',
      },
    },
  },
  AccountCreated: {
    payload: [
      'name',
      'email',
      'user_id',
    ],
  },
  AccountInviteToOrgRevoked: {
    payload: [
      'invite_token',
    ],
  },
  AccountEmailUpdated: {
    payload: [
      'user_id',
      'email',
    ],
  },
};

export const store = {
  readAll: (condition?: any) => {
    // Returns a filtered list of events from the fake_event_pool
    // Simulating postgres functionality
    if (!condition) {
      return fake_event_pool;
    } else {
      console.log(condition);
      return R.sort(
        (a, b) => a.time - b.time,
        fake_event_pool.filter(
          (item) => {
            let isType = false;
            if (condition.type) {
              isType = item.type === condition.type;
            }
            return isType || Object.entries(item.payload).reduce(
              (acc, entry) => {
                // Entry is a [key, value] array
                if (R.path([entry[0]])(condition)) {
                  return acc || entry[1] === R.path([entry[0]])(condition);
                }
                return acc;
              }, false);
            return true;
          }));
    }
  },
};
