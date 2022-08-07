import { Theme } from "@encode42/remix-extras";
import { api } from "~/util/api.server";
import { config } from "~/data/config";

let theme: Theme;

declare global {
    var __theme: Theme | undefined;
}

if (process.env.NODE_ENV === "production") {
    theme = init();
} else {
    if (!global.__theme) {
        global.__theme = init();
    }

    theme = global.__theme;
}

function init() {
    return new Theme({
        "colorScheme": config.colorScheme,
        api
    });
}

export { theme };
