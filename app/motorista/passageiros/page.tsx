"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Search,
  UserCheck,
  Clock,
  UserX,
  User,
  MapPin,
  CircleDot,
} from "lucide-react";

// Mock de dados dos passageiros
const PASSAGEIROS_MOCK = [
  {
    id: 1,
    nome: "Ana Beatriz Sousa",
    matricula: "ALU-202401",
    status: "embarcou",
  },
  {
    id: 2,
    nome: "Carlos Eduardo Silva",
    matricula: "ALU-202402",
    status: "pendente",
  },
  { id: 3, nome: "Fernanda Lima", matricula: "ALU-202403", status: "embarcou" },
  {
    id: 4,
    nome: "João Pedro Alves",
    matricula: "ALU-202404",
    status: "pendente",
  },
  {
    id: 5,
    nome: "Maria Clara Nunes",
    matricula: "ALU-202405",
    status: "falta",
  },
  {
    id: 6,
    nome: "Pedro Henrique Santos",
    matricula: "ALU-202406",
    status: "pendente",
  },
  {
    id: 7,
    nome: "Rafael Souza Costa",
    matricula: "ALU-202407",
    status: "embarcou",
  },
];

export default function ListaPassageiros() {
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const [passageiros, setPassageiros] = useState(PASSAGEIROS_MOCK);

  // Filtra os passageiros baseados na barra de pesquisa
  const passageirosFiltrados = passageiros.filter(
    (p) =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.matricula.toLowerCase().includes(busca.toLowerCase()),
  );

  // Calcula estatísticas
  const total = passageiros.length;
  const embarcados = passageiros.filter((p) => p.status === "embarcou").length;

  // Função para simular o check-in manual na lista
  const alternarCheckIn = (id: number) => {
    setPassageiros(
      passageiros.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            status: p.status === "embarcou" ? "pendente" : "embarcou",
          };
        }
        return p;
      }),
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1] pb-24">
      <main className="flex-1 w-full max-w-3xl mx-auto py-8 px-4">
        {/* Botão de Voltar */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-white py-2 px-4 rounded-full shadow-md text-[#103173] font-black uppercase text-sm hover:opacity-70 transition-all mb-8 w-fit"
        >
          <ArrowLeft className="h-5 w-5" /> Voltar
        </button>

        {/* Cabeçalho da Rota */}
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-black text-[#103173] tracking-tight">
            Lista de Passageiros
          </h1>

          <Card className="border-none shadow-lg bg-[#103173] text-white rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <Badge className="bg-[#F2D022] text-[#103173] font-black uppercase mb-2 hover:bg-[#F2D022]">
                    ROTA ROT-0042
                  </Badge>
                  <div className="flex items-center flex-wrap gap-2 text-sm font-bold mt-2">
                    <CircleDot className="h-4 w-4 text-[#F2D022]" />
                    <span>Salvador</span>
                    <span className="text-[#73AABF]">→</span>
                    <MapPin className="h-4 w-4 text-[#73AABF]" />
                    <span>Feira de Santana</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/10 p-3 rounded-2xl w-fit">
                  <div className="text-center px-3 border-r border-white/20">
                    <p className="text-[10px] text-[#73AABF] font-black uppercase tracking-widest">
                      Total
                    </p>
                    <p className="text-xl font-black">{total}</p>
                  </div>
                  <div className="text-center px-3">
                    <p className="text-[10px] text-[#23B99A] font-black uppercase tracking-widest">
                      Embarcados
                    </p>
                    <p className="text-xl font-black text-[#23B99A]">
                      {embarcados}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barra de Pesquisa */}
        <div className="relative mb-6 shadow-sm rounded-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#73AABF]" />
          </div>
          <Input
            type="text"
            placeholder="Buscar por nome ou matrícula..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-12 h-14 bg-white border-none rounded-2xl text-[#103173] font-bold focus-visible:ring-2 focus-visible:ring-[#F2D022] shadow-sm"
          />
        </div>

        {/* Lista de Passageiros */}
        <div className="space-y-3">
          {passageirosFiltrados.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[#73AABF] font-bold">
                Nenhum passageiro encontrado.
              </p>
            </div>
          ) : (
            passageirosFiltrados.map((passageiro) => (
              <Card
                key={passageiro.id}
                className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden"
              >
                <CardContent className="p-0 flex items-center">
                  {/* Tarja lateral de cor do status */}
                  <div
                    className={`w-3 h-full min-h-[80px] shrink-0 ${
                      passageiro.status === "embarcou"
                        ? "bg-[#23B99A]"
                        : passageiro.status === "falta"
                          ? "bg-red-500"
                          : "bg-[#F2D022]"
                    }`}
                  />

                  <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Info do Passageiro */}
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                        <User className="h-6 w-6 text-[#103173]/50" />
                      </div>
                      <div>
                        <h3 className="font-black text-[#103173] text-base md:text-lg leading-tight">
                          {passageiro.nome}
                        </h3>
                        <p className="text-xs font-bold text-[#73AABF]">
                          {passageiro.matricula}
                        </p>
                      </div>
                    </div>

                    {/* Status e Ação */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 ml-16 sm:ml-0">
                      <Badge
                        variant="outline"
                        className={`font-black uppercase tracking-wider text-[10px] py-1 border-2 ${
                          passageiro.status === "embarcou"
                            ? "border-[#23B99A] text-[#23B99A]"
                            : passageiro.status === "falta"
                              ? "border-red-500 text-red-500"
                              : "border-[#F2D022] text-[#b39912]"
                        }`}
                      >
                        {passageiro.status === "embarcou" && (
                          <UserCheck className="w-3 h-3 mr-1" />
                        )}
                        {passageiro.status === "pendente" && (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {passageiro.status === "falta" && (
                          <UserX className="w-3 h-3 mr-1" />
                        )}
                        {passageiro.status}
                      </Badge>

                      {/* Botão de Check-in Manual (Só aparece se estiver pendente) */}
                      {passageiro.status !== "falta" && (
                        <Button
                          onClick={() => alternarCheckIn(passageiro.id)}
                          variant="ghost"
                          className={`h-10 px-4 rounded-xl font-bold transition-all ${
                            passageiro.status === "embarcou"
                              ? "text-slate-400 hover:text-red-500 hover:bg-red-50"
                              : "bg-[#103173] text-white hover:bg-[#103B73] shadow-md"
                          }`}
                        >
                          {passageiro.status === "embarcou"
                            ? "Desfazer"
                            : "Embarcar"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
