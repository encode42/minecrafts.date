import { ReactNode, useMemo, useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import { Link } from "@encode42/remix-extras";
import { ActionIcon, Group, MultiSelect, Stack, Text, TextInput, Title, CloseButton, Collapse, Button, Box, Badge, Divider, Center, useMantineColorScheme, Container, Space } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { ThemePaper } from "@encode42/mantine-extras";
import { IconBox, IconLink, IconSearch, IconShare } from "@tabler/icons";
import { StandardLayout } from "~/layout/StandardLayout";
import { details } from "~/data/details";
import { getVersions, Versions } from "~/util/getVersions.server";

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
    const { colorScheme } = useMantineColorScheme();

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

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

            const isNewest = version.id === data.versions[data.newest[version.type]].id;
            const isOldest = version.id === data.versions[data.oldest[version.type]].id;

            newList.push(
                <Box id={version.id}>
                    <ThemePaper key={version.id}>
                        <Stack>
                            <VersionTitle id={version.id} badge={isNewest ? `Newest ${version.type}` : isOldest ? `Oldest ${version.type}` : undefined} released={version.date.released} />
                            <Group position="apart" sx={{
                                "alignItems": "flex-end"
                            }}>
                                <Text>Released <Text weight="bold" component="span">{version.date.age}</Text> ago</Text>
                                <Group>
                                    <ActionIcon color="primary" size="lg" variant="filled" onClick={async () => {
                                        let hash = `#${version.id}`;
                                        if (types.length > 0 && !(types.length === 1 && types[0] === "release")) {
                                            searchParams.set("types", types.join(","));

                                            hash = `?${searchParams.toString()}${hash}`;
                                        }

                                        navigate(hash, {
                                            "replace": true
                                        });

                                        await navigator.clipboard.writeText(window.location.href);

                                        showNotification({
                                            "title": "Successfully Copied!",
                                            "message": "The link to this version has been copied to your clipboard."
                                        });
                                    }}>
                                        <IconLink />
                                    </ActionIcon>
                                    <Link to={`/${version.id}`}>
                                        <ActionIcon color="primary" size="lg" variant="filled">
                                            <IconShare />
                                        </ActionIcon>
                                    </Link>
                                </Group>
                            </Group>
                        </Stack>
                    </ThemePaper>
                </Box>
            );
        }

        setListedVersions(newList);
    }, [debouncedSearch, types]);

    return (
        <StandardLayout>
            <Stack spacing="xl">
                <ThemePaper p="xl" sx={theme => ({
                    "background": colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[1]
                })}>
                    <Stack>
                        <Center>
                            <Title sx={theme => ({
                                "color": colorScheme === "dark" ? theme.colors.gray[2] : theme.black
                            })}>{details.name}</Title>
                        </Center>
                        <Divider />
                        <Container size="md" sx={{
                            "width": "100%"
                        }}>
                            <Text size="lg" weight="bold" align="left">"How old is Minecraft?"</Text>
                            <Text size="lg" weight="bold" align="center">"Where is the age of that version?"</Text>
                            <Text size="lg" weight="bold" align="right">"Am I old?"</Text>
                        </Container>
                        <Space h="md" />
                        <Text size="lg" align="center">...you may ask yourself. This website contains the answers to those questions!</Text>
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
                <Stack>
                    {!debouncedSearch && (
                        <ThemePaper>
                            <Stack>
                                <VersionTitle id={data.versions[data.oldest.all].id} badge="Oldest" released={data.versions[data.oldest.all].date.released} />
                                <Text>This is the oldest public version of Minecraft.</Text>
                                <Text>It was released {data.versions[data.oldest.all].date.age} ago!</Text>
                            </Stack>
                        </ThemePaper>
                    )}
                    {listedVersions}
                </Stack>
            </Stack>
        </StandardLayout>
    );
}

