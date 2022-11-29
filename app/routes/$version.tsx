import { MetaDescriptor } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { RouteOptions } from "@encode42/remix-extras";
import { Text, Stack } from "@mantine/core";
import { StandardLayout } from "~/layout/StandardLayout";
import { HomeLink } from "~/component/HomeLink";
import { ImportantPaper } from "~/component/ImportantPaper";
import { ImportantTitle } from "~/component/ImportantTitle";
import { getVersion, Version } from "~/util/storage/getVersions.server";
import { prefixTitle } from "~/util/prefixTitle";
import { AnchorIcon } from "~/component/AnchorIcon";
import { IconNews } from "@tabler/icons";

interface MetaOptions {
    "data": LoaderResult
}

interface LoaderResult {
    "version": Version | undefined,
    "isBot": boolean
}

export function meta({ data }: MetaOptions): MetaDescriptor {
    if (!data.version) {
        return {};
    }

    return {
        "title": data.isBot ? `Minecraft ${data.version.id}` : prefixTitle(data.version.id),
        "description": `Released ${data.version.date.age} ago!`,
        "og:image": null
    };
}

export async function loader({ request, params }: RouteOptions): Promise<LoaderResult> {
    // Find the requested version
    const version = await getVersion(params.version);

    // Check for bots (for embeds)
    const userAgent = request.headers.get("user-agent");

    return {
        "version": version,
        "isBot": userAgent ? userAgent.includes("Discordbot") : false
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
                            {data.version.changelog && <AnchorIcon icon={<IconNews />} to={data.version.changelog} target="_blank">Changelog</AnchorIcon>}
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
