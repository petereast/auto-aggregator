import * as R from 'ramda';

import events_by_payload from './events-by-payload';

export {events_by_payload};

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
  where: any;
  group_by?: string[];
}

const get_state_change_by_event = (event_definitions: any, event: any) => {
  try {
    const state_changes = Object.entries(event_definitions[event.type].state);
    return state_changes.reduce((acc, change) => {
      const c = {};
      c[change[0]] = (change[1] as any).value;
      return {...acc, ...c};
    }, {});
  } catch (e) {
    return {};
  }
};

// TODO: Write a query parser in parser
const simple_aggregate = (event_definitions: any[], query: AggregationQuery) =>
  (events: any[]): any => {
    // Get all the stuff related to what we need, then trim out the stuff we don't
    const events_of_interest: string[] = R.uniq(
      query.select.reduce((acc: any, attr: any) => {
        return [...acc, ...events_by_payload(event_definitions).get(attr)];
      }, [] as string[]),
    );

    const selected_events = R.filter((event) => {
      return R.contains(event.type)(events_of_interest);
    },
      events,
    );

    console.log(selected_events);

    return R.pick(query.select)(selected_events.reduce((acc, event) => {
      return {
        ...acc,
        ...event.payload,
        ...get_state_change_by_event(event_definitions, event),
      };
    }, {}));
};

const generate_data_map = (event_definitions: any[]) => {
  return undefined; // TODO: Get a clustered payload object
};

const group_by_aggregate = (event_definitions: any[], query: AggregationQuery) =>
  (event_store: any): any => {
    const initial_results = event_store.readAll({...query.where});
    // initial_result(s) should be an  object that contains the value of query.order_by and other stuff
    // We need to find the events that match the other attributes of initital_results
    // But first map out the initial_results according to query.group_by
    const results_map = initial_results.reduce(
      (acc: any, result: any) => {
        return acc.set(
          R.path(query.where, result),
          result,
        );
      }, new Map<string | number, any>());
    console.log(Array.from(results_map.entries()));
    return undefined;
    // Start with the where clause

    // Then fill in the rest of the information, maybe recursively, using
    // attributes that are common between events as where?
};

export {
  group_by_aggregate,
  simple_aggregate,
  example_query,
};
