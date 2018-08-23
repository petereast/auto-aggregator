import test from 'ava';
import * as R from 'ramda';
import {query_builder} from '.';

test.only("Check that basic query functionality works", async (t) => {
  const x = query_builder.create()
    .select("pop")
    .select("wang")
    .select(['other', 'key'])
    .where({x: 'y'})
    .where()
      .key("another_key").equal("value")
    .where()
      .key("key").equal("something")
    .where()
      .key("yet_another_key").not_equal("not this!");

  t.deepEqual(
    R.pick(["_select_terms", "_conditions"], x),
    {
      _select_terms: ["pop", "wang", "other", "key"],
      _conditions: {
        eq: {
          another_key: "value",
          key: "something",
          x: 'y',
        },
        neq: {
          yet_another_key: "not this!",
        },
      },
    });
});
