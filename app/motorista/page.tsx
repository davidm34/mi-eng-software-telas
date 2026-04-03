"use client";

import { useState } from "react";
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
  Users,
  PlayCircle,
  Flag,
  UserCircle,
  ShieldAlert
} from "lucide-react";

const VIAGENS = [
  {
    id: "VG-0042",
    origem: "Salvador",
    destino: "Feira de Santana",
    horarioPartida: "08:30",
    horarioChegada: "10:30",
    passageirosConfirmados: 38,
    vagasTotais: 44,
    dia: "Segunda-feira",
    statusInicial: "pronta", 
  },
  {
    id: "VG-0043",
    origem: "Feira de Santana",
    destino: "Salvador",
    horarioPartida: "18:00",
    horarioChegada: "19:40",
    passageirosConfirmados: 42,
    vagasTotais: 44,
    dia: "Segunda-feira",
    statusInicial: "bloqueada", 
  }
];

function ViagemCard({ viagem }: { viagem: typeof VIAGENS[0] }) {
  const router = useRouter();
  const [statusViagem, setStatusViagem] = useState<"bloqueada" | "pronta" | "em_curso" | "finalizada">(
    viagem.statusInicial as any
  );

  const handleCheckIn = () => {
    router.push("/motorista/embarque");
  };

  const handleAcaoViagem = () => {
    if (statusViagem === "pronta") {
      setStatusViagem("em_curso");
    } else if (statusViagem === "em_curso") {
      setStatusViagem("finalizada");
    }
  };

  return (
    <div className="mb-8">
      <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(16,49,115,0.06),0_8px_24px_rgba(16,49,115,0.04)]">
        <div className="bg-[#103173]/5 px-4 py-3 flex items-center justify-between border-b border-[#103173]/5">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${statusViagem === 'em_curso' ? 'bg-[#F2D022]' : statusViagem === 'bloqueada' ? 'bg-slate-300' : 'bg-[#23B99A]'} ${statusViagem !== 'bloqueada' && statusViagem !== 'finalizada' ? 'animate-pulse' : ''}`} />
            <span className="text-xs font-extrabold text-[#103173] uppercase tracking-wider">{viagem.id}</span>
          </div>
          <span className="text-xs font-bold text-[#103173]/40">{viagem.dia}</span>
        </div>

        <div className="p-5">
          <div className="flex items-start gap-3 mb-5">
            <div className="flex flex-col items-center pt-0.5 shrink-0">
              <CircleDot className="h-5 w-5 text-[#F2D022]" />
              <div className="w-px h-8 bg-gradient-to-b from-[#F2D022] to-[#103173] my-1" />
              <MapPin className="h-5 w-5 text-[#103173]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between">
                <p className="text-lg font-extrabold text-[#103173]">{viagem.origem}</p>
                <span className="text-sm font-bold text-[#103173]/50 ml-2 shrink-0">{viagem.horarioPartida}</span>
              </div>
              <div className="flex items-baseline justify-between mt-4">
                <p className="text-lg font-extrabold text-[#103173]">{viagem.destino}</p>
                <span className="text-sm font-bold text-[#103173]/50 ml-2 shrink-0">{viagem.horarioChegada}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#103173]/[0.03] rounded-xl mb-5">
            <Users className="h-5 w-5 text-[#103173]/60" />
            <div className="flex-1">
              <p className="text-xs font-bold text-[#103173]/40 uppercase tracking-wider">Passageiros</p>
              <p className="text-lg font-extrabold text-[#103173]">{viagem.passageirosConfirmados} <span className="text-sm font-bold text-[#103173]/30">/ {viagem.vagasTotais}</span></p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {statusViagem !== "finalizada" && (
              <button onClick={handleCheckIn} className="w-full py-4 rounded-2xl text-lg font-extrabold bg-[#23B99A] text-white hover:bg-[#1fa889] active:scale-[0.97] transition-all shadow-lg flex items-center justify-center gap-3">
                <CheckCircle2 className="h-6 w-6" /> Fazer Check-in
              </button>
            )}
            <button
              onClick={handleAcaoViagem}
              disabled={statusViagem === "bloqueada" || statusViagem === "finalizada"}
              className={`w-full py-4 rounded-2xl text-lg font-extrabold transition-all duration-300 flex items-center justify-center gap-3 ${
                statusViagem === "bloqueada" ? "bg-slate-200 text-slate-400" : 
                statusViagem === "pronta" ? "bg-[#103173] text-white" : 
                statusViagem === "em_curso" ? "bg-[#F2D022] text-[#103173]" : "bg-slate-100 text-slate-400"
              }`}
            >
              {statusViagem === "bloqueada" ? "Aguardando Horário" : statusViagem === "pronta" ? "Iniciar Viagem" : statusViagem === "em_curso" ? "Confirmar Chegada" : "Viagem Concluída"}
            </button>
          </div>
        </div>
      </div>
      
      <Link href={`/motorista/informacao?viagem=${viagem.id}`} className="block -mt-4">
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F2D022]/15 flex items-center justify-center"><Info className="h-5 w-5 text-[#b8960a]" /></div>
            <div>
              <p className="text-sm font-bold text-[#103173]">Informações da Escala</p>
              <p className="text-[11px] text-[#103173]/40 font-medium">Ver detalhes e lista de passageiros</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-[#103173]/20" />
        </div>
      </Link>
    </div>
  );
}

export default function MotoristaPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f4f8]">
      <Navigation isMotorista={true} />

      <main className="flex-1 max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto w-full px-4 pt-10 pb-32">
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Bus className="h-4 w-4 text-[#103173]" />
            <span className="text-[11px] font-bold text-[#103173] uppercase tracking-widest">Painel do Motorista</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#103173] tracking-tight">Suas viagens de hoje</h1>
          <p className="text-[#73AABF] text-sm mt-1 font-medium">Confira os detalhes e faça a gestão do embarque.</p>
        </header>

        {VIAGENS.map((viagem) => (
          <ViagemCard key={viagem.id} viagem={viagem} />
        ))}
      </main>

      {/* --- MODO DE TESTE --- */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#103173] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 z-50 border-2 border-[#F2D022]/30 backdrop-blur-md">
        <div className="flex flex-col border-r border-white/20 pr-4">
          <span className="text-[9px] font-black uppercase text-[#F2D022] tracking-tighter">
            Modo de Teste
          </span>
          <span className="text-xs font-bold">Alternar Perfil</span>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="hover:bg-white/10 text-white gap-2 font-bold"
            onClick={() => router.push("/passageiro")}
          >
            <UserCircle className="h-4 w-4" /> Passageiro
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="bg-[#F2D022] text-[#103173] gap-2 font-bold transition-colors"
            onClick={() => router.push("/motorista")}
          >
            <Bus className="h-4 w-4" /> Motorista
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="hover:bg-red-500 hover:text-white text-white gap-2 font-bold transition-colors"
            onClick={() => router.push("/admin")}
          >
            <ShieldAlert className="h-4 w-4" /> Admin
          </Button>
        </div>
      </div>
    </div>
  );
}