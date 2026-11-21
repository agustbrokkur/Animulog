import { useState } from "react";
import styled from "styled-components";
import { Star } from "lucide-react";
import { FormDialog } from "../ui/FormDialog";
import { EditRow, EditLabel, Input } from "./EntryDetailBody.styles";
import { MediaTypeMenu } from "../layout/entry/MediaTypeMenu";
import { StatusMenu } from "../layout/entry/StatusMenu";
import { useCreateEntry } from "../../hooks/useAnime";
import { useSettings } from "../../hooks/useSettings";
import type { MediaType } from "../../types/mediaType";
import type { Status } from "../../types/status";

const FavoriteToggle = styled.button<{ $active: boolean }>`
	display: flex;
	align-items: center;
	gap: 6px;
	width: fit-content;
	padding: 8px 14px;
	border-radius: var(--radius);
	font-size: 13px;
	font-weight: 600;
	font-family: inherit;
	border: 1px solid ${({ $active }) => ($active ? "var(--color-accent)" : "var(--border)")};
	background: ${({ $active }) => ($active ? "color-mix(in srgb, var(--color-accent) 15%, transparent)" : "var(--bg-2)")};
	color: ${({ $active }) => ($active ? "var(--color-accent)" : "var(--text-dim)")};
	cursor: pointer;
	transition:
		border-color 150ms,
		background 150ms,
		color 150ms;

	&:hover {
		border-color: var(--color-accent);
		color: var(--color-accent);
	}
`;

interface CreateEntryDialogProps {
	onCancel: () => void;
	/** Called with the new entry's id right after a successful create — e.g. so the section page can add it to the section being viewed. */
	onCreated: (entryId: string) => void;
}

/** Minimal new-entry form: title + media type are all the backend requires, status/favorite are common enough to set up front. Everything else (score, notes, cover, tags) is edited afterward from the entry detail panel. */
export const CreateEntryDialog = ({ onCancel, onCreated }: CreateEntryDialogProps) => {
	const { data: settings } = useSettings();

	const [title, setTitle] = useState("");
	const [mediaType, setMediaType] = useState<MediaType>("tv");
	const [status, setStatus] = useState<Status>(settings?.defaultEntryStatus ?? "unsorted");
	const [favorite, setFavorite] = useState(false);

	const { mutate: createEntry, isPending } = useCreateEntry();

	const handleSubmit = () => {
		const trimmed = title.trim();
		if (!trimmed || isPending) return;

		createEntry(
			{
				title: trimmed,
				mediaType,
				status,
				favorite,
				note: null,
				score: null,
				progress: null,
				coverOverride: null,
				totalEpisodesOverride: null,
				tags: [],
			},
			{ onSuccess: onCreated },
		);
	};

	return (
		<FormDialog title="Add Entry" confirmLabel="Create" onSubmit={handleSubmit} onCancel={onCancel} submitDisabled={!title.trim() || isPending}>
			<EditRow>
				<EditLabel>Title</EditLabel>
				<Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Frieren: Beyond Journey's End" autoFocus />
			</EditRow>
			<EditRow>
				<EditLabel>Media Type</EditLabel>
				<MediaTypeMenu mediaType={mediaType} onChange={setMediaType} />
			</EditRow>
			<EditRow>
				<EditLabel>Status</EditLabel>
				<StatusMenu status={status} onChange={setStatus} />
			</EditRow>
			<EditRow>
				<EditLabel>Favorite</EditLabel>
				<FavoriteToggle type="button" $active={favorite} onClick={() => setFavorite((v) => !v)}>
					<Star size={13} fill={favorite ? "currentColor" : "none"} />
					{favorite ? "Favorited" : "Not favorited"}
				</FavoriteToggle>
			</EditRow>
		</FormDialog>
	);
};
