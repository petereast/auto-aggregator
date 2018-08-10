import * as R from 'ramda';

import events_by_payload from './events-by-payload';

export {events_by_payload};

export interface SimpleAggregationQuery {
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
const simple_aggregate = (event_definitions: any[], query: SimpleAggregationQuery) =>
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

    return R.pick(query.select)(selected_events.reduce((acc, event) => {
      return {
        ...acc,
        ...event.payload,
        ...get_state_change_by_event(event_definitions, event),
      };
    }, {}));
};

export {
  get_state_change_by_event,
  simple_aggregate,
};
