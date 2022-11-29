import Fuse from "fuse.js";
import { Versions } from "~/util/storage/getVersions.server";

let index: Fuse.FuseIndex<unknown> | undefined;

declare global {
    // eslint-disable-next-line no-var
    var __index: Fuse.FuseIndex<unknown> | undefined;
}

if (process.env.NODE_ENV === "production") {
    index = undefined;
} else {
    if (!global.__index) {
        global.__index = undefined;
    }

    index = global.__index;
}

export function updateIndex(versions?: Versions) {
    if (!versions) {
        return;
    }

    setIndex(Fuse.createIndex(["id"], versions.versions));
}

function setIndex(idx: Fuse.FuseIndex<unknown>) {
    index = idx;
    global.__index = idx;
}

export { index };
