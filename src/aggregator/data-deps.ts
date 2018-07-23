import * as R from 'ramda';

import {
  AggregationQuery,
  events_by_payload,
} from '.';

const loose_match = (a: any, b: any): boolean => {
  return R.intersection(
    Object.entries(a),
    Object.entries(b),
  ).length !== 0;
};

const generate_deps_graph = (event_definitions: any, query: AggregationQuery) => {
  const where_deps_ = new Map<string, string[]>();

  const where_deps = Array.from(events_by_payload(event_definitions))
    .reduce((acc, source) => {
      // There's a better way of doing this - I don't like all these loops!
      return acc;
    }, []);
  // Find where the information in 'where' comes from
  // Find how it links to the information in 'select'
};

export {
  generate_deps_graph,
};
