"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Users, Dumbbell, Trash2, ShieldCheck, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { admin as adminApi } from "@/lib/api";
import type { User, RoutineResponse } from "@/lib/types";

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [routines, setRoutines] = useState<RoutineResponse[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingRoutines, setLoadingRoutines] = useState(true);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [deletingRoutine, setDeletingRoutine] = useState<RoutineResponse | null>(null);
  const [editingRoutine, setEditingRoutine] = useState<RoutineResponse | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await adminApi.getUsers();
      setUsers(data);
    } catch {
      toast.error("Error al cargar los usuarios");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const fetchRoutines = useCallback(async () => {
    try {
      const data = await adminApi.getRoutines();
      setRoutines(data);
    } catch {
      toast.error("Error al cargar las rutinas");
    } finally {
      setLoadingRoutines(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchRoutines();
  }, [fetchUsers, fetchRoutines]);

  async function handleDeleteUser() {
    if (!deletingUser) return;
    try {
      await adminApi.deleteUser(deletingUser.id);
      toast.success("Usuario eliminado");
      setDeletingUser(null);
      fetchUsers();
      fetchRoutines();
    } catch {
      toast.error("Error al eliminar el usuario");
    }
  }

  async function handleDeleteRoutine() {
    if (!deletingRoutine) return;
    try {
      await adminApi.deleteRoutine(deletingRoutine.id);
      toast.success("Rutina eliminada");
      setDeletingRoutine(null);
      await fetchRoutines();
    } catch {
      toast.error("Error al eliminar la rutina");
    }
  }

  function openEditRoutine(routine: RoutineResponse) {
    setEditingRoutine(routine);
    setEditForm({ name: routine.name, description: routine.description || "" });
  }

  async function handleEditRoutine() {
    if (!editingRoutine) return;
    setSaving(true);
    try {
      await adminApi.updateRoutine(editingRoutine.id, editForm);
      toast.success("Rutina actualizada");
      setEditingRoutine(null);
      await fetchRoutines();
    } catch {
      toast.error("Error al actualizar la rutina");
    } finally {
      setSaving(false);
    }
  }

  const totalUsers = users.length;
  const totalRoutines = routines.length;
  const adminCount = users.filter((u) => u.role === "ROLE_ADMIN").length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          Panel de Administracion
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gestiona usuarios y rutinas de toda la plataforma.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Usuarios
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {loadingUsers ? "-" : totalUsers}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Rutinas
            </CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {loadingRoutines ? "-" : totalRoutines}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Administradores
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {loadingUsers ? "-" : adminCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="routines">Rutinas</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardContent className="p-0">
              {loadingUsers ? (
                <div className="p-8 flex items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : users.length === 0 ? (
                <p className="p-8 text-center text-muted-foreground">
                  No hay usuarios registrados.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {user.id}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {user.username}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "ROLE_ADMIN"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {user.role === "ROLE_ADMIN" ? "Admin" : "Usuario"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => setDeletingUser(user)}
                            disabled={user.role === "ROLE_ADMIN"}
                            aria-label={`Eliminar usuario ${user.username}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routines" className="mt-4">
          <Card>
            <CardContent className="p-0">
              {loadingRoutines ? (
                <div className="p-8 flex items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : routines.length === 0 ? (
                <p className="p-8 text-center text-muted-foreground">
                  No hay rutinas creadas.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Descripcion</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {routines.map((routine) => (
                      <TableRow key={routine.id}>
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {routine.id}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {routine.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-xs truncate">
                          {routine.description || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {routine.user?.username || "-"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-primary"
                              onClick={() => openEditRoutine(routine)}
                              aria-label={`Editar rutina ${routine.name}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => setDeletingRoutine(routine)}
                              aria-label={`Eliminar rutina ${routine.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog
        open={!!deletingUser}
        onOpenChange={(v) => !v && setDeletingUser(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar usuario</AlertDialogTitle>
            <AlertDialogDescription>
              {"Estas seguro de que quieres eliminar al usuario "}
              <strong>{deletingUser?.username}</strong>
              {"? Se eliminaran todas sus rutinas, ejercicios y progreso. Esta accion no se puede deshacer."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar usuario
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!deletingRoutine}
        onOpenChange={(v) => !v && setDeletingRoutine(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar rutina</AlertDialogTitle>
            <AlertDialogDescription>
              {"Estas seguro de que quieres eliminar la rutina "}
              <strong>{deletingRoutine?.name}</strong>
              {"? Se eliminaran todos sus ejercicios y el progreso asociado. Esta accion no se puede deshacer."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRoutine}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar rutina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={!!editingRoutine}
        onOpenChange={(v) => !v && setEditingRoutine(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar rutina</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nombre</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Nombre de la rutina"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Descripcion</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Descripcion de la rutina"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingRoutine(null)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button onClick={handleEditRoutine} disabled={saving || !editForm.name.trim()}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
