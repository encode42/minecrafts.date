import { hydrate } from "react-dom";
import { RemixBrowser } from "@remix-run/react";
import { ClientProvider } from "@mantine/remix";

/**
 * @author https://github.com/jacob-ebey/remix-preact/blob/bb4b9f122694cbcb13906e7560e614d642b941fc/app/entry.client.tsx
 */
function start() {
    // eslint-disable-next-line no-undef
    const documentElement = document.documentElement;

    // eslint-disable-next-line no-undef
    const apply = (n: HTMLElement) => documentElement.replaceWith(n);

    hydrate((
        <ClientProvider>
            <RemixBrowser />
        </ClientProvider>
    ), {
        childNodes: [documentElement],
        firstChild: documentElement,
        insertBefore: apply,
        appendChild: apply,
    } as never);
}

start();

