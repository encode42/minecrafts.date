import { getVersions, Version } from "~/util/storage/getVersions.server";
import { json } from "@remix-run/node";
import { VersionsList } from "~/validation";
import { RouteRequest } from "@encode42/remix-extras";

function mapIDs(versions: Version[]) {
    return versions.map(version => version.id);
}

interface Result {
    "versions": string[]
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

    const versions = await getVersions();

    if (validation.data.types) {
        const invalidTypes: string[] = [];
        for (const type of validation.data.types) {
            if (!versions.types.includes(type)) {
                invalidTypes.push(type);
            }
        }

        const withTypes = versions.versions.filter(version => validation.data.types.includes(version.type));

        const result: ActionResult = {
            "versions": mapIDs(withTypes),
        };

        if (invalidTypes.length > 0) {
            result.invalid = invalidTypes;
        }

        return json(result);
    }
}

export async function loader() {
    const versions = await getVersions();

    return json({
        "versions": mapIDs(versions.versions)
    } as Result);
}
