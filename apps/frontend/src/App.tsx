import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Overview } from "./pages/OverviewPage";
import { SectionView } from "./pages/SectionPage";
import { EntryView } from "./pages/EntryPage";
import { EntriesIndexView } from "./pages/EntryIndexPage";
import { SectionsIndexView } from "./pages/SectionIndexPage";

function App() {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route path="/" element={<Overview />} />

				<Route path="/sections" element={<SectionsIndexView />} />
				<Route path="/sections/:sectionId" element={<SectionView />} />

				<Route path="/anime" element={<EntriesIndexView />} />
				<Route path="/anime/:animeId" element={<EntryView />} />

				<Route path="*" element={<Navigate to="/" replace />} />
			</Route>
		</Routes>
	);
}

export default App;
