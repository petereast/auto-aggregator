import * as R from 'ramda';

import events_by_payload from './events-by-payload';

export {events_by_payload};

import {
  get_state_change_by_event,
  simple_aggregate,
} from './simple-aggregator';

import {
  object_keys,
} from '../util';

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

// TYPE DEFINITIONS

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

export type EventsKnowledge = any;

// end of type definitions

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

  // Generate the condition paths we want based on the relationship maps paths follow
  // the format ['a', 'b', 'c'] where 'a' is the starting "condition key" and 'c' is
  // the "select from key"

  const condition_path = navigator(query_template.select);
    // Merge the paths into one
    // TODO: Make this more intelligent
    // so that the items are in order of dependencies

  console.log("CPATH:", condition_path);

  const prepare_knowledge = (
    current_knowledge: EventsKnowledge,
    new_information: any[], // as an array of events
  ): EventsKnowledge => {
    // TODO: Define types for these structures
    //
    // Knowledge {
    //    key?: [old_values..., new_value];
    // }

    return new_information.reduce(
      (acc, event) => {
      return Object.entries(event.payload).reduce(
        (_acc, entry) => {
            const [key, value] = entry;

            if (R.has(key, _acc)) {
              _acc[key].push(value);
            } else {
              _acc[key] = [value];
            }

            return _acc;
          },
          acc,
        );
      }, current_knowledge);
    };

  // In other words, to get that overall aggregate, these paths have to be fulfilled.
  return async (query_data: AggregationQueryPayload) => {
    const knowledge = {...query_data.where.reduce(
      (acc, cond) => {
        const cond_key = object_keys(cond)[0];
        return {
          ...acc,
          [cond_key]: [cond[cond_key]],
        };
      }, {}),
    };

    console.log("INITIAL_KNOWLEDGE:", knowledge);

    // TODO: Define 'knowledge structure'
    // Struct
    // Knowledge {
    //   key: [array of possible values]
    //     ^^ This array is only ever added to - so that information about time is always
    //     maintained
    // }

    // TODO: This thing currently keeps on re-aggregating past events because the aggregate path
    // is full of duplicates. Maybe a solution to this problem would be to just have a union of the condition paths?
    // UPDATE 1: It turns out this is a bigger problem than I thought, we need to think about the condition path as
    // a tree, where the leaf nodes are the data we want to find and the non-leaf nodes are the links between those
    // events
    // UPDATE 2: I need to make a couple of changes to the `navigator` function - so that it returns an array of
    // attributes, in order of their dependencies so that there is a single-dimensional array that can be iterated
    // through.
    //
    // This should always return the values associated, regardless of which ones are current or not
    // Also the group-by algorithm is IMPORTANT!!

    console.log("CONDITION_PATHS:", condition_path);
    const result = condition_path.reduce(
      (known_information: any, condition: string) => {
          console.log("KNOWN", known_information);
          const matching_events = event_store.readAll(
            {
              [condition]: known_information[condition].reverse()[0],
              // Ensure that this value here is always the most up to data thang.
              // TODO: Don't forget to handle state changes somewhere - this is where
              // it blows up if selecting a state variable
            },
          );

          console.log("MATCHES:", matching_events);
          console.log("\n\n");

          return prepare_knowledge(
            known_information,
            matching_events,
          );
        }, await knowledge);

    console.log("\n\nFINAL_KNOWLEDGE:", await result);

    return R.pipe(
      R.map(
        R.reverse,
      ),
      R.map(
       (event_stack) => event_stack[0],
      ),
      R.pick(
        query_template.select,
      ),
    )(await result);

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
