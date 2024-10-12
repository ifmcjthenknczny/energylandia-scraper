// eslint-disable-next-line @typescript-eslint/no-explicit-any 
export function removeUndefinedOrNull<T extends Record<string, any>>(obj: T): Required<T> {
    Object.keys(obj).forEach(key => {
        if (obj[key] === undefined || obj[key] === null) {
            delete obj[key];
        }
    });
    return obj as Required<T>;
}