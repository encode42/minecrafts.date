import { ThemeToggle, Caption } from "@encode42/mantine-extras";
import { ActionIcon, Anchor, Center, Group, Stack } from "@mantine/core";
import { IconBrandDiscord, IconBrandGithub, IconQuestionMark } from "@tabler/icons";
import { Link } from "@encode42/remix-extras";
import { details } from "~/data/details";

export function Footer() {
    return (
        <Stack>
            <Group position="center">
                <Link to="/about">
                    <ActionIcon variant="filled" size="xl">
                        <IconQuestionMark />
                    </ActionIcon>
                </Link>
                <Anchor unstyled href={details.links.github}>
                    <ActionIcon variant="filled" size="xl">
                        <IconBrandGithub />
                    </ActionIcon>
                </Anchor>
                <Anchor unstyled href={details.links.support}>
                    <ActionIcon variant="filled" size="xl">
                        <IconBrandDiscord />
                    </ActionIcon>
                </Anchor>
                <ThemeToggle />
            </Group>
            <Center>
                <Caption>NOT AN OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED WITH MOJANG.</Caption>
            </Center>
        </Stack>
    );
}
