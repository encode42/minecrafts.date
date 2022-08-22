import { Version, Versions } from "~/util/storage/getVersions.server";

function mergeExtras(versions: Versions, version: Version) {
    return {
        ...version,
        "extras": versions.extras[version.id]
    };
}

export function withExtras(versions: Versions, version: Version | Version[]) {
    if (Array.isArray(version)) {
        return version.map(v => mergeExtras(versions, v));
    }

    return mergeExtras(versions, version);
}
