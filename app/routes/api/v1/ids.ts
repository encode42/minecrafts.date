import { getVersions, Version } from "~/util/storage/getVersions.server";
import { json } from "@remix-run/node";
import { VersionsList } from "~/validation";
import { RouteRequest } from "@encode42/remix-extras";
import { withTypes } from "~/util/api/withTypes";

function mapIDs(versions: Version[]) {
    return versions.map(version => version.id);
}

interface Result {
    "ids": string[]
}

interface ActionResult extends Result {
    "invalid"?: string[]
}

export async function action({ request }: RouteRequest) {
    if (request.method !== "PATCH") {
        return null;
    }

    const body = await request.json();

    const validation = VersionsList.safeParse(body);
    if (!validation.success) {
        return json({
            "error": validation.error
        }, {
            "status": 400
        });
    }

    if (validation.data.types) {
        const types = await withTypes(validation.data.types);

        const result: ActionResult = {
            "ids": mapIDs(types.versions),
        };

        if (types.invalid.length > 0) {
            result.invalid = types.invalid;
        }

        return json(result);
    }
}

export async function loader() {
    const versions = await getVersions();

    return json({
        "ids": mapIDs(versions.versions)
    } as Result);
}
