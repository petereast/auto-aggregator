import test from 'ava';

import clustered_payloads from './clustered-payloads';

const example_event_defs = {
  A: {
    payload: ['a', 'b', 'c'],
    state: {},
    sequence: 0,
  },
  B: {
    payload: ['c', 'd', 'e'],
    state: {f: '1'},
    sequence: 1,
  },
  C: {
    payload: ['h', 'i', 'j'],
    state: {},
    sequence: 2,
  },
};

test("It correctly clusters the event payloads", async (t) => {
  const result = clustered_payloads(Object.values(example_event_defs));
  t.deepEqual(
    result,
    [ [ 'a', 'b', 'c' ], [ 'c', 'd', 'e', 'f' ], [ 'h', 'i', 'j' ] ],
  );
});
