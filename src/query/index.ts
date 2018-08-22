// Query object
// The idea is to have a composable 'query builder' that's functional and lovely

interface Query {
  _select_terms: string[];

  select: (term: string) => Query;
  where: () => any; // Returns condition chain builder
}

export interface QueryBuilder {
  create: () => Query;
  query: Query;
}

export const query_builder: QueryBuilder = {
  create() {
    return Object.create(this.query);
  },

  query: {

    _select_terms: [],

    select(term: string) {
      this._select_terms.push(term);
      return this;
    },
    where() {
      console.log("where");
      return condition_chain_builder.create(this);
    },
  },
};

interface ConditionChainBuilder {
  create: (_parent: Query) => ConditionChain;
  condition_chain: ConditionChain;
}

interface ConditionChain {
  parent: Query | undefined;
  key: (item: string) => Condition;
  and: () => null;
}

const condition_chain_builder: ConditionChainBuilder = {
  create(_parent: Query) {
    const tmp = Object.create(this.condition_chain);
    tmp.parent = _parent;
    return tmp;
  },

  condition_chain: {
    parent: undefined,
    key(item: string) {
      console.log(item);
      return ConditionBuilder.create(this.parent);
    },
    and() {
      return null;
    },
  },
};

interface ConditionBuilder {
  condition: Condition;
  create: (_parent: Query) => Condition;
}

interface Condition {
  parent: any;
  // All evaluations should return a query
  equal: (value: any) => Query;
  not_equal: (value: any) => Query;
}

const ConditionBuilder: ConditionBuilder = {
  create(_parent: any) {
    const tmp = Object.create(this.condition);
    tmp.parent = _parent;
    return tmp;
  },

  condition: {
    parent: null,
    equal(value: any) {
      console.log("EQ:", value);
      return this.parent;
    },
    not_equal(value: any) {
      console.log("NEQ:", value);
      return this.parent;
    },
  },
};
