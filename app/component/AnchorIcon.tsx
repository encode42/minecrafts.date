import { cloneElement, ReactElement } from "react";
import { Anchor, AnchorProps } from "@encode42/remix-extras";
import { Box, BoxProps, Center, useMantineTheme } from "@mantine/core";
import deepmerge from "deepmerge";
import { config } from "~/data/config";

interface AnchorIconProps extends AnchorProps {
    "icon": ReactElement,
    "iconSize"?: number,
    "boxProps"?: BoxProps
}

export function AnchorIcon({ icon, iconSize = 18, boxProps = {}, color = config.accentColor, children, ...other }: AnchorIconProps) {
    const theme = useMantineTheme();

    boxProps = deepmerge({
        "ml": theme.spacing.xs
    }, boxProps);

    return (
        <Anchor color={color} {...other}>
            <Center inline>
                {cloneElement(icon, {
                    "size": iconSize
                })}
                <Box {...boxProps}>{children}</Box>
            </Center>
        </Anchor>
    );
}
