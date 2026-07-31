import styled from "styled-components";
import type { Entry } from "../../types/entry";
import { EntryDetailItem } from "./EntryDetailItem";
import { EntryListItem } from "./EntryListItem";
import { EntryGridItem } from "./EntryGridItem";

export type ViewMode = "detail" | "list" | "grid";
export const VIEW_MODES: ViewMode[] = ["detail", "list", "grid"];

// display:contents keeps this wrapper invisible to layout when shown, so hiding
// an entry is a pure CSS toggle instead of an unmount/remount of the whole card.
const HideWrap = styled.div<{ $hidden: boolean }>`
	display: ${({ $hidden }) => ($hidden ? "none" : "contents")};
`;

interface EntryRendererProps {
	entry: Entry;
	viewMode: ViewMode;
	hidden?: boolean;
}

export const EntryRenderer = ({ entry, viewMode, hidden = false }: EntryRendererProps) => {
	let content;
	switch (viewMode) {
		case "list":
			content = <EntryListItem entry={entry} />;
			break;
		case "grid":
			content = <EntryGridItem entry={entry} />;
			break;
		case "detail":
		default:
			content = <EntryDetailItem entry={entry} />;
			break;
	}

	return <HideWrap $hidden={hidden}>{content}</HideWrap>;
};
