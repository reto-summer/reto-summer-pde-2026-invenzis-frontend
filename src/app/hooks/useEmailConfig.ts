/**
 * Hook useEmailConfig — GET /config/email, POST /config/email, DELETE /config/email
 */

import { useState, useEffect, useCallback } from "react";
import { getEmailConfig, postEmailConfig, deleteEmailConfig } from "../../api/emailConfig";
import type { EmailConfig } from "../../api/types";

export interface UseEmailConfigResult {
  emails: EmailConfig[];
  loading: boolean;
  error: string | null;
  addEmail: (direccion: string) => Promise<void>;
  removeEmail: (direccion: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useEmailConfig(): UseEmailConfigResult {
  const [emails, setEmails] = useState<EmailConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEmailConfig();
      setEmails(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar configuracion de emails");
      setEmails([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  const addEmail = useCallback(async (direccion: string) => {
    setError(null);
    try {
      await postEmailConfig({ direccion });
      await fetchEmails();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al agregar email");
      throw e;
    }
  }, [fetchEmails]);

  const removeEmail = useCallback(async (direccion: string) => {
    setError(null);
    try {
      await deleteEmailConfig(direccion);
      await fetchEmails();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar email");
      throw e;
    }
  }, [fetchEmails]);

  return {
    emails,
    loading,
    error,
    addEmail,
    removeEmail,
    refetch: fetchEmails,
  };
}
