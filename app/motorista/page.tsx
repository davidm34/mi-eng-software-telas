"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/landing/navigation";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle2,
  ChevronRight,
  Info,
  MapPin,
  CircleDot,
  Bus,
  User,
  UserCircle,
  ShieldAlert,
  Users,
} from "lucide-react";

// Mock de dados da viagem atribuída ao motorista
const viagemAtribuida = {
  id: "VG-0042",
  origem: "Salvador",
  destino: "Feira de Santana",
  horarioPartida: "08:30",
  horarioChegada: "10:30",
  passageirosConfirmados: 38,
  vagasTotais: 44,
  dia: "Segunda-feira",
};

export default function MotoristaPage() {
  const router = useRouter();

  const handleCheckIn = () => {
    router.push("/motorista/embarque");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f4f8]">
      {/* Header unificado */}
      <div className="bg-[#103173] relative overflow-hidden">
        {/* Nav inline */}
        <div className="max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto px-4 pt-4 pb-1 relative flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-[#F2D022] p-1.5 rounded-lg">
              <Bus className="h-4 w-4 text-[#103173]" />
            </div>
            <span className="text-lg font-extrabold text-white tracking-tight">Roteiro</span>
          </Link>
          <Button className="bg-[#F2D022] hover:bg-[#d9ba1f] text-[#103173] font-bold rounded-md px-4 h-9">
            <User className="w-4 h-4 mr-2" /> PERFIL
          </Button>
        </div>

        {/* Hero */}
        <div className="max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto px-4 pt-4 pb-7 relative">
          <div className="flex items-center gap-2 mb-1">
            <Bus className="h-4 w-4 text-[#F2D022]" />
            <span className="text-[11px] font-bold text-[#F2D022] uppercase tracking-widest">
              Painel do Motorista
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white leading-tight tracking-tight">
            Sua viagem de hoje
          </h1>
          <p className="text-white/50 text-sm mt-1 font-medium">
            Confira os detalhes e faça o check-in.
          </p>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main className="flex-1 max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto w-full px-4 pt-5 pb-32">
        {/* Card da viagem */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(16,49,115,0.06),0_8px_24px_rgba(16,49,115,0.04)]">
          {/* Identificador da viagem */}
          <div className="bg-[#103173]/5 px-4 py-3 flex items-center justify-between border-b border-[#103173]/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#23B99A] animate-pulse" />
              <span className="text-xs font-extrabold text-[#103173] uppercase tracking-wider">
                {viagemAtribuida.id}
              </span>
            </div>
            <span className="text-xs font-bold text-[#103173]/40">
              {viagemAtribuida.dia}
            </span>
          </div>

          <div className="p-5">
            {/* Rota visual — origem → destino */}
            <div className="flex items-start gap-3 mb-5">
              {/* Indicador vertical */}
              <div className="flex flex-col items-center pt-0.5 shrink-0">
                <CircleDot className="h-5 w-5 text-[#F2D022]" />
                <div className="w-px h-8 bg-gradient-to-b from-[#F2D022] to-[#103173] my-1" />
                <MapPin className="h-5 w-5 text-[#103173]" />
              </div>
              {/* Locais + horários */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between">
                  <p className="text-lg font-extrabold text-[#103173]">
                    {viagemAtribuida.origem}
                  </p>
                  <span className="text-sm font-bold text-[#103173]/50 ml-2 shrink-0">
                    {viagemAtribuida.horarioPartida}
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-4">
                  <p className="text-lg font-extrabold text-[#103173]">
                    {viagemAtribuida.destino}
                  </p>
                  <span className="text-sm font-bold text-[#103173]/50 ml-2 shrink-0">
                    {viagemAtribuida.horarioChegada}
                  </span>
                </div>
              </div>
            </div>

            {/* Info de passageiros */}
            <div className="flex items-center gap-3 p-3 bg-[#103173]/[0.03] rounded-xl mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#103173]/5 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-[#103173]/60" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-[#103173]/40 uppercase tracking-wider">
                  Passageiros confirmados
                </p>
                <p className="text-lg font-extrabold text-[#103173]">
                  {viagemAtribuida.passageirosConfirmados}
                  <span className="text-sm font-bold text-[#103173]/30 ml-1">
                    / {viagemAtribuida.vagasTotais}
                  </span>
                </p>
              </div>
              {/* Barra de ocupação */}
              <div className="w-16 shrink-0">
                <div className="w-full bg-[#103173]/5 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#23B99A] transition-all duration-700"
                    style={{
                      width: `${(viagemAtribuida.passageirosConfirmados / viagemAtribuida.vagasTotais) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* CTA de Check-in */}
            <button
              onClick={handleCheckIn}
              className="
                w-full py-5 rounded-2xl text-xl font-extrabold
                bg-[#23B99A] text-white
                hover:bg-[#1fa889]
                active:scale-[0.97]
                transition-all duration-150
                shadow-lg shadow-[#23B99A]/25
                flex items-center justify-center gap-3
              "
            >
              <CheckCircle2 className="h-7 w-7" />
              Fazer Check-in
            </button>
          </div>
        </div>

        {/* Link para informações da escala */}
        <Link href="/motorista/informacao" className="block mt-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-[0_1px_3px_rgba(16,49,115,0.04)] hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F2D022]/15 flex items-center justify-center">
                <Info className="h-5 w-5 text-[#b8960a]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#103173]">Informações da Escala</p>
                <p className="text-[11px] text-[#103173]/40 font-medium">Ver detalhes e lista de passageiros</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-[#103173]/20 group-hover:translate-x-1 group-hover:text-[#103173]/40 transition-all" />
          </div>
        </Link>
      </main>

      {/* --- DEV BAR --- */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#103173] text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-4 z-50 border border-[#F2D022]/20 backdrop-blur-md">
        <div className="flex flex-col border-r border-white/15 pr-3">
          <span className="text-[8px] font-extrabold uppercase text-[#F2D022] tracking-tight">Dev</span>
          <span className="text-[10px] font-bold text-white/70">Perfil</span>
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="hover:bg-white/10 text-white gap-1.5 font-bold text-xs h-8 px-2.5"
            onClick={() => router.push("/passageiro")}
          >
            <UserCircle className="h-3.5 w-3.5" /> Passageiro
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="hover:bg-[#F2D022] hover:text-[#103173] text-white gap-1.5 font-bold text-xs h-8 px-2.5 transition-colors"
            onClick={() => router.push("/motorista")}
          >
            <Bus className="h-3.5 w-3.5" /> Motorista
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="hover:bg-red-500 hover:text-white text-white gap-1.5 font-bold text-xs h-8 px-2.5 transition-colors"
            onClick={() => router.push("/admin")}
          >
            <ShieldAlert className="h-3.5 w-3.5" /> Admin
          </Button>
        </div>
      </div>
    </div>
  );
}