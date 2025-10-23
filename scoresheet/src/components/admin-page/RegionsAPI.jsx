import { useEffect, useState } from "react";

let cachedRegions = null;

export const useRegions = () => {
  const [regions, setRegions] = useState(cachedRegions || []);
  const [isLoading, setIsLoading] = useState(!cachedRegions);

  useEffect(() => {
    if (cachedRegions) return; // skip if cached

    const fetchRegions = async () => {
      try {
        const res = await fetch("https://psgc.gitlab.io/api/regions.json");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        cachedRegions = data;
        setRegions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegions();
  }, []);

  return { regions, isLoading };
};
