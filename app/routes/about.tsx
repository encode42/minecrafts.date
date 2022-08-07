import { PropsWithChildren } from "react";
import { Stack, Title, Text, Center } from "@mantine/core";
import { ThemePaper } from "@encode42/mantine-extras";
import { StandardLayout } from "~/layout/StandardLayout";
import { details } from "~/data/details";
import { Anchor } from "@encode42/remix-extras";
import { HomeLink } from "~/component/HomeLink";
import { prefixTitle } from "~/util/prefixTitle";
import { MetaDescriptor } from "@remix-run/node";

interface AboutEntry extends PropsWithChildren {
    "title": string
}

export function meta() {
    return {
        "title": prefixTitle("About")
    } as MetaDescriptor;
}

function AboutEntry({ title, children }: AboutEntry) {
    return (
        <ThemePaper>
            <Stack>
                <Title order={3}>{title}</Title>
                <Stack spacing="xs">
                    {children}
                </Stack>
            </Stack>
        </ThemePaper>
    );
}

export default function AboutPage() {
    return (
        <StandardLayout>
            <Stack spacing="xl">
                <Center>
                    <Title>About {details.name}</Title>
                </Center>
                <AboutEntry title="What is this?">
                    <Text>{details.name} is a website that displays the age of various Minecraft versions.</Text>
                    <Text>The release dates and elapsed time for every official Minecraft version is contained here!</Text>
                </AboutEntry>
                <AboutEntry title="How often are versions updated?">
                    <Text>Versions are updated on every page visit.</Text>
                    <Text>The version list will automatically update when Mojang pushes a new Minecraft version.</Text>
                </AboutEntry>
                <AboutEntry title="I've spotted a mistake!">
                    <Text>Luckily, this website is open-source! If you have experience with the technologies we use, you're encouraged to open a pull request.</Text>
                    <Text>If you can't fix the issue yourself, you can report the issue on <Anchor to={details.links.github} inline>GitHub</Anchor> or our <Anchor to={details.links.support} inline>support Discord</Anchor>.</Text>
                </AboutEntry>
                <AboutEntry title="What does the home page's header mean?">
                    <Text>It's a reference to <Anchor to="https://youtu.be/5IsSpAOD6K8">Talking Heads - Once in a Lifetime</Anchor>!</Text>
                    <Text>Specifically, it's a parody of the lyrics found at <Anchor to="https://youtu.be/5IsSpAOD6K8?t=70">1:10</Anchor>.</Text>
                </AboutEntry>
                <HomeLink />
            </Stack>
        </StandardLayout>
    );
}
