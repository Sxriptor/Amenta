/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Null types for telemetry - disabled in Amenta
type IPayloadData = any;
type IXHROverride = any;

import { streamToBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { IRequestOptions } from '../../../base/parts/request/common/request.js';
import { IRequestService } from '../../request/common/request.js';
import * as https from 'https';
import { AbstractOneDataSystemAppender, IAppInsightsCore } from '../common/1dsAppender.js';

type OnCompleteFunc = (status: number, headers: { [headerName: string]: string }, response?: string) => void;

interface IResponseData {
	headers: { [headerName: string]: string };
	statusCode: number;
	responseData: string;
}

/**
 * Completes a request to submit telemetry to the server utilizing the request service
 * @param options The options which will be used to make the request
 * @param requestService The request service
 * @returns An object containing the headers, statusCode, and responseData
 */
async function makeTelemetryRequest(options: IRequestOptions, requestService: IRequestService): Promise<IResponseData> {
	const response = await requestService.request(options, CancellationToken.None);
	const responseData = (await streamToBuffer(response.stream)).toString();
	const statusCode = response.res.statusCode ?? 200;
	const headers = response.res.headers as Record<string, any>;
	return {
		headers,
		statusCode,
		responseData
	};
}

/**
 * Complete a request to submit telemetry to the server utilizing the https module. Only used when the request service is not available
 * @param options The options which will be used to make the request
 * @returns An object containing the headers, statusCode, and responseData
 */
async function makeLegacyTelemetryRequest(options: IRequestOptions): Promise<IResponseData> {
	const httpsOptions = {
		method: options.type,
		headers: options.headers
	};
	const responsePromise = new Promise<IResponseData>((resolve, reject) => {
		const req = https.request(options.url ?? '', httpsOptions, res => {
			res.on('data', function (responseData) {
				resolve({
					headers: res.headers as Record<string, any>,
					statusCode: res.statusCode ?? 200,
					responseData: responseData.toString()
				});
			});
			// On response with error send status of 0 and a blank response to oncomplete so we can retry events
			res.on('error', function (err) {
				reject(err);
			});
		});
		req.write(options.data, (err) => {
			if (err) {
				reject(err);
			}
		});
		req.end();
	});
	return responsePromise;
}

async function sendPostAsync(requestService: IRequestService | undefined, payload: IPayloadData, oncomplete: OnCompleteFunc) {
	// Telemetry is disabled in Amenta - do nothing
	oncomplete(200, {}, '');
}

export class OneDataSystemAppender extends AbstractOneDataSystemAppender {

	constructor(
		requestService: IRequestService | undefined,
		isInternalTelemetry: boolean,
		eventPrefix: string,
		defaultData: { [key: string]: any } | null,
		iKeyOrClientFactory: string | (() => IAppInsightsCore), // allow factory function for testing
	) {
		// Telemetry is disabled in Amenta
		const customHttpXHROverride: IXHROverride = {
			sendPOST: (payload: IPayloadData, oncomplete: OnCompleteFunc) => {
				// Do nothing - telemetry is disabled
				oncomplete(200, {}, '');
			}
		};

		super(isInternalTelemetry, eventPrefix, defaultData, iKeyOrClientFactory, customHttpXHROverride);
	}
}
