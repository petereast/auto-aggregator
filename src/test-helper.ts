// Test helper - provides testing methods and stuff

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
      return undefined;
    }
  },
};
