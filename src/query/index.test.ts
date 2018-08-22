import test from 'ava';
import {query_builder} from '.';

test.only("Check that basic query functionality works", async (t) => {
  const x = query_builder.create()
    .select("pop")
    .select("wang")
    .where()
      .key("key").equal("value")
    .where()
      .key("key").equal("something");

  console.log(x._select_terms);
  t.fail();
});
