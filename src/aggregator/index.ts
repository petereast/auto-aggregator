import * as R from 'ramda';

import events_by_payload from './events-by-payload';

export {events_by_payload};

import {
  get_state_change_by_event,
  simple_aggregate,
} from './simple-aggregator';

import {
  relationship_map_navigator,
} from './relationship-map';

const example_query = {
  select: [
    'invite_token',
    'organisation_id',
    'user_id',
  ],
  where: {
    email: 'peter@repositive.io',
  },
};

export interface AggregationQuery {
  select: string[];
  group_by: string[];
  where_keys: string[];
}

export type AggregationQueryPayloadCondition = any;
// TODO: Define this as a thang

export interface AggregationQueryPayload {
  where: AggregationQueryPayloadCondition[];
}

const staggered_group_by_aggregate = (
  event_definitions: any,
  event_store: any,
  query_template: AggregationQuery,
) => {
  // Prepare for when the query is actually made

  const navigator = relationship_map_navigator(
    Object.values(event_definitions),
    query_template.where_keys,
  );

  // Generate the condition paths we want based on the relationship maps
  // paths follow the format ['a', 'b', 'c'] where 'a' is the starting
  // "condition key" and 'c' is the "select from key"

  const condition_paths = query_template.select.reduce(
    (acc, term) => {
      // TODO: Compile these paths into a(nother) tree-like structure to traverse
      // breadth-first
      return [...acc, navigator(term)];
    }, []);

  console.log('CONDITION PATHS: ', condition_paths);
  // In other words, to get that overall aggregate, these paths have to be fulfilled.
  return (query_data: AggregationQueryPayload) => {
    return undefined;
    // Initially select by query_data.where
    //
    // For each 'condition path', find where the relationships lie
    // It'll form a tree-like data structure, (this should probably be optimised)
    // this DS will be a representation of all the connected knowledge
    // This should then be trimmed down, yet still remain accessable to the
    // programmer
  };
};

export {
  simple_aggregate,
  example_query,
  staggered_group_by_aggregate,
};
