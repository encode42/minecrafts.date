import { getVersions, Version, Versions } from "~/util/storage/getVersions.server";

function mergeExtras(versions: Versions, version: Version) {
    return {
        ...version,
        "extras": versions.extras[version.id]
    };
}

export async function withExtras(version: Version | Version[]) {
    const versions = await getVersions();

    if (Array.isArray(version)) {
        return version.map(v => mergeExtras(versions, v));
    }

    return mergeExtras(versions, version);
}
