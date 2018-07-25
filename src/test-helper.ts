// Test helper - provides testing methods and stuff
import * as R from 'ramda';

const fake_event_pool = [
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
  {
    type: 'AccountCreated',
    payload: {
      name: 'orgng',
      email: 'never@trust.orang',
      user_id: '5',
    },
  },
];

export const store = {
  readAll: (condition?: any) => {
    // Returns a filtered list of events from the fake_event_pool
    // Simulating postgres functionality
    if (!condition) {
      return fake_event_pool;
    } else {
      return fake_event_pool.filter(
        (item) => {
          let isType = false;
          if (condition.type) {
            isType = item.type === condition.type;
          }
          return isType || Object.entries(item.payload).reduce(
            (acc, entry) => {
              // Entry is a [key, value] array
              if (R.path([entry[0]])(condition)) {
                console.log("ENTRY", entry);
                return acc || entry[1] === R.path([entry[0]])(condition);
              }
              return acc;
            }, false);
          return true;
        });
    }
  },
};