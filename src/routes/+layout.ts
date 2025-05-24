import posthog from 'posthog-js';
import { browser, dev } from '$app/environment';
import { PUBLIC_ORIGIN, PUBLIC_POSTHOG_KEY } from '$env/static/public';

// export const load = async () => {
// 	if (browser) { // todo: add && !dev
// 		posthog.init(PUBLIC_POSTHOG_KEY, {
// 			// api_host: `${PUBLIC_ORIGIN}/ingest`,
// 			api_host: "https://us.i.posthog.com",
// 			ui_host: 'https://us.posthog.com',
// 			person_profiles: "always",
// 			capture_pageview: false,
// 			capture_pageleave: false
// 		});
// 	}
// };

export const load = async () => {
	if (browser) {
		posthog.init(
			PUBLIC_POSTHOG_KEY,
			{
				api_host: 'https://us.i.posthog.com',
				person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
			}
		)
	}
};