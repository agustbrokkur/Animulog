import styled from "styled-components";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { GROUP_TYPES, GROUP_ICONS, GROUP_TYPE_MAPPINGS, GROUP_COLOR_VARS, type GroupType } from "../../../types/groupType";
import { useAnimu } from "../../../hooks/useAnime";

interface Grouping {
	name: string;
	type: GroupType;
	count: number;
	path: string;
}

const Body = styled.div`
	flex: 1;
	min-height: 0;
	overflow-y: auto;
	padding: 12px 8px;
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

const GroupBlock = styled.div<{ $color: string }>`
	flex-shrink: 0;
	border-radius: 10px;
	background: color-mix(in srgb, ${({ $color }) => $color} 6%, transparent);
	border: 1px solid color-mix(in srgb, ${({ $color }) => $color} 18%, transparent);
	overflow: hidden;
`;

const GroupHeader = styled.div<{ $color: string }>`
	display: flex;
	align-items: center;
	gap: 8px;
	color: ${({ $color }) => $color};
	font-size: 16px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	padding: 10px 12px 6px;
`;

const SectionList = styled.div`
	display: flex;
	flex-direction: column;
	padding: 0 6px 6px;
`;

const SectionLink = styled(Link)<{ $color: string }>`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	color: #d1d5db;
	padding: 7px 10px;
	border-radius: 6px;
	text-decoration: none;
	transition:
		background 150ms,
		color 150ms,
		transform 150ms;

	&:hover {
		color: white;
		background: color-mix(in srgb, ${({ $color }) => $color} 25%, transparent);
		transform: translateX(2px);
	}
`;

const SectionName = styled.span`
	font-size: 15px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	min-width: 0;
`;

const SectionCount = styled.span<{ $color: string }>`
	font-size: 15px;
	font-weight: 600;
	color: #6b6b6f;
	font-variant-numeric: tabular-nums;
	transition: color 150ms;

	${SectionLink}:hover & {
		color: ${({ $color }) => $color};
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
		<Body>
			{GROUP_TYPES.map((groupType) => {
				const Icon = GROUP_ICONS[groupType];
				const color = GROUP_COLOR_VARS[groupType];
				const sections = grouping.filter((group) => group.type === groupType);

				return (
					<GroupBlock key={groupType} $color={color}>
						<GroupHeader $color={color}>
							<Icon size={14} color={color} />
							<span>{GROUP_TYPE_MAPPINGS[groupType]}</span>
						</GroupHeader>

						<SectionList>
							{sections.map((section) => (
								<SectionLink key={section.path} to={section.path} $color={color} title={section.name}>
									<SectionName>{section.name}</SectionName>
									<SectionCount $color={color}>{section.count}</SectionCount>
								</SectionLink>
							))}
						</SectionList>
					</GroupBlock>
				);
			})}
		</Body>
	);
};
