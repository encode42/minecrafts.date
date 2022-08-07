import { API } from "@encode42/remix-extras";
import { getEnv } from "~/util/getEnv.server";

let api: API;

declare global {
    var __api: API | undefined;
}

if (process.env.NODE_ENV === "production") {
    api = init();
} else {
    if (!global.__api) {
        global.__api = init();
    }

    api = global.__api;
}

function init() {
    return new API({
        "websiteURL": getEnv("WEBSITE_URL", "http://localhost:3000")
    });
}

export { api };
