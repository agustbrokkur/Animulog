// EntryDetailPanel.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { FolderOpen, Maximize2, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { useEntryPanel } from "../../context/EntryPanelContext";
import {
	useAdjustEntryProgress,
	useAnimu,
	useDeleteEntry,
	useMoveEntryToSection,
	useUpdateEntry,
	useUpdateEntryFranchise,
	useUpdateEntryMediaType,
	useUpdateEntryStatus,
} from "../../hooks/useAnime";
import { resolveEntry, type Entry } from "../../types/entry";
import type { Status } from "../../types/status";
import { STATUS_LABELS } from "../../types/status";
import { MEDIA_ICONS, MEDIA_TYPE_LABELS } from "../../types/mediaType";
import { sortedSections } from "../../types/section";
import { EpisodeStepper } from "../layout/entry/EpisodeStepper";
import { MediaTypeMenu } from "../layout/entry/MediaTypeMenu";
import { StatusMenu } from "../layout/entry/StatusMenu";
import { MoveMenu } from "../layout/entry/MoveMenu";
import {
	ActionButton,
	ActionsRow,
	AddedDate,
	AltTitle,
	Backdrop,
	CancelButton,
	Content,
	Cover,
	CoverWrap,
	DateHint,
	EditActions,
	EditLabel,
	EditPanel,
	EditRow,
	EditToggleButton,
	EpisodeRow,
	EpisodeSep,
	FieldLabel,
	FranchiseLine,
	Input,
	JpTitle,
	MetaCol,
	NoteDisplay,
	NoteEdit,
	NoteEmpty,
	NotesBlock,
	NoteTextarea,
	PanelWrap,
	ProgressBar,
	ProgressFill,
	ProgressLabel,
	ProgressWrap,
	ReleaseDate,
	ResizeHandle,
	SaveButton,
	SectionBadge,
	StatBox,
	StatGrid,
	StatLabel,
	StatValue,
	SynopsisBlock,
	SynopsisText,
	Tag,
	TagChip,
	TagChips,
	TagInputRow,
	TagRow,
	Title,
	Toolbar,
	ToolbarButton,
	Top,
} from "./EntryDetailPanel.styles";

const STATUS_COLORS: Record<Status, string> = {
	unsorted: "#9ca3af",
	backlog: "#fbbf24",
	watching: "#378ADD",
	on_hold: "#c084fc",
	watched: "#5DCAA5",
	dropped: "#f87171",
};

const MIN_WIDTH = 320;
const MAX_WIDTH = 900;
const DEFAULT_WIDTH = 420;
const STORAGE_KEY = "entryPanel:width";

function useResizableWidth() {
	const [width, setWidth] = useState(() => {
		const stored = Number(localStorage.getItem(STORAGE_KEY));
		return Number.isFinite(stored) && stored >= MIN_WIDTH && stored <= MAX_WIDTH ? stored : DEFAULT_WIDTH;
	});
	const draggingRef = useRef(false);
	const startXRef = useRef(0);
	const startWidthRef = useRef(width);
	const widthRef = useRef(width);
	widthRef.current = width;

	const startDragging = (e: React.MouseEvent) => {
		e.preventDefault();
		draggingRef.current = true;
		startXRef.current = e.clientX;
		startWidthRef.current = widthRef.current;
		document.body.style.cursor = "ew-resize";
		document.body.style.userSelect = "none";
	};

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!draggingRef.current) return;
			// Dragging the left edge left (negative clientX delta from the start) grows the panel.
			const delta = startXRef.current - e.clientX;
			setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidthRef.current + delta)));
		};
		const handleMouseUp = () => {
			if (!draggingRef.current) return;
			draggingRef.current = false;
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
			localStorage.setItem(STORAGE_KEY, String(widthRef.current));
		};
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, []);

	return { width, startDragging };
}

