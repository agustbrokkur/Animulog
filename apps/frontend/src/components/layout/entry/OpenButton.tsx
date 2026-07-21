import styled from "styled-components";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const Btn = styled(Link)`
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 12px;
	padding: 4px 8px;
	border-radius: 6px;
	background: var(--color-brand, #e8473f);
	color: white;
	&:hover {
		opacity: 0.9;
	}
`;

export const OpenButton = ({ to }: { to: string }) => (
	<Btn to={to}>
		Open <ExternalLink size={12} />
	</Btn>
);
