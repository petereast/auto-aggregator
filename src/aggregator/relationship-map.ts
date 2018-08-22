import * as R from 'ramda';
import clustered_payloads from './clustered-payloads';

//
// TYPE DEFINITIONS
//

type Path = string[];

interface AttributeNode {
  start_point: string;
  children: AttributeNode[];
}

type AttribtueTree = AttributeNode;

// Implementation

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
// Actually, it might be useful as it'll remove problems caused by graph cycles??
//
// TODO: Redefine this algorithm - see TODO in index.ts
const generate_relationship_tree = (
  start_point: string,
  event_relationships: Map<string, string[]>,
  explored_nodes: string[] = [],
): any => {
  if (event_relationships.get(start_point) === undefined) {
    console.log("UNDEFINED!!", Array.from(event_relationships.entries()));
  }
  return {
    // TODO: Add try-catch here to catch errors
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
  path: Path = [],
): Path => {
  // Depth or bredth first search?
  // probably depth?

  if (tree.start_point === search_term) {
    return [...path, tree.start_point];
  } else {
    return [
      tree.start_point,
      ...tree.children.reduce(
        (acc: string[], child: any) => {
          const explored_child = search_tree(
            child,
            search_term,
            [...path],
          );
          if (!R.contains(search_term, explored_child)) {
            return acc;
          } else {
            return explored_child;
          }
      }, []),
    ];
  }
};

const relationship_map_navigator = (
  event_defs: any[],
  start_points: string[],
) => {
  // recursively find the route between start and end point
  // implement greedy-search or some algorithm for pathfinding
  // TODO: Think of a better solution
  // I NEED TO THINK ABOUT THIS DIFFERENTLY

  const event_relationships = generate_relationship_graph(event_defs);
  const attribute_trees: Map<string, any> = start_points.reduce(
    (acc, start_point) => {
      return acc.set(
        start_point,
        generate_relationship_tree(start_point, event_relationships),
      );
    }, new Map<string, any>());

  return (end_point: string): Path[] => {
    // Currently returns *a* valid path from one attribute to another, maybe
    return start_points.reduce(
      (acc, start_point) => {
        return [
          ...acc,
          search_tree(
            attribute_trees.get(start_point),
            end_point,
          ),
        ];
      }, []);
  };
};

const relationship_map_navigator_2 = (
  event_defs: any[],
  start_points: string[],
): (end_points: string[]) => Path => {

  const event_relationships = generate_relationship_graph(event_defs);
  const attribute_trees: Map<string, AttribtueTree> = start_points.reduce(
    (acc, start_point) => {
      return acc.set(
        start_point,
        generate_relationship_tree(start_point, event_relationships),
      );
    }, new Map<string, AttribtueTree>());
  const find_attribute_dependencies = (attribute: string): string[] => {
    // TODO: Define dependancies
    // An Attribute's dependancies are defined as:
    //   The attribute value(s) that must be known to find the target attribute
    //   value
    return [];
  };

  return (end_points: string[]): Path => {

    // All the end_points should be at the end of the output
    // The end_points have dependencies, which may have other dependencies
    // so basically, find all the dependencies!!

    return end_points.reduce(
      (acc, end_point) => {

        return acc;
      },
      [],
    );
  };
};

interface ConditonPath {
  value: string;
  children: ConditonPath[];
}

const generate_condition_path_tree = (condition_paths: string[][]): ConditonPath => {
  // TODO: Implement some sort of DS for this
  // A Tree?
  //
  // NOTE: This will no longer be needed once work in the paths dept is complete

  // Somehow track something
  return condition_paths.reduce(
    (acc, path, paths_index, _condition_paths) => {
      const p = path.reduce(
        (_acc, step) => {
          return _acc;
        }, "");
      return acc;
    }, {} as ConditonPath);
};

export {
  generate_relationship_graph,
  relationship_map_navigator,
  generate_relationship_tree,
  search_tree,
};
