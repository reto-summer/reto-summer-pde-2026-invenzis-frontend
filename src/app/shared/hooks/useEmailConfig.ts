/**
 * Hook useEmailConfig — GET /email, POST /email, DELETE /email/{direccion}
 *
 * Encapsula la lista de emails registrados para notificaciones y las operaciones
 * de alta y baja. Carga la lista al montar y la refresca tras cada mutación.
 */

import { useState, useEffect, useCallback } from "react";
import {
  getEmailConfig,
  postEmailConfig,
  deleteEmailConfig,
  type EmailConfig,
} from "../../../api";

/** Resultado expuesto por `useEmailConfig`. */
export interface UseEmailConfigResult {
  /** Lista actual de emails registrados. */
  emails: EmailConfig[];
  /** `true` mientras se realiza una petición al backend. */
  loading: boolean;
  /** Mensaje de error user-friendly, o `null` si no hay error. */
  error: string | null;
  /**
   * Registra una nueva dirección de email.
   * Refresca la lista automáticamente tras el éxito.
   * @param direccion - Email a agregar.
   */
  addEmail: (direccion: string) => Promise<void>;
  /**
   * Elimina una dirección de email.
   * Refresca la lista automáticamente tras el éxito.
   * @param direccion - Email a eliminar.
   */
  removeEmail: (direccion: string) => Promise<void>;
  /** Recarga manualmente la lista de emails desde el backend. */
  refetch: () => Promise<void>;
}

/**
 * Hook para gestionar los emails de notificación del usuario.
 * Carga la lista al montar el componente y expone operaciones de alta y baja.
 *
 * @returns `UseEmailConfigResult` con estado, carga y funciones de mutación.
 */
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
      console.error("fetchEmails:", e);
      setError("No se pudieron cargar los emails. Intenta de nuevo.");
      setEmails([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  const addEmail = useCallback(
    async (direccion: string) => {
      setError(null);
      try {
        await postEmailConfig({ direccion });
        await fetchEmails();
      } catch (e) {
        console.error("addEmail:", e);
        setError(
          "No se pudo agregar el email. Verificá que sea válido e intentá de nuevo.",
        );
      }
    },
    [fetchEmails],
  );

  const removeEmail = useCallback(
    async (direccion: string) => {
      setError(null);
      try {
        await deleteEmailConfig(direccion);
        await fetchEmails();
      } catch (e) {
        console.error("removeEmail:", e);
        setError("No se pudo eliminar el email. Intentá de nuevo.");
      }
    },
    [fetchEmails],
  );

  return {
    emails,
    loading,
    error,
    addEmail,
    removeEmail,
    refetch: fetchEmails,
  };
}
