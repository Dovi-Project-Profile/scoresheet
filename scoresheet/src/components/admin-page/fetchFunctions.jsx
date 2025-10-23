import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

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

export const fetchCities = async ({ selectedRegionCode }) => {
  try {
    const res = await fetch(
      `https://psgc.gitlab.io/api/regions/${selectedRegionCode}/cities-municipalities.json`
    );
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchTeams = async () => {
  try {
    const { data, error } = await supabase
      .from("tbl_local_team")
      .select("*")
      .order("team_id", { ascending: true });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error fetching teams:", err.message);
  }
};
