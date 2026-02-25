"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ExerciseResponse } from "@/lib/types";

interface ExerciseDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; sets: number; reps: number }) => void;
  editing?: ExerciseResponse | null;
  loading?: boolean;
}

export function ExerciseDialog({
  open,
  onClose,
  onSubmit,
  editing,
  loading,
}: ExerciseDialogProps) {
  const [name, setName] = useState("");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setSets(editing.sets);
      setReps(editing.reps);
    } else {
      setName("");
      setSets(3);
      setReps(10);
    }
  }, [editing, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ name, sets, reps });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Editar Ejercicio" : "Nuevo Ejercicio"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="exercise-name">Nombre</Label>
            <Input
              id="exercise-name"
              placeholder="Ej: Press de banca"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="exercise-sets">Series</Label>
              <Input
                id="exercise-sets"
                type="number"
                min={1}
                value={sets}
                onChange={(e) => setSets(Number(e.target.value))}
                required
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="exercise-reps">Repeticiones</Label>
              <Input
                id="exercise-reps"
                type="number"
                min={1}
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : editing ? "Guardar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
