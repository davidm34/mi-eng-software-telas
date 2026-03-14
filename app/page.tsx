"use client";

import { useState } from "react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Users, 
  Clock, 
  QrCode, 
  ClipboardList, 
  Bus, 
  BusFront, 
  CheckCircle2, 
  CalendarDays,
  Info,
  ArrowRightLeft,
  CircleDot
} from "lucide-react";

// --- MOCK DE DADOS (Baseado no PDF) ---
const DADOS_PASSAGEIRO = [
  { id: "1", dia: "segunda", origem: "Terminal Central", destino: "Pórtico UEFS", inicio: "06:40", fim: "07:20", inscritos: 18, quorum: 20, total: 44, inscrito: false },
  { id: "2", dia: "segunda", origem: "Módulo 5 (UEFS)", destino: "Terminal Central", inicio: "12:10", fim: "12:50", inscritos: 35, quorum: 20, total: 44, inscrito: true },
];

const DADOS_MOTORISTA = [
  { id: "ROT-9901", dia: "segunda", origem: "Terminal Central", destino: "UEFS - Pórtico", inicio: "06:40", fim: "07:20", inscritos: 42, total: 44, status: "programada" },
  { id: "ROT-9905", dia: "segunda", origem: "Módulo 7", destino: "Terminal Norte", inicio: "12:15", fim: "13:00", inscritos: 20, total: 44, status: "em_andamento" },
];

const DIAS = [
  { id: "segunda", label: "Segunda" },
  { id: "terca", label: "Terça" },
  { id: "quarta", label: "Quarta" },
  { id: "quinta", label: "Quinta" },
  { id: "sexta", label: "Sexta" },
];

export default function GerenciadorRoteiro() {
  const [visao, setVisao] = useState<"passageiro" | "motorista">("passageiro");

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1] text-slate-900">
      {/* BOTÃO FLUTUANTE PARA ALTERNAR TELAS */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button 
          onClick={() => setVisao(visao === "passageiro" ? "motorista" : "passageiro")}
          className="bg-[#103173] hover:bg-[#103B73] text-[#F2D022] font-black rounded-full h-16 px-8 shadow-2xl border-2 border-[#F2D022] transition-all hover:scale-110 active:scale-95"
        >
          <ArrowRightLeft className="mr-2 h-6 w-6" />
          VER COMO {visao === "passageiro" ? "MOTORISTA" : "PASSAGEIRO"}
        </Button>
      </div>

      <Navigation />

      <main className="flex-1 container max-w-6xl py-10 px-4">
        {visao === "passageiro" ? <VisaoPassageiro /> : <VisaoMotorista />}
      </main>

      <FooterSection />
    </div>
  );
}

