import { ReactNode, useEffect, useMemo, useState } from "react";
import { useFetcher, useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import { Anchor, Link, RouteRequest } from "@encode42/remix-extras";
import { ActionIcon, Group, MultiSelect, Stack, Text, TextInput, Title, CloseButton, Collapse, Button, Badge, Space, Image, Container, useMantineColorScheme } from "@mantine/core";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { ThemePaper } from "@encode42/mantine-extras";
import { IconBox, IconFilter, IconLink, IconQuestionMark, IconSearch, IconX } from "@tabler/icons";
import { StandardLayout } from "~/layout/StandardLayout";
import { details } from "~/data/details";
import { getVersions, Version, Versions } from "~/util/storage/getVersions.server";
import { ImportantPaper } from "~/component/ImportantPaper";
import { ImportantTitle } from "~/component/ImportantTitle";
import badge from "a/logo/badge.png";
import LazyLoad, { forceCheck } from "react-lazyload";
import Fuse from "fuse.js";
import { index } from "~/util/storage/index.server";
import { getUser, getUserResult } from "~/util/user/getUser.server";
import { z } from "zod";
import { SetQuery } from "~/validation";
import { AnchorButton } from "~/component/AnchorButton";

/*
TODO:
- Improve mobile view
- Change API to use queries instead of PATCH
- Change API to exclude extras if specified
- More stats
- More types (infdev, etc.)
- More filters
  * Year range
  * X ago (inc & exc)
  * Apply filters to search
 */

interface VersionTitleProps {
    "id": string,
    "badges"?: string[],
    "released": string
}

interface VersionEntryProps {
    "version": Version,
    "isNewest"?: boolean,
    "isOldest"?: boolean,
    "badges"?: string[],
    "onCopy"?: () => Promise<void>
}

interface LoaderResult {
    "versions": Versions,
    "user": getUserResult,
    "index": Fuse.FuseIndex<unknown> | undefined
}

function VersionTitle({ id, badges = [], released }: VersionTitleProps) {
    const anchor = (
        <Anchor to={`/${id}`}>
            <Title>{id}</Title>
        </Anchor>
    );

    return (
        <Group position="apart" sx={{
            "alignItems": "flex-start"
        }}>
            {badges?.length > 0 ? (
                <Group>
                    {anchor}
                    {badges?.map(badge => (
                        <Badge key={badge}>{badge}</Badge>
                    ))}
                </Group>
            ) : anchor}
            <Text>{released}</Text>
        </Group>
    );
}

function VersionEntry({ version, isNewest, isOldest, badges = [], onCopy }: VersionEntryProps) {
    const { colorScheme } = useMantineColorScheme();

    if (isNewest) {
        badges.push(`Newest ${version.type}`);
    }

    if (isOldest) {
        badges.push(`Oldest ${version.type}`);
    }

    return (
        <LazyLoad once>
            <ThemePaper id={version.id}>
                <Stack>
                    <VersionTitle id={version.id} badges={badges} released={version.date.released} />
                    <Group position="apart" sx={{
                        "alignItems": "flex-end"
                    }}>
                        <Text color={colorScheme === "dark" ? "white" : "black"}>Released {version.date.age} ago</Text>
                        <Group>
                            <ActionIcon title="Copy version link" color="primary" size="lg" variant="outline" onClick={async () => {
                                await onCopy?.();
                            }}>
                                <IconLink />
                            </ActionIcon>
                            <AnchorButton title="View more information about this version" to={`/${version.id}`} leftIcon={<IconQuestionMark />}>
                                Info
                            </AnchorButton>
                        </Group>
                    </Group>
                </Stack>
            </ThemePaper>
        </LazyLoad>
    );
}

export async function loader({ request }: RouteRequest): Promise<LoaderResult> {
    return {
        "versions": await getVersions(),
        "user": await getUser(request),
        index
    };
}

export default function IndexPage() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const data = useLoaderData<LoaderResult>();
    const navigate = useNavigate();
    const fetcher = useFetcher();

    const [fuse] = useState(new Fuse(data.versions.versions, {
        "threshold": 0.1,
        "keys": ["id"]
    }, Fuse.parseIndex(data.index)));

    const [search, setSearch] = useDebouncedState(data.user.search, 350);
    const [types, setTypes] = useState<string[]>(data.user.types);
    const [firstLoad, firstLoadHandler] = useDisclosure(true);

    const [showFilters, openFiltersHandler] = useDisclosure(false);
    const [listedVersions, setListedVersions] = useState<ReactNode[]>([]);

    function createEntry(version: Version, key?: string) {
        const isNewest = version.id === data.versions.versions[data.versions.newest[version.type]].id;
        const isOldest = version.id === data.versions.versions[data.versions.oldest[version.type]].id;

        return (
            <VersionEntry key={key} version={version} isNewest={isNewest} isOldest={isOldest} badges={search === version.id ? ["Exact Match"] : undefined} onCopy={async () => {
                // Add the selected categories if required
                let hash = `#${version.id}`;
                if (version.type !== "release") {
                    searchParams.set("type", version.type);

                    hash = `?${searchParams.toString()}${hash}`;
                }

                navigate(hash, {
                    "replace": true
                });

                // Copy link to clipboard
                // eslint-disable-next-line no-undef
                await navigator.clipboard.writeText(window.location.href);

                showNotification({
                    "title": "Successfully Copied!",
                    "message": "The link to this version has been copied to your clipboard."
                });
            }} />
        );
    }

    function runFilter(versions: LoaderResult["versions"]["versions"] = data.versions.versions) {
        const newList: typeof listedVersions = [];

        for (const version of versions) {
            // Exclude types that aren't selected
            if (types.length > 0 && !types.includes(version.type)) {
                continue;
            }

            newList.push(createEntry(version, version.id));
        }

        setListedVersions(newList);
    }

    function runSearch() {
        if (!search) {
            runFilter();

            return;
        }

        runFilter(fuse.search(search).map(result => result.item));
    }

    useMemo(() => {
        runSearch();
    }, [search, types]);

    useEffect(() => {
        if (firstLoad) {
            firstLoadHandler.close();

            return;
        }

        fetcher.submit({
            "data": JSON.stringify({
                search,
                types
            } as z.infer<typeof SetQuery>)
        }, {
            "action": "/api/v1/user/setQuery",
            "method": "post"
        });
    }, [search, types]);

    useMemo(() => {
        forceCheck();
    }, [listedVersions]);

    return (
        <StandardLayout>
            <Stack spacing="xl">
                <ImportantPaper>
                    <Stack>
                        <ImportantTitle.Wrapper custom>
                            <Image alt="Website's logo" src={badge} width={42} />
                            <ImportantTitle ml="md">{details.name}</ImportantTitle>
                        </ImportantTitle.Wrapper>
                        <Text size="lg" weight="bold" align="left">"How old is Minecraft?"</Text>
                        <Text size="lg" weight="bold" align="center">"Where is the age of that version?"</Text>
                        <Text size="lg" weight="bold" align="right">"Am I old?"</Text>
                        <Space h="md" />
                        <Text size="lg" align="center">...you may ask yourself. This website contains the answers to those questions!</Text>
                    </Stack>
                </ImportantPaper>
                <Group sx={{
                    "alignItems": "flex-end"
                }}>
                    <TextInput label="Search" icon={<IconSearch />} defaultValue={search} rightSectionWidth={30} rightSection={
                        <CloseButton title="Clear search" variant="transparent" size="sm" onClick={() => {
                            setSearch("");
                        }} />
                    } onChange={event => {
                        setSearch(event.currentTarget.value);
                    }} sx={{
                        "flexGrow": 1
                    }} />
                    <Button color={showFilters ? "red" : "primary"} leftIcon={showFilters ? <IconX /> : <IconFilter />} onClick={() => {
                        openFiltersHandler.toggle();
                    }}>
                        {showFilters ? "Hide" : "Show"} Filters
                    </Button>
                </Group>
                <Collapse in={showFilters}>
                    <MultiSelect label="Release Types" icon={<IconBox />} clearable data={data.versions.types} value={types} onChange={value => {
                        setTypes(value);
                    }} />
                </Collapse>
                <Stack>
                    {listedVersions}
                </Stack>
            </Stack>
        </StandardLayout>
    );
}

