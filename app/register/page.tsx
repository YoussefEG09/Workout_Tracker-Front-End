"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dumbbell, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Las contrasenas no coinciden");
      return;
    }
    if (password.length < 4) {
      toast.error("La contrasena debe tener al menos 4 caracteres");
      return;
    }
    setLoading(true);
    try {
      const res = await auth.register({ username, password });
      login(res.token);
      toast.success("Cuenta creada correctamente");
      router.push("/dashboard");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error al crear la cuenta"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="/images/auth-hero.jpg"
          alt="Interior de gimnasio moderno"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="relative z-10 flex flex-col justify-end p-12">
          <h2 className="text-4xl font-bold text-primary-foreground leading-tight text-balance">
            Empieza tu viaje fitness hoy.
          </h2>
          <p className="mt-3 text-primary-foreground/80 text-lg max-w-md">
            Crea tu cuenta y comienza a registrar cada serie, cada repeticion,
            cada logro.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Dumbbell className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              Workout Tracker
            </span>
          </div>

          <h1 className="text-2xl font-bold text-foreground">Crear Cuenta</h1>
          <p className="mt-1 text-muted-foreground">
            Registrate para empezar a usar la aplicacion.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="tu_usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Contrasena</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimo 4 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={
                    showPassword ? "Ocultar contrasena" : "Mostrar contrasena"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm-password">Confirmar Contrasena</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Repite la contrasena"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full mt-2">
              {loading ? "Registrando..." : "Crear Cuenta"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {"Ya tienes cuenta? "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Inicia sesion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
