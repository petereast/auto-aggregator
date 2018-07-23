import test from 'ava';

import {
  generate_relationship_graph,
} from './generate-relationship-map';

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

test("Generates a correct relationship map", async (t) => {
  const result = generate_relationship_graph(
    Object.values(example_event_defs),
  );

  t.deepEqual(
    Array.from(result.entries()),
    [
      ['a', ['b', 'c']],
      ['b', ['a', 'c']],
      ['c', ['a', 'b', 'd', 'e', 'f']],
      ['d', ['c', 'e', 'f']],
      ['e', ['c', 'd', 'f']],
      ['f', ['c', 'd', 'e']],
      ['h', ['i', 'j']],
      ['i', ['h', 'j']],
      ['j', ['h', 'i']],
    ],
  );
});
