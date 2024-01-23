import { BeatLoader } from 'react-spinners';

export default function Loader() {
	return (
		<div className="h-[calc(100vh-64px)] flex items-center justify-center">
			<BeatLoader color="#0891b2" size={20} />
		</div>
	);
}
