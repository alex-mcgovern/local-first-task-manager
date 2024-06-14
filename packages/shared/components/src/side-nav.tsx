import { faHome } from "@fortawesome/pro-solid-svg-icons/faHome";
import { App } from "boondoggle";
import { useLocation } from "wouter";

export function SideNav() {
	const [location] = useLocation();

	const path = location.split("/")[1];

	return (
		<App.SideBar>
			<App.SideNavSection>
				<App.Link data-testid="nav-home" href="/" icon={faHome} isCurrent={path === "/"}>
					Home
				</App.Link>
			</App.SideNavSection>
		</App.SideBar>
	);
}
