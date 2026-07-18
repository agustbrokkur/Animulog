import { Link } from "react-router-dom";
import { useAnimu } from "../../hooks/useAnime";
import { EntryDetail } from "./EntryDetail";

export const AnimuList = () => {
    const { data: animu, isLoading, isError } = useAnimu();

    if (isLoading) return <p>Loading Animu...</p>;
    if (isError) return <p>Something went wrong with Animu</p>;

    return (
        <div>
            <h2>Entries</h2>
            <ul>
                {animu?.sections.map(section => (
                    <div key={section.id}>
                        <Link to={`/sections/${section.id}`}><h1>{section.label}</h1></Link>
                        {
                            section.entryIds.map(id => (
                                <EntryDetail key={section.label + "-" + id} entry={animu?.entries.find(x => x.id == id) ?? null}  />
                            ))
                        }
                    </div>
                ))
                }
            </ul>
        </div>
    )
}