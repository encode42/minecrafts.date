import { mergeSx, ThemePaper } from "@encode42/mantine-extras";
import { PaperProps, useMantineColorScheme } from "@mantine/core";

export function ImportantPaper({ p = "xl", sx, ...other }: PaperProps) {
    const { colorScheme } = useMantineColorScheme();

    return (
        <ThemePaper p={p} sx={mergeSx(theme => ({
            "background": colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[1]
        }), sx)} {...other} />
    );
}
