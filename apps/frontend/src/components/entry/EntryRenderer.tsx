import styled from "styled-components";
import type { Entry } from "../../types/entry";
import { EntryDetailItem } from "./EntryDetailItem";
import { EntryListItem } from "./EntryListItem";
import { EntryGridItem } from "./EntryGridItem";

export type ViewMode = "detail" | "list" | "grid";
export const VIEW_MODES: ViewMode[] = ["detail", "list", "grid"];

// display:contents keeps a slot invisible to layout when shown, so both hiding
// an entry and switching view mode are pure CSS toggles instead of an
// unmount/remount of the card — all three variants stay mounted at once.
const ViewSlot = styled.div<{ $show: boolean }>`
	display: ${({ $show }) => ($show ? "contents" : "none")};
`;

interface EntryRendererProps {
	entry: Entry;
	viewMode: ViewMode;
	hidden?: boolean;
	order?: number;
}

export const EntryRenderer = ({ entry, viewMode, hidden = false, order }: EntryRendererProps) => {
	return (
		<>
			<ViewSlot $show={!hidden && viewMode === "detail"}>
				<EntryDetailItem entry={entry} order={order} />
			</ViewSlot>
			<ViewSlot $show={!hidden && viewMode === "list"}>
				<EntryListItem entry={entry} order={order} />
			</ViewSlot>
			<ViewSlot $show={!hidden && viewMode === "grid"}>
				<EntryGridItem entry={entry} />
			</ViewSlot>
		</>
	);
};
