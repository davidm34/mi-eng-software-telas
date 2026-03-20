"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/landing/navigation";
import {
  MapPin,
  CheckCircle2,
  ArrowRight,
  Bus,
  User,
  UserCircle,
  ShieldAlert,
  Ticket,
  CircleDot,
} from "lucide-react";

// Dados mock
const VIAGENS_REQUISITOS = [
  {
    id: "1",
    dia: "segunda",
    origem: "Salvador",
    destino: "Feira de Santana",
    horarioInicio: "06:00",
    horarioFim: "08:00",
    inscritos: 18,
    quorum: 20,
    vagasTotais: 44,
    jaInscrito: false,
  },
  {
    id: "2",
    dia: "segunda",
    origem: "Feira de Santana",
    destino: "Salvador",
    horarioInicio: "18:30",
    horarioFim: "20:30",
    inscritos: 35,
    quorum: 20,
    vagasTotais: 44,
    jaInscrito: true,
  },
  {
    id: "3",
    dia: "terca",
    origem: "Salvador",
    destino: "Feira de Santana",
    horarioInicio: "07:00",
    horarioFim: "09:00",
    inscritos: 10,
    quorum: 20,
    vagasTotais: 44,
    jaInscrito: false,
  },
];

const DIAS_SEMANA = [
  { id: "segunda", label: "Seg", full: "Segunda-feira" },
  { id: "terca", label: "Ter", full: "Terça-feira" },
  { id: "quarta", label: "Qua", full: "Quarta-feira" },
  { id: "quinta", label: "Qui", full: "Quinta-feira" },
  { id: "sexta", label: "Sex", full: "Sexta-feira" },
];

