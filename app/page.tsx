"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routines as routinesApi } from "@/lib/api";
import type { RoutineResponse } from "@/lib/types";
import { RoutineCard } from "@/components/routine-card";
import { RoutineDialog } from "@/components/routine-dialog";
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

export default function DashboardPage() {
  const [routines, setRoutines] = useState<RoutineResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<RoutineResponse | null>(null);
  const [deleting, setDeleting] = useState<RoutineResponse | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchRoutines = useCallback(async () => {
    try {
      const data = await routinesApi.getAll();
      setRoutines(data ?? []);
    } catch {
      toast.error("Error al cargar las rutinas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoutines();
  }, [fetchRoutines]);

  async function handleSubmit(data: { name: string; description: string }) {
    setSaving(true);
    try {
      if (editing) {
        await routinesApi.update(editing.id, data);
        toast.success("Rutina actualizada");
      } else {
        await routinesApi.create(data);
        toast.success("Rutina creada");
      }
      setDialogOpen(false);
      setEditing(null);
      await fetchRoutines();
    } catch (err) {
      console.error("Error guardando rutina:", err);
      toast.error("Error al guardar la rutina");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await routinesApi.delete(deleting.id);
      toast.success("Rutina eliminada");
      setDeleting(null);
      await fetchRoutines();
    } catch (err) {
      console.error("Error eliminando rutina:", err);
      toast.error("Error al eliminar la rutina");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mis Rutinas</h1>
          <p className="mt-1 text-muted-foreground">
            Gestiona tus rutinas de entrenamiento.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Rutina
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-36 rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : routines.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Dumbbell className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            No tienes rutinas todavia
          </h3>
          <p className="mt-1 text-muted-foreground max-w-sm">
            Crea tu primera rutina para empezar a registrar tus ejercicios y progreso.
          </p>
          <Button
            className="mt-6"
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear mi primera rutina
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {routines.map((routine) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              onEdit={(r) => {
                setEditing(r);
                setDialogOpen(true);
              }}
              onDelete={(r) => setDeleting(r)}
            />
          ))}
        </div>
      )}

      <RoutineDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        editing={editing}
        loading={saving}
      />

      <AlertDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar rutina</AlertDialogTitle>
            <AlertDialogDescription>
              {"Estas seguro de que quieres eliminar la rutina "}
              <strong>{deleting?.name}</strong>
              {"? Esta accion no se puede deshacer."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
