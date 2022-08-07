import { ReactNode, useMemo, useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import { Link } from "@encode42/remix-extras";
import { ActionIcon, Group, MultiSelect, Stack, Text, TextInput, Title, CloseButton, Collapse, Button, Box, Badge, Container, Space, Image } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { ThemePaper } from "@encode42/mantine-extras";
import { IconBox, IconLink, IconSearch, IconShare } from "@tabler/icons";
import { StandardLayout } from "~/layout/StandardLayout";
import { details } from "~/data/details";
import { getVersions, Versions } from "~/util/getVersions.server";
import { ImportantPaper } from "~/component/ImportantPaper";
import { ImportantTitle } from "~/component/ImportantTitle";
import badge from "a/logo/badge.png";

/*
TODO:
- Improve mobile view
- Improve performance
  * Lazyload versions? The issue is that there's hundreds of versions being displayed at once
- More stats
- Ability to favorite a version
- Add "and" to final unit
 */

interface VersionTitleProps {
    "id": string,
    "badge"?: string,
    "released": string
}

interface LoaderResult extends Versions {}

function VersionTitle({ id, badge, released }: VersionTitleProps) {
    return (
        <Group position="apart" sx={{
            "alignItems": "flex-start"
        }}>
            <Group>
                <Title>{id}</Title>
                {badge && <Badge>{badge}</Badge>}
            </Group>
            <Text color="dimmed">{released}</Text>
        </Group>
    );
}

export async function loader(): Promise<LoaderResult> {
    return await getVersions();
}

export default function IndexPage() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const data = useLoaderData<LoaderResult>();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [types, setTypes] = useState<string[]>(searchParams.get("types")?.split(",") ?? ["release"]);
    const [openFilters, openFiltersHandler] = useDisclosure(false);
    const [listedVersions, setListedVersions] = useState<ReactNode[]>([]);

    const [debouncedSearch] = useDebouncedValue(search, 250);

    useMemo(() => {
        const newList: typeof listedVersions = [];

        for (const version of data.versions) {
            // Search for versions starting with query
            if (debouncedSearch && !version.id.startsWith(debouncedSearch)) {
                continue;
            }

            // Exclude types that aren't selected
            if (types.length > 0 && !types.includes(version.type)) {
                continue;
            }

            const isNewest = version.id === data.versions[data.newest[version.type]].id;
            const isOldest = version.id === data.versions[data.oldest[version.type]].id;

            newList.push(
                <ThemePaper key={version.id} id={version.id}>
                    <Stack>
                        <VersionTitle id={version.id} badge={isNewest ? `Newest ${version.type}` : isOldest ? `Oldest ${version.type}` : undefined} released={version.date.released} />
                        <Group position="apart" sx={{
                            "alignItems": "flex-end"
                        }}>
                            <Text>Released {version.date.age} ago</Text>
                            <Group>
                                <ActionIcon color="primary" size="lg" variant="filled" onClick={async () => {
                                    // Add the selected categories if required
                                    let hash = `#${version.id}`;
                                    if (types.length > 0 && !(types.length === 1 && types[0] === "release")) {
                                        searchParams.set("types", types.join(","));

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
                                }}>
                                    <IconLink />
                                </ActionIcon>
                                <ActionIcon component={Link} to={`/${version.id}`} color="primary" size="lg" variant="filled">
                                    <IconShare color="white" />
                                </ActionIcon>
                            </Group>
                        </Group>
                    </Stack>
                </ThemePaper>
            );
        }

        setListedVersions(newList);
    }, [debouncedSearch, types]);

    return (
        <StandardLayout>
            <Stack spacing="xl">
                <ImportantPaper>
                    <Stack>
                        <ImportantTitle.Wrapper custom>
                            <Image src={badge} width={42} />
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
                    <TextInput label="Search" icon={<IconSearch />} rightSectionWidth={30} rightSection={
                        <CloseButton variant="transparent" size="sm" onClick={() => {
                            setSearch("");
                        }} />
                    } value={search} onChange={event => {
                        setSearch(event.currentTarget.value);
                    }} sx={{
                        "flexGrow": 1
                    }} />
                    <Button onClick={() => {
                        openFiltersHandler.toggle();
                    }}>
                        {openFilters ? "Close" : "Open"} Filters
                    </Button>
                </Group>
                <Collapse in={openFilters}>
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

