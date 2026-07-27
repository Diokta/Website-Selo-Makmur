import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../lib/supabase";

interface WebsiteContentContextValue {
  content: Record<string, string>;
  loading: boolean;
  getContent: (key: string, defaultValue?: string) => string;
  refreshContent: () => Promise<void>;
}

const WebsiteContentContext = createContext<WebsiteContentContextValue | null>(null);

export function WebsiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const CACHE_KEY = "website_content_cache";
  const CACHE_TTL = 30 * 60 * 1000; // Cache valid untuk 30 menit

  const saveToCache = (data: Record<string, string>) => {
    try {
      const cacheObj = {
        data,
        expiresAt: Date.now() + CACHE_TTL
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObj));
    } catch (e) {
      console.warn("Gagal menyimpan cache website_content:", e);
    }
  };

  const fetchContent = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const { data, error } = await supabase
        .from("website_content")
        .select("section_key, value");

      if (error) {
        console.error("Error fetching website content:", error);
        return;
      }

      if (data) {
        const map: Record<string, string> = {};
        data.forEach((item) => {
          map[item.section_key] = item.value || "";
        });
        
        setContent(map);
        saveToCache(map);
      }
    } catch (err) {
      console.error("Error in fetchContent:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Memuat dari cache terlebih dahulu (Stale-While-Revalidate)
    let hasLoadedFromCache = false;
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, expiresAt } = JSON.parse(cached);
        if (data && typeof data === "object") {
          setContent(data);
          setLoading(false);
          hasLoadedFromCache = true;
          
          // Jika cache sudah kedaluwarsa, ambil data baru di background
          if (Date.now() > expiresAt) {
            fetchContent(true);
          }
        }
      }
    } catch (e) {
      console.warn("Gagal membaca cache website_content:", e);
    }

    // Jika tidak ada di cache, lakukan fetch normal yang memblokir loading
    if (!hasLoadedFromCache) {
      fetchContent(false);
    }
  }, []);

  // Update favicon secara dinamis berdasarkan logo yang diunggah
  useEffect(() => {
    const logoUrl = content["identity.logo"];
    if (logoUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.getElementsByTagName("head")[0].appendChild(link);
      }
      link.href = logoUrl;
    }
  }, [content]);

  const getContent = (key: string, defaultValue = ""): string => {
    const val = content[key];
    return val !== undefined && val !== null && val !== "" ? val : defaultValue;
  };

  const refreshContent = async () => {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (e) {
      console.warn("Gagal menghapus cache website_content:", e);
    }
    await fetchContent(false);
  };

  return (
    <WebsiteContentContext.Provider
      value={{
        content,
        loading,
        getContent,
        refreshContent,
      }}
    >
      {children}
    </WebsiteContentContext.Provider>
  );
}

export function useWebsiteContent() {
  const ctx = useContext(WebsiteContentContext);
  if (!ctx) {
    throw new Error(
      "useWebsiteContent harus digunakan di dalam <WebsiteContentProvider>"
    );
  }
  return ctx;
}
