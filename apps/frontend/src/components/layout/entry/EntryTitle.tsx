import styled from "styled-components";
import { Link } from "react-router-dom";

const Main = styled(Link)`
	font-size: 18px;
	font-weight: 600;
	color: white;
	&:hover {
		color: var(--color-brand, #e8473f);
	}
`;

const Sub = styled.p`
	font-size: 12px;
	color: #6b6b6f;
	margin-top: 2px;
`;

export const EntryTitle = ({ to, title, subtitle, englishSubtitle }: { to: string; title: string; subtitle?: string; englishSubtitle?: string }) => (
	<div>
		<Main to={to}>{title}</Main>
		{subtitle && (
			<Sub>
				{subtitle} ({englishSubtitle})
			</Sub>
		)}
	</div>
);