function ProgressRing({ value, size = 48, stroke = 4 }: { value: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(16, 49, 115, 0.08)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={value >= 100 ? "#23B99A" : "#103173"}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
}

export default function PaginaPassageiro() {
  const router = useRouter();
  const [diaAtivo, setDiaAtivo] = useState("segunda");

  const viagensDoDia = VIAGENS_REQUISITOS.filter((v) => v.dia === diaAtivo);
  const diaAtual = DIAS_SEMANA.find((d) => d.id === diaAtivo);

  return (
    <div className="flex min-h-screen flex-col bg-[#f0f4f8]">
      {/* Header unificado — nav + hero num bloco só */}
      <div className="bg-[#103173] relative overflow-hidden">
        {/* Elementos decorativos sutis */}
        {/* <div className="absolute top-0 right-0 w-40 h-40 bg-[#F2D022]/8 rounded-full -translate-y-1/2 translate-x-1/2" /> */}
        {/* <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" /> */}

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

        {/* Hero copy */}
        <div className="max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto px-4 pt-4 pb-7 relative">
          <div className="flex items-center gap-2 mb-1">
            <Ticket className="h-4 w-4 text-[#F2D022]" />
            <span className="text-[11px] font-bold text-[#F2D022] uppercase tracking-widest">
              Transporte Universitário
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white leading-tight tracking-tight">
            Inscreva-se na sua rota
          </h1>
          <p className="text-white/60 text-sm mt-1 font-medium">
            Selecione o dia e escolha a viagem desejada.
          </p>
        </div>
      </div>

      {/* Seletor de dia — pill tabs */}
      <div className="sticky top-0 z-30 bg-[#f0f4f8]/95 backdrop-blur-md border-b border-[#103173]/5">
        <div className="max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto px-4 py-3">
          <div className="flex gap-2">
            {DIAS_SEMANA.map((dia) => {
              const isActive = dia.id === diaAtivo;
              const temViagens = VIAGENS_REQUISITOS.some((v) => v.dia === dia.id);
              return (
                <button
                  key={dia.id}
                  onClick={() => setDiaAtivo(dia.id)}
                  className={`
                    flex-1 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider
                    transition-all duration-200 relative
                    ${isActive
                      ? "bg-[#103173] text-white shadow-lg shadow-[#103173]/20"
                      : "bg-white text-[#103173]/70 hover:bg-[#103173]/5 border border-[#103173]/8"
                    }
                    active:scale-95
                  `}
                >
                  {dia.label}
                  {temViagens && !isActive && (
                    <span className="absolute top-1 right-1.5 w-1.5 h-1.5 bg-[#F2D022] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lista de viagens */}
      <main className="flex-1 max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto w-full px-4 pt-5 pb-32">
        {/* Label do dia */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-[#103173]/40 uppercase tracking-widest">
            {diaAtual?.full}
          </span>
          <span className="text-xs font-semibold text-[#73AABF]">
            {viagensDoDia.length} rota{viagensDoDia.length !== 1 ? "s" : ""}
          </span>
        </div>

        {viagensDoDia.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#103173]/5 flex items-center justify-center mb-4">
              <Bus className="h-7 w-7 text-[#103173]/20" />
            </div>
            <p className="text-sm font-bold text-[#103173]/30">
              Nenhuma rota disponível
            </p>
            <p className="text-xs text-[#103173]/20 mt-1">
              Não há viagens cadastradas para este dia.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {viagensDoDia.map((viagem) => {
              const percentInscritos = Math.round((viagem.inscritos / viagem.vagasTotais) * 100);
              const quorumAtingido = viagem.inscritos >= viagem.quorum;
              const vagasLivres = viagem.vagasTotais - viagem.inscritos;

              return (
                <div
                  key={viagem.id}
                  className={`
                    bg-white rounded-2xl overflow-hidden
                    shadow-[0_1px_3px_rgba(16,49,115,0.06),0_8px_24px_rgba(16,49,115,0.04)]
                    transition-all duration-300
                    ${viagem.jaInscrito ? "ring-2 ring-[#23B99A]/30" : ""}
                  `}
                >
                  {/* Status da inscrição */}
                  {viagem.jaInscrito && (
                    <div className="bg-[#23B99A]/5 px-4 py-2 flex items-center gap-2 border-b border-[#23B99A]/10">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#23B99A]" />
                      <span className="text-xs font-bold text-[#23B99A]">Você já está inscrito</span>
                    </div>
                  )}

                  <div className="p-4">
                    {/* Rota visual — origem → destino */}
                    <div className="flex items-start gap-3 mb-4">
                      {/* Indicador vertical da rota */}
                      <div className="flex flex-col items-center pt-0.5 shrink-0">
                        <CircleDot className="h-4 w-4 text-[#F2D022]" />
                        <div className="w-px h-6 bg-gradient-to-b from-[#F2D022] to-[#103173] my-0.5" />
                        <MapPin className="h-4 w-4 text-[#103173]" />
                      </div>
                      {/* Nomes */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between">
                          <p className="text-base font-extrabold text-[#103173] truncate">
                            {viagem.origem}
                          </p>
                          <span className="text-[11px] font-bold text-[#103173]/50 ml-2 shrink-0">
                            {viagem.horarioInicio}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between mt-3">
                          <p className="text-base font-extrabold text-[#103173] truncate">
                            {viagem.destino}
                          </p>
                          <span className="text-[11px] font-bold text-[#103173]/50 ml-2 shrink-0">
                            {viagem.horarioFim}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Métricas e badges */}
                    <div className="flex items-center gap-3 mb-4">
                      {/* Progresso circular */}
                      <div className="relative shrink-0">
                        <ProgressRing value={percentInscritos} size={44} stroke={3.5} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[10px] font-extrabold text-[#103173]">
                            {viagem.inscritos}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            className={`
                              text-[10px] font-bold px-2 py-0.5 rounded-md border-0
                              ${quorumAtingido
                                ? "bg-[#23B99A]/10 text-[#23B99A]"
                                : "bg-[#F2D022]/15 text-[#b8960a]"
                              }
                            `}
                          >
                            {quorumAtingido ? "Quórum atingido" : `Faltam ${viagem.quorum - viagem.inscritos}`}
                          </Badge>
                          <span className="text-[10px] font-semibold text-[#103173]/35">
                            {vagasLivres} vaga{vagasLivres !== 1 ? "s" : ""} livre{vagasLivres !== 1 ? "s" : ""}
                          </span>
                        </div>
                        {/* Barra de progresso linear fina */}
                        <div className="w-full bg-[#103173]/5 h-1 rounded-full overflow-hidden mt-2">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ease-out ${
                              quorumAtingido ? "bg-[#23B99A]" : "bg-[#103173]"
                            }`}
                            style={{ width: `${percentInscritos}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    {viagem.jaInscrito ? (
                      <button
                        onClick={() => router.push("/passageiro/status")}
                        className="
                          w-full py-3 rounded-xl text-sm font-bold
                          bg-[#103173]/5 text-[#103173] 
                          hover:bg-[#103173]/10
                          active:scale-[0.98]
                          transition-all duration-150
                          flex items-center justify-center gap-2
                        "
                      >
                        Ver minha inscrição
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => router.push("/passageiro/confirmacao")}
                        className="
                          w-full py-3.5 rounded-xl text-sm font-extrabold
                          bg-[#103173] text-white
                          hover:bg-[#0d2a63]
                          active:scale-[0.97]
                          transition-all duration-150
                          shadow-lg shadow-[#103173]/20
                          flex items-center justify-center gap-2
                        "
                      >
                        <Ticket className="h-4 w-4" />
                        Inscrever-se nesta rota
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* --- BARRA DE NAVEGAÇÃO ENTRE PERFIS (DEVELOPER BAR) --- */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#103173] text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-4 z-50 border border-[#F2D022]/20 backdrop-blur-md">
        <div className="flex flex-col border-r border-white/15 pr-3">
          <span className="text-[8px] font-extrabold uppercase text-[#F2D022] tracking-tight">
            Dev
          </span>
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