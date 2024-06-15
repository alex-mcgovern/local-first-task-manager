import { Loader } from "boondoggle";
import "../css/index.css";

export function FullScreenLoader() {
	return (
		<div className="full-screen-loader">
			<Loader size="2xl" />
		</div>
	);
}
