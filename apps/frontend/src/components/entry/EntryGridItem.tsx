// EntryGridItem.tsx
import styled from "styled-components";
import { Star } from "lucide-react";
import type { Entry } from "../../types/entry";
import { resolveEntry } from "../../types/entry";
import type { Section } from "../../types/section";
import { STATUS_COLORS } from "../../types/status";
import { EpisodeStepper } from "../layout/entry/EpisodeStepper";
import { MoveMenu } from "../layout/entry/MoveMenu";
import { MediaTypeMenu } from "../layout/entry/MediaTypeMenu";
import { StatusMenu } from "../layout/entry/StatusMenu";
import { OpenButton } from "../layout/entry/OpenButton";
import React, { useEffect, useState } from "react";
import { useAdjustEntryProgress, useMoveEntryToSection, useUpdateEntryMediaType, useUpdateEntryStatus } from "../../hooks/useAnime";
import { useOpenMenuTracker } from "../../hooks/useOpenMenuTracker";
import { useEntryPanel } from "../../context/EntryPanelContext";

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
	background: var(--bg-3);
	border: 2px solid transparent;
	cursor: pointer;
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

const ProgressBadge = styled.div<{ $color: string }>`
	position: absolute;
	top: 6px;
	left: 6px;
	font-size: 12px;
	font-weight: 600;
	color: ${({ $color }) => $color};
	background: rgb(0 0 0 / 0.8);
	padding: 2px 6px;
	border-radius: 999px;
	opacity: 1;
	transition: opacity 150ms;

	${Card}:hover & {
		opacity: 0;
	}
`;

const RatingBadge = styled.div<{ $color: string }>`
	position: absolute;
	top: 6px;
	right: 6px;
	display: flex;
	align-items: center;
	gap: 3px;
	font-size: 12px;
	font-weight: 600;
	color: ${({ $color }) => $color};
	background: rgb(0 0 0 / 0.8);
	padding: 2px 6px;
	border-radius: 999px;
`;

const HoverScrim = styled.div<{ $forceOpen?: boolean }>`
	position: absolute;
	inset: 0;
	background: rgb(0 0 0 / 0.75);
	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-content: flex-end;
	gap: 6px;
	padding: 10px;
	opacity: ${({ $forceOpen }) => ($forceOpen ? 1 : 0)};
	pointer-events: ${({ $forceOpen }) => ($forceOpen ? "auto" : "none")};
	transition: opacity 150ms;

	${Card}:hover & {
		opacity: 1;
		pointer-events: auto;
	}
`;

const ScrimRow = styled.div`
	display: flex;
	align-items: center;
	gap: 6px;

	> * {
		flex: 1;
		min-width: 0;
	}

	> * button {
		width: 100%;
		justify-content: center;
	}
`;

const Footer = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 6px;
`;

const OrderBox = styled.div<{ $color: string }>`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	width: 26px;
	height: 26px;
	border-radius: 6px;
	background: var(--bg-3);
	border: 1px solid var(--border);
	transition: border-color 150ms;

	&:focus-within {
		border-color: ${({ $color }) => $color};
	}
`;

const OrderInput = styled.input<{ $color: string }>`
	width: 100%;
	height: 100%;
	padding: 0;
	text-align: center;
	font-size: 12px;
	font-weight: 700;
	font-family: inherit;
	color: var(--text-dim);
	background: transparent;
	border: none;
	border-radius: inherit;
	transition:
		color 150ms,
		background 150ms;

	&:hover {
		color: var(--text);
		background: var(--bg-4);
	}

	&:focus {
		outline: none;
		color: var(--text);
		background: color-mix(in srgb, ${({ $color }) => $color} 22%, var(--bg-2));
	}
`;

const Title = styled.button`
	display: -webkit-box;
	flex: 1;
	background: none;
	border: none;
	padding: 0;
	font: inherit;
	cursor: pointer;
	font-size: 16px;
	color: #d1d5db;
	white-space: initial;
	overflow: hidden;
	text-overflow: ellipsis;
	align-self: start;
	text-align: start;

	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;

	&:hover {
		color: white;
	}
