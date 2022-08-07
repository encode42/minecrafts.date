import { PropsWithChildren } from "react";
import { Container, Stack } from "@mantine/core";
import { Footer } from "~/component/Footer";

export interface StandardLayoutProps extends PropsWithChildren {
    "container"?: boolean
}

export function StandardLayout({ container = true, children }: StandardLayoutProps) {
    return (
        <Stack spacing="xl" py="md">
            {container ? (
                <Container size="xl" sx={{
                    "minWidth": "50%"
                }}>
                    {children}
                </Container>
            ) : children}
            <Footer />
        </Stack>
    );
}
