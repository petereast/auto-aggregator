// Type definitions for the query builder

type WhereWithConditions = (conditions: any) => Query;
type WhereWithoutConditions = () => ConditionChainBuilder;

export interface Query {
  _select_terms: string[];
  _conditions: any;

  select: (term: string | string[]) => Query;
  where: any;

  _set_condition: (cond: any) => any;
}

export interface QueryBuilder {
  create: () => Query;
  query: Query;
}

export interface ConditionChainBuilder {
  create: (_parent: Query) => ConditionChain;
  condition_chain: ConditionChain;
}

export interface ConditionChain {
  parent: Query | undefined;
  key: (item: string) => Condition;
  and: () => null;
}

export interface ConditionBuilder {
  condition: Condition;
  create: (_parent: Query, key: string) => Condition;
}

export interface Condition {
  parent: Query | undefined;
  // All evaluations should return a query
  key: string;
  operation: 'eq' | 'neq' | undefined;
  value: any;

  equal: (value: any) => Query;
  not_equal: (value: any) => Query;
}
