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
import { Textarea } from "@/components/ui/textarea";
import type { RoutineResponse } from "@/lib/types";

interface RoutineDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
  editing?: RoutineResponse | null;
  loading?: boolean;
}

export function RoutineDialog({
  open,
  onClose,
  onSubmit,
  editing,
  loading,
}: RoutineDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setDescription(editing.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [editing, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ name, description });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Editar Rutina" : "Nueva Rutina"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="routine-name">Nombre</Label>
            <Input
              id="routine-name"
              placeholder="Ej: Rutina de pecho"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="routine-desc">Descripcion</Label>
            <Textarea
              id="routine-desc"
              placeholder="Describe la rutina..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
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
