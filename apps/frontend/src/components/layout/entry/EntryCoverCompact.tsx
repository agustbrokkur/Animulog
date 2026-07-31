// EntryCoverCompact.tsx
import styled from "styled-components";
import { Link } from "react-router";
import { Star } from "lucide-react";

const Wrap = styled(Link)`
	display: block;
	height: 100%;
	aspect-ratio: 2 / 3;
	border-radius: 6px;
	overflow: hidden;
	background: var(--bg-3);
	position: relative;
	flex-shrink: 0;
`;

const Img = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
	transition: transform 200ms;
`;

interface EntryCoverCompactProps {
	src?: string;
	to: string;
	favorite?: boolean;
}

export const EntryCoverCompact = ({ src, to, favorite }: EntryCoverCompactProps) => (
	<Wrap to={to} className="cover">
		<Img src={src} loading="lazy" decoding="async" />
		{favorite && <Star size={11} fill="#fbbf24" color="#fbbf24" style={{ position: "absolute", top: 2, right: 2 }} />}
	</Wrap>
);
