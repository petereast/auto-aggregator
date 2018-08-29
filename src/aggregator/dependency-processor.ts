const find_max_len = (input: any[][]) => {
  return Math.max(...input.reduce(
    (acc: number[] , item: any[]) => {
      return [...acc, item.length];
    },
    [],
  ));
};
const merge_in_place = (items: any[][]) => {
  const output = [];
  for (let i = 0; i < find_max_len(items); i++) {
    for (const item of items) {
      if (item[i]) {
        output.push(item[i]);
      }
    }
  }
  return output;

};
const count = (ar: any[], cond: (i: any) => boolean) => {
  return ar.reduce(
    (acc, item) => {
      if (cond(item)) {
        return acc + 1;
      } else {
        return acc;
      }
    },
    0,
  );
};
const remove_later_copies = (deps_list: string[]): string[] => {
  return deps_list.reduce(
    (acc, item) => {
      if (count(acc, (i) => i === item) >= 1 || !item) {
        return acc;
      } else {
        return [...acc, item];
      }
    },
    [],
  );
};

export default function(deps: string[][]) {
  return remove_later_copies(merge_in_place(deps));
}

export {
  remove_later_copies,
  count,
  merge_in_place,
  find_max_len,

};
