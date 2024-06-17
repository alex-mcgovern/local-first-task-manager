import type { FallbackRender } from "@sentry/react";

import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons/faExclamationTriangle";
import { App, Button, Grid, Icon, LinkButton } from "boondoggle";

import * as i18n from "@shared/i18n";

import "../css/index.css";

export function ErrorMessage({ error, resetError }: Parameters<FallbackRender>[0]) {
	const { message, name } =
		error instanceof Error
			? error
			: {
					message: i18n.error_message_fallback,
					name: i18n.error_name_fallback,
				};

	return (
		<App.Focused>
			<div className="full-height-message error-message">
				<Icon color="red" icon={faExclamationTriangle} size="4x" />

				<div>
					<h1 className="error-message-title mb-2">{name}</h1>
					<p className="error-message-body mb-2">{message}</p>
				</div>

				<Grid columns={2} gap={2}>
					<LinkButton color="red" href="/">
						{i18n.home}
					</LinkButton>
					<Button
						appearance="secondary"
						color="red"
						onPress={() => {
							return resetError();
						}}
					>
						{i18n.try_again}
					</Button>
				</Grid>
			</div>
		</App.Focused>
	);
}