`;

interface Props {
	entry: Entry;
	sections: Section[];
	order?: number;
	/** Commits a new 0-based position for this entry within its section's custom order. Only rendered when the entry belongs to a manually-ordered section. */
	onReorder?: (newIndex: number) => void;
}

export const EntryGridItem = React.memo(({ entry, sections, order, onReorder }: Props) => {
	const { displayTitle, displayCover, displayTotalEpisodes: total } = resolveEntry(entry);
	const color = STATUS_COLORS[entry.status];
	const ratingValue = entry.score ?? entry.source?.communityRating ?? null;
	const ratingColor = entry.score != null ? "var(--color-accent)" : "#fbbf24";
	const { mutate: adjustProgress } = useAdjustEntryProgress();
	const { mutate: moveEntry } = useMoveEntryToSection();
	const { mutate: updateMediaType } = useUpdateEntryMediaType();
	const { mutate: updateStatus } = useUpdateEntryStatus();
	const { anyOpen: menuOpen, setMenuOpen } = useOpenMenuTracker();
	const { openPanel } = useEntryPanel();

	const [orderValue, setOrderValue] = useState(order != null ? String(order) : "");
	useEffect(() => {
		if (order != null) setOrderValue(String(order));
	}, [order]);

	const commitOrder = () => {
		if (order == null || !onReorder) return;
		const parsed = Number.parseInt(orderValue, 10);
		if (Number.isNaN(parsed) || parsed === order) {
			setOrderValue(String(order));
			return;
		}
		onReorder(parsed);
	};

	return (
		<Wrap>
			<Card onClick={() => openPanel(entry.id)}>
				<Img src={displayCover ?? undefined} loading="lazy" decoding="async" />

				<ProgressBadge $color={color}>
					{entry.progress ?? 0} / {total ?? "?"}
				</ProgressBadge>

				{ratingValue != null && (
					<RatingBadge $color={ratingColor}>
						<Star size={10} fill={ratingColor} />
						{ratingValue}
					</RatingBadge>
				)}

				<HoverScrim $forceOpen={menuOpen}>
					<div onClick={(e) => e.stopPropagation()}>
						<EpisodeStepper current={entry.progress ?? 0} total={total ?? undefined} onChange={(delta) => adjustProgress({ entry, delta })} transparent />
					</div>
					<ScrimRow onClick={(e) => e.stopPropagation()}>
						<MediaTypeMenu
							mediaType={entry.mediaType}
							onChange={(mediaType) => updateMediaType({ entry, mediaType })}
							onOpenChange={(open) => setMenuOpen("mediaType", open)}
							transparent
						/>
						<StatusMenu status={entry.status} onChange={(status) => updateStatus({ entry, status })} onOpenChange={(open) => setMenuOpen("status", open)} transparent />
					</ScrimRow>
					<ScrimRow onClick={(e) => e.stopPropagation()}>
						<MoveMenu
							sections={sections}
							entryId={entry.id}
							onMove={(sectionId) => moveEntry({ entryId: entry.id, targetSectionId: sectionId, sections })}
							onOpenChange={(open) => setMenuOpen("move", open)}
							transparent
						/>
						<OpenButton to={`/anime/${entry.id}`} transparent />
					</ScrimRow>
				</HoverScrim>
			</Card>

			<Footer>
				{order != null && (
					<OrderBox $color={color} onClick={(e) => e.stopPropagation()}>
						<OrderInput
							$color={color}
							type="text"
							inputMode="numeric"
							value={orderValue}
							onChange={(e) => setOrderValue(e.target.value.replace(/[^0-9]/g, ""))}
							onBlur={commitOrder}
							onKeyDown={(e) => {
								if (e.key === "Enter") e.currentTarget.blur();
								if (e.key === "Escape") setOrderValue(String(order));
							}}
						/>
					</OrderBox>
				)}
				<Title onClick={() => openPanel(entry.id)}>{displayTitle}</Title>
			</Footer>
		</Wrap>
	);
});
