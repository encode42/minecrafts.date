import { MetaDescriptor } from "@remix-run/node";
import { PropsWithChildren, useState } from "react";
import { Links, LiveReload, Meta, Outlet, Scripts, useCatch, useFetcher, useLoaderData } from "@remix-run/react";
import { ErrorPage, getResult, RouteRequest } from "@encode42/remix-extras";
import { ColorScheme, ColorSchemeProvider, Global, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { StylesPlaceholder } from "@mantine/remix";
import { theme } from "~/util/theme.server";
import { details } from "~/data/details";
import { config } from "~/data/config";
import montserrat from "a/font/montserrat.ttf";

interface BasicDocumentProps extends PropsWithChildren {
    "colorScheme"?: ColorScheme
}

interface DocumentProps extends BasicDocumentProps {
    "title"?: string,
    "prefix"?: boolean
}

interface LoaderResult {
    "theme": getResult,
    "themeSetRoute": string
}

export function meta() {
    return {
        "charset": "utf-8",
        "viewport": "width=device-width,initial-scale=1"
    } as MetaDescriptor;
}

export function links() {
    return [{
        "rel": "icon",
        "href": "/favicon/favicon.svg",
        "type": "image/svg+xml"
    }, {
        "rel": "icon",
        "href": "/favicon/favicon.png",
        "type": "image/png"
    }];
}

const fonts = {
    "montserrat": "Montserrat, sans-serif"
};

export async function loader({ request }: RouteRequest): Promise<LoaderResult> {
    return {
        "theme": await theme.get(request),
        "themeSetRoute": theme.setRoute
    };
}

export default function App() {
    return (
        <Document>
            <Outlet />
        </Document>
    );
}

function BasicDocument({ colorScheme = config.colorScheme, children }: BasicDocumentProps) {
    return (
        <html lang="en">
            <head>
                <title>{details.name}</title>
                <Meta />
                <Links />
                <StylesPlaceholder />
            </head>
            <body>
                <MantineProvider withGlobalStyles withNormalizeCSS theme={{
                    "headings": {
                        "fontFamily": fonts.montserrat
                    },
                    "other": {
                        "fonts": fonts
                    },
                    "primaryColor": config.accentColor,
                    colorScheme
                }}>
                    <Global styles={[{
                        "button": {
                            "fontFamily": `${fonts.montserrat} !important`
                        }
                    }, {
                        "@font-face": {
                            "fontFamily": "Montserrat",
                            "src": `url("${montserrat}") format("truetype")`
                        }
                    }]} />
                    <NotificationsProvider>
                        <ModalsProvider>
                            {children}
                        </ModalsProvider>
                    </NotificationsProvider>
                </MantineProvider>
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}

function Document({ children }: DocumentProps) {
    const data = useLoaderData<LoaderResult>();
    const fetcher = useFetcher();

    const [colorScheme, setColorScheme] = useState<ColorScheme>(data.theme.colorScheme);

    function toggleColorScheme(value: ColorScheme) {
        const newColorScheme = value ?? (colorScheme === "dark" ? "light" : "dark");
        setColorScheme(newColorScheme);

        fetcher.submit({
            "colorScheme": newColorScheme
        }, {
            "method": "post",
            "action": data.themeSetRoute
        });
    }

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <BasicDocument colorScheme={colorScheme}>
                {children}
            </BasicDocument>
        </ColorSchemeProvider>
    );
}

export function CatchBoundary() {
    const caught = useCatch();

    return (
        <BasicDocument>
            <ErrorPage title={caught.statusText} statusCode={caught.status} />
        </BasicDocument>
    );
}

export function ErrorBoundary({ error }: { error: Error }) {
    console.error(error);

    return (
        <BasicDocument>
            <ErrorPage title={error.name} statusCode={500} />
        </BasicDocument>
    );
}
