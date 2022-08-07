import { Versions } from "~/util/getVersions.server";
import lunr, { Index } from "lunr";

let index: Index | undefined;

declare global {
    var __index: Index | undefined;
}

if (process.env.NODE_ENV === "production") {
    index = undefined;
} else {
    if (!global.__index) {
        global.__index = undefined;
    }

    index = global.__index;
}

export function generateIndex(versions: Versions) {
    setIndex(lunr(function () {
        this.ref("index");
        this.field("id");
        this.field("released");

        this.metadataWhitelist = ["position"];

        for (const [i, version] of versions.versions.entries()) {
            this.add({
                "index": i,
                "id": version.id,
                "released": version.date.released
            });
        }
    }));
}

function setIndex(idx: Index) {
    index = idx;
    global.__index = idx;
}

export { index };
