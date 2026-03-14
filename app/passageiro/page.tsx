"use client";

import { useRouter } from "next/navigation"; // Importado para navegação
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Users, Clock, Info, CheckCircle2, CalendarDays } from "lucide-react";

// Mock de dados seguindo os campos do PDF
const VIAGENS_REQUISITOS = [
  {
    id: "1",
    dia: "segunda",
    origem: "Terminal Central",
    destino: "Pórtico UEFS",
    horarioInicio: "06:40",
    horarioFim: "07:20",
    inscritos: 18,
    quorum: 20,
    vagasTotais: 44,
    jaInscrito: false,
  },
  {
    id: "2",
    dia: "segunda",
    origem: "Módulo 5 (UEFS)",
    destino: "Terminal Central",
    horarioInicio: "12:10",
    horarioFim: "12:50",
    inscritos: 35,
    quorum: 20,
    vagasTotais: 44,
    jaInscrito: true,
  },
];

const DIAS_SEMANA = [
  { id: "segunda", label: "Segunda" },
  { id: "terca", label: "Terça" },
  { id: "quarta", label: "Quarta" },
  { id: "quinta", label: "Quinta" },
  { id: "sexta", label: "Sexta" },
];

export default function PaginaPassageiro() {
  const router = useRouter(); // Hook para navegação

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1]">
      <Navigation />
      
      <main className="flex-1 container max-w-6xl py-10 px-4">
        <header className="mb-10 space-y-3">
          <h1 className="text-4xl font-black text-[#103173] flex items-center gap-3 tracking-tight">
            <CalendarDays className="h-10 w-10 text-[#F2D022]" />
            Rotas Disponíveis
          </h1>
          <p className="text-[#73AABF] font-bold text-lg">
            Garanta o seu lugar no transporte universitário para esta semana.
          </p>
        </header>

        <Tabs defaultValue="segunda" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-[#103B73]/10 p-1 mb-10 rounded-2xl h-16 shadow-inner">
            {DIAS_SEMANA.map((dia) => (
              <TabsTrigger 
                key={dia.id} 
                value={dia.id} 
                className="font-black text-xs md:text-sm uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-[#103173] data-[state=active]:shadow-sm rounded-xl transition-all"
              >
                {dia.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {DIAS_SEMANA.map((dia) => (
            <TabsContent key={dia.id} value={dia.id}>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                {VIAGENS_REQUISITOS.filter(v => v.dia === dia.id).map((viagem) => (
                  <Card key={viagem.id} className="border-none shadow-xl bg-white overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
                    <CardHeader className="bg-[#103B73]/5 border-b border-[#103B73]/5 pb-6">
                      <div className="flex justify-between items-start mb-4">
                        <Badge className={`${viagem.inscritos >= viagem.quorum ? "bg-[#23B99A]" : "bg-[#73AABF]"} text-white px-3 py-1 font-bold`}>
                          {viagem.inscritos >= viagem.quorum ? "QUORUM ATINGIDO" : "AGUARDANDO QUORUM"}
                        </Badge>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-[#73AABF] uppercase tracking-wider">Vagas Livres</p>
                          <p className="text-xl font-black text-[#103173]">{viagem.vagasTotais - viagem.inscritos}</p>
                        </div>
                      </div>
                      
                      <CardTitle className="text-xl text-[#103173] font-black leading-tight flex flex-col gap-2">
                        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#F2D022]"/> {viagem.origem}</span>
                        <span className="flex items-center gap-2"><MapPin className="h-5 w-5 text-[#103173]"/> {viagem.destino}</span>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-8 pb-8 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#E4F2F1] p-4 rounded-2xl border border-[#103173]/5">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-[#103173]" />
                            <p className="text-[10px] font-black text-[#73AABF] uppercase tracking-widest">Partida</p>
                          </div>
                          <p className="text-2xl font-black text-[#103173]">{viagem.horarioInicio}</p>
                        </div>
                        <div className="bg-[#E4F2F1] p-4 rounded-2xl border border-[#103173]/5">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 className="h-4 w-4 text-[#23B99A]" />
                            <p className="text-[10px] font-black text-[#73AABF] uppercase tracking-widest">Chegada</p>
                          </div>
                          <p className="text-2xl font-black text-[#103173]">{viagem.horarioFim}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <p className="text-sm font-bold text-[#103173]">Progresso do Quorum</p>
                          <p className="text-sm font-black text-[#103173]">{viagem.inscritos}/{viagem.vagasTotais}</p>
                        </div>
                        <div className="w-full bg-[#E4F2F1] h-3 rounded-full overflow-hidden border border-[#103173]/10">
                          <div 
                            className="bg-[#103173] h-full rounded-full transition-all duration-500" 
                            style={{ width: `${(viagem.inscritos / viagem.vagasTotais) * 100}%` }}
                          />
                        </div>
                        <p className="text-[10px] font-bold text-[#73AABF] italic">
                          * Necessário no mínimo {viagem.quorum} passageiros.
                        </p>
                      </div>
                    </CardContent>

                    <CardFooter className="bg-[#103173]/5 p-4">
                      {viagem.jaInscrito ? (
                        <Button 
                          variant="outline" 
                          className="w-full border-2 border-[#103173] text-[#103173] font-black h-12 hover:bg-[#103173] hover:text-white transition-colors"
                          onClick={() => router.push("/passageiro/status")} // Redireciona para Status
                        >
                          <Info className="h-5 w-5 mr-2" /> VER MINHA INSCRIÇÃO
                        </Button>
                      ) : (
                        <Button 
                          className="w-full bg-[#103173] hover:bg-[#103B73] text-white font-black h-12 shadow-md"
                          onClick={() => router.push("/passageiro/confirmacao")} // Redireciona para Confirmação
                        >
                          INSCREVER-SE AGORA
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      <FooterSection />
    </div>
  );
}