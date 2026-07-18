import { useParams } from "react-router-dom";
import { EntryDetail } from "../components/layout/EntryDetail";
import { useAnimu } from "../hooks/useAnime";

export const SectionView = () => {
    const { sectionId } = useParams();
    const { data: animu, isLoading, isError } = useAnimu();

    if (isLoading) return <p>Loading Animu...</p>;
    if (isError) return <p>Something went wrong with Animu</p>;

    const sectionData = animu?.sections.find(section => section.id === sectionId || section.label === sectionId);

    return (
        <div>
            <div>Section View</div>
            <ul>
                <div>
                    <h1>{sectionData?.label}</h1>
                    {
                        sectionData?.entryIds.map(id => (
                            <EntryDetail key={sectionData.label + "-" + id} entry={animu?.entries.find(x => x.id == id) ?? null}  />
                        ))
                    }
                </div>
            </ul>
        </div>
    )
}