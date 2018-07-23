import * as R from 'ramda';

export default function events_by_payload(event_defs: any[]) {
  const get_state_attributes = (ev: any): string[] => {
    return Object.entries(R.pathOr({}, ['state'])(ev[1]))
      .reduce((acc, state) => {
        return [...acc, state[0]];
      }, [] as string[],
      );
  };

  const payloads_base: string[] = [];
  const events_by_payload_base = new Map<string, string[]>();

  return R.uniq(Object.entries(event_defs)
      .reduce((acc, event) => {
        return [...acc, ...(event[1] as any).payload, ...get_state_attributes(event)];
      }, payloads_base))
      .reduce((acc, payload_item) => {
      const payloadSearch = (ev: any) => R.contains(payload_item)(ev[1].payload);
      const stateUpdateSearch = (ev: any) => R.contains(payload_item)(get_state_attributes(ev));
      const withPayload: string[] = Object.entries(event_defs).reduce((accu, event) => {
        if (payloadSearch(event) || stateUpdateSearch(event)) {
          return [event[0], ...accu];
        } else {
          return accu;
        }
      }, [] as string[]);
      return acc.set(
        payload_item,
        withPayload,
      );
    }, events_by_payload_base);
}
