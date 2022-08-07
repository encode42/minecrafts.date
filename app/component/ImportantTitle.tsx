import { Center, Divider, Title as MantineTitle, TitleProps, useMantineColorScheme } from "@mantine/core";
import { mergeSx } from "@encode42/mantine-extras";

interface ImportantTitleWrapperProps extends TitleProps {
    "custom"?: boolean
}

function Title({ sx, ...other }: TitleProps) {
    const { colorScheme } = useMantineColorScheme();

    return (
        <MantineTitle sx={mergeSx(theme => ({
            "color": colorScheme === "dark" ? theme.colors.gray[2] : theme.black
        }), sx)} {...other} />
    );
}

function Wrapper({ custom = false, children, ...other }: ImportantTitleWrapperProps) {
    return (
        <>
            <Center>
                {custom ? children : <Title {...other}>{children}</Title>}
            </Center>
            <Divider />
        </>
    );
}

const ImportantTitle = Title as any;
ImportantTitle.Wrapper = Wrapper;

export { ImportantTitle };
