import { RouteOptions } from "@encode42/remix-extras";
import { api } from "~/util/api.server";

export function action({ request, params }: RouteOptions) {
    return api.handle({
        "route": params["*"],
        "type": "action",
        request
    });
}

export function loader({ request, params }: RouteOptions) {
    return api.handle({
        "route": params["*"],
        "type": "loader",
        request
    });
}
