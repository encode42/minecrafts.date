import { details } from "~/data/details";

export function prefixTitle(title?: string | string[]) {
    return title ? `${details.name} | ${Array.isArray(title) ? title.join(" > ") : title}` : details.name;
}
