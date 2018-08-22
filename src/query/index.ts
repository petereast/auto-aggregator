// Query object
// The idea is to have a composable 'query builder' that's functional and lovely
import * as R from 'ramda';

interface Query {
  _select_terms: string[];
  _conditions: any;

  select: (term: string | string[]) => Query;
  where: () => any; // Returns condition chain builder

  _set_condition: (cond: any) => any;
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
    _conditions: {},

    select(term: string | string[]) {
      return R.set(
        R.lensProp("_select_terms"),
        R.pipe(
          R.append(term),
          R.flatten)(this._select_terms),
        this);
    },
    where(conditions?: any) {
      if (conditions) {
        return this._select_conditions(conditions);
      } else {
        console.log("where");
        return condition_chain_builder.create(this);
      }
    },
    _set_condition(cond: Condition) {
      return R.set(
        R.lensPath(['_conditions', cond.operation as any, cond.key]),
        cond.value,
        this,
      );
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
      return ConditionBuilder.create(this.parent, item);
    },
    and() {
      return null;
    },
  },
};

interface ConditionBuilder {
  condition: Condition;
  create: (_parent: Query, key: string) => Condition;
}

interface Condition {
  parent: Query | undefined;
  // All evaluations should return a query
  key: string;
  operation: 'eq' | 'neq' | undefined;
  value: any;

  equal: (value: any) => Query;
  not_equal: (value: any) => Query;
}

const ConditionBuilder: ConditionBuilder = {
  create(_parent: any, _key: string) {
    const tmp = Object.create(this.condition);
    tmp.parent = _parent;
    tmp.key = _key;
    return tmp;
  },

  condition: {
    parent: undefined,
    key: "",
    operation: undefined,
    value: undefined,

    equal(value: any) {
      return this.parent._set_condition(
        {
          ...this,
          operation: 'eq',
          value,
        },
      );
    },

    not_equal(value: any) {
      return this.parent._set_condition(
        {
          ...this,
          operation: 'neq',
          value,
        },
      );
    },
  },
};
