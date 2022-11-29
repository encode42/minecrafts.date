import { userStorage } from "~/util/user/userStorage.server";

export interface getUserResult {
    "search": string,
    "types": string[]
}

export async function getUser(request: Request): Promise<getUserResult> {
    const session = await userStorage.getSession(request.headers.get("Cookie"));
    const url = new URL(request.url);

    const typeParams = url.searchParams.get("type");

    return {
        "search": session.get("search") ?? "",
        "types": (typeParams ? [typeParams] : undefined) ?? session.get("types") ?? ["release"]
    };
}
