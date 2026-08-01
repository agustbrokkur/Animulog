import { Star } from "lucide-react";
import type { Entry } from "../../types/entry";
import { resolveEntry } from "../../types/entry";
import type { Section } from "../../types/section";
import { MEDIA_ICONS } from "../../types/mediaType";
import type { Status } from "../../types/status";
import { STATUS_LABELS } from "../../types/status";
import { EntryCover } from "../layout/entry/EntryCover";
import { EpisodeProgress } from "../layout/entry/EpisodeProgress";
import { EpisodeStepper } from "../layout/entry/EpisodeStepper";
import { MoveMenu } from "../layout/entry/MoveMenu";
import { OpenButton } from "../layout/entry/OpenButton";
import { EntryTitle } from "../layout/entry/EntryTitle";
import { EntryText } from "../layout/entry/EntryText";
import { EntryPill } from "../layout/entry/EntryPill";
import { Actions, Card, Info, Row } from "./EntryDetailItem.styles";
import React from "react";

const STATUS_COLORS: Record<Status, [string, string, string]> = {
	unsorted: ["#9ca3af", "rgba(55,65,81,0.4)", "#374151"],
	backlog: ["#fbbf24", "rgba(120,53,15,0.4)", "#92400e"],
	watching: ["#378ADD", "rgba(30,58,138,0.4)", "#1e40af"],
	on_hold: ["#c084fc", "rgba(88,28,135,0.4)", "#6b21a8"],
	watched: ["#5DCAA5", "rgba(19,78,74,0.4)", "#115e59"],
	dropped: ["#f87171", "rgba(127,29,29,0.4)", "#991b1b"],
};

const noop = () => {};

interface EntryDetailItemProps {
	entry: Entry;
	order?: number;
	sections: Section[];
}

export const EntryDetailItem = React.memo(({ entry, order, sections }: EntryDetailItemProps) => {
	const Icon = MEDIA_ICONS[entry.mediaType];
	const { displayTitle, displayCover } = resolveEntry(entry);
	const [statusColor, statusBg, statusBorder] = STATUS_COLORS[entry.status];

	return (
		<Card>
			<EntryCover src={displayCover ?? undefined} title={displayTitle} to={`/anime/${entry.id}`} favorite={entry.favorite} />

			<Info>
				<div>
					<EntryPill color={statusColor} bg={statusBg} border={statusBorder}>
						{STATUS_LABELS[entry.status].toUpperCase()}
					</EntryPill>
				</div>

				<EntryTitle
					to={`/anime/${entry.id}`}
					title={`${displayTitle} (${entry.mediaType.toUpperCase()})`}
					subtitle={entry.source?.japaneseTitle}
					englishSubtitle={entry.source?.englishTitle}
				/>

				<Row>
					<EntryText $muted>Added: {new Date(entry.timestamps.added).toLocaleDateString()}</EntryText>
					<div>{entry.source?.totalEpisodes != null && <EpisodeProgress current={entry.progress ?? 0} total={entry.source.totalEpisodes} color={statusColor} />}</div>
				</Row>

				<Row>
					{order != null && <EntryPill>#{order}</EntryPill>}
					{entry.source?.communityRating != null && (
						<EntryPill color="#fbbf24" bg="rgba(120,53,15,0.4)" border="#78350f">
							<Star size={11} fill="#fbbf24" />
							{entry.source.communityRating}
						</EntryPill>
					)}
					<EntryPill>
						<Icon size={12} />
						{entry.mediaType.toUpperCase()}
					</EntryPill>
					{entry.source?.totalEpisodes != null && <EntryPill>{entry.source.totalEpisodes} ep</EntryPill>}
					{entry.source?.studios[0] && <EntryPill>{entry.source.studios[0]}</EntryPill>}
					{entry.source?.genres.map((g) => (
						<EntryPill key={g} color="#d8b4fe" bg="rgba(88,28,135,0.3)" border="#581c87">
							{g}
						</EntryPill>
					))}
				</Row>

				{entry.source?.synopsis && <EntryText $clamp={2}>{entry.source.synopsis}</EntryText>}
				{entry.note && <EntryText $italic>{entry.note}</EntryText>}

				<Actions>
					<EpisodeStepper current={entry.progress ?? 0} total={entry.source?.totalEpisodes ?? undefined} onChange={noop} />
					<MoveMenu sections={sections} onMove={noop} />
					<OpenButton to={`/anime/${entry.id}`} />
				</Actions>
			</Info>
		</Card>
	);
});
