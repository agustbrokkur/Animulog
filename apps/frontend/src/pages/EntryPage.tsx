import { Link, useParams } from "react-router";
import { EntryRenderer } from "../components/entry/EntryRenderer";
import { useAnimu } from "../hooks/useAnime";
import { resolveEntry } from "../types/entry";
import { sortedSections } from "../types/section";

export const EntryView = () => {
	const { animeId } = useParams();
	const { data: animu, isLoading, isError } = useAnimu();

	if (isLoading) return <p>Loading Animu...</p>;
	if (isError) return <p>Something went wrong with Animu</p>;

	const byId = animeId ? animu?.entries[animeId] : undefined;
	const byTitle = animeId && !byId ? Object.values(animu?.entries ?? {}).find((x) => resolveEntry(x).displayTitle === animeId) : undefined;
	const animeData = byId ?? byTitle ?? null;

	if (!animeData) return <p>Entry not found</p>;

	return (
		<div>
			<Link to={`/anime/${animeData.id}`}>
				<div>Entry View</div>
			</Link>
			<EntryRenderer entry={animeData} viewMode="detail" sections={animu ? sortedSections(animu.sections) : []} />
		</div>
	);
};
