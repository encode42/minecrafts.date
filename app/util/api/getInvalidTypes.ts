import { getVersions } from "~/util/storage/getVersions.server";

export async function getInvalidTypes(types: string[]) {
    const versions = await getVersions();

    const invalidTypes: string[] = [];
    for (const type of types) {
        if (!versions.types.includes(type)) {
            invalidTypes.push(type);
        }
    }

    return invalidTypes;
}
