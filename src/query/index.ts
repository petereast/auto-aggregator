// Query object
// The idea is to have a composable 'query builder' that's functional and lovely
import * as R from 'ramda';

import {
  Query,
  QueryBuilder,
  ConditionChainBuilder,
  ConditionChain,
  ConditionBuilder,
  Condition,
} from './types';

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
        const output = Object.entries(conditions).reduce(
          (acc, cond) => {
            return condition_chain_builder.create(acc)
              .key(cond[0])
              .equal(cond[1]);
          },
          this,
        );

        console.log("OUTPUT:", output);
        return output;
      } else {
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
