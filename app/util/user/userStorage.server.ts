import { storageBuilder } from "@encode42/remix-extras";
import { getEnv } from "~/util/getEnv.server";
import { SessionStorage } from "@remix-run/node";

let userStorage: SessionStorage;

declare global {
    var __userStorage: SessionStorage | undefined;
}

if (process.env.NODE_ENV === "production") {
    userStorage = init();
} else {
    if (!global.__userStorage) {
        global.__userStorage = init();
    }

    userStorage = global.__userStorage;
}

function init() {
    return storageBuilder.cookie({
        "name": "_user",
        "secret": getEnv("COOKIE_AUTH_SECRET", "insecure")
    });
}

export { userStorage };
