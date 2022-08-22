import { Versions } from "~/util/storage/getVersions.server";

export function getInvalidTypes(versions: Versions, types: string[]) {
    const invalidTypes: string[] = [];
    for (const type of types) {
        if (!versions.types.includes(type)) {
            invalidTypes.push(type);
        }
    }

    return invalidTypes;
}
