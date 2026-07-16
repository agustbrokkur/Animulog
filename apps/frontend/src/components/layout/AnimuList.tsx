import { useAnimu } from "../../hooks/useAnime";
import { EntryDetail } from "./EntryDetail";

export const AnimuList = () => {
    const { data: animu, isLoading, isError } = useAnimu();

    if (isLoading) return <p>Loading Animu...</p>;
    if (isError) return <p>Something went wrong with Animu</p>;

    return (
        <div>
            {/* <h2>Sections</h2>
            <ul>
                {animu?.sections.map(section => (
                    <li key={section.id}>
                        {section.label}
                        <div>{section.entryIds.join(",\n ")}</div>
                    </li>
                ))}
            </ul> */}
            <h2>Entries</h2>
            <ul>
                {animu?.sections.map(section => (
                    <div>
                        <h1>{section.label}</h1>
                        {
                            section.entryIds.map(id => (
                                <EntryDetail key={section.label + "-" + id} entry={animu?.entries.find(x => x.id == id) ?? null}  />
                            ))
                        }
                    </div>
                ))
                // .map(entry => (
                //     <EntryDetail key={entry.id} entry={entry}  />
                //     // <li key={entry.id}>
                //     //     <div>Title:          {entry.title}</div>
                //     //     <div>Type:           {entry.mediaType}</div>
                //     //     <div>Studios:        {entry.studios.join(", ")}</div>
                //     //     <div>Genres:         {entry.genres.join(", ")}</div>
                //     //     <div>Episodes:       {entry.currentEpisode} / {entry.totalEpisodes}</div>
                //     //     <div>Release Date:   {entry.releasedAt}</div>
                //     //     <div>Favorite:       {entry.favorite}</div>
                //     //     <div>Cover:          <img src={entry.coverUrl ?? ""} alt={entry.title} /></div>
                //     //     <div>Note:           {entry.note}</div>
                //     //     <div>Added Date:     {entry.addedAt}</div>
                //     //     <div>Started Date:   {entry.startedAt}</div>
                //     //     <div>Finished Date:  {entry.finishedAt}</div>
                //     //     <div>Dropped Date:   {entry.droppedAt}</div>
                //     //     <div>Rating:         {entry.rating} / 10</div>
                //     //     <div>------------</div>
                //     // </li>
                // ))
                }
            </ul>
        </div>
    )
}