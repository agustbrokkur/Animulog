import { useParams } from "react-router";
import { useAnimu } from "../../../hooks/useAnime";
import { Breadcrumb } from "./Breadcrumb";
import styled from "styled-components";

interface Crumbs {
	name: string;
	path: string;
}

const Wrap = styled.div`
	display: flex;
	align-items: center;
	min-height: 60px;
	height: 60px;
	overflow-y: auto;
	border-bottom: 1px solid var(--border);
	background: var(--bg-2);
`;

export const Toolbar = () => {
	const { animeId, sectionId } = useParams();
	const { data: animu } = useAnimu();

	const crumbs: Crumbs[] = [{ name: "Overview", path: "/" }];

	if (animeId) {
		const sectionItem = animu?.sections.find((x) => x.entryIds.includes(animeId));
		const entryItem = animu?.entries.find((x) => x.id === animeId);

		crumbs.push({ name: sectionItem?.label ?? "", path: `section/${sectionItem?.id}` });
		crumbs.push({ name: entryItem?.title ?? "", path: `section/${entryItem?.id}` });
	}

	if (sectionId) {
		const sectionItem = animu?.sections.find((x) => x.id === sectionId);

		crumbs.push({ name: sectionItem?.label ?? "", path: `section/${sectionItem?.id}` });
	}

	return (
		<Wrap>
			<Breadcrumb />
		</Wrap>
		// <div className="flex items-center justify-between py-0 px-6 h-14 bg-[#141416] border-b border-[#2a2a2e] shrink-0">
		//     {/* Overview  */}
		//     {
		//         crumbs.map(crumb => (
		//             <><Link key={crumb.name} to={crumb.path}>{crumb.name}</Link> / </>
		//         ))
		//     }
		// </div>
	);
};
