import { fetch } from "@remix-run/node";
import { ReactNode, useMemo, useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import { ActionIcon, Group, MultiSelect, Stack, Text, TextInput, Title, CloseButton, Collapse, Button, List, Box } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { ThemePaper } from "@encode42/mantine-extras";
import { IconBox, IconLink, IconSearch } from "@tabler/icons";
import { StandardLayout } from "~/layout/StandardLayout";
import { details } from "~/data/details";
import humanizeDuration from "humanize-duration";

interface Version {
    "id": string,
    "type": string,
    "date": {
        "released": string,
        "age": string
    }
}

interface LoaderResult {
    "versions": Version[],
    "types": string[]
}

export async function loader(): Promise<LoaderResult> {
    const response = await fetch("https://piston-meta.mojang.com/mc/game/version_manifest_v2.json");
    const meta = await response.json();

    const now = new Date();

    const versions: Version[] = [];
    const types: string[] = [];

    for (const version of meta.versions) {
        if (!types.includes(version.type)) {
            types.push(version.type);
        }

        const release = new Date(version.releaseTime);

        versions.push({
            "id": version.id,
            "type": version.type,
            "date": {
                "released": release.toLocaleDateString("en-US", {
                    "weekday": "long",
                    "year": "numeric",
                    "month": "long",
                    "day": "numeric"
                }),
                "age": humanizeDuration(now.getTime() - release.getTime(), { "units": ["y", "mo", "d"], "round": true })
            }
        });
    }

    return {
        versions,
        types
    };
}

export default function IndexPage() {
    const searchParams = new URLSearchParams(useLocation().search);

    const data = useLoaderData<LoaderResult>();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [types, setTypes] = useState<string[]>(searchParams.get("types")?.split(",") ?? ["release"]);
    const [openFilters, openFiltersHandler] = useDisclosure(false);

    const [debouncedSearch] = useDebouncedValue(search, 250);

    const [listedVersions, setListedVersions] = useState<ReactNode[]>([]);

    useMemo(() => {
        const newList: typeof listedVersions = [];

        for (const version of data.versions) {
            if (debouncedSearch && !version.id.startsWith(debouncedSearch)) {
                continue;
            }

            if (types.length > 0 && !types.includes(version.type)) {
                continue;
            }

            newList.push(
                <Box id={version.id}>
                    <ThemePaper key={version.id}>
                        <Group position="apart" sx={{
                            "alignItems": "flex-start"
                        }}>
                            <Title>{version.id}</Title>
                            <Text color="dimmed">{version.date.released}</Text>
                        </Group>
                        <Group position="apart" sx={{
                            "alignItems": "flex-end"
                        }}>
                            <Text>Released <Text weight="bold" component="span">{version.date.age}</Text> ago</Text>
                            <Group>
                                <ActionIcon color="primary" size="lg" variant="filled" onClick={() => {
                                    let hash = `#${version.id}`;
                                    if (types.length > 0 && !(types.length === 1 && types[0] === "release")) {
                                        searchParams.set("types", types.join(","));

                                        hash = `?${searchParams.toString()}${hash}`;
                                    }

                                    navigate(hash, {
                                        "replace": true
                                    });
                                }}>
                                    <IconLink />
                                </ActionIcon>
                            </Group>
                        </Group>
                    </ThemePaper>
                </Box>
            );
        }

        setListedVersions(newList);
    }, [debouncedSearch, types]);

    return (
        <StandardLayout>
            <Stack>
                <ThemePaper>
                    <Stack>
                        <Title>{details.name}</Title>
                        <Text>You may ask yourself:</Text>
                        <List>
                            <List.Item>How old is Minecraft?</List.Item>
                            <List.Item>Where is the age of that version?</List.Item>
                            <List.Item>Am I old?</List.Item>
                        </List>
                        <Text>Well, this website answers those questions!</Text>
                    </Stack>
                </ThemePaper>
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
                {listedVersions}
            </Stack>
        </StandardLayout>
    );
}

