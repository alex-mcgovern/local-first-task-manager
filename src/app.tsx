import { App } from "boondoggle";
import { Route } from "wouter";
import { SideNav } from "@shared/components";
import { TaskDetails, Tasks } from "@domain/tasks";

export default function MainApp() {
	return (
		<Route nest path="/">
			<App.Container>
				<SideNav />
				<App.Main.Root>
					<Route component={Tasks} nest path="/" />
					<Route path="/tasks/:id">
						{({ id }) => {
							return <TaskDetails id={id} />;
						}}
					</Route>
				</App.Main.Root>
			</App.Container>
		</Route>
	);
}
