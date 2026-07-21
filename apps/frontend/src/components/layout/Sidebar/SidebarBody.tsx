import styled from "styled-components";
import { Link } from "react-router-dom";
import { GROUP_TYPES, GROUP_ICONS, GROUP_TYPE_MAPPINGS, type GroupType } from "../../../types/groupType";
import { useMemo } from "react";
import { useAnimu } from "../../../hooks/useAnime";

interface Grouping {
	name: string;
	type: GroupType;
	count: number;
	path: string;
}

const GroupBlock = styled.div`
	margin-bottom: 16px;
`;

const GroupHeader = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	color: #d1d5db;
	font-weight: 500;
	margin-bottom: 4px;
`;

const SectionList = styled.div`
	padding-left: 24px;
	border: 1px solid #2a2a2e;
	margin: 0 8px;
`;

const SectionLink = styled(Link)`
	display: block;
	font-size: 14px;
	color: #9ca3af;
	padding: 2px 0;

	&:hover {
		color: white;
	}
`;

export const SidebarBody = () => {
	const { data: animu, isLoading } = useAnimu();

	const grouping = useMemo<Grouping[]>(() => {
		if (!animu) return [];

		return animu.sections.map((section) => ({
			name: section.label,
			type: section.group,
			count: section.entryIds.length,
			path: `/sections/${section.id}`,
		}));
	}, [animu, isLoading]);

	return (
		<div>
			{GROUP_TYPES.map((groupType) => {
				const Icon = GROUP_ICONS[groupType];
				const sections = grouping.filter((group) => group.type === groupType);

				return (
					<GroupBlock key={groupType}>
						<GroupHeader>
							<Icon size={16} color="#9ca3af" />
							<span>{GROUP_TYPE_MAPPINGS[groupType]}</span>
						</GroupHeader>

						<SectionList>
							{sections.map((section) => (
								<SectionLink key={section.path} to={section.path}>
									{section.name}: {section.count}
								</SectionLink>
							))}
						</SectionList>
					</GroupBlock>
				);
			})}
		</div>
	);
};
