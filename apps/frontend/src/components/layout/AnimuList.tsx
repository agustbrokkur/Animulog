import { Link } from "react-router";
import { useAnimu } from "../../hooks/useAnime";
import { EntryListItem } from "../entry/EntryListItem";
import { sectionEntryIds, sortedSections } from "../../types/section";
import type { Entry } from "../../types/entry";

export const AnimuList = () => {
	const { data: animu, isLoading, isError } = useAnimu();

	if (isLoading) return <p>Loading Animu...</p>;
	if (isError) return <p>Something went wrong with Animu</p>;

	const sections = animu ? sortedSections(animu.sections) : [];

	return (
		<div>
			<h2>Entries</h2>
			<ul>
				{sections.map((section) => (
					<div key={section.id}>
						<Link to={`/sections/${section.id}`}>
							<h1>{section.label}</h1>
						</Link>
						{sectionEntryIds(section)
							.map((id) => animu?.entries[id])
							.filter((e): e is Entry => e != null)
							.map((entry) => (
								<EntryListItem key={section.label + "-" + entry.id} entry={entry} sections={sections} />
							))}
					</div>
				))}
			</ul>
		</div>
	);
};
