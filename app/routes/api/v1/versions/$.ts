import { json } from "@remix-run/node";
import { RouteOptions, RouteParams } from "@encode42/remix-extras";
import { getVersion, getVersions } from "~/util/storage/getVersions.server";
import { Version, Versions } from "~/validation";
import { withTypes } from "~/util/api/withTypes";
import { withExtras } from "~/util/api/withExtras";

export async function action({ request }: RouteOptions) {
    if (request.method !== "PATCH") {
        return null;
    }

    const body = await request.json();

    const validation = Versions.safeParse(body);
    if (!validation.success) {
        return json({
            "error": validation.error
        }, {
            "status": 400
        });
    }

    const versions = await getVersions();

    if (validation.data.types) {
        const hasTypes = withTypes(versions, validation.data.types);
        const hasExtras = withExtras(versions, hasTypes.versions);

        return {
            "versions": hasExtras,
            "invalid": hasTypes.invalid
        };
    }

    return json({
        "versions": await getVersions()
    });
}

export async function loader({ params }: RouteParams) {
    const validation = Version.safeParse(params["*"]);
    if (!validation.success) {
        return json({
            "error": validation.error
        }, {
            "status": 400
        });
    }

    const versions = await getVersions();

    if (!validation.data) {
        return json({
            "versions": withExtras(versions, versions.versions)
        });
    }

    const version = await getVersion(validation.data);

    return version ? json(withExtras(versions, version)) : json({
        "error": "The specified version does not exist."
    }, {
        "status": 400
    });
}
