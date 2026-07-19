import { Link } from 'react-router-dom'
import type { Entry } from '../../types/entry'
import { MEDIA_ICONS } from '../../types/mediaType'

interface EntryDetailProps {
  entry: Entry | null
}

export const EntryDetail = ({ entry }: EntryDetailProps) => {
    if (entry == null) {
        return <div>None</div>
    }

    const Icon = MEDIA_ICONS[entry.mediaType]

    return (
        <div className='grid grid-cols-[190px_1fr_1.1fr] gap-4 rounded-(length:10px) border border-(color:#2a2a2e) border-l-[3px] border-l-(--c,var(#2a2a2e)) bg-(color:#141416) overflow-hidden transition-[border-color] duration-150 min-h-75'>
            <div className='w-47.5 min-w-47.5 relative cursor-pointer overflow-hidden bg-[#242428] shrink-0'>
                <img className='w-full h-full object-cover block trans transition-transform duration-200 ease-out hover:scale-[1.03]' src={entry.coverUrl ?? entry.source.coverUrl ?? undefined} />
            </div>
            <div className='grid grid-cols-4 justify-between gap-4'>
                <div><Link to={`/anime/${entry.id}`}>{entry.title}</Link></div>
                <span className='flex items-start justify-center gap-2'>Format: {entry.mediaType.toUpperCase()} <Icon size={16} className="text-gray-400" /></span>
                {/* <span>Favorite: {entry.favorite ?? 'False'}</span> */}
                <span>Studios: {entry.source.studios.join(", ")}</span>
                <span>Genres: {entry.source.genres.join(", ")}</span>
                <span>Added: {entry.addedAt ? new Date(entry.addedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</span>
                <span>Release Date: {entry.source.airedFrom ? new Date(entry.addedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</span>
                <span>Progress: {entry.currentEpisode ?? 'N/A'} / {entry.source.totalEpisodes ?? 'N/A'}</span>
                <span>Note: {entry.note}</span>
                <span>Rating {entry.rating ?? 'N/A'}</span>
                <span>Started: {entry.startedAt ? new Date(entry.startedAt ?? 0).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</span>
                <span>Finished: {entry.finishedAt ? new Date(entry.finishedAt ?? 0).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</span>
                <span>Dropped: {entry.droppedAt ? new Date(entry.droppedAt ?? 0).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</span>
            </div>
        </div>
    )
}