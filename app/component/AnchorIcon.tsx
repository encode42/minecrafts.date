import { cloneElement, ReactElement } from "react";
import { Anchor, AnchorProps } from "@encode42/remix-extras";
import { Box, BoxProps, Center } from "@mantine/core";
import deepmerge from "deepmerge";

interface AnchorIconProps extends AnchorProps {
    "icon": ReactElement,
    "iconSize"?: number,
    "boxProps"?: BoxProps
}

export function AnchorIcon({ icon, iconSize = 14, boxProps = {}, children, ...other }: AnchorIconProps) {
    boxProps = deepmerge({
        "ml": 5
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
