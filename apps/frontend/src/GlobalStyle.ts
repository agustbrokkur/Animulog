// GlobalStyle.ts
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    :root {
        --color-brand: #E8473F;

        --color-group-watching: #378ADD;
        --color-group-backlog: #EF9F27;
        --color-group-watched: #5DCAA5;
        --color-group-other: #5B5FC7;

        --color-media-movie: #7F77DD;
        --color-media-tv: #1D9E75;
        --color-media-ova: #D4537E;
        --color-media-special: #FAC775;
        --color-media-other: #3FB6C7;

        --bg-base: #141416;
        --bg-surface: #1c1c1f;
        --bg-surface-alt: #242428;
        --border: #2a2a2e;
    }

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        background: var(--bg-base);
        font-family: system-ui, -apple-system, sans-serif;
    }
`;
