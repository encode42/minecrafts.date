import { RouteRequest, validateForm } from "@encode42/remix-extras";
import { SearchQuery } from "~/validation";
import { index } from "~/util/index.server";

export async function action({ request }: RouteRequest) {
    const validation = await validateForm(request, SearchQuery, {
        "throw": true
    });

    if (!index || validation.query.length === 0) {
        return null;
    }

    const results = index.search(validation.query);
    const indexes: number[] = [];
    for (const result of results) {
        indexes.push(Number(result.ref));
    }

    return indexes;
}
