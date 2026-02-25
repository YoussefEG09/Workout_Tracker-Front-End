"use client";

import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { RoutineResponse } from "@/lib/types";

interface RoutineCardProps {
  routine: RoutineResponse;
  onEdit: (routine: RoutineResponse) => void;
  onDelete: (routine: RoutineResponse) => void;
}

export function RoutineCard({ routine, onEdit, onDelete }: RoutineCardProps) {
  return (
    <Card className="group relative transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4">
        <Link
          href={`/dashboard/routine/${routine.id}`}
          className="flex-1 min-w-0"
        >
          <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {routine.name}
          </CardTitle>
          <CardDescription className="mt-1 line-clamp-2">
            {routine.description || "Sin descripcion"}
          </CardDescription>
          <div className="mt-4 flex items-center text-sm text-primary font-medium">
            Ver ejercicios
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground shrink-0"
              aria-label="Opciones de rutina"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(routine)}>
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(routine)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
    </Card>
  );
}
