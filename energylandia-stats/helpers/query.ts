export function getQueryParams(req: Request) {
    const url = new URL(req.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    return queryParams
}