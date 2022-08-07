import { MetaDescriptor } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { RouteParams } from "@encode42/remix-extras";
import { Text, Stack } from "@mantine/core";
import { StandardLayout } from "~/layout/StandardLayout";
import { HomeLink } from "~/component/HomeLink";
import { ImportantPaper } from "~/component/ImportantPaper";
import { ImportantTitle } from "~/component/ImportantTitle";
import { getVersions, Version } from "~/util/getVersions.server";
import { prefixTitle } from "~/util/prefixTitle";

interface MetaOptions {
    "data": LoaderResult
}

interface LoaderResult {
    "version": Version | undefined
}

export function meta({ data }: MetaOptions): MetaDescriptor {
    if (!data.version) {
        return {};
    }

    return {
        "title": prefixTitle(data.version.id),
        "description": `Released on ${data.version.date.released}. That was ${data.version.date.age} ago!`
    };
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
            <ImportantPaper>
                <Stack spacing="xl">
                    {data.version ? (
                        <>
                            <ImportantTitle.Wrapper>Minecraft {data.version.id}</ImportantTitle.Wrapper>
                            <Stack spacing="xs">
                                <Text size="lg">This version was released on <Text weight="bold" component="span">{data.version.date.released}</Text>.</Text>
                                <Text size="lg">That was <Text weight="bold" component="span">{data.version.date.age}</Text> ago!</Text>
                            </Stack>
                            <HomeLink />
                        </>
                    ) : (
                        <>
                            <ImportantTitle>Error!</ImportantTitle>
                            <Text size="lg" weight="bold">The specified version does not exist.</Text>
                            <HomeLink />
                        </>
                    )}
                </Stack>
            </ImportantPaper>
        </StandardLayout>
    );
};
