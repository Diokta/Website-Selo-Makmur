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

  const fetchContent = async () => {
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
      }
    } catch (err) {
      console.error("Error in fetchContent:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const getContent = (key: string, defaultValue = ""): string => {
    return content[key] !== undefined ? content[key] : defaultValue;
  };

  return (
    <WebsiteContentContext.Provider
      value={{
        content,
        loading,
        getContent,
        refreshContent: fetchContent,
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
