import styled from "styled-components";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { EntryRenderer, type ViewMode } from "../components/entry/EntryRenderer";
import { useAnimu } from "../hooks/useAnime";
import type { Entry } from "../types/entry";

const Container = styled.div<{ $viewMode: ViewMode }>`
	display: ${({ $viewMode }) => ($viewMode === "grid" ? "grid" : "flex")};
	${({ $viewMode }) =>
		$viewMode === "grid"
			? `
        grid-template-columns: repeat(9, 1fr);
        gap: 14px;
      `
			: `
        flex-direction: column;
        gap: ${$viewMode === "list" ? "6px" : "10px"};
      `}
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

	const section = animu?.sections.find((s) => s.id === sectionId);
	const entries = section?.entryIds.map((id) => animu?.entries.find((e) => e.id === id)).filter((e): e is NonNullable<typeof e> => e != null) ?? [];

	if (!section) return null;

	return (
		<div>
			<Container $viewMode={viewMode}>
				{entries.map((entry) => (
					<EntryRenderer key={entry.id} entry={testEntry} viewMode={viewMode} />
				))}
			</Container>
		</div>
	);
};
