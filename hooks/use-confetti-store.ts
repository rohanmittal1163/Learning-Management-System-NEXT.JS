import { create } from 'zustand';
interface confettiProps {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}
export const useConfettiStore = create<confettiProps>((set) => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}));
