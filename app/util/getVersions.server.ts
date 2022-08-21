import humanizeDuration from "humanize-duration";
import { index, updateIndex } from "~/util/index.server";
import { config } from "~/data/config";

export interface Version {
    "id": string,
    "type": string,
    "date": {
        "released": string,
        "age": string
    },
    "changelog"?: string
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

let versions: Versions | undefined;

declare global {
    var __versions: Versions | undefined;
}

if (process.env.NODE_ENV === "production") {
    processVersions();
} else {
    if (!global.__versions) {
        processVersions();
    }

    versions = global.__versions;
}

async function processVersions() {
    const response = await fetch("https://piston-meta.mojang.com/mc/game/version_manifest_v2.json");
    const json = await response.json();

    if (versions && response.headers.get("x-cache") === "HIT") {
        return;
    }

    const now = new Date();

    const processedVersions: Version[] = [];
    const types: string[] = [];

    for (const version of json.versions) {
        if (!types.includes(version.type)) {
            types.push(version.type);
        }

        const release = new Date(version.releaseTime);

        // Create the changelog link compatible with the Minecraft Wiki
        // A bit of a mess, but it works!
        let changelog;
        switch (version.type) {
            case "old_beta":
                changelog = `${config.changelog.base}${version.id.replace("b", config.changelog.beta)}`;
                break;
            case "old_alpha":
                if (version.id.startsWith("a")) {
                    changelog = `${config.changelog.base}${version.id.replace("a", config.changelog.alpha)}`;
                } else if (version.id.startsWith("inf")) {
                    changelog = `${config.changelog.base}${version.id.replace("inf-", config.changelog.infdev)}`;
                } else if (version.id.startsWith("c")) {
                    changelog = `${config.changelog.base}${version.id.replace("c", config.changelog.classic)}`;
                } else if (version.id.startsWith("rd")) {
                    changelog = `${config.changelog.base}pre-Classic_${version.id}`;
                }

                break;
            default:
                changelog = `${config.changelog.base}${version.id}`;
        }

        processedVersions.push({
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
            },
            changelog
        });
    }

    const newest: NewestOldestIndex = {
        "all": 0
    };

    const oldest: NewestOldestIndex = {
        "all": processedVersions.length - 1
    };

    for (const type of types) {
        const typeVersions: number[] = [];

        for (const [i, version] of processedVersions.entries()) {
            if (version.type !== type) {
                continue;
            }

            typeVersions.push(i);
        }

        newest[type] = typeVersions[0];
        oldest[type] = typeVersions[typeVersions.length - 1];
    }

    setVersions({
        versions: processedVersions,
        newest,
        oldest,
        types
    });

    if (!index || response.headers.get("x-cache") !== "HIT") {
        updateIndex(versions);
    }
}

export async function getVersions(): Promise<Versions> {
    await processVersions();

    if (!versions) {
        throw new Error("'versions' is undefined");
    }

    return versions;
}

function setVersions(vrs: Versions) {
    versions = vrs;
    global.__versions = vrs;
}
