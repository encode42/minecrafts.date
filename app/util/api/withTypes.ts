import { getInvalidTypes } from "~/util/api/getInvalidTypes";
import { getVersions } from "~/util/storage/getVersions.server";

export async function withTypes(types: string[]) {
    const versions = await getVersions();

    return {
        "versions": versions.versions.filter(version => types.includes(version.type)),
        "invalid": await getInvalidTypes(types)
    };
}
