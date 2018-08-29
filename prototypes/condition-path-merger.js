const test_data_1 = [
  ['a', 'c', 'f'],
  ['b', 'c', 'f'],
  ['c', 'f'],
]

const test_data_extreme = [
  ['a', 'c', 'g', 'f'],
  ['a', 'n', 'y', 'f'],
  ['b', 'q', 'g', 'f'],
]

const find_max_len = (mda) => {
  return Math.max(...mda.reduce(
    (acc, item) => {
      return [...acc, item.length];
    },
    [],
  ));
}

const merge_in_place = (mda) => {
  let output = []
  for (let i = 0; i < find_max_len(mda); i++) {
    for (let j = 0; j < mda.length; j++) {
      if(mda[j][i]){
        output.push(mda[j][i]);
      }
    }
  }
  return output;

}

const count = (ar, cond) => {
  return ar.reduce(
    (acc, item) => {
      if(cond(item)) {
        return acc + 1;
      } else {
        return acc;
      }
    },
    0,
  );
}

const remove_later_copies_old = (sda) => {
  return sda.reduceRight(
    (acc, item, index) => {
      tmp = acc;
      if(count(acc, (i) => i === item) > 1) {
        tmp[index] = undefined;
        return tmp;
      } else {
        // Do nothing
        return acc;
      }
    },
    sda,
  ).reduce(
    (acc, item) => {
      if(item) {
        return [...acc, item];
      } else {
        return acc;
      }
    },
    [],
  );
}

const remove_later_copies = (sda) => {
  return sda.reduce(
    (acc, item) => {
      if (count(acc, (i) => i === item) > 1 ||!item) {
        return acc;
      } else {
        return [...acc, item];
      }
    },
    [],
  );
}

const merge_dependencies = (mda) => {
  // Should be able to do all of the above in one step
  return remove_later_copies(merge_in_place(mda));

}
const pre_merged = merge_in_place(test_data_extreme);
const pre_trimmed = remove_later_copies_old(pre_merged);

console.log('remove_later_copies', remove_later_copies(pre_merged));
console.log('pre_trimmed', pre_trimmed);

const bench = require("benchmark");

let suite = new bench.Suite;


suite.add('count', () => {
  count(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], (i) => i == 'a');
});

suite.add('merge', () => {
  merge_in_place(test_data_extreme);
});

suite.add('remove_later_copies_old', () => {
  remove_later_copies_old(pre_trimmed);
});

suite.add('remove_later_copies_updated', () => {
  // ~20% more compared to remove_later_copies_old
  remove_later_copies(pre_merged);
});

suite.add('full test', () => {
  // Testing separate functions
  remove_later_copies_old(merge_in_place(test_data_extreme));
});

suite.add('merge_dependencies', () => {
  // Testing the one-step solution
  merge_dependencies(test_data_extreme);
});

suite.on("cycle", (event) => {console.log(String(event.target))});
suite.run({async: true});

