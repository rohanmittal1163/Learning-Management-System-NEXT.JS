import Image from 'next/image';
import logo from '../../../public/logo.svg';
import Link from 'next/link';
export default function Logo() {
	return (
		<Link href="/" className="px-5 py-4">
			<Image alt="logo" src={logo} width={130} height={130} loading="lazy" />
		</Link>
	);
}
