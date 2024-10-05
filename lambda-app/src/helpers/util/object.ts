export function omit<T extends { [key: string]: any }, K extends keyof T>(
  obj: T,
  keysToOmit: K[],
): Omit<T, K> {
  return Object.keys(obj).reduce(
    (newObj, key) => {
      if (keysToOmit.includes(key as K)) {
        return newObj;
      }
      return { ...newObj, [key]: obj[key] };
    },
    {} as Omit<T, K>,
  );
}

export function pick<T extends { [key: string]: any }, K extends keyof T>(
  obj: T,
  keysToPick: K[],
): Pick<T, K> {
  return Object.keys(obj).reduce(
    (newObj, key) => {
      if (keysToPick.includes(key as K)) {
        return { ...newObj, [key]: obj[key] };
      }
      return newObj;
    },
    {} as Pick<T, K>,
  );
}

export function removeUndefined<T extends Record<string, any | undefined>>(obj: T): Required<T> {
  return Object.keys(obj).reduce(
    (newObj, key) => {
      if (obj[key] === undefined || obj[key] === null) {
        return newObj;
      }
      return { ...newObj, [key]: obj[key] };
    },
    {} as any,
  );
}