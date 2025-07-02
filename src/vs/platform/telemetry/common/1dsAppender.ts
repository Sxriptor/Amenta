/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITelemetryAppender } from './telemetryUtils.js';

// Null implementation - telemetry is disabled in Amenta
export interface IAppInsightsCore {
	pluginVersionString: string;
	track(item: any): void;
	unload(isAsync: boolean, unloadComplete: (unloadState: any) => void): void;
}

export abstract class AbstractOneDataSystemAppender implements ITelemetryAppender {

	protected readonly endPointUrl = '';
	protected readonly endPointHealthUrl = '';

	constructor(
		_isInternalTelemetry: boolean,
		_eventPrefix: string,
		_defaultData: { [key: string]: any } | null,
		_iKeyOrClientFactory: string | (() => IAppInsightsCore),
		_xhrOverride?: any
	) {
		// Telemetry is disabled in Amenta - all parameters ignored
	}

	log(eventName: string, data?: any): void {
		// Telemetry is disabled - do nothing
	}

	flush(): Promise<void> {
		// Telemetry is disabled - return immediately
		return Promise.resolve();
	}
}
