import styled from "styled-components";
import { Star } from "lucide-react";
import type { Entry } from "../../types/entry";
import type { Section } from "../../types/section";
import { MEDIA_ICONS } from "../../types/mediaType";
import { EntryPill } from "../layout/entry/EntryPill";
import { EntryTitle } from "../layout/entry/EntryTitle";
import { EpisodeStepper } from "../layout/entry/EpisodeStepper";
import { MoveMenu } from "../layout/entry/MoveMenu";
import { OpenButton } from "../layout/entry/OpenButton";
import { EntryCoverCompact } from "../layout/entry/EntryCoverCompact";
import React from "react";

const noop = () => {};

// EntryListItem.tsx
const Row = styled.div`
	display: flex;
	align-items: center;
	gap: 14px;
	height: 144px;
	min-height: 0;
	overflow: hidden;
	padding: 10px 14px;
	border: 1px solid var(--border);
	border-radius: 8px;
	transition: border-color 150ms;

	&:hover {
		border-color: #6b6b6f;
	}
	&:hover .cover img {
		transform: scale(1.05);
	}
`;
const Info = styled.div`
	display: flex;
	align-items: center;
	gap: 14px;
	flex: 1;
	min-width: 0;
`;

const TitleBlock = styled.div`
	min-width: 0;
	flex-shrink: 0;
	width: 220px;
`;

const Progress = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	flex: 1;
	min-width: 100px;
`;

const Track = styled.div`
	flex: 1;
	height: 4px;
	border-radius: 999px;
	background: var(--bg-3);
	overflow: hidden;
`;

const Fill = styled.div`
	height: 100%;
	border-radius: 999px;
	background: var(--color-group-watching);
	width: var(--percent, 0%);
`;

const ProgressLabel = styled.span`
	font-size: 12px;
	color: #6b6b6f;
	flex-shrink: 0;
`;

const Actions = styled.div`
	display: flex;
	align-items: center;
	gap: 6px;
	opacity: 0;
	pointer-events: none;
	transition: opacity 150ms;
	flex-shrink: 0;

	${Row}:hover & {
		opacity: 1;
		pointer-events: auto;
	}
`;

interface Props {
	entry: Entry;
	order?: number;
	sections: Section[];
}

export const EntryListItem = React.memo(({ entry, order, sections }: Props) => {
	const Icon = MEDIA_ICONS[entry.mediaType];
	const coverUrl = entry.coverUrl ?? entry.source.coverUrl ?? undefined;
	const total = entry.source.totalEpisodes;
	const current = entry.currentEpisode ?? 0;
	const percent = total ? Math.min(100, (current / total) * 100) : 0;

	return (
		<Row>
			<EntryCoverCompact src={coverUrl} to={`/anime/${entry.id}`} favorite={entry.favorite} />

			<Info>
				{order != null && <EntryPill>#{order}</EntryPill>}

				<TitleBlock>
					<EntryTitle to={`/anime/${entry.id}`} title={entry.title} />
				</TitleBlock>

				<EntryPill>
					<Icon size={12} />
					{entry.mediaType.toUpperCase()}
				</EntryPill>

				{entry.source.rating != null && (
					<EntryPill color="#fbbf24">
						<Star size={11} fill="#fbbf24" />
						{entry.source.rating}
					</EntryPill>
				)}

				{total != null && (
					<Progress>
						<Track>
							<Fill style={{ "--percent": `${percent}%` } as React.CSSProperties} />
						</Track>
						<ProgressLabel>
							{current} / {total}
						</ProgressLabel>
					</Progress>
				)}
			</Info>

			<Actions>
				<EpisodeStepper current={current} total={total ?? undefined} onChange={noop} />
				<MoveMenu sections={sections} onMove={noop} />
				<OpenButton to={`/anime/${entry.id}`} />
			</Actions>
		</Row>
	);
});
