import { json } from "@remix-run/node";
import { RouteParams } from "@encode42/remix-extras";
import { getVersion, getVersions } from "~/util/storage/getVersions.server";
import { VersionsGet } from "~/validation";

export async function loader({ params }: RouteParams) {
    const data = VersionsGet.safeParse(params["*"]);
    if (!data.success) {
        return json({
            "error": data.error
        }, {
            "status": 400
        });
    }

    if (!data.data) {
        const versions = await getVersions();
        return json(versions.versions);
    }

    const version = await getVersion(data.data);

    return version ? json(version) : json({
        "error": "The specified version does not exist."
    }, {
        "status": 400
    });
}
