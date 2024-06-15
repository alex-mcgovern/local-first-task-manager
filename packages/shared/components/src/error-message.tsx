import type { FallbackRender } from "@sentry/react";
import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons/faExclamationTriangle";
import { App, Button, Grid, Icon, LinkButton } from "boondoggle";
import "../css/index.css";

export function ErrorMessage({ error, resetError }: Parameters<FallbackRender>[0]) {
	const errorMessage = error instanceof Error ? error.message : "An error occurred";

	return (
		<App.Focused>
			<div className="full-height-message error-message">
				<Icon color="red" icon={faExclamationTriangle} size="4x" />

				<div>
					<h1 className="error-message-title mb-2">Error title</h1>
					<p className="error-message-body mb-2">{errorMessage}</p>
				</div>

				<Grid columns={2} gap={2}>
					<LinkButton color="red" href="/">
						Home
					</LinkButton>
					<Button
						appearance="secondary"
						color="red"
						onPress={() => {
							return resetError();
						}}
					>
						Try again
					</Button>
				</Grid>
			</div>
		</App.Focused>
	);
}
