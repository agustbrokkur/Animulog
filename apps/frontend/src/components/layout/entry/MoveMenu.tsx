import { useState } from "react";
import styled from "styled-components";
import { ArrowLeftRight } from "lucide-react";
import type { Section } from "../../../types/section";

const Wrap = styled.div`
	position: relative;
`;

const Btn = styled.button`
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 12px;
	padding: 4px 8px;
	border-radius: 6px;
	border: 1px solid #2a2a2e;
	color: #d1d5db;
	background: none;
	cursor: pointer;
	&:hover {
		border-color: #6b6b6f;
	}
`;

const Dropdown = styled.div`
	position: absolute;
	z-index: 10;
	margin-top: 4px;
	width: 160px;
	background: #1c1c1f;
	border: 1px solid #2a2a2e;
	border-radius: 6px;
	box-shadow: 0 4px 12px rgb(0 0 0 / 0.3);
	padding: 4px 0;
`;

const Option = styled.button`
	width: 100%;
	text-align: left;
	font-size: 12px;
	padding: 6px 12px;
	color: #d1d5db;
	background: none;
	border: none;
	cursor: pointer;
	&:hover {
		background: #242428;
	}
`;

export const MoveMenu = ({ sections, onMove }: { sections: Section[]; onMove?: (id: string) => void }) => {
	const [open, setOpen] = useState(false);
	return (
		<Wrap>
			<Btn onClick={() => setOpen((v) => !v)}>
				<ArrowLeftRight size={12} /> Move
			</Btn>
			{open && (
				<Dropdown>
					{sections.map((s) => (
						<Option
							key={s.id}
							onClick={() => {
								onMove?.(s.id);
								setOpen(false);
							}}
						>
							{s.label}
						</Option>
					))}
				</Dropdown>
			)}
		</Wrap>
	);
};
