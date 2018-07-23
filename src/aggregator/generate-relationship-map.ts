import * as R from 'ramda';
import clustered_payloads from './clustered-payloads';

const generate_relationship_graph = (event_defs: any[]) => {
  const relationships = clustered_payloads(event_defs);
  const attr_union = relationships.reduce(
    (acc: string[], relationship: string[]) => {
      return R.union(acc, relationship);
    }, []);
  const base_rel_graph = new Map<string, string[]>();

  return attr_union.reduce(
    (acc: Map<string, string[]>, attr: string) => {
      // Find attributes which occur in the same event
      return acc.set(
        attr,
        [
          ...(acc.has(attr) ? acc.get(attr) : []) as string[],
          // Union of all the stuff attr is adjacent to
          ...R.difference(
              relationships
              .filter(R.contains(attr))
              .reduce(
                (rel_acc: string[], attr_group: string[]) => {
                  return R.union(rel_acc, attr_group);
                }, [] as string[]),
              [attr], // Remove circular references to current group
            ),
        ],
      );
    }, base_rel_graph);
};

const navigate_relationship_map = (event_defs: any[]) =>
  (start_point: string, end_point: string): string[] => {
  return [];
};

export {
  generate_relationship_graph,
};
