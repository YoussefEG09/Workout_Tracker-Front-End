"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Trash2, CalendarDays, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { progress as progressApi } from "@/lib/api";
import type { ExerciseResponse, ProgressResponse } from "@/lib/types";

interface ProgressPanelProps {
  exercise: ExerciseResponse | null;
  open: boolean;
  onClose: () => void;
}

export function ProgressPanel({ exercise, open, onClose }: ProgressPanelProps) {
  const [entries, setEntries] = useState<ProgressResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<ProgressResponse | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!exercise) return;
    setLoading(true);
    try {
      const data = await progressApi.getByExercise(exercise.id);
      setEntries(data);
    } catch {
      toast.error("Error al cargar el progreso");
    } finally {
      setLoading(false);
    }
  }, [exercise]);

  useEffect(() => {
    if (open && exercise) {
      fetchProgress();
    }
  }, [open, exercise, fetchProgress]);

  async function handleAddProgress(e: React.FormEvent) {
    e.preventDefault();
    if (!exercise) return;
    setSaving(true);
    try {
      await progressApi.create({
        exerciseId: exercise.id,
        date,
        note,
      });
      toast.success("Progreso registrado");
      setNote("");
      setDate(new Date().toISOString().split("T")[0]);
      fetchProgress();
    } catch {
      toast.error("Error al registrar el progreso");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteProgress() {
    if (!deleting) return;
    try {
      await progressApi.delete(deleting.id);
      toast.success("Entrada eliminada");
      setDeleting(null);
      fetchProgress();
    } catch {
      toast.error("Error al eliminar");
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              Progreso: {exercise?.name}
            </SheetTitle>
            <p className="text-sm text-muted-foreground">
              {exercise?.sets} series x {exercise?.reps} reps
            </p>
          </SheetHeader>

          <div className="mt-6">
            <form
              onSubmit={handleAddProgress}
              className="flex flex-col gap-4 rounded-lg border border-border bg-muted/30 p-4"
            >
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Registrar progreso
              </h4>
              <div className="flex flex-col gap-2">
                <Label htmlFor="progress-date">Fecha</Label>
                <Input
                  id="progress-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="progress-note">Nota</Label>
                <Textarea
                  id="progress-note"
                  placeholder="Ej: Aumente 5kg en la segunda serie..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  required
                />
              </div>
              <Button type="submit" disabled={saving} size="sm">
                {saving ? "Guardando..." : "Registrar"}
              </Button>
            </form>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Historial
            </h4>
            {loading ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 rounded-md bg-muted animate-pulse"
                  />
                ))}
              </div>
            ) : entries.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No hay registros de progreso todavia.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start justify-between rounded-lg border border-border bg-card p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                        {new Date(entry.date).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="mt-1 flex items-start gap-2 text-sm text-foreground">
                        <FileText className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground" />
                        <span className="line-clamp-3">{entry.note}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleting(entry)}
                      aria-label="Eliminar entrada"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar entrada</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion eliminara esta entrada de progreso permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProgress}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
