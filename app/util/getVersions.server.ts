import { fetch } from "@remix-run/node";
import humanizeDuration from "humanize-duration";

export interface Version {
    "id": string,
    "type": string,
    "date": {
        "released": string,
        "age": string
    }
}

export interface VersionKey<T> {
    [key: string]: T
}

export interface NewestOldestIndex extends VersionKey<number> {
    "all": number
}

export interface Versions {
    "versions": Version[],
    "newest": NewestOldestIndex,
    "oldest": NewestOldestIndex,
    "types": string[]
}

export async function getVersions(): Promise<Versions> {
    const response = await fetch("https://piston-meta.mojang.com/mc/game/version_manifest_v2.json");
    const meta = await response.json();

    const now = new Date();

    const versions: Version[] = [];
    const types: string[] = [];

    for (const version of meta.versions) {
        if (!types.includes(version.type)) {
            types.push(version.type);
        }

        const release = new Date(version.releaseTime);

        versions.push({
            "id": version.id,
            "type": version.type,
            "date": {
                "released": release.toLocaleDateString("en-US", {
                    "weekday": "long",
                    "year": "numeric",
                    "month": "long",
                    "day": "numeric"
                }),
                "age": humanizeDuration(now.getTime() - release.getTime(), { "units": ["y", "mo", "d"], "round": true })
            }
        });
    }

    const newest: NewestOldestIndex = {
        "all": 0
    };

    const oldest: NewestOldestIndex = {
        "all": versions.length - 1
    };

    for (const type of types) {
        const typeVersions: number[] = [];

        for (const [i, version] of versions.entries()) {
            if (version.type !== type) {
                continue;
            }

            typeVersions.push(i);
        }

        newest[type] = typeVersions[0];
        oldest[type] = typeVersions[typeVersions.length - 1];
    }

    return {
        versions,
        newest,
        oldest,
        types
    };
}
