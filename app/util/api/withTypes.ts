import { getInvalidTypes } from "~/util/api/getInvalidTypes";
import { Versions } from "~/util/storage/getVersions.server";

export function withTypes(versions: Versions, types: string[]) {
    return {
        "versions": versions.versions.filter(version => types.includes(version.type)),
        "invalid": getInvalidTypes(versions, types)
    };
}
