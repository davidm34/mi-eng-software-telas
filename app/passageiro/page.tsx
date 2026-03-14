"use client";

import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Users, Clock, Info, CheckCircle2, CalendarDays } from "lucide-react";

// Mock de dados seguindo exatamente os campos do PDF:
// Quorum, Inscritos, Vagas, Origem/Destino, Horários
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
    jaInscrito: true, // Requisito: Visualizar informações sobre a rota já inscrita
  }
];

export default function TelaPrincipalPassageiro() {
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
        {/* Cabeçalho da Tela Principal */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-extrabold text-[#103173] flex items-center gap-2">
            <CalendarDays className="h-8 w-8" />
            Roteiro de Viagens
          </h1>
          <p className="text-[#73AABF] text-lg font-medium">
            Olá, passageiro! Confira as rotas disponíveis e garanta sua vaga.
          </p>
        </div>

        {/* Ação do Usuário: Visualizar rotas disponíveis pelos dias úteis da semana */}
        <Tabs defaultValue="segunda" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-[#103B73]/10 p-1 mb-8 rounded-xl h-14">
            {diasUteis.map((dia) => (
              <TabsTrigger 
                key={dia.id} 
                value={dia.id}
                className="data-[state=active]:bg-[#103173] data-[state=active]:text-white font-bold text-sm lg:text-base rounded-lg transition-all"
              >
                {dia.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {diasUteis.map((dia) => (
            <TabsContent key={dia.id} value={dia.id} className="animate-in fade-in-50 duration-500">
              <div className="grid gap-6 md:grid-cols-2">
                {VIAGENS_REQUISITOS.filter(v => v.dia === dia.id).map((viagem) => (
                  <Card key={viagem.id} className={`border-none shadow-lg overflow-hidden transition-all ${viagem.jaInscrito ? 'ring-2 ring-[#103173]' : ''}`}>
                    {/* Header com Origem e Destino */}
                    <CardHeader className="bg-[#103B73]/5 pb-4">
                      <div className="flex justify-between items-start">
                        <Badge className={`${viagem.inscritos >= viagem.quorum ? 'bg-[#103173]' : 'bg-[#73AABF]'} text-white border-none px-3 py-1`}>
                          {viagem.inscritos >= viagem.quorum ? "Quorum Atingido" : "Aguardando Quorum"}
                        </Badge>
                        {viagem.jaInscrito && (
                          <Badge variant="outline" className="border-[#103173] text-[#103173] font-bold bg-[#103173]/10">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Inscrito
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl text-[#103173] mt-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-[#F2D022]" />
                        <span className="leading-tight">{viagem.origem} <br/> 
                          <span className="text-sm font-normal text-slate-500">para</span> {viagem.destino}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="pt-6 space-y-6">
                      {/* Requisito: Horário de início e fim da viagem */}
                      <div className="flex items-center gap-4 bg-[#E4F2F1]/50 p-3 rounded-lg">
                        <Clock className="h-5 w-5 text-[#103173]" />
                        <div>
                          <p className="text-xs font-bold text-[#73AABF] uppercase tracking-wider">Horário Previsto</p>
                          <p className="text-lg font-black text-[#103173]">{viagem.horarioInicio} — {viagem.horarioFim}</p>
                        </div>
                      </div>

                      {/* Requisito: Quorum, Inscritos e Quantidade de vagas */}
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm font-bold text-[#103173]">
                          <span>Inscritos: {viagem.inscritos}</span>
                          <span>Vagas: {viagem.vagasTotais - viagem.inscritos} restantes</span>
                        </div>
                        
                        <div className="h-3 w-full bg-[#E4F2F1] rounded-full overflow-hidden border border-[#73AABF]/20">
                          <div 
                            className="h-full bg-[#F2D022] transition-all duration-1000" 
                            style={{ width: `${(viagem.inscritos / viagem.vagasTotais) * 100}%` }}
                          />
                        </div>
                        
                        <p className="text-[11px] font-semibold text-[#73AABF] italic">
                          * Quorum necessário: {viagem.quorum} passageiros.
                        </p>
                      </div>
                    </CardContent>

                    <CardFooter className="bg-[#103173]/5 p-4">
                      {viagem.jaInscrito ? (
                        /* Ação: Visualizar informações sobre a rota já inscrita */
                        <Button variant="outline" className="w-full border-2 border-[#103173] text-[#103173] font-black h-12 hover:bg-[#103173] hover:text-white transition-colors">
                          <Info className="h-5 w-5 mr-2" /> VER MINHA INSCRIÇÃO
                        </Button>
                      ) : (
                        /* Ação: Inscrever numa viagem */
                        <Button className="w-full bg-[#103173] hover:bg-[#103B73] text-white font-black h-12 shadow-md">
                          INSCREVER-SE AGORA
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {VIAGENS_REQUISITOS.filter(v => v.dia === dia.id).length === 0 && (
                <div className="text-center py-20 bg-white/50 rounded-2xl border-2 border-dashed border-[#73AABF]">
                  <p className="text-[#73AABF] font-bold">Nenhuma rota programada para este dia.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>

      <FooterSection />
    </div>
  );
}