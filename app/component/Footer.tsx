import { ThemeToggle, Caption } from "@encode42/mantine-extras";
import { Group, Stack } from "@mantine/core";
import { IconBrandDiscord, IconBrandGithub, IconQuestionMark } from "@tabler/icons";
import { details } from "~/data/details";
import { AnchorActionIcon } from "~/component/AnchorActionIcon";

export function Footer() {
    return (
        <Stack>
            <Group position="center">
                <AnchorActionIcon title="About this website" to="/about" variant="filled" size="xl">
                    <IconQuestionMark />
                </AnchorActionIcon>
                <AnchorActionIcon title="Source code for this website" to={details.links.github} variant="filled" size="xl">
                    <IconBrandGithub />
                </AnchorActionIcon>
                <AnchorActionIcon title="Discord community for this website" to={details.links.support} variant="filled" size="xl">
                    <IconBrandDiscord />
                </AnchorActionIcon>
                <ThemeToggle title="Toggle the theme" /> {/* TODO */}
            </Group>
            <Caption align="center">NOT AN OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED WITH MOJANG.</Caption>
        </Stack>
    );
}
