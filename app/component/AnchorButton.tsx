import { Button, ButtonProps } from "@mantine/core";
import { Anchor, AnchorProps } from "@encode42/remix-extras";

export function AnchorButton({ ...other }: ButtonProps & AnchorProps) {
    return (
        <Button component={Anchor} {...other} />
    );
}
