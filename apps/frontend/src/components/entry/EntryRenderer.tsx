import React from "react";
import type { Entry } from "../../types/entry";
import type { Section } from "../../types/section";
import { EntryDetailItem } from "./EntryDetailItem";
import { EntryListItem } from "./EntryListItem";
import { EntryGridItem } from "./EntryGridItem";

export type ViewMode = "detail" | "list" | "grid";
export const VIEW_MODES: ViewMode[] = ["detail", "list", "grid"];

interface EntryRendererProps {
	entry: Entry;
	viewMode: ViewMode;
	order?: number;
	sections: Section[];
}

/**
 * Renders exactly one variant. The previous version mounted all three and hid
 * two with `display: none`, which tripled the DOM and made every style recalc
 * and layout pass three times more expensive than it needed to be.
 *
 * Switching view mode now unmounts and remounts, but that happens on an
 * explicit user click a few times a session — not on every filter keystroke.
 */
export const EntryRenderer = React.memo(({ entry, viewMode, order, sections }: EntryRendererProps) => {
	switch (viewMode) {
		case "detail":
			return <EntryDetailItem entry={entry} order={order} sections={sections} />;
		case "list":
			return <EntryListItem entry={entry} order={order} sections={sections} />;
		case "grid":
			return <EntryGridItem entry={entry} />;
	}
});

EntryRenderer.displayName = "EntryRenderer";
