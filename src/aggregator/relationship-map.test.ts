import test from 'ava';
import * as util from 'util';

import {
  generate_relationship_graph,
  relationship_map_navigator,
  generate_relationship_tree,
  search_tree,
} from './relationship-map';

const example_event_defs = {
  A: {
    payload: ['a', 'b', 'c', 'h'],
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

test("Generates a correct adjacency matrix for the relationships between event payloads", async (t) => {
  const result = generate_relationship_graph(
    Object.values(example_event_defs),
  );

  t.deepEqual(
    Array.from(result.entries()),
    [
      ['a', ['b', 'c', 'h']],
      ['b', ['a', 'c', 'h']],
      ['c', ['a', 'b', 'h', 'd', 'e', 'f']],
      ['h', ['a', 'b', 'c', 'i', 'j']],
      ['d', ['c', 'e', 'f']],
      ['e', ['c', 'd', 'f']],
      ['f', ['c', 'd', 'e']],
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
        {
          start_point: 'h',
          children: [
            {start_point: 'i', children: []},
            {start_point: 'j', children: []},
          ],
        },
      ],
    },
  );
});

test("The tree search function finds the correct path to a point", async (t) => {
  const event_relationships = generate_relationship_graph(
    Object.values(example_event_defs),
  );

  const relationship_tree = generate_relationship_tree(
    'a',
    event_relationships,
  );

  // TODO: Make these functions composable

  const result = search_tree(relationship_tree, 'f');

  t.deepEqual(
    result,
    ['a', 'c', 'f'],
  );
});

test("The whole thing works together nicely", async (t) => {
  const result = relationship_map_navigator(
    Object.values(example_event_defs),
    ['a', 'b', 'c'],
  )('f');

  t.deepEqual(
    result,
    [
      ['a', 'c', 'f'],
      ['b', 'c', 'f'],
      ['c', 'f'],
    ],
  );
});
