// EntryListItem.tsx
import styled from "styled-components";
import { Star } from "lucide-react";
import type { Entry } from "../../types/entry";
import { resolveEntry } from "../../types/entry";
import type { Section } from "../../types/section";
import { STATUS_COLORS } from "../../types/status";
import { EpisodeStepper } from "../layout/entry/EpisodeStepper";
import { MoveMenu } from "../layout/entry/MoveMenu";
import { OpenButton } from "../layout/entry/OpenButton";
import { EntryCoverCompact } from "../layout/entry/EntryCoverCompact";
import { Link } from "react-router";
import React, { useEffect, useState } from "react";
import { useAdjustEntryProgress } from "../../hooks/useAnime";

const noop = () => {};

/** Baseline compact card height (a minimum, not a cap — long titles grow it) — used by grids that estimate row heights, e.g. the Overview page's 2-row clip. */
export const COMPACT_ENTRY_HEIGHT = 104;

const Card = styled.div<{ $color: string; $compact: boolean }>`
	position: relative;
	display: flex;
	background: var(--bg-3);
	border: 1px solid color-mix(in srgb, ${({ $color }) => $color} 30%, var(--border));
	border-left: 4px solid ${({ $color }) => $color};
	border-radius: var(--radius-lg);
	overflow: hidden;
	transition:
		border-color 150ms,
		background 150ms;
	min-height: ${({ $compact }) => ($compact ? COMPACT_ENTRY_HEIGHT : 150)}px;

	&:hover {
		border-color: ${({ $color }) => $color};
		background: color-mix(in srgb, ${({ $color }) => $color} 8%, var(--bg-3));
	}
`;

/** Full-bleed invisible link behind the content — only used in compact mode, where there are no other interactive children to conflict with. */
const CardLink = styled(Link)`
	position: absolute;
	inset: 0;
	z-index: 0;
`;

const OrderColumn = styled.div<{ $color: string }>`
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	width: 52px;
	background: var(--bg-2);
	border-right: 1px solid var(--border);
	transition: border-color 150ms;

	&:focus-within {
		border-right-color: ${({ $color }) => $color};
	}
`;

const OrderInput = styled.input<{ $color: string }>`
	width: 100%;
	height: 100%;
	padding: 0;
	text-align: center;
	font-size: 16px;
	font-weight: 700;
	font-family: inherit;
	color: var(--text-dim);
	background: transparent;
	border: none;
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

const Content = styled.div<{ $compact: boolean }>`
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	flex: 1;
	min-width: 0;
	gap: ${({ $compact }) => ($compact ? "10px" : "16px")};
	padding: ${({ $compact }) => ($compact ? "10px 12px" : "16px 18px")};
	${({ $compact }) => $compact && "pointer-events: none;"}
`;

const CoverWrap = styled.div<{ $compact: boolean }>`
	flex-shrink: 0;
	height: ${({ $compact }) => ($compact ? "56px" : "108px")};
`;

const Info = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 5px;
	flex: 1;
	min-width: 0;
	text-align: left;
`;

const Title = styled(Link)<{ $compact: boolean }>`
	font-weight: 600;
	color: var(--text);
	text-align: left;
	text-decoration: none;
	font-size: ${({ $compact }) => ($compact ? "13px" : "17px")};

	&:hover {
		color: var(--color-brand);
	}
`;

const Note = styled.span<{ $compact: boolean }>`
	font-size: ${({ $compact }) => ($compact ? "12px" : "15px")};
	color: var(--text-dimmer);
	text-align: left;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
`;

const Meta = styled.div<{ $compact: boolean }>`
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: ${({ $compact }) => ($compact ? "11px" : "13px")};
`;

const Rating = styled.span`
	display: flex;
	align-items: center;
	gap: 3px;
	color: #fbbf24;
	font-weight: 600;
`;

const EpisodeText = styled.span<{ $color: string }>`
	color: ${({ $color }) => $color};
	font-weight: 600;
	white-space: nowrap;
`;

const ProgressTrack = styled.div<{ $compact: boolean }>`
	position: relative;
	flex-shrink: 0;
	width: ${({ $compact }) => ($compact ? "80px" : "144px")};
	height: 5px;
	border-radius: 999px;
	background: var(--bg-4);
	overflow: hidden;
`;

const ProgressFill = styled.div<{ $color: string }>`
	height: 100%;
	border-radius: 999px;
	background: ${({ $color }) => $color};
	width: var(--percent, 0%);
`;

const Actions = styled.div`
	position: relative;
	z-index: 2;
	display: flex;
	align-items: center;
	gap: 6px;
	flex-shrink: 0;
	opacity: 0;
	pointer-events: none;
	transition: opacity 150ms;

	${Card}:hover & {
		opacity: 1;
		pointer-events: auto;
	}
`;

interface Props {
	entry: Entry;
	order?: number;
	sections: Section[];
	/** Small, no hover actions, whole card navigates — used on the Overview page. Defaults to the full-width row used in List View elsewhere. */
	compact?: boolean;
	/** Commits a new 0-based position for this entry within its section's custom order. Only relevant (and only rendered) in the non-compact row. */
	onReorder?: (newIndex: number) => void;
}

export const EntryListItem = React.memo(({ entry, order, sections, compact = false, onReorder }: Props) => {
	const { displayTitle, displayCover } = resolveEntry(entry);
	const total = entry.source?.totalEpisodes ?? null;
	const current = entry.progress ?? 0;
	const percent = total ? Math.min(100, (current / total) * 100) : 0;
	const color = STATUS_COLORS[entry.status];
	const { mutate: adjustProgress } = useAdjustEntryProgress();

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
		<Card $color={color} $compact={compact}>
			{compact && <CardLink to={`/anime/${entry.id}`} />}

			{!compact && order != null && (
				<OrderColumn $color={color}>
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
				</OrderColumn>
			)}

			<Content $compact={compact}>
				<CoverWrap $compact={compact}>
					<EntryCoverCompact src={displayCover ?? undefined} to={`/anime/${entry.id}`} favorite={entry.favorite} />
				</CoverWrap>

				<Info>
					<Title to={`/anime/${entry.id}`} $compact={compact}>
						{displayTitle}
					</Title>

					{entry.note ? (
						<Note $compact={compact}>{entry.note}</Note>
					) : (
						<Meta $compact={compact}>
							{entry.source?.communityRating != null && (
								<Rating>
									<Star size={compact ? 11 : 13} fill="#fbbf24" />
									{entry.source.communityRating}
								</Rating>
							)}
							{total != null && (
								<>
									<EpisodeText $color={color}>
										EP {current} / {total}
									</EpisodeText>
									<ProgressTrack $compact={compact}>
										<ProgressFill $color={color} style={{ "--percent": `${percent}%` } as React.CSSProperties} />
									</ProgressTrack>
								</>
							)}
						</Meta>
					)}
				</Info>

				{!compact && (
					<Actions>
						<EpisodeStepper current={current} total={total ?? undefined} onChange={(delta) => adjustProgress({ entry, delta })} />
						<MoveMenu sections={sections} onMove={noop} />
						<OpenButton to={`/anime/${entry.id}`} />
					</Actions>
				)}
			</Content>
		</Card>
	);
});
