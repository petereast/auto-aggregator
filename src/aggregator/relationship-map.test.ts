import test from 'ava';
import * as util from 'util';

import {
  generate_relationship_graph,
  navigate_relationship_map,
  generate_relationship_tree,
} from './relationship-map';

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

test("Generates a correct relationship tree from a given start point", async (t) => {
  const event_relationships = generate_relationship_graph(
    Object.values(example_event_defs),
  );

  const result = generate_relationship_tree('a', event_relationships);
  console.log(util.inspect(result, false, null));

  t.deepEqual(
    result,
    {
      start_point: 'a',
      children: [
        {
          start_point: 'b',
          children: [],
        },
        {
          start_point: 'c',
          children: [
            {start_point: 'd', children: []},
            {start_point: 'e', children: []},
            {start_point: 'f', children: []},
          ],
        },
      ],
    },
  );
});
