import styled from "styled-components";
import { type ReactNode } from "react";

const StyledAside = styled.aside`
	width: 240px;
	min-width: 240px;
	border-right: 1px solid #2a2a2e;
	display: flex;
	flex-direction: column;
	overflow: hidden;
`;

interface AsideProps {
	children: ReactNode;
}

export const Aside = ({ children }: AsideProps) => <StyledAside>{children}</StyledAside>;
