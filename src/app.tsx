import { App } from "boondoggle";
import { Route } from "wouter";
import { TaskDetails, Tasks } from "@domain/tasks";
import { SideNav } from "@shared/components";

export default function MainApp() {
	return (
		<Route nest path="/">
			<App.Container>
				<SideNav />
				<App.Main.Root>
					<Route component={Tasks} path="/" nest />
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
