import { AnimuList } from "./components/layout/AnimuList";
import { Sidebar } from "./components/layout/Sidebar/Sidebar";
import { Toolbar } from "./components/layout/Toolbar/Toolbar";
import { Layout } from "./components/ui/Layout";
import { MainContent } from "./components/ui/MainContent";

function App() {

  return (
    <Layout>
      <Sidebar />
      <MainContent>
        <Toolbar />
        <div className="flex flex-col h-full min-h-0 flex-1 overflow-y-auto">
          <AnimuList />
        </div>
      </MainContent>
    </Layout>
  )
}

export default App
