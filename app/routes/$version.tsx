import { MetaDescriptor } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { RouteOptions } from "@encode42/remix-extras";
import { Text, Stack } from "@mantine/core";
import { StandardLayout } from "~/layout/StandardLayout";
import { HomeLink } from "~/component/HomeLink";
import { ImportantPaper } from "~/component/ImportantPaper";
import { ImportantTitle } from "~/component/ImportantTitle";
import { getVersions, Version } from "~/util/getVersions.server";
import { prefixTitle } from "~/util/prefixTitle";
import { AnchorIcon } from "~/component/AnchorIcon";
import { IconNews } from "@tabler/icons";

interface MetaOptions {
    "data": LoaderResult
}

interface LoaderResult {
    "version": Version | undefined,
    "changelog": string | undefined,
    "isBot": boolean
}

const baseChangelogURL = `https://minecraft.fandom.com/wiki/Java_Edition_`;

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
    const versions = await getVersions();

    // Find the requested version
    let existingVersion: Version | undefined;
    for (const version of versions.versions) {
        if (version.id === params.version) {
            existingVersion = version;
            break;
        }
    }

    // Create the changelog link compatible with the Minecraft Wiki
    // A bit of a mess, but it works!
    let changelog;
    if (existingVersion) {
        switch (existingVersion.type) {
            case "old_beta":
                changelog = `${baseChangelogURL}${existingVersion.id.replace("b", "Beta_")}`;
                break;
            case "old_alpha":
                if (existingVersion.id.startsWith("a")) {
                    changelog = `${baseChangelogURL}${existingVersion.id.replace("a", "Alpha_")}`;
                } else if (existingVersion.id.startsWith("inf")) {
                    changelog = `${baseChangelogURL}${existingVersion.id.replace("inf-", "Infdev_")}`;
                } else if (existingVersion.id.startsWith("c")) {
                    changelog = `${baseChangelogURL}${existingVersion.id.replace("c", "Classic_")}`;
                } else if (existingVersion.id.startsWith("rd")) {
                    changelog = `${baseChangelogURL}pre-Classic_${existingVersion.id}`;
                }

                break;
            default:
                changelog = `${baseChangelogURL}${existingVersion.id}`;
        }
    }

    // Check for bots (for embeds)
    const userAgent = request.headers.get("user-agent");

    return {
        "version": existingVersion,
        changelog,
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
                            <AnchorIcon icon={<IconNews />} to={data.changelog} target="_blank">Changelog</AnchorIcon>
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
