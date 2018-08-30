import * as R from 'ramda';
import merge_dependencies from './dependency-processor';
import clustered_payloads from './clustered-payloads';

// TODO: This file is massive, make sure you refactor this at some
// point.

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

  const event_relationships = generate_relationship_graph(event_defs);
  const attribute_trees: Map<string, any> = start_points.reduce(
    (acc, start_point) => {
      return acc.set(
        start_point,
        generate_relationship_tree(start_point, event_relationships),
      );
    }, new Map<string, any>());

  return (end_points: string[]): Path => {
    // Currently returns *a* valid path from one attribute to another, maybe

    // TODO: Refactor this, it's nasty :(
    const paths: string[][] = end_points.reduce(
      (acc, end_point) => {
        return [...acc, ...start_points.reduce(
          (_acc, start_point) => {
            return [
              ..._acc,
              search_tree(
                attribute_trees.get(start_point),
                end_point,
              ),
            ];
          },
          [],
        )];
      },
      [],
    );

    return merge_dependencies(paths);
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
