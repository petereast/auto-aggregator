import test from 'ava';

import {
  find_max_len,
  count,
  merge_in_place,
  remove_later_copies,
} from './dependency-processor';

test("correctly finds the max length of a 2d array", async (t) => {
  const test_data = [[2, 3, 4, 5, 53, 3, 2, 2, 2], [2, 32, 3, 1, 1, 1, 2, 4324], [21, 421, 4, 2]];

  t.is(find_max_len(test_data), 9);
});

test("correctly counts the items in an array", async (t) => {
  const test_data = [1, 1, 1, 1, 1, 2, 3, 4, 4, 3, 2, 1, 2, 3, 1, 3];

  t.is(count(test_data, (i) => i === 1), 7);
});

test("correctly merges some lists", async (t) => {

  const test_data = [
    ['a', 'b', 'c'],
    ['d', 'e', 'f'],
    ['g', 'h', 'i'],
  ];

  t.deepEqual(merge_in_place(test_data),
    ['a', 'd', 'g', 'b', 'e', 'h', 'c', 'f', 'i'],
  );
});

test("Correctly removes duplicate entrires", async (t) => {
  const test_data = ['a', 'b', 'c', 'a', 'b', 'c', 'd', 'a'];

  t.deepEqual(remove_later_copies(test_data),
    ['a', 'b', 'c', 'd'],
  );
});
