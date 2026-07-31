import styled from "styled-components";
import { useDeferredValue, useMemo, useState } from "react";
import { EntryRenderer, VIEW_MODES, type ViewMode } from "../components/entry/EntryRenderer";
import { useAnimu } from "../hooks/useAnime";
import { SquareCheck } from "lucide-react";
import { GROUP_COLOR_VARS, GROUP_ICONS } from "../types/groupType";
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
import { SortMenu } from "../components/layout/actions/SortMenu/SortMenu";
import { type EntrySort, DEFAULT_SORT } from "../types/sort";
import { sortEntries } from "../utils/sortEntries";

const Wrap = styled.div`
	overflow-y: auto;
`;

const Header = styled.div`
	display: flex;
	flex-direction: column;
	gap: 18px;
	padding: 28px 24px 20px;
	border-bottom: 1px solid var(--border);
`;

const SectionHeader = styled.h1<{ $color: string }>`
	display: flex;
	align-items: center;
	gap: 12px;
	font-size: 26px;
	font-weight: 800;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	color: ${({ $color }) => $color};
`;

const EntryCount = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 32px;
	height: 32px;
	padding: 0 10px;
	border-radius: 999px;
	background: var(--bg-4);
	font-size: 16px;
	font-weight: 600;
	letter-spacing: 0;
	text-transform: none;
	color: var(--text-dim);
`;

const SectionBody = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	width: 100%;
`;

const SectionBodyGroup = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
`;

/**
 * `content-visibility: auto` lets the browser skip layout/paint for offscreen
 * children. `contain-intrinsic-size` gives it a placeholder height so the
 * scrollbar stays stable. This is cheap virtualization without a dependency.
 */
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

	> * {
		content-visibility: auto;
		contain-intrinsic-size: auto ${({ $viewMode }) => ($viewMode === "list" ? "144px" : "320px")};
	}
`;

const EmptyState = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 10px;
	padding: 80px 24px;
	color: var(--text-dimmer);
	text-align: center;
`;

const EmptyTitle = styled.span`
	font-size: 15px;
	font-weight: 600;
	color: var(--text-dim);
`;

const EmptyHint = styled.span`
	font-size: 13px;
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
	const deferredViewMode = useDeferredValue(viewMode);
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState<EntryFilters>(EMPTY_FILTERS);
	const [sort, setSort] = useState<EntrySort>(DEFAULT_SORT);
	const debouncedSearch = useDebouncedValue(search, 200);

	const section = animu?.sections.find((s) => s.id === sectionId);
	const sections = useMemo(() => animu?.sections ?? [], [animu]);
	const entries = useMemo(() => {
		return section?.entryIds.map((id) => animu?.entries.find((e) => e.id === id)).filter((e): e is NonNullable<typeof e> => e != null) ?? [];
	}, [section, animu]);
	const entryOrder = useMemo(() => new Map(section?.entryIds.map((id, index) => [id, index])), [section]);

	const searchedEntries = useEntrySearch(entries, debouncedSearch, "quick");

	const deferredFilters = useDeferredValue(filters);
	const deferredSort = useDeferredValue(sort);

	const visibleEntries = useMemo(() => sortEntries(applyEntryFilters(searchedEntries, deferredFilters), deferredSort), [searchedEntries, deferredFilters, deferredSort]);

	const isStale = filters !== deferredFilters || sort !== deferredSort || viewMode !== deferredViewMode;

	if (!section) return null;

	const GroupIcon = GROUP_ICONS[section.group];
	const groupColor = GROUP_COLOR_VARS[section.group];

	return (
		<Wrap>
			<Header>
				<SectionHeader $color={groupColor}>
					<GroupIcon size={24} color={groupColor} />
					{section.label}
					<EntryCount>{section.entryIds.length}</EntryCount>
				</SectionHeader>
				<SectionBody>
					<SectionBodyGroup>
						<SearchInput value={search} onChange={setSearch} />
						<FilterMenu entries={entries} filters={filters} onChange={setFilters} />
						<SortMenu sort={sort} onChange={setSort} />
					</SectionBodyGroup>
					<SectionBodyGroup>
						<ToolbarButton icon={SquareCheck} label="Select" />
						<ViewModeSwitcher viewMode={viewMode} onViewModeChange={setViewMode} />
						<AddButton />
					</SectionBodyGroup>
				</SectionBody>
			</Header>

			{visibleEntries.length === 0 ? (
				<EmptyState>
					<EmptyTitle>No entries found</EmptyTitle>
					<EmptyHint>Try a different search term or adjust your filters.</EmptyHint>
				</EmptyState>
			) : (
				<Container $viewMode={deferredViewMode} style={{ opacity: isStale ? 0.6 : 1 }}>
					{visibleEntries.map((entry) => (
						<EntryRenderer key={entry.id} entry={entry} viewMode={deferredViewMode} order={entryOrder.get(entry.id)} sections={sections} />
					))}
				</Container>
			)}
		</Wrap>
	);
};
