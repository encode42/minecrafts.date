import { RouteRequest, validateFormThrow } from "@encode42/remix-extras";
import { SetQuery } from "~/validation";
import { userStorage } from "~/util/user/userStorage.server";
import { json } from "@remix-run/node";

export async function action({ request }: RouteRequest) {
    const data = await validateFormThrow(request, SetQuery);

    // Update the cookie
    const session = await userStorage.getSession(request.headers.get("Cookie"));
    session.set("search", data.search ?? session.get("search"));
    session.set("types", data.types ?? session.get("types"));

    return json(null, {
        "headers": {
            "Set-Cookie": await userStorage.commitSession(session)
        }
    });
}
