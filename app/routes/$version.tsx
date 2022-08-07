import { RouteParams } from "@encode42/remix-extras";
import { getVersions, Version } from "~/util/getVersions.server";
import { useLoaderData } from "@remix-run/react";
import { Title, Text, Stack } from "@mantine/core";
import { StandardLayout } from "~/layout/StandardLayout";
import { ThemePaper } from "@encode42/mantine-extras";
import { HomeLink } from "~/component/HomeLink";

export interface LoaderResult {
    "version": Version | undefined
}

export async function loader({ params }: RouteParams): Promise<LoaderResult> {
    const versions = await getVersions();

    let existingVersion: Version | undefined;
    for (const version of versions.versions) {
        if (version.id === params.version) {
            existingVersion = version;
            break;
        }
    }

    return {
        "version": existingVersion
    };
}

export default function VersionPage() {
    const data = useLoaderData<LoaderResult>();

    return (
        <StandardLayout>
            {data.version ? (
                <ThemePaper>
                    <Stack>
                        <Title>Minecraft {data.version.id}</Title>
                        <Text>This version was released on {data.version.date.released}.</Text>
                        <Text>That was {data.version.date.age} ago!</Text>
                        <HomeLink />
                    </Stack>
                </ThemePaper>
            ) : (
                <ThemePaper>
                    <Stack>
                        <Title>Error!</Title>
                        <Text>The specified version does not exist.</Text>
                        <HomeLink />
                    </Stack>
                </ThemePaper>
            )}
        </StandardLayout>
    );
};
