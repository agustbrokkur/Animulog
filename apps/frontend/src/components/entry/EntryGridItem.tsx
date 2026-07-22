// EntryGridItem.tsx
import styled from "styled-components";
import { Star } from "lucide-react";
import type { Entry } from "../../types/entry";
import { EpisodeStepper } from "../layout/entry/EpisodeStepper";
import { OpenButton } from "../layout/entry/OpenButton";

const Wrap = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const Card = styled.div`
	position: relative;
	aspect-ratio: 2 / 3;
	border-radius: 10px;
	overflow: hidden;
	background: var(--bg-surface-alt);
	border: 2px solid transparent;
	transition: border-color 150ms;

	&:hover {
		border-color: var(--color-group-watching);
	}
	&:hover img {
		transform: scale(1.05);
	}
`;

const Img = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
	transition: transform 200ms;
`;

const ProgressBadge = styled.div`
	position: absolute;
	top: 6px;
	left: 6px;
	font-size: 11px;
	font-weight: 600;
	color: white;
	background: rgb(0 0 0 / 0.6);
	padding: 2px 6px;
	border-radius: 999px;
	opacity: 1;
	transition: opacity 150ms;

	${Card}:hover & {
		opacity: 0;
	}
`;

const RatingBadge = styled.div`
	position: absolute;
	top: 6px;
	right: 6px;
	display: flex;
	align-items: center;
	gap: 3px;
	font-size: 11px;
	font-weight: 600;
	color: #fbbf24;
	background: rgb(0 0 0 / 0.6);
	padding: 2px 6px;
	border-radius: 999px;
`;

const HoverScrim = styled.div`
	position: absolute;
	inset: 0;
	background: rgb(0 0 0 / 0.75);
	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-content: flex-end;
	gap: 6px;
	padding: 10px;
	opacity: 0;
	pointer-events: none;
	transition: opacity 150ms;

	${Card}:hover & {
		opacity: 1;
		pointer-events: auto;
	}
`;

const Title = styled.a`
	font-size: 13px;
	color: #d1d5db;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	&:hover {
		color: white;
	}
`;

interface Props {
	entry: Entry;
}

export const EntryGridItem = ({ entry }: Props) => {
	const coverUrl = entry.coverUrl ?? entry.source.coverUrl ?? undefined;
	const total = entry.source.totalEpisodes;

	return (
		<Wrap>
			<Card>
				<Img src={coverUrl} />

				<ProgressBadge>
					{entry.currentEpisode ?? 0} / {total ?? "?"}
				</ProgressBadge>

				{entry.source.rating != null && (
					<RatingBadge>
						<Star size={10} fill="#fbbf24" />
						{entry.source.rating}
					</RatingBadge>
				)}

				<HoverScrim>
					<EpisodeStepper current={entry.currentEpisode ?? 0} total={total ?? undefined} onChange={() => {}} transparent />
					<OpenButton to={`/anime/${entry.id}`} transparent />
				</HoverScrim>
			</Card>

			<Title href={`/anime/${entry.id}`}>{entry.title}</Title>
		</Wrap>
	);
};
