import { API } from "@encode42/remix-extras";

let api: API;

declare global {
    var __api: API | undefined;
}

if (process.env.NODE_ENV === "production") {
    api = new API({});
} else {
    if (!global.__api) {
        global.__api = new API({});
    }

    api = global.__api;
}

export { api };
