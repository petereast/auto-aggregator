// General utility functions

export function object_keys(obj: any): string[] {
  return Object.entries(obj).reduce(
    (acc, entry) => {
      return [
        ...acc,
        entry[0],
      ];
    }, []);
}
