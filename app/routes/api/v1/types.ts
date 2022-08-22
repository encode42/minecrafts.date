import { getVersions } from "~/util/storage/getVersions.server";

export async function loader() {
    const versions = await getVersions();

    return versions.types;
}
