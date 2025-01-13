export function createSearchParamsString(
  params: Record<string, string | null>
) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }
  });

  return searchParams.toString();
}

export function getSearchParams(searchParams: URLSearchParams) {
  return Object.fromEntries(searchParams.entries());
}
