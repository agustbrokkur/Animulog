import styled from "styled-components";

export const Card = styled.div`
	display: flex;
	gap: 16px;
	padding: 12px;
	border: 1px solid #2a2a2e;
	border-radius: 8px;
	transition: border-color 150ms;
	&:hover {
		border-color: #6b6b6f;
	}
	&:hover .cover img {
		transform: scale(1.05);
	}
`;

export const Info = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	flex: 1;
	min-width: 0;
	text-align: left;
`;

export const Row = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 6px;
`;

export const Actions = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	margin-top: auto;
	padding-top: 8px;
	border-top: 1px solid #2a2a2e;
	opacity: 0;
	pointer-events: none;
	transition: opacity 150ms;
	${Card}:hover & {
		opacity: 1;
		pointer-events: auto;
	}
`;
