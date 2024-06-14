import { App } from "boondoggle";
import { Route, Switch } from "wouter";
import { Tasks } from "@domain/tasks";
import { SideNav } from "@shared/components";

export default function MainApp() {
	return (
		<Route nest path="/">
			<App.Container>
				<SideNav />
				<App.Main.Root>
					<Switch>
						<Route component={Tasks} path="/" />
					</Switch>
				</App.Main.Root>
			</App.Container>
		</Route>
	);
}
