import { cloneElement, PropsWithChildren, ReactElement } from "react";
import { Anchor, AnchorProps } from "@encode42/remix-extras";
import { Box, BoxProps, Center, useMantineTheme } from "@mantine/core";
import deepmerge from "deepmerge";

interface AnchorIconProps extends AnchorProps {
    "icon": ReactElement,
    "iconSize"?: number,
    "boxProps"?: BoxProps
}

export function AnchorIcon({ icon, iconSize = 18, boxProps = {}, children, ...other }: AnchorIconProps & PropsWithChildren) {
    const theme = useMantineTheme();

    boxProps = deepmerge({
        "ml": theme.spacing.xs
    }, boxProps);

    return (
        <Anchor {...other}>
            <Center inline>
                {cloneElement(icon, {
                    "size": iconSize
                })}
                <Box {...boxProps}>{children}</Box>
            </Center>
        </Anchor>
    );
}
