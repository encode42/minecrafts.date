import { ActionIcon, ActionIconProps } from "@mantine/core";
import { Anchor, AnchorProps } from "@encode42/remix-extras";

export function AnchorActionIcon({ ...other }: ActionIconProps & AnchorProps) {
    return (
        <ActionIcon component={Anchor} {...other} />
    );
}
