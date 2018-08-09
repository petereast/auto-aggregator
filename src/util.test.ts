import test from 'ava';

import {
  object_keys,
} from './util';

test("Object.keys returns the correct keys", async (t) => {
  const test_data = {
    key_1: 'value 1',
    key2: 'value 2',
    KeyThree: 'value 3',
  };

  t.deepEqual(
    object_keys(test_data),
    ["key_1", "key2", "KeyThree"],
  );
});
