import styled from "styled-components";
import { Minus, Plus } from "lucide-react";

const Wrap = styled.div`
	display: flex;
	align-items: center;
	gap: 2px;
	background: #1c1c1f;
	border: 1px solid #2a2a2e;
	border-radius: 6px;
	padding: 0 4px;
`;

const Btn = styled.button`
	padding: 4px;
	color: #9ca3af;
	background: none;
	border: none;
	cursor: pointer;
	&:hover {
		color: white;
	}
`;

const Count = styled.span`
	font-size: 12px;
	color: #d1d5db;
	width: 40px;
	text-align: center;
`;

export const EpisodeStepper = ({ current, total, onChange }: { current: number; total?: number; onChange?: (delta: number) => void }) => (
	<Wrap>
		<Btn onClick={() => onChange?.(-1)}>
			<Minus size={13} />
		</Btn>
		<Count>
			{current} / {total ?? "?"}
		</Count>
		<Btn onClick={() => onChange?.(1)}>
			<Plus size={13} />
		</Btn>
	</Wrap>
);