// --- COMPONENTE: VISÃO PASSAGEIRO ---
function VisaoPassageiro() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-black text-[#103173] flex items-center gap-2">
          <CalendarDays className="h-8 w-8 text-[#F2D022]" />
          Roteiro de Viagens
        </h1>
        <p className="text-[#73AABF] font-bold">Olá! Selecione o dia para garantir sua vaga no transporte.</p>
      </div>

      <Tabs defaultValue="segunda">
        <TabsList className="grid w-full grid-cols-5 bg-[#103B73]/10 p-1 mb-8 rounded-xl h-14">
          {DIAS.map(dia => (
            <TabsTrigger key={dia.id} value={dia.id} className="data-[state=active]:bg-[#103173] data-[state=active]:text-white font-bold">{dia.label}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="segunda" className="grid gap-6 md:grid-cols-2">
          {DADOS_PASSAGEIRO.map((rota) => (
            <Card key={rota.id} className="border-none shadow-lg bg-white overflow-hidden">
              <CardHeader className="bg-[#103B73]/5 pb-4">
                <div className="flex justify-between items-start">
                  <Badge className={rota.inscritos >= rota.quorum ? "bg-[#103173]" : "bg-[#73AABF]"}>
                    {rota.inscritos >= rota.quorum ? "Quorum Atingido" : "Aguardando Quorum"}
                  </Badge>
                  {rota.inscrito && <Badge className="bg-[#103173]/10 text-[#103173] border-[#103173]"><CheckCircle2 className="h-3 w-3 mr-1"/> Inscrito</Badge>}
                </div>
                <CardTitle className="text-xl text-[#103173] mt-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#F2D022]" /> {rota.origem} → {rota.destino}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between bg-[#E4F2F1] p-3 rounded-lg font-black text-[#103173]">
                  <span className="flex items-center gap-2"><Clock className="h-4 w-4"/> {rota.inicio} - {rota.fim}</span>
                  <span className="text-[#73AABF]">{rota.total - rota.inscritos} vagas</span>
                </div>
                <div className="space-y-1">
                  <div className="h-2 w-full bg-[#E4F2F1] rounded-full overflow-hidden">
                    <div className="h-full bg-[#F2D022]" style={{ width: `${(rota.inscritos/rota.total)*100}%` }} />
                  </div>
                  <p className="text-[10px] font-bold text-[#73AABF] italic">* Quorum necessário: {rota.quorum}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className={rota.inscrito ? "w-full border-2 border-[#103173] text-[#103173]" : "w-full bg-[#103173] text-white"} variant={rota.inscrito ? "outline" : "default"}>
                  {rota.inscrito ? "VER MINHA INSCRIÇÃO" : "INSCREVER-SE AGORA"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- COMPONENTE: VISÃO MOTORISTA ---
function VisaoMotorista() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-[#103173] flex items-center gap-3">
            <div className="bg-[#F2D022] p-2 rounded-lg"><BusFront className="h-7 w-7 text-[#103173]" /></div>
            Painel do Motorista
          </h1>
          <p className="text-[#73AABF] font-bold">Gerencie suas escalas e embarques para hoje.</p>
        </div>
      </div>

      <Tabs defaultValue="segunda">
        <TabsList className="grid w-full grid-cols-5 bg-[#103B73]/10 p-1 mb-8 rounded-xl h-14">
          {DIAS.map(dia => (
            <TabsTrigger key={dia.id} value={dia.id} className="data-[state=active]:bg-[#103173] data-[state=active]:text-white font-bold">{dia.label}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="segunda" className="grid gap-6 md:grid-cols-2">
          {DADOS_MOTORISTA.map((escala) => (
            <Card key={escala.id} className="border-none shadow-xl bg-white overflow-hidden flex">
              <div className={`w-2 ${escala.status === 'em_andamento' ? 'bg-[#23B99A]' : 'bg-[#103173]'}`} />
              <div className="flex-1">
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="outline" className={escala.status === 'em_andamento' ? "text-[#23B99A] border-[#23B99A]" : "text-[#103173] border-[#103173]"}>
                      {escala.status === 'em_andamento' ? "EM ROTA" : "PROGRAMADA"}
                    </Badge>
                    <span className="text-xs font-bold text-slate-300">#{escala.id}</span>
                  </div>
                  <CardTitle className="text-lg text-[#103173]">
                    <div className="flex items-center gap-2"><CircleDot className="h-3 w-3 text-[#F2D022]"/> {escala.origem}</div>
                    <div className="flex items-center gap-2 mt-1"><MapPin className="h-3 w-3 text-[#103173]"/> {escala.destino}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="bg-[#E4F2F1] p-3 rounded-xl">
                    <p className="text-[10px] font-bold text-[#73AABF] uppercase">Saída</p>
                    <p className="text-lg font-black text-[#103173]">{escala.inicio}</p>
                  </div>
                  <div className="bg-[#E4F2F1] p-3 rounded-xl">
                    <p className="text-[10px] font-bold text-[#73AABF] uppercase">Ocupação</p>
                    <p className="text-lg font-black text-[#103173]">{escala.inscritos}/{escala.total}</p>
                  </div>
                </CardContent>
                <CardFooter className="gap-3 bg-slate-50 border-t border-slate-100">
                  <Button variant="outline" className="flex-1 border-2 border-[#103173] text-[#103173] font-bold"><ClipboardList className="mr-2 h-4 w-4"/> LISTA</Button>
                  <Button className="flex-1 bg-[#103173] text-white font-bold"><QrCode className="mr-2 h-4 w-4"/> CÓDIGO</Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}