"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Car, Loader2, Lock, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("Terjadi kesalahan saat login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen grid lg:grid-cols-2 font-sans overflow-hidden">
      {/* LEFT COLUMN - Form Section */}
      <div className="flex flex-col justify-center items-center p-8 md:p-12 lg:p-16 bg-white relative z-10">
        <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-xl shadow-blue-200 mb-6 transform hover:scale-105 transition-transform duration-300">
              <Car className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Selamat Datang
            </h1>
            <p className="text-slate-500 text-sm">
              Sistem Manajemen Karoseri v2.0
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            autoComplete="off"
          >
            {error && (
              <Alert
                variant="destructive"
                className="animate-in fade-in zoom-in-95 duration-200 border-red-200 bg-red-50 text-red-800"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="ml-2 font-medium">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-slate-700 text-sm font-semibold"
                >
                  Username
                </Label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete="off"
                    className="pl-11 h-12 border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="password"
                    className="text-slate-700 text-sm font-semibold"
                  >
                    Password
                  </Label>
                  <a
                    href="#"
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Lupa password?
                  </a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete="new-password"
                    className="pl-11 h-12 border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all duration-300 transform hover:-translate-y-0.5 rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Memproses...</span>
                </div>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>

          {/* Dev Mode Credentials Hint */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">
                Development Credentials
              </h3>
              <div className="text-xs text-yellow-700 space-y-1 font-mono">
                <p>
                  Username: <span className="font-bold select-all">admin</span>
                </p>
                <p>
                  Password:{" "}
                  <span className="font-bold select-all">admin123</span>
                </p>
              </div>
            </div>
          )}

          <div className="text-center pt-4">
            <p className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} Karoseri System. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - Image Section (Hidden on mobile) */}
      <div className="relative hidden lg:block bg-slate-900 overflow-hidden">
        <Image
          src="/images/login-background.png"
          alt="Login Background"
          fill
          className="object-cover opacity-90 transition-transform duration-[20s] hover:scale-105"
          priority
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-black/20" />

        {/* Quote / Overlay Text */}
        <div className="absolute bottom-20 left-12 right-12 z-20 text-white">
          <div className="max-w-md space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="h-1 w-20 bg-blue-500 mb-6 rounded-full" />
            <h2 className="text-4xl font-bold leading-tight">
              Excellence in Automotive Manufacturing.
            </h2>
            <p className="text-lg text-blue-100/80 font-medium">
              Streamline your production, manage resources, and deliver quality
              with our integrated system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
