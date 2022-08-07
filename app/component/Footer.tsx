import { ThemeToggle } from "@encode42/mantine-extras";
import { ActionIcon, Group } from "@mantine/core";
import { IconBrandDiscord, IconBrandGithub } from "@tabler/icons";
import { Link } from "@encode42/remix-extras";

export function Footer() {
    return (
        <Group position="center">
            <Link to="https://github.com">
                <ActionIcon variant="filled" size="xl">
                    <IconBrandGithub />
                </ActionIcon>
            </Link>
            <Link to="https://discord.com">
                <ActionIcon variant="filled" size="xl">
                    <IconBrandDiscord />
                </ActionIcon>
            </Link>
            <ThemeToggle />
        </Group>
    );
}
