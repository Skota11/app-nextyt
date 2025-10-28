export const jsonFetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
  return res.json();
};

export const dataFetcher = async (url: string) => {
  const json = await jsonFetcher(url);
  return json?.data;
};