const formatAddedDate = (ms: number) => new Date(ms).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
const formatDMY = (ms: number) => new Date(ms).toLocaleDateString();
const formatLongDate = (ms: number) => new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const toDateInputValue = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export const EntryDetailPanel = () => {
	const { openEntryId, closePanel } = useEntryPanel();
	const { data: animu } = useAnimu();
	const navigate = useNavigate();
	const location = useLocation();
	const { width, startDragging } = useResizableWidth();

	const entry: Entry | undefined = openEntryId ? animu?.entries[openEntryId] : undefined;

	const [editing, setEditing] = useState(false);
	const [titleInput, setTitleInput] = useState("");
	const [progressInput, setProgressInput] = useState("");
	const [ratingInput, setRatingInput] = useState("");
	const [dateAddedInput, setDateAddedInput] = useState("");
	const [coverInput, setCoverInput] = useState("");
	const [franchiseInput, setFranchiseInput] = useState("");
	const [tagsState, setTagsState] = useState<string[]>([]);
	const [tagDraft, setTagDraft] = useState("");

	const [notesEditing, setNotesEditing] = useState(false);
	const [notesValue, setNotesValue] = useState("");

	const [confirmingDelete, setConfirmingDelete] = useState(false);

	useEffect(() => {
		setEditing(false);
		setNotesEditing(false);
		setConfirmingDelete(false);
	}, [openEntryId]);

	useEffect(() => {
		if (!openEntryId) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") closePanel();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [openEntryId, closePanel]);

	const currentFranchiseTitle = useMemo(() => {
		if (!animu || !entry) return null;
		return Object.values(animu.franchises).find((f) => f.entryIds.includes(entry.id))?.title ?? null;
	}, [animu, entry]);

	const { mutate: updateEntryMutate } = useUpdateEntry();
	const { mutate: updateFranchiseMutate } = useUpdateEntryFranchise();
	const { mutate: deleteEntryMutate } = useDeleteEntry();
	const { mutate: moveEntry } = useMoveEntryToSection();
	const { mutate: adjustProgress } = useAdjustEntryProgress();
	const { mutate: updateMediaType } = useUpdateEntryMediaType();
	const { mutate: updateStatus } = useUpdateEntryStatus();

	if (!openEntryId || !entry) return null;

	const { displayTitle, displayCover } = resolveEntry(entry);
	const statusColor = STATUS_COLORS[entry.status];
	const Icon = MEDIA_ICONS[entry.mediaType];
	const sections = animu ? sortedSections(animu.sections) : [];
	const year = entry.source?.airedFrom != null ? new Date(entry.source.airedFrom).getFullYear() : null;
	const total = entry.source?.totalEpisodes ?? null;
	const current = entry.progress ?? 0;
	const percent = total ? Math.min(100, (current / total) * 100) : 0;
	const altTitle = entry.source?.englishTitle && entry.source.englishTitle !== displayTitle ? entry.source.englishTitle : null;

	const openEdit = () => {
		setTitleInput(entry.title);
		setProgressInput(entry.progress != null ? String(entry.progress) : "");
		setRatingInput(entry.score != null ? String(entry.score) : "");
		setDateAddedInput(toDateInputValue(entry.timestamps.added));
		setCoverInput(entry.coverOverride ?? "");
		setFranchiseInput(currentFranchiseTitle ?? "");
		setTagsState(entry.tags ?? []);
		setTagDraft("");
		setEditing(true);
	};

	const handleAddTag = () => {
		const t = tagDraft.trim();
		if (!t || tagsState.includes(t)) {
			setTagDraft("");
			return;
		}
		setTagsState([...tagsState, t]);
		setTagDraft("");
	};

	const handleSave = () => {
		const progress = progressInput.trim() === "" ? null : Number(progressInput);
		const score = ratingInput.trim() === "" ? null : Number(ratingInput);
		const addedMs = dateAddedInput ? new Date(dateAddedInput).getTime() : entry.timestamps.added;

		updateEntryMutate({
			entry,
			patch: {
				title: titleInput.trim() ? titleInput.trim() : entry.title,
				coverOverride: coverInput.trim() ? coverInput.trim() : null,
				progress: progress != null && Number.isFinite(progress) ? Math.max(0, progress) : null,
				score: score != null && Number.isFinite(score) ? score : null,
				tags: tagsState,
				timestamps: { ...entry.timestamps, added: addedMs, updated: Date.now() },
			},
		});

		const trimmedFranchise = franchiseInput.trim();
		if (trimmedFranchise !== (currentFranchiseTitle ?? "")) {
			updateFranchiseMutate({ entryId: entry.id, title: trimmedFranchise ? trimmedFranchise : null });
		}

		setEditing(false);
	};

	const startNotesEdit = () => {
		setNotesValue(entry.note ?? "");
		setNotesEditing(true);
	};

	const saveNotes = () => {
		const trimmed = notesValue.trim();
		updateEntryMutate({ entry, patch: { note: trimmed ? trimmed : null } });
		setNotesEditing(false);
	};

	const handleExpand = () => {
		const id = entry.id;
		closePanel();
		navigate(`/anime/${id}`);
	};

	const handleDeleteClick = () => {
		if (!confirmingDelete) {
			setConfirmingDelete(true);
			return;
		}
		const id = entry.id;
		deleteEntryMutate(id, {
			onSuccess: () => {
				closePanel();
				if (location.pathname === `/anime/${id}`) navigate("/anime");
			},
		});
	};

	return (
		<>
			<Backdrop onClick={() => closePanel()} />
			<PanelWrap $width={width}>
				<ResizeHandle onMouseDown={startDragging} title="Drag to resize" />

				<Toolbar>
					<ToolbarButton $variant="expand" onClick={handleExpand}>
						<Maximize2 size={13} /> Expand
					</ToolbarButton>
					<ToolbarButton $variant="close" onClick={() => closePanel()}>
						<X size={14} />
					</ToolbarButton>
				</Toolbar>

				<Content>
					<Top>
						<CoverWrap>
							<Cover>{displayCover && <img src={displayCover} alt={displayTitle} />}</Cover>
						</CoverWrap>

						<MetaCol>
							<SectionBadge $color={statusColor}>{STATUS_LABELS[entry.status]}</SectionBadge>

							<Title>{displayTitle}</Title>

							{currentFranchiseTitle && (
								<FranchiseLine>
									<FolderOpen size={13} /> {currentFranchiseTitle}
								</FranchiseLine>
							)}

							<AddedDate>Added {formatAddedDate(entry.timestamps.added)}</AddedDate>

							{entry.source?.airedFrom != null && (
								<ReleaseDate>
									Released: {formatLongDate(entry.source.airedFrom)}
									{entry.source.airedTo != null ? ` to ${formatLongDate(entry.source.airedTo)}` : ""}
								</ReleaseDate>
							)}

							{altTitle && <AltTitle>{altTitle}</AltTitle>}
							{entry.source?.japaneseTitle && <JpTitle>{entry.source.japaneseTitle}</JpTitle>}

							{total != null && (
								<ProgressWrap>
									<ProgressBar>
										<ProgressFill $percent={percent} $color={statusColor} />
									</ProgressBar>
									<ProgressLabel>
										{current} / {total}
									</ProgressLabel>
								</ProgressWrap>
							)}

							{entry.tags && entry.tags.length > 0 && (
								<TagRow>
									{entry.tags.map((t) => (
										<Tag key={t} $color="var(--color-accent)" $bg="var(--color-accent-dim)">
											{t}
										</Tag>
									))}
								</TagRow>
							)}

							{entry.source?.genres && entry.source.genres.length > 0 && (
								<TagRow>
									{entry.source.genres.map((g) => (
										<Tag key={g} $color="var(--color-purple)" $bg="var(--color-purple-dim)">
											{g}
										</Tag>
									))}
								</TagRow>
							)}

							<StatGrid>
								<StatBox>
									<StatLabel>Your Score</StatLabel>
									<StatValue $color="var(--color-accent)" $muted={entry.score == null}>
										{entry.score != null ? (
											<>
												<Star size={12} fill="var(--color-accent)" /> {entry.score}
											</>
										) : (
											"—"
										)}
									</StatValue>
								</StatBox>
								<StatBox>
									<StatLabel>Community Score</StatLabel>
									<StatValue $color="var(--color-gold)" $muted={entry.source?.communityRating == null}>
										{entry.source?.communityRating != null ? (
											<>
												<Star size={12} fill="var(--color-gold)" /> {entry.source.communityRating}
											</>
										) : (
											"—"
										)}
									</StatValue>
								</StatBox>
								<StatBox>
									<StatLabel>Episodes</StatLabel>
									<StatValue>
										{current} / {total ?? "?"}
									</StatValue>
								</StatBox>
								<StatBox>
									<StatLabel>Status</StatLabel>
									<StatValue>{STATUS_LABELS[entry.status]}</StatValue>
								</StatBox>
								<StatBox>
									<StatLabel>Year</StatLabel>
									<StatValue $muted={year == null}>{year ?? "—"}</StatValue>
								</StatBox>
								<StatBox>
									<StatLabel>Type</StatLabel>
									<StatValue>
										<Icon size={12} /> {MEDIA_TYPE_LABELS[entry.mediaType]}
									</StatValue>
								</StatBox>
								<StatBox $span2>
									<StatLabel>Studio</StatLabel>
									<StatValue $muted={!entry.source?.studios[0]}>{entry.source?.studios[0] ?? "—"}</StatValue>
								</StatBox>
							</StatGrid>
						</MetaCol>
					</Top>

					{entry.source?.synopsis && (
						<SynopsisBlock>
							<FieldLabel>Synopsis</FieldLabel>
							<SynopsisText>{entry.source.synopsis}</SynopsisText>
						</SynopsisBlock>
					)}

					<NotesBlock>
						<FieldLabel>Your Notes</FieldLabel>
						{notesEditing ? (
							<NoteEdit>
								<NoteTextarea autoFocus rows={3} value={notesValue} onChange={(e) => setNotesValue(e.target.value)} placeholder="Add your notes..." />
								<EditActions>
									<SaveButton onClick={saveNotes}>Save</SaveButton>
									<CancelButton onClick={() => setNotesEditing(false)}>Cancel</CancelButton>
								</EditActions>
							</NoteEdit>
						) : (
							<NoteDisplay onClick={startNotesEdit}>{entry.note ? <p>{entry.note}</p> : <NoteEmpty>Click to add notes...</NoteEmpty>}</NoteDisplay>
						)}
					</NotesBlock>

					{!editing ? (
						<EditToggleButton onClick={openEdit}>
							<Pencil size={13} /> Edit entry details
						</EditToggleButton>
					) : (
						<EditPanel>
							<FieldLabel>Edit Entry</FieldLabel>

							<EditRow>
								<EditLabel>Title</EditLabel>
								<Input type="text" value={titleInput} onChange={(e) => setTitleInput(e.target.value)} placeholder={displayTitle} />
							</EditRow>

							<EditRow>
								<EditLabel>Episode Progress</EditLabel>
								<EpisodeRow>
									<Input type="number" min={0} value={progressInput} onChange={(e) => setProgressInput(e.target.value)} placeholder="Current" />
									<EpisodeSep>/</EpisodeSep>
									<Input type="text" value={total ?? "—"} disabled />
								</EpisodeRow>
							</EditRow>

							<EditRow>
								<EditLabel>Your Rating (1-10)</EditLabel>
								<Input
									type="number"
									min={1}
									max={10}
									step={0.5}
									style={{ width: 100 }}
									value={ratingInput}
									onChange={(e) => setRatingInput(e.target.value)}
									placeholder="e.g. 8.5"
								/>
							</EditRow>

							<EditRow>
								<EditLabel>Date Added</EditLabel>
								<Input type="date" value={dateAddedInput} onChange={(e) => setDateAddedInput(e.target.value)} />
								<DateHint>Currently: {formatDMY(entry.timestamps.added)}</DateHint>
							</EditRow>

							<EditRow>
								<EditLabel>Custom Cover Image URL</EditLabel>
								<Input type="text" value={coverInput} onChange={(e) => setCoverInput(e.target.value)} placeholder="https://..." />
							</EditRow>

							<EditRow>
								<EditLabel>Franchise / Series Group</EditLabel>
								<Input
									type="text"
									value={franchiseInput}
									onChange={(e) => setFranchiseInput(e.target.value)}
									placeholder="e.g. Fate, Monogatari, Initial D..."
								/>
							</EditRow>

							<EditRow>
								<EditLabel>Tags</EditLabel>
								<TagInputRow>
									<Input
										type="text"
										value={tagDraft}
										onChange={(e) => setTagDraft(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleAddTag();
											}
										}}
										placeholder="Type a tag and press Enter..."
									/>
									<CancelButton onClick={handleAddTag}>
										<Plus size={13} /> Add
									</CancelButton>
								</TagInputRow>
								{tagsState.length > 0 && (
									<TagChips>
										{tagsState.map((t) => (
											<TagChip key={t}>
												{t}
												<button onClick={() => setTagsState(tagsState.filter((existing) => existing !== t))}>
													<X size={11} />
												</button>
											</TagChip>
										))}
									</TagChips>
								)}
							</EditRow>

							<EditActions>
								<SaveButton onClick={handleSave}>Save changes</SaveButton>
								<CancelButton onClick={() => setEditing(false)}>Cancel</CancelButton>
							</EditActions>
						</EditPanel>
					)}

					<ActionsRow>
						<EpisodeStepper current={current} total={total ?? undefined} onChange={(delta) => adjustProgress({ entry, delta })} />
						<MediaTypeMenu mediaType={entry.mediaType} onChange={(mediaType) => updateMediaType({ entry, mediaType })} />
						<StatusMenu status={entry.status} onChange={(status) => updateStatus({ entry, status })} />
						<MoveMenu sections={sections} entryId={entry.id} onMove={(sectionId) => moveEntry({ entryId: entry.id, targetSectionId: sectionId, sections })} />
						<ActionButton $danger $active={confirmingDelete} onClick={handleDeleteClick}>
							<Trash2 size={13} /> {confirmingDelete ? "Confirm?" : "Delete"}
						</ActionButton>
					</ActionsRow>
				</Content>
			</PanelWrap>
		</>
	);
};
