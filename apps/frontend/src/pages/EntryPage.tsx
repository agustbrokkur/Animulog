import { useParams } from "react-router-dom";
import { EntryDetail } from "../components/layout/EntryDetail"
import { useAnimu } from "../hooks/useAnime";

export const EntryView = () => {
    const { animeId } = useParams();
    const { data: animu, isLoading, isError } = useAnimu();

    if (isLoading) return <p>Loading Animu...</p>;
    if (isError) return <p>Something went wrong with Animu</p>;

    const animeData = animu?.entries.find(x => x.id === animeId || x.title === animeId) ?? null;
    
    return (
        <div>
            <div>Entry View</div>
            <EntryDetail entry={animeData}  />
        </div>
    )
}