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

export const fetchCitiesMunicipalities = async () => {
  try {
    const res = await fetch(
      `https://psgc.gitlab.io/api/cities-municipalities.json`
    );
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();

    // Transform and clean names
    const transformedData = data.map((item) => {
      let name = item.name.trim();

      // "City of Pasig" → "Pasig City"
      if (/^City of /i.test(name)) {
        name = name.replace(/^City of (.*)/i, "$1 City");
      }

      // "Municipality of Angono" → "Angono"
      else if (/^Municipality of /i.test(name)) {
        name = name.replace(/^Municipality of (.*)/i, "$1");
      }

      // Remove any extra spaces or redundant words
      name = name.replace(/\s+/g, " ").trim();

      return { ...item, name };
    });

    // Remove duplicates (based on name, case-insensitive)
    const uniqueData = [
      ...new Map(
        transformedData.map((item) => [item.name.toLowerCase(), item])
      ).values(),
    ];

    // Sort alphabetically by name
    uniqueData.sort((a, b) => a.name.localeCompare(b.name));

    return uniqueData;
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

export const fetchPlayers = async () => {
  try {
    const { data, error } = await supabase
      .from("tbl_local_players")
      .select(
        `*,
        tbl_local_team (
            team_name,
            short_name
            )`
      )
      .order("player_id", { ascending: true });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error fetching players list:", err.message);
  }
};

export const fetchPlayerStats = async (playerId) => {
  try {
    const { data, error } = await supabase
      .from("vw_stats_player_played_team")
      .select("*")
      .eq("player_id", playerId);

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error fetching player stats:", err.message);
    return [];
  }
};

