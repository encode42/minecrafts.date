import { RouteRequest, validateForm } from "@encode42/remix-extras";
import { VersionsGet } from "~/validation";
import { json } from "@remix-run/node";
import { getVersion, getVersions } from "~/util/storage/getVersions.server";

export async function action({ request }: RouteRequest) {
    const post = await request.json();
    const parsed = VersionsGet.parse(post);

    const versions = await getVersions();

    if (!parsed.version) {
        return json(versions.versions);
    }

    return json(await getVersion(parsed.version));
}

export async function loader() {
    return await getVersions();
}
