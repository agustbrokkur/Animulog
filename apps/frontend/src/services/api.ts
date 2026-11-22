const BASE_API_URL = import.meta.env.VITE_API_URL;

// A failed API call, what we were trying to do, plus the server's explanation when it gave one.
export class ApiError extends Error {
	readonly serverMessage: string | null;
	// HTTP status, or null when the server couldn't be reached at all.
	readonly status: number | null;

	constructor(failureMessage: string, serverMessage: string | null, status: number | null) {
		super(failureMessage);
		this.name = "ApiError";
		this.serverMessage = serverMessage;
		this.status = status;
	}
}

interface RequestOptions {
	method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	// Sent as JSON. Leave out for requests without a body.
	body?: unknown;
	responseType?: "json" | "text";
}

// Pulls `message` out of an error response. Returns null if the body isn't JSON or has no message.
const readServerMessage = async (response: Response): Promise<string | null> => {
	try {
		const errorBody: unknown = await response.json();
		if (typeof errorBody === "object" && errorBody !== null && "message" in errorBody && typeof errorBody.message === "string") {
			return errorBody.message;
		}
	} catch {
		// Not JSON, e.g. an HTML error page. Fall through.
	}
	return null;
};

export const request = async <ResponseBody = void>(path: string, failureMessage: string, options: RequestOptions = {}): Promise<ResponseBody> => {
	const { method = "GET", body, responseType = "json" } = options;
	const hasBody = body !== undefined;

	let response: Response;
	try {
		response = await fetch(`${BASE_API_URL}${path}`, {
			method,
			headers: hasBody ? { "Content-Type": "application/json" } : undefined,
			body: hasBody ? JSON.stringify(body) : undefined,
		});
	} catch {
		// fetch only throws when no response arrived at all, server down, wrong port, CORS.
		throw new ApiError(failureMessage, "Can't reach the server. Is it running?", null);
	}

	if (!response.ok) {
		throw new ApiError(failureMessage, await readServerMessage(response), response.status);
	}

	if (response.status === 204) return undefined as ResponseBody;
	if (responseType === "text") return (await response.text()) as ResponseBody;
	return (await response.json()) as ResponseBody;
};
