import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
	from { opacity: 0; }
	to { opacity: 1; }
`;

const slideIn = keyframes`
	from { transform: translateX(100%); }
	to { transform: translateX(0); }
`;

export const Backdrop = styled.div`
	position: fixed;
	inset: 0;
	background: rgb(0 0 0 / 0.35);
	z-index: 1000;
	animation: ${fadeIn} 150ms ease;
`;

export const PanelWrap = styled.div<{ $width: number }>`
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	width: ${({ $width }) => $width}px;
	background: var(--bg-2);
	border-left: 1px solid var(--border-bright);
	z-index: 1001;
	display: flex;
	flex-direction: column;
	box-shadow: -8px 0 32px rgb(0 0 0 / 0.5);
	animation: ${slideIn} 220ms cubic-bezier(0.22, 1, 0.36, 1);
	overflow: hidden;
	/* #root sets text-align: center globally (leftover from the Vite template) — every text element here needs it undone. */
	text-align: left;
`;

export const ResizeHandle = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 6px;
	height: 100%;
	cursor: ew-resize;
	z-index: 10;
	background: transparent;
	transition: background 150ms;

	&:hover,
	&:active {
		background: color-mix(in srgb, var(--color-brand) 25%, transparent);
	}
`;

export const Toolbar = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px 14px;
	border-bottom: 1px solid var(--border);
	flex-shrink: 0;
	background: var(--bg-3);
`;

export const ToolbarButton = styled.button<{ $variant?: "expand" | "close" }>`
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 7px 14px;
	border-radius: var(--radius);
	font-size: 14px;
	font-weight: 600;
	font-family: inherit;
	border: 1px solid var(--border);
	background: none;
	color: var(--text-dim);
	cursor: pointer;
	transition:
		background 100ms,
		color 100ms,
		border-color 100ms;

	&:hover {
		background: var(--bg-4);
		color: var(--text);
		${({ $variant }) =>
			$variant === "expand" &&
			`
				color: var(--color-blue);
				border-color: var(--color-blue);
			`}
		${({ $variant }) =>
			$variant === "close" &&
			`
				color: var(--color-brand);
				border-color: var(--color-brand);
			`}
	}
`;

export const Content = styled.div`
	flex: 1;
	overflow-y: auto;
	padding: 20px;
	display: flex;
	flex-direction: column;
	gap: 18px;
`;

export const Top = styled.div`
	display: flex;
	gap: 16px;
	align-items: flex-start;
`;

export const CoverWrap = styled.div`
	width: 120px;
	flex-shrink: 0;
`;

export const Cover = styled.div`
	width: 100%;
	aspect-ratio: 2 / 3;
	border-radius: var(--radius);
	overflow: hidden;
	background: var(--bg-4);
	border: 1px solid var(--border);

	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;

export const MetaCol = styled.div`
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const SectionBadge = styled.div<{ $color: string }>`
	display: inline-flex;
	align-items: center;
	gap: 6px;
	font-size: 12px;
	font-weight: 700;
	letter-spacing: 1px;
	text-transform: uppercase;
	color: ${({ $color }) => $color};
	padding: 4px 8px;
	border-radius: 20px;
	border: 1px solid color-mix(in srgb, ${({ $color }) => $color} 35%, transparent);
	background: color-mix(in srgb, ${({ $color }) => $color} 10%, transparent);
	width: fit-content;
`;

export const Title = styled.h2`
	font-family: var(--font-display);
	font-size: 27px;
	letter-spacing: 1px;
	color: var(--text);
	line-height: 1.2;
	word-break: break-word;
`;

export const FranchiseLine = styled.p`
	display: flex;
	align-items: center;
	gap: 5px;
	font-size: 14px;
	color: var(--color-accent);
	font-weight: 600;
`;

export const AltTitle = styled.p`
	font-size: 14px;
	color: var(--text-dim);
`;

export const JpTitle = styled.p`
	font-size: 12px;
	color: var(--text-dimmer);
`;

export const AddedDate = styled.p`
	font-family: var(--font-mono);
	font-size: 12px;
	color: var(--text-dimmer);
`;

export const ReleaseDate = styled.p`
	font-family: var(--font-mono);
	font-size: 12px;
	color: var(--text-dimmer);
`;

export const ProgressWrap = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
`;

export const ProgressBar = styled.div`
	height: 3px;
	background: var(--bg-4);
	border-radius: 2px;
	overflow: hidden;
`;

export const ProgressFill = styled.div<{ $percent: number; $color: string }>`
	height: 100%;
	width: ${({ $percent }) => $percent}%;
	background: ${({ $color }) => $color};
	border-radius: 2px;
	transition: width 300ms ease;
`;

export const ProgressLabel = styled.span`
	font-family: var(--font-mono);
	font-size: 12px;
	color: var(--text-dimmer);
`;

export const TagRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 5px;
`;

export const Tag = styled.span<{ $color: string; $bg: string }>`
	font-size: 11px;
	font-weight: 700;
	padding: 2px 7px;
	border-radius: 20px;
	border: 1px solid ${({ $color }) => $color};
	color: ${({ $color }) => $color};
	background: ${({ $bg }) => $bg};
`;

export const StatGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 6px;
`;

export const StatBox = styled.div<{ $span2?: boolean }>`
	display: flex;
	flex-direction: column;
	gap: 2px;
	padding: 7px 9px;
	border-radius: var(--radius);
	background: var(--bg-3);
	border: 1px solid var(--border);
	${({ $span2 }) => $span2 && "grid-column: 1 / -1;"}
`;

export const StatLabel = styled.span`
	font-size: 10px;
	font-weight: 700;
	letter-spacing: 1px;
	text-transform: uppercase;
	color: var(--text-dimmer);
`;

