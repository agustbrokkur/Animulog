import { useMemo } from "react";
import styled from "styled-components";
import { useAnimu } from "../../../hooks/useAnime";
import { type GroupType, GROUP_TYPES, GROUP_TYPE_MAPPINGS, GROUP_COLOR_VARS } from "../../../types/groupType";

interface GroupCount {
	name: GroupType;
	count: number;
}

const Wrap = styled.div`
	padding: 20px 16px 16px;
	border-bottom: 1px solid var(--border);
	flex-shrink: 0;
`;

const Logo = styled.div`
	cursor: pointer;
	color: var(--color-brand);
	font-size: 32px;
	font-weight: 700;
	letter-spacing: 3px;
	transition: opacity 150ms;
	margin-bottom: 14px;

	&:hover {
		opacity: 0.75;
	}
`;

const CountColumn = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6px;
`;

const CountPill = styled.div<{ $color: string }>`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	min-width: 60px;
	max-width: 180px;
	width: 100%;
	padding: 4px 10px;
	border-radius: 999px;
	font-size: 16px;
	color: ${({ $color }) => $color};
	background: color-mix(in srgb, ${({ $color }) => $color} 10%, transparent);
	border: 1px solid color-mix(in srgb, ${({ $color }) => $color} 35%, transparent);
`;

const CountNumber = styled.span`
	font-weight: 600;
`;

export const SidebarHeader = () => {
	const { data: animu, isLoading } = useAnimu();

	const counts = useMemo<GroupCount[]>(() => {
		if (!animu) return [];

		return GROUP_TYPES.map((group) => ({
			name: group,
			count: animu.sections.filter((section) => section.group === group).reduce((total, section) => total + section.entryIds.length, 0),
		}));
	}, [animu, isLoading]);

	return (
		<Wrap>
			<Logo>Animulog</Logo>

			<CountColumn>
				{counts.map((x) => (
					<CountPill key={x.name} $color={GROUP_COLOR_VARS[x.name]}>
						{GROUP_TYPE_MAPPINGS[x.name]}
						<CountNumber>{x.count}</CountNumber>
					</CountPill>
				))}
			</CountColumn>
		</Wrap>
	);
};
