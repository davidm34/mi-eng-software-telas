"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bus, User } from "lucide-react";

// Adicionamos a propriedade "isMotorista" para controlar o que aparece
export function Navigation({ isMotorista = false }: { isMotorista?: boolean }) {
  return (
    <nav className="w-full bg-[#103173] text-[#E4F2F1] shadow-md border-b-2 border-[#73AABF]">
      <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-[#F2D022] p-1.5 rounded-md">
            <Bus className="h-5 w-5 text-[#103173]" />
          </div>
          <span className="text-xl font-bold tracking-tight">Roteiro</span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          {/* Só mostra esses links se NÃO for motorista */}
          {!isMotorista && (
            <>
              <Link href="#" className="hover:text-[#F2D022] transition-colors">Rotas</Link>
              <Link href="#" className="hover:text-[#F2D022] transition-colors">Minhas Viagens</Link>
            </>
          )}
          
          <Button className="bg-[#F2D022] hover:bg-[#d9ba1f] text-[#103173] font-bold rounded-md px-4 h-9">
            <User className="w-4 h-4 mr-2" /> PERFIL
          </Button>
        </div>
      </div>
    </nav>
  );
}