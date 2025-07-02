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

	protected _aiCoreOrKey: IAppInsightsCore | string | undefined;
	private _asyncAiCore: Promise<IAppInsightsCore> | null;
	protected readonly endPointUrl = '';
	protected readonly endPointHealthUrl = '';

	constructor(
		private readonly _isInternalTelemetry: boolean,
		private _eventPrefix: string,
		private _defaultData: { [key: string]: any } | null,
		iKeyOrClientFactory: string | (() => IAppInsightsCore),
		private _xhrOverride?: any
	) {
		// Telemetry is disabled in Amenta
		this._aiCoreOrKey = undefined;
		this._asyncAiCore = null;
	}

	log(eventName: string, data?: any): void {
		// Telemetry is disabled - do nothing
	}

	flush(): Promise<void> {
		// Telemetry is disabled - return immediately
		return Promise.resolve();
	}
}
