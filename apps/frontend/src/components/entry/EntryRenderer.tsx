import type { Entry } from "../../types/entry";
import { EntryDetailItem } from "./EntryDetailItem";
import { EntryListItem } from "./EntryListItem";
import { EntryGridItem } from "./EntryGridItem";

export type ViewMode = "detail" | "list" | "grid";
export const VIEW_MODES: ViewMode[] = ["detail", "list", "grid"];

interface EntryRendererProps {
	entry: Entry;
	viewMode: ViewMode;
}

export const EntryRenderer = ({ entry, viewMode }: EntryRendererProps) => {
	switch (viewMode) {
		case "list":
			return <EntryListItem entry={entry} />;
		case "grid":
			return <EntryGridItem entry={entry} />;
		case "detail":
		default:
			return <EntryDetailItem entry={entry} />;
	}
};
