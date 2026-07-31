import styled from "styled-components";
import { useMemo, useState } from "react";
import { EntryRenderer, VIEW_MODES, type ViewMode } from "../components/entry/EntryRenderer";
import { useAnimu } from "../hooks/useAnime";
import { Filter, ArrowUpDown, SquareCheck } from "lucide-react";
import { ViewModeSwitcher } from "../components/layout/actions/ViewModeSwitcher";
import { SearchInput } from "../components/layout/actions/SearchInput";
import { ToolbarButton } from "../components/layout/actions/ToolbarButton";
import { AddButton } from "../components/layout/actions/AddButton";
import type { Entry } from "../types/entry";
import { useParams } from "react-router";
import { useEntrySearch } from "../hooks/useEntrySearch";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { type EntryFilters, EMPTY_FILTERS } from "../types/filters";
import { applyEntryFilters } from "../utils/applyEntryFilters";
import { FilterMenu } from "../components/layout/actions/FilterMenu/FilterMenu";

const Wrap = styled.div`
	overflow-y: auto;
`;

const Header = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: start;
	min-height: 200px;
	height: 200px;
	padding: 20px;
	margin-bottom: 6px;
	border-bottom: 1px solid var(--border);
	border-radius: 8px;
`;

const SectionHeader = styled.div`
	font-size: 42px;
`;

const SectionBody = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	width: 100%;
`;

const Container = styled.div<{ $viewMode: ViewMode }>`
	display: ${({ $viewMode }) => ($viewMode === "grid" ? "grid" : "flex")};
	${({ $viewMode }) =>
		$viewMode === "grid"
			? `
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 14px;
      `
			: `
        flex-direction: column;
        gap: ${$viewMode === "list" ? "6px" : "10px"};
      `}
	padding: 16px 24px 24px;
`;

export const testEntry: Entry = {
	id: "test-mmbn-1",
	title: "Mega Man: NT Warrior",
	mediaType: "tv",
	favorite: true,
	note: "Rewatching for nostalgia, holds up better than expected.",

	rating: 8,
	coverUrl: null,
	relatedEntryIds: ["test-mmbn-axess", "test-mmbn-stream"],

	currentEpisode: 32,

	addedAt: new Date("2026-04-26").getTime(),
	startedAt: new Date("2026-05-01").getTime(),
	finishedAt: null,
	droppedAt: null,

	source: {
		englishTitle: "Mega Man: NT Warrior",
		japaneseTitle: "ロックマンエグゼ",
		synopsis:
			"In a future where every device is networked, kids team up with personalized programs called Net Navis to battle viruses and cybercriminals. Series protagonist Lan pairs with his Navi, MegaMan, to defend the digital world from an escalating string of threats.",
		studios: ["Xebec"],
		genres: ["Action", "Adventure", "Comedy", "Sci-Fi"],
		coverUrl: "https://cdn.myanimelist.net/images/anime/2/26575.jpg",
		totalEpisodes: 51,
		rating: 6.9,
		airedFrom: new Date("2002-01-08").getTime(),
		airedTo: new Date("2002-12-24").getTime(),
		fetchedAt: new Date("2026-07-19").getTime(),
	},
};

export const SectionView = () => {
	const { sectionId } = useParams();
	const { data: animu } = useAnimu();
	const [viewMode, setViewMode] = useState<ViewMode>("grid");
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState<EntryFilters>(EMPTY_FILTERS);
	const debouncedSearch = useDebouncedValue(search, 200);

	const section = animu?.sections.find((s) => s.id === sectionId);
	const entries = useMemo(() => {
		return section?.entryIds.map((id) => animu?.entries.find((e) => e.id === id)).filter((e): e is NonNullable<typeof e> => e != null) ?? [];
	}, [section, animu]);
	const searchedEntries = useEntrySearch(entries, debouncedSearch, "quick");
	const filteredEntries = useMemo(() => applyEntryFilters(searchedEntries, filters), [searchedEntries, filters]);
	const visibleEntryIds = useMemo(() => new Set(filteredEntries.map((e) => e.id)), [filteredEntries]);

	if (!section) return null;

	return (
		<Wrap>
			<Header>
				<SectionHeader>
					{section.label} ({section.entryIds.length})
				</SectionHeader>
				<SectionBody>
					<SearchInput value={search} onChange={setSearch} />
					<FilterMenu entries={entries} filters={filters} onChange={setFilters} />
					<ToolbarButton icon={ArrowUpDown} label="Custom order" />
					<ToolbarButton icon={SquareCheck} label="Select" />
					<ViewModeSwitcher viewMode={viewMode} onViewModeChange={setViewMode} />
					<AddButton />
				</SectionBody>
			</Header>
			<Container $viewMode={viewMode}>
				{searchedEntries.map((entry) => (
					<EntryRenderer key={entry.id} entry={entry} viewMode={viewMode} hidden={!visibleEntryIds.has(entry.id)} />
				))}
			</Container>
		</Wrap>
	);
};
