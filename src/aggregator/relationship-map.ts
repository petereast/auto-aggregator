import * as R from 'ramda';
import clustered_payloads from './clustered-payloads';

type Path = string[];
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

// I probably don't have to generate this intermediate tree,
// the purpose of it is to help me think through the search strategy
// Actually, it might be useful as it'll remove graph cycles??
const generate_relationship_tree = (
  start_point: string,
  event_relationships: Map<string, string[]>,
  explored_nodes: string[] = [],
): any => {
  return {
    start_point,
    children: [
      ...R.difference(
        (event_relationships.get(start_point) as string[]),
        explored_nodes,
      )
        .reduce((acc, child) => {
          return [
            ...acc,
            generate_relationship_tree(
              child,
              event_relationships,
              [
                start_point,
                ...explored_nodes,
                ...(event_relationships.get(start_point) as string[]),
                // Assume these nodes have already been explored, because JavaScript
              ],
            ),
          ];
        }, []),
    ],
  };
};

const search_tree = (
  tree: any,
  search_term: string,
): Path => {
  return [];
};

const navigate_relationship_map = (event_defs: any[], start_point: string) => {
  // recursively find the route between start and end point
  // implement greedy-search or some algorithm for pathfinding

  const event_relationships = generate_relationship_graph(event_defs);
  const attribute_tree = generate_relationship_tree(start_point, event_relationships);
  return (end_point: string): Path => {
    return [];
  };
};

export {
  generate_relationship_graph,
  navigate_relationship_map,
  generate_relationship_tree,
};
