"use client";

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
  ChevronRight,
  CircleDot
} from "lucide-react";

// Dados simulados baseados no documento (Guia do Motorista)
const VIAGENS_ATRIBUIDAS = [
  {
    id: "ROT-9901",
    dia: "segunda",
    origem: "Terminal Central",
    destino: "UEFS - Pórtico",
    horarioInicio: "06:40",
    horarioFim: "07:20",
    inscritos: 42,
    capacidade: 44,
    status: "programada", // programada | em_andamento | concluida
  },
  {
    id: "ROT-9905",
    dia: "segunda",
    origem: "Módulo 7",
    destino: "Terminal Norte",
    horarioInicio: "12:15",
    horarioFim: "13:00",
    inscritos: 20,
    capacidade: 44,
    status: "em_andamento",
  }
];

export default function PaginaMotorista() {
  const diasUteis = [
    { id: "segunda", label: "Segunda" },
    { id: "terca", label: "Terça" },
    { id: "quarta", label: "Quarta" },
    { id: "quinta", label: "Quinta" },
    { id: "sexta", label: "Sexta" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1]">
      <Navigation />
      
      <main className="flex-1 container max-w-6xl py-10 px-4">
        {/* Header do Motorista */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-[#103173] p-2 rounded-xl shadow-lg">
                <Bus className="h-8 w-8 text-[#F2D022]" />
              </div>
              <h1 className="text-4xl font-black text-[#103173] tracking-tight">
                Roteiro <span className="text-[#73AABF] font-light">| Motorista</span>
              </h1>
            </div>
            <p className="text-lg font-medium text-slate-500">
              Bem-vindo, **Marcos Oliveira**. Confira suas escalas de hoje.
            </p>
          </div>

          <div className="flex gap-2">
            <Badge className="bg-[#F2D022] text-[#103173] hover:bg-[#F2D022] border-none font-bold px-4 py-2 rounded-full">
              Status: Ativo
            </Badge>
          </div>
        </div>

        {/* Abas de Dias Úteis */}
        <Tabs defaultValue="segunda" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/50 border border-[#73AABF]/20 p-1 mb-8 rounded-2xl h-16 shadow-inner">
            {diasUteis.map((dia) => (
              <TabsTrigger 
                key={dia.id} 
                value={dia.id}
                className="data-[state=active]:bg-[#103173] data-[state=active]:text-white font-bold text-sm lg:text-base rounded-xl transition-all"
              >
                {dia.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {diasUteis.map((dia) => (
            <TabsContent key={dia.id} value={dia.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid gap-8 md:grid-cols-2">
                {VIAGENS_ATRIBUIDAS.filter(v => v.dia === dia.id).map((viagem) => (
                  <Card key={viagem.id} className="border-none shadow-xl rounded-3xl overflow-hidden bg-white group transition-transform hover:scale-[1.01]">
                    {/* Barra Lateral de Status */}
                    <div className="flex">
                      <div className={`w-3 ${viagem.status === 'em_andamento' ? 'bg-[#23B99A]' : 'bg-[#103173]'}`} />
                      
                      <div className="flex-1">
                        <CardHeader className="pb-4">
                          <div className="flex justify-between items-center mb-4">
                            <Badge variant="outline" className={`font-bold border-2 ${viagem.status === 'em_andamento' ? 'text-[#23B99A] border-[#23B99A]' : 'text-[#103173] border-[#103173]'}`}>
                              {viagem.status === 'em_andamento' ? "EM ROTA" : "AGUARDANDO"}
                            </Badge>
                            <span className="text-sm font-black text-slate-300">#{viagem.id}</span>
                          </div>
                          
                          <CardTitle className="text-2xl font-black text-[#103173] leading-none">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <CircleDot className="h-4 w-4 text-[#F2D022]" />
                                <span>{viagem.origem}</span>
                              </div>
                              <div className="ml-[7px] w-0.5 h-4 bg-[#73AABF]/30" />
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-[#103173]" />
                                <span>{viagem.destino}</span>
                              </div>
                            </div>
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6">
                          {/* Info de Tempo e Passageiros */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#E4F2F1] p-4 rounded-2xl border border-[#73AABF]/10">
                              <p className="text-[10px] font-bold text-[#73AABF] uppercase tracking-widest mb-1">Horário</p>
                              <div className="flex items-center text-xl font-black text-[#103173]">
                                <Clock className="h-5 w-5 mr-2" /> {viagem.horarioInicio}
                              </div>
                            </div>
                            <div className="bg-[#E4F2F1] p-4 rounded-2xl border border-[#73AABF]/10">
                              <p className="text-[10px] font-bold text-[#73AABF] uppercase tracking-widest mb-1">Ocupação</p>
                              <div className="flex items-center text-xl font-black text-[#103173]">
                                <Users className="h-5 w-5 mr-2" /> {viagem.inscritos}/{viagem.capacidade}
                              </div>
                            </div>
                          </div>

                          {/* Barra de Progresso de Passageiros */}
                          <div className="space-y-2">
                            <div className="h-3 w-full bg-[#E4F2F1] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#F2D022] rounded-full" 
                                style={{ width: `${(viagem.inscritos / viagem.capacidade) * 100}%` }}
                              />
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="p-6 bg-slate-50 flex gap-4 border-t border-slate-100">
                          {/* Botão de Lista de Passageiros */}
                          <Button variant="outline" className="flex-1 h-14 border-2 border-[#103173] text-[#103173] font-black rounded-2xl hover:bg-[#103173] hover:text-white transition-all">
                            <ClipboardList className="h-5 w-5 mr-2" /> LISTA
                          </Button>
                          
                          {/* Botão de Validação de Código */}
                          <Button className="flex-1 h-14 bg-[#103173] text-white font-black rounded-2xl shadow-lg shadow-[#103173]/20 hover:bg-[#103B73]">
                            <QrCode className="h-5 w-5 mr-2" /> CÓDIGO
                          </Button>
                        </CardFooter>
                      </div>
                    </div>
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