import { Link, useParams } from "react-router-dom";
import { EntryRenderer } from "../components/entry/EntryRenderer";
import { useAnimu } from "../hooks/useAnime";
import { EntryDetailItem } from "../components/entry/EntryDetailItem";
import type { Entry } from "../types/entry";

export const SectionView = () => {
	const { sectionId } = useParams();
	const { data: animu, isLoading, isError } = useAnimu();

	if (isLoading) return <p>Loading Animu...</p>;
	if (isError) return <p>Something went wrong with Animu</p>;

	const sectionData = animu?.sections.find((section) => section.id === sectionId || section.label === sectionId);

	return (
		<div>
			<div>Section View</div>
			<ul>
				<div>
					<Link to={`/sections/${sectionData?.id}`}>
						<h1>{sectionData?.label}</h1>
					</Link>
					{sectionData?.entryIds.map((id, index) => (
						<EntryDetailItem key={sectionData.label + "-" + id} entry={animu?.entries.find((x) => x.id == id) ?? ({} as Entry)} />
						// <EntryRenderer key={sectionData.label + "-" + id} entry={animu?.entries.find(x => x.id == id) ?? null}  />
					))}
				</div>
			</ul>
		</div>
	);
};
