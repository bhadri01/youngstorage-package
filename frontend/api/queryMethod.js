import { useQuery } from "@tanstack/react-query";

export const APIQuery = (key, API, interval = false) =>
  useQuery({
    queryKey: [key],
    queryFn: () => API(),
    retry: 1,
    cacheTime: 1000 * 60 * 60 * 24,
    refetchInterval: interval
  });
