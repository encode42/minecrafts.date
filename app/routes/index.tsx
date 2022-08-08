import { ReactNode, useMemo, useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import { Link } from "@encode42/remix-extras";
import { ActionIcon, Group, MultiSelect, Stack, Text, TextInput, Title, CloseButton, Collapse, Button, Badge, Space, Image, Container } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { ThemePaper } from "@encode42/mantine-extras";
import { IconArrowRight, IconBox, IconFilter, IconFilterOff, IconLink, IconQuestionMark, IconSearch, IconX } from "@tabler/icons";
import { StandardLayout } from "~/layout/StandardLayout";
import { details } from "~/data/details";
import { getVersions, Version, Versions } from "~/util/getVersions.server";
import { ImportantPaper } from "~/component/ImportantPaper";
import { ImportantTitle } from "~/component/ImportantTitle";
import badge from "a/logo/badge.png";
import LazyLoad, { forceCheck } from "react-lazyload";
import Fuse from "fuse.js";
import { index } from "~/util/index.server";

/*
TODO:
- Improve mobile view
- More stats
- Ability to favorite a version
- Add "and" to final unit
- More types
- More filters
  * Year range
  * X ago (inc & exc)
  * Apply filters to search
- Empty search doesn't show anything
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

interface LoaderResult extends Versions {
    "index": Fuse.FuseIndex<unknown> | undefined
}

function VersionTitle({ id, badges = [], released }: VersionTitleProps) {
    return (
        <Group position="apart" sx={{
            "alignItems": "flex-start"
        }}>
            <Group>
                <Title>{id}</Title>
                {badges?.map(badge => (
                    <Badge key={badge}>{badge}</Badge>
                ))}
            </Group>
            <Text color="dimmed">{released}</Text>
        </Group>
    );
}

function VersionEntry({ version, isNewest, isOldest, badges = [], onCopy }: VersionEntryProps) {
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
                        <Text>Released {version.date.age} ago</Text>
                        <Group>
                            <ActionIcon color="primary" size="lg" variant="outline" onClick={async () => {
                                await onCopy?.();
                            }}>
                                <IconLink />
                            </ActionIcon>
                            <Link to={`/${version.id}`}>
                                <Button leftIcon={<IconQuestionMark />} color="primary" size="sm" variant="filled">
                                    Info
                                </Button>
                            </Link>
                        </Group>
                    </Group>
                </Stack>
            </ThemePaper>
        </LazyLoad>
    );
}

export async function loader(): Promise<LoaderResult> {
    return {
        ...await getVersions(),
        index
    };
}

export default function IndexPage() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const data = useLoaderData<LoaderResult>();
    const navigate = useNavigate();

    const [fuse] = useState(new Fuse(data.versions, {
        "threshold": 0.1,
        "keys": ["id"]
    }, Fuse.parseIndex(data.index)));

    const [search, setSearch] = useState("");
    const [types, setTypes] = useState<(string | null)[]>(["release", searchParams.get("type")]);
    const [showFilters, openFiltersHandler] = useDisclosure(false);
    const [listedVersions, setListedVersions] = useState<ReactNode[]>([]);

    const [debouncedSearch] = useDebouncedValue(search, 350);

    function createEntry(version: Version, key?: string) {
        const isNewest = version.id === data.versions[data.newest[version.type]].id;
        const isOldest = version.id === data.versions[data.oldest[version.type]].id;

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
                await navigator.clipboard.writeText(window.location.href);

                showNotification({
                    "title": "Successfully Copied!",
                    "message": "The link to this version has been copied to your clipboard."
                });
            }} />
        );
    }

    useMemo(() => {
        const results = fuse.search(debouncedSearch);

        const newList: typeof listedVersions = [];
        for (const result of results) {
            newList.push(createEntry(result.item, result.item.id));
        }
        setListedVersions(newList);
    }, [debouncedSearch]);

    useMemo(() => {
        const newList: typeof listedVersions = [];
        for (const version of data.versions) {
            // Exclude types that aren't selected
            if (types.length > 0 && !types.includes(version.type)) {
                continue;
            }

            newList.push(createEntry(version, version.id));
        }
        setListedVersions(newList);
    }, [types]);

    useMemo(() => {
        forceCheck();
    }, [listedVersions]);

    return (
        <StandardLayout>
            <Stack spacing="xl">
                <ImportantPaper>
                    <Stack>
                        <ImportantTitle.Wrapper custom>
                            <Image src={badge} width={42} />
                            <ImportantTitle ml="md">{details.name}</ImportantTitle>
                        </ImportantTitle.Wrapper>
                        <Container size="xl" sx={{
                            "width": "100%"
                        }}>
                            <Text size="lg" weight="bold" align="left">"How old is Minecraft?"</Text>
                            <Text size="lg" weight="bold" align="center">"Where is the age of that version?"</Text>
                            <Text size="lg" weight="bold" align="right">"Am I old?"</Text>
                        </Container>
                        <Space h="md" />
                        <Text size="lg" align="center">...you may ask yourself. This website contains the answers to those questions!</Text>
                    </Stack>
                </ImportantPaper>
                <Group sx={{
                    "alignItems": "flex-end"
                }}>
                    <TextInput label="Search" icon={<IconSearch />} rightSectionWidth={30} rightSection={
                        <CloseButton variant="transparent" size="sm" onClick={() => {
                            setSearch("");
                        }} />
                    } value={search} onChange={event => {
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
                    <MultiSelect label="Release Types" icon={<IconBox />} clearable data={data.types} value={types} onChange={value => {
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

