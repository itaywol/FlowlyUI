export interface HttpResponse<T> extends Response {
  parsedBody: T;
}

async function httpBase<T>(request: RequestInfo): Promise<HttpResponse<T>> {
  const response: Response = await fetch(request);
  let httpResponse: HttpResponse<T>;

  try {
    httpResponse = {...response, parsedBody: await response.json() as T};
  } catch (e) {
    httpResponse = {...response, parsedBody: (undefined as any) as T};
  }

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return httpResponse;
}

export class http {
  static async get<T>(
    path: string,
    args: RequestInit = { method: "get" }
  ): Promise<HttpResponse<T>> {
    return await httpBase<T>(new Request(path, args));
  }

  static async post<T>(
    path: string,
    body?: any,
    args: RequestInit = { method: "post", body: JSON.stringify(body) }
  ): Promise<HttpResponse<T>> {
    return await httpBase<T>(new Request(path, args));
  }

  static async put<T>(
    path: string,
    body?: any,
    args: RequestInit = { method: "put", body: JSON.stringify(body) }
  ): Promise<HttpResponse<T>> {
    return await httpBase<T>(new Request(path, args));
  }

  static async del<T>(
    path: string,
    body?: any,
    args: RequestInit = { method: "delete", body: JSON.stringify(body) }
  ): Promise<HttpResponse<T>> {
    return await httpBase<T>(new Request(path, args));
  }

  async patch<T>(
    path: string,
    body?: any,
    args: RequestInit = { method: "patch", body: JSON.stringify(body) }
  ): Promise<HttpResponse<T>> {
    return await httpBase<T>(new Request(path, args));
  }
}