export const StatValue = styled.span<{ $color?: string; $muted?: boolean }>`
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 14px;
	font-weight: 600;
	color: ${({ $color, $muted }) => ($muted ? "var(--text-dimmer)" : ($color ?? "var(--text)"))};
`;

export const FieldLabel = styled.div`
	font-size: 13px;
	font-weight: 700;
	letter-spacing: 1.2px;
	text-transform: uppercase;
	color: var(--text-dimmer);
`;

export const SynopsisBlock = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const SynopsisText = styled.p`
	font-size: 14px;
	color: var(--text-dim);
	line-height: 1.65;
`;

export const NotesBlock = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

export const NoteDisplay = styled.div`
	cursor: pointer;
	padding: 10px 12px;
	border-radius: var(--radius);
	border: 1px solid var(--border);
	background: var(--bg-3);
	min-height: 40px;
	transition: border-color 150ms;

	p {
		font-size: 14px;
		color: var(--text-dim);
		line-height: 1.5;
	}

	&:hover {
		border-color: var(--border-bright);
	}
`;

export const NoteEmpty = styled.span`
	font-size: 13px;
	color: var(--text-dimmer);
	font-style: italic;
`;

export const NoteEdit = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const NoteTextarea = styled.textarea`
	width: 100%;
	font-family: inherit;
	font-size: 14px;
	background: var(--bg-3);
	border: 1px solid var(--border);
	color: var(--text);
	border-radius: var(--radius);
	padding: 8px 12px;
	resize: vertical;
	min-height: 64px;
	outline: none;
	transition: border-color 150ms;

	&:focus {
		border-color: var(--color-brand);
	}
`;

export const EditToggleButton = styled.button`
	display: flex;
	align-items: center;
	gap: 6px;
	width: fit-content;
	padding: 8px 14px;
	border-radius: var(--radius);
	font-size: 13px;
	font-weight: 600;
	font-family: inherit;
	border: 1px solid var(--border);
	background: none;
	color: var(--text-dim);
	cursor: pointer;
	transition:
		background 100ms,
		color 100ms;

	&:hover {
		background: var(--bg-4);
		color: var(--text);
	}
`;

export const EditPanel = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding: 16px;
	border-radius: var(--radius-lg);
	border: 1px solid var(--border-bright);
	background: var(--bg-3);
`;

export const EditRow = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

export const EditLabel = styled.label`
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 1px;
	text-transform: uppercase;
	color: var(--text-dimmer);
`;

export const Input = styled.input`
	width: 100%;
	font-family: inherit;
	background: var(--bg-2);
	border: 1px solid var(--border);
	color: var(--text);
	border-radius: var(--radius);
	padding: 8px 12px;
	font-size: 14px;
	outline: none;
	transition: border-color 150ms;

	&:focus {
		border-color: var(--color-brand);
	}

	&:disabled {
		color: var(--text-dimmer);
		cursor: not-allowed;
	}

	&::-webkit-calendar-picker-indicator {
		filter: invert(0.6);
	}
`;

export const EpisodeRow = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

export const EpisodeSep = styled.span`
	color: var(--text-dimmer);
`;

export const DateHint = styled.span`
	display: block;
	margin-top: 4px;
	font-size: 12px;
	font-family: var(--font-mono);
	color: var(--text-dimmer);
`;

export const TagInputRow = styled.div`
	display: flex;
	gap: 6px;

	> input {
		flex: 1;
	}
`;

export const TagChips = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 5px;
	margin-top: 2px;
`;

export const TagChip = styled.span`
	display: inline-flex;
	align-items: center;
	gap: 4px;
	font-size: 12px;
	font-weight: 600;
	padding: 3px 8px;
	border-radius: 20px;
	background: var(--color-accent-dim);
	border: 1px solid var(--color-accent);
	color: var(--color-accent);

	button {
		display: flex;
		font-size: 11px;
		color: inherit;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		line-height: 1;
		opacity: 0.7;
		transition: opacity 100ms;

		&:hover {
			opacity: 1;
		}
	}
`;

export const EditActions = styled.div`
	display: flex;
	gap: 8px;
	padding-top: 4px;
`;

export const SaveButton = styled.button`
	padding: 8px 18px;
	background: var(--color-brand);
	color: white;
	border-radius: var(--radius);
	font-size: 14px;
	font-weight: 600;
	font-family: inherit;
	border: none;
	cursor: pointer;
	transition: opacity 150ms;

	&:hover {
		opacity: 0.85;
	}
`;

export const CancelButton = styled.button`
	padding: 8px 14px;
	color: var(--text-dim);
	border-radius: var(--radius);
	font-size: 14px;
	font-family: inherit;
	border: 1px solid var(--border);
	background: none;
	cursor: pointer;
	transition: background 100ms;

	&:hover {
		background: var(--bg-4);
	}
`;

export const ActionsRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 8px;
	padding-top: 4px;
	border-top: 1px solid var(--border);
`;

export const ActionButton = styled.button<{ $danger?: boolean; $active?: boolean }>`
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 9px 14px;
	border-radius: var(--radius);
	font-size: 13px;
	font-weight: 600;
	border: 1px solid var(--border);
	background: none;
	color: var(--text-dim);
	cursor: pointer;
	font-family: inherit;
	transition:
		background 100ms,
		color 100ms,
		border-color 100ms;

	&:hover {
		background: var(--bg-4);
		color: var(--text);
	}

	${({ $danger }) =>
		$danger &&
		`
			&:hover {
				color: var(--color-brand);
				border-color: var(--color-brand);
				background: var(--color-brand-dim);
			}
		`}

	${({ $active }) =>
		$active &&
		`
			color: var(--color-brand);
			border-color: var(--color-brand);
			background: var(--color-brand-dim);
		`}
`;
