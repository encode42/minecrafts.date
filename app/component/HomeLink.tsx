import { config } from "~/data/config";
import { Anchor } from "@encode42/remix-extras";
import { Box, Center } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons";

export function HomeLink() {
    return (
        <Anchor to="/" color={config.accentColor}>
            <Center inline>
                <IconArrowLeft size={14} />
                <Box ml={5}>Return to the version list</Box>
            </Center>
        </Anchor>
    );
}
