import { IconArrowLeft } from "@tabler/icons";
import { AnchorIcon } from "~/component/AnchorIcon";

export function HomeLink() {
    return (
        <AnchorIcon to="/" icon={<IconArrowLeft />}>
            Return home
        </AnchorIcon>
    );
}
