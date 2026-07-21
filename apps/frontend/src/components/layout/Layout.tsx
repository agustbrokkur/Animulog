import styled from "styled-components";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar/Sidebar";
import { Toolbar } from "./Toolbar/Toolbar";

const Container = styled.div`
	display: flex;
	height: 100vh;
	overflow: hidden;
	background: #141416;
`;

const Content = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	min-width: 0;
`;

const Main = styled.main`
	flex: 1;
	min-height: 0;
	overflow-y: auto;
`;

export const Layout = () => {
	return (
		<Container>
			<Sidebar />
			<Content>
				<Toolbar />
				<Main>
					<Outlet />
				</Main>
			</Content>
		</Container>
	);
};
