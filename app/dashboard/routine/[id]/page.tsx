"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Plus,
  ArrowLeft,
  MoreHorizontal,
  Pencil,
  Trash2,
  BarChart3,
  Repeat,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  routines as routinesApi,
  exercises as exercisesApi,
} from "@/lib/api";
import type { RoutineResponse, ExerciseResponse } from "@/lib/types";
import { ExerciseDialog } from "@/components/exercise-dialog";
import { ProgressPanel } from "@/components/progress-panel";

export default function RoutineDetailPage() {
  const params = useParams();
  const routineId = Number(params.id);

  const [routine, setRoutine] = useState<RoutineResponse | null>(null);
  const [exercisesList, setExercisesList] = useState<ExerciseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] =
    useState<ExerciseResponse | null>(null);
  const [deletingExercise, setDeletingExercise] =
    useState<ExerciseResponse | null>(null);
  const [saving, setSaving] = useState(false);
  const [progressExercise, setProgressExercise] =
    useState<ExerciseResponse | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [routineData, exercisesData] = await Promise.all([
        routinesApi.getById(routineId),
        exercisesApi.getByRoutine(routineId),
      ]);
      setRoutine(routineData);
      setExercisesList(exercisesData);
    } catch {
      toast.error("Error al cargar la rutina");
    } finally {
      setLoading(false);
    }
  }, [routineId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleSubmitExercise(data: {
    name: string;
    sets: number;
    reps: number;
  }) {
    setSaving(true);
    try {
      if (editingExercise) {
        await exercisesApi.update(editingExercise.id, data);
        toast.success("Ejercicio actualizado");
      } else {
        await exercisesApi.create({ ...data, routineId });
        toast.success("Ejercicio creado");
      }
      setDialogOpen(false);
      setEditingExercise(null);
      fetchData();
    } catch {
      toast.error("Error al guardar el ejercicio");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteExercise() {
    if (!deletingExercise) return;
    try {
      await exercisesApi.delete(deletingExercise.id);
      toast.success("Ejercicio eliminado");
      setDeletingExercise(null);
      fetchData();
    } catch {
      toast.error("Error al eliminar el ejercicio");
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-8 w-48 rounded bg-muted animate-pulse" />
        <div className="h-4 w-72 rounded bg-muted animate-pulse" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!routine) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Rutina no encontrada</p>
        <Link href="/dashboard">
          <Button variant="link" className="mt-2">
            Volver al dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver a mis rutinas
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {routine.name}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {routine.description || "Sin descripcion"}
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingExercise(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ejercicio
          </Button>
        </div>
      </div>

      {exercisesList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Layers className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            No hay ejercicios
          </h3>
          <p className="mt-1 text-muted-foreground max-w-sm">
            Anade ejercicios a esta rutina para empezar a registrar tu progreso.
          </p>
          <Button
            className="mt-6"
            onClick={() => {
              setEditingExercise(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Anadir ejercicio
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exercisesList.map((exercise) => (
            <Card
              key={exercise.id}
              className="group transition-shadow hover:shadow-md"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">
                      {exercise.name}
                    </h3>
                    <div className="mt-3 flex items-center gap-3">
                      <Badge variant="secondary" className="gap-1">
                        <Layers className="h-3 w-3" />
                        {exercise.sets} series
                      </Badge>
                      <Badge variant="secondary" className="gap-1">
                        <Repeat className="h-3 w-3" />
                        {exercise.reps} reps
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground shrink-0"
                        aria-label="Opciones del ejercicio"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setProgressExercise(exercise)}
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Ver progreso
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingExercise(exercise);
                          setDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeletingExercise(exercise)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full"
                  onClick={() => setProgressExercise(exercise)}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Progreso
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ExerciseDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingExercise(null);
        }}
        onSubmit={handleSubmitExercise}
        editing={editingExercise}
        loading={saving}
      />

      <ProgressPanel
        exercise={progressExercise}
        open={!!progressExercise}
        onClose={() => setProgressExercise(null)}
      />

      <AlertDialog
        open={!!deletingExercise}
        onOpenChange={(v) => !v && setDeletingExercise(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar ejercicio</AlertDialogTitle>
            <AlertDialogDescription>
              {"Estas seguro de que quieres eliminar "}
              <strong>{deletingExercise?.name}</strong>
              {"? Se eliminara tambien todo su historial de progreso."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteExercise}
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
