import styled from "styled-components";

const Wrap = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	flex: 1;
	min-width: 280px;
	font-size: 16px;
	color: #6b6b6f;
`;

const Track = styled.div`
	flex: 1;
	height: 6px;
	border-radius: 999px;
	background: #242428;
	overflow: hidden;
`;

const Fill = styled.div<{ $percent: number }>`
	height: 100%;
	border-radius: 999px;
	background: #2dd4bf;
	width: ${({ $percent }) => $percent}%;
`;

export const EpisodeProgress = ({ current, total }: { current: number; total: number }) => (
	<Wrap>
		<Track>
			<Fill $percent={Math.min(100, (current / total) * 100)} />
		</Track>
		<span>
			{current} / {total}
		</span>
	</Wrap>
);
