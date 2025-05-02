export function omitFields(object: any, keys: string[]) {
    const cloneObject = { ...object };

    if (keys.length > 0) {
        for (const key of keys) {
            delete cloneObject[key];
        };
    };

    return cloneObject;
}