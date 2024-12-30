type RequestOptions = Omit<RequestInit, "method" | "body">;
type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

function mergeOptions<T>(
    { method, data }: { method: Method; data?: T },
    source?: RequestOptions
) {
    const body = data ? JSON.stringify(data) : undefined;
    return source ? { ...source, method, body } : { method, body };
}

function parseResponse<T>(response: Response) {
    if (response.ok) return response.json() as Promise<T>;
    throw new ServerError(response.status as StatusCode, response.statusText);
}

export class Interceptors<T> {
    private interceptors: Set<(value: T) => Promise<T>>;

    constructor() {
        this.interceptors = new Set();
    }

    use(interceptor: (value: T) => Promise<T>) {
        this.interceptors.add(interceptor);
    }

    remove(interceptor: (value: T) => Promise<T>) {
        this.interceptors.delete(interceptor);
    }

    async intercept(value: T) {
        for (const interceptor of this.interceptors) {
            await interceptor(value);
        }

        return value;
    }
}

export type Request = RequestInit & {
    url: string;
};

export class Api {
    interceptors: {
        request: Interceptors<Request>;
        response: Interceptors<Response>;
    };

    constructor() {
        this.interceptors = {
            request: new Interceptors<Request>(),
            response: new Interceptors<Response>(),
        };
    }

    async get<R>(url: string, options?: RequestOptions) {
        const opts = await this.interceptRequest(
            url,
            mergeOptions({ method: "GET" }, options)
        );

        const response = await this.interceptResponse(await fetch(url, opts));
        return parseResponse<R>(response);
    }

    async post<R>(url: string, data?: unknown, options?: RequestOptions) {
        const opts = await this.interceptRequest(
            url,
            mergeOptions({ method: "POST", data }, options)
        );

        const response = await this.interceptResponse(await fetch(url, opts));

        return parseResponse<R>(response);
    }

    async put<R>(url: string, data?: unknown, options?: RequestOptions) {
        const opts = await this.interceptRequest(
            url,
            mergeOptions({ method: "PUT", data }, options)
        );

        const response = await this.interceptResponse(await fetch(url, opts));
        return parseResponse<R>(response);
    }

    async patch<R>(url: string, data?: unknown, options?: RequestOptions) {
        const opts = await this.interceptRequest(
            url,
            mergeOptions({ method: "PATCH", data }, options)
        );

        const response = await this.interceptResponse(await fetch(url, opts));
        return parseResponse<R>(response);
    }

    async delete<R>(url: string, options?: RequestOptions) {
        const opts = await this.interceptRequest(
            url,
            mergeOptions({ method: "DELETE" }, options)
        );

        const response = await this.interceptResponse(await fetch(url, opts));
        return parseResponse<R>(response);
    }

    private async interceptRequest(url: string, request: RequestInit) {
        return await this.interceptors.request.intercept({ ...request, url });
    }

    private async interceptResponse(response: Response) {
        return await this.interceptors.response.intercept(response);
    }
}

export enum StatusCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    VALIDATION = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    SERVER_ERROR = 500,
}

export class ServerError extends Error {
    status: StatusCode;
    meta?: Record<string, unknown>;

    constructor(
        status: StatusCode,
        message: string,
        meta?: Record<string, unknown>
    ) {
        super(message);
        this.status = status;
        this.meta = meta;
    }

    data() {
        return {
            status: this.status,
            message: this.message,
            meta: this.meta,
        };
    }

    static raise(
        status: StatusCode,
        message: string,
        meta?: Record<string, unknown>
    ) {
        return new ServerError(status, message, meta);
    }
}
