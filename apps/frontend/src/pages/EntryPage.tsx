import { Link, useParams } from "react-router-dom";
import { EntryRenderer } from "../components/entry/EntryRenderer";
import { useAnimu } from "../hooks/useAnime";

export const EntryView = () => {
	const { animeId } = useParams();
	const { data: animu, isLoading, isError } = useAnimu();

	if (isLoading) return <p>Loading Animu...</p>;
	if (isError) return <p>Something went wrong with Animu</p>;

	const animeData = animu?.entries.find((x) => x.id === animeId || x.title === animeId) ?? null;

	return (
		<div>
			<Link to={`/anime/${animeData?.id}`}>
				<div>Entry View</div>
			</Link>
			<EntryRenderer entry={animeData} viewMode="detail" />
		</div>
	);
};
