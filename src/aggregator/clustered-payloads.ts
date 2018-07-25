
interface EventDef {
  sequence: number;
  payload: string[];
  state: any[];
}
type EventDefs = EventDef[];

export default function(event_defs: any[]) {
  const base: string[][] = [];
  return event_defs.reduce(
    (acc, event) => {
      if (!event || !event.payload) {
        return acc;
      }
      return [
        ...acc,
        [
          ...event.payload,
          ...(event.state ? Object.entries(event.state) : [])
            .map((state_change) => state_change[0]),
        ],
      ];
    }, base);
}
