import { Link } from "react-router-dom";
import { useAnimu } from "../../hooks/useAnime";
import { EntryRenderer } from "../entry/EntryRenderer";
import { EntryDetailItem } from "../entry/EntryDetailItem";
import type { Entry } from "../../types/entry";

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

export const AnimuList = () => {
	const { data: animu, isLoading, isError } = useAnimu();

	if (isLoading) return <p>Loading Animu...</p>;
	if (isError) return <p>Something went wrong with Animu</p>;

	return (
		<div>
			<h2>Entries</h2>
			<ul>
				{animu?.sections.map((section) => (
					<div key={section.id}>
						<Link to={`/sections/${section.id}`}>
							<h1>{section.label}</h1>
						</Link>
						{section.entryIds.map((id, index) => (
							// <EntryDetailItem key={section.label + "-" + id} entry={testEntry} order={index + 1} sections={animu?.sections} />
							<EntryDetailItem key={section.label + "-" + id} entry={animu?.entries.find((x) => x.id == id) ?? ({} as Entry)} />
							// <EntryDetailItem key={section.label + "-" + id} entry={animu?.entries.find(x => x.id == id) ?? null} />
							// <EntryRenderer key={section.label + "-" + id} entry={animu?.entries.find(x => x.id == id) ?? null}  />
						))}
					</div>
				))}
			</ul>
		</div>
	);
};
