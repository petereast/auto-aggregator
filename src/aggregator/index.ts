import * as R from 'ramda';

import events_by_payload from './events-by-payload';

export {events_by_payload};

import {
  get_state_change_by_event,
  simple_aggregate,
} from './simple-aggregator';

import {
  navigate_relationship_map,
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

export interface AggregationQueryPayloadCondition {
  attr: string | number;
}

export interface AggregationQueryPayload {
  where: AggregationQueryPayloadCondition[];
}

const staggered_group_by_aggregate = (
  event_definitions: any,
  event_store: any,
  query_template: AggregationQuery,
) => {
  // Prepare for when the query is actually made

  const navigator = navigate_relationship_map(
    Object.entries(event_definitions),
    query_template.where_keys,
  );

  // Generate the condition paths we want based on the relationship maps
  // paths follow the format ['a', 'b', 'c'] where 'a' is the starting
  // "condition key" and 'c' is the "select from key"

  const condition_paths = query_template.select.reduce(
    (acc, term) => {
      return [...acc, navigator(term)];
    }, []);

  console.log('CONDITION PATHS: ', condition_paths);

  return (query_data: AggregationQueryPayload) => {
    return undefined;
  };
};

export {
  simple_aggregate,
  example_query,
  staggered_group_by_aggregate,
};
