"use client";

import { useRouter } from "next/navigation";
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
  CircleDot,
  UserCircle,
  ShieldAlert
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
    status: "programada",
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

const DIAS_SEMANA = [
  { id: "segunda", label: "Segunda" },
  { id: "terca", label: "Terça" },
  { id: "quarta", label: "Quarta" },
  { id: "quinta", label: "Quinta" },
  { id: "sexta", label: "Sexta" },
];

export default function PaginaMotorista() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1] pb-24">
      <Navigation />
      
      <main className="flex-1 container max-w-6xl py-10 px-4">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <h1 className="text-4xl font-black text-[#103173] flex items-center gap-3 tracking-tight">
              <div className="bg-[#F2D022] p-2 rounded-xl shadow-sm">
                <Bus className="h-10 w-10 text-[#103173]" />
              </div>
              Painel do Motorista
            </h1>
            <p className="text-[#73AABF] font-bold text-lg">
              Bem-vindo, João Silva. Confira as suas escalas para hoje.
            </p>
          </div>
          <Badge variant="outline" className="w-fit border-2 border-[#103173] text-[#103173] font-black px-4 py-2 bg-white">
            VEÍCULO: JLS-1020
          </Badge>
        </header>

        <Tabs defaultValue="segunda" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-[#103B73]/10 p-1 mb-10 rounded-2xl h-16 shadow-inner border border-white/20">
            {DIAS_SEMANA.map((dia) => (
              <TabsTrigger 
                key={dia.id} 
                value={dia.id} 
                className="font-black text-xs md:text-sm uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-[#103173] rounded-xl transition-all"
              >
                {dia.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {DIAS_SEMANA.map((dia) => (
            <TabsContent key={dia.id} value={dia.id}>
              <div className="grid gap-6">
                {VIAGENS_ATRIBUIDAS.filter(v => v.dia === dia.id).map((viagem) => (
                  <Card key={viagem.id} className="border-none shadow-xl bg-white overflow-hidden group">
                    <div className="flex flex-col md:flex-row">
                      {/* Barra Lateral de Status */}
                      <div className={`w-full md:w-3 ${viagem.status === 'em_andamento' ? 'bg-[#23B99A]' : 'bg-[#103173]'}`} />
                      
                      <div className="flex-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-slate-50">
                          <div className="space-y-1">
                            <Badge className={`${viagem.status === 'em_andamento' ? 'bg-[#23B99A]' : 'bg-[#103173]'} text-white`}>
                              {viagem.status === 'em_andamento' ? 'EM ANDAMENTO' : 'PROGRAMADA'}
                            </Badge>
                            <CardTitle className="text-2xl font-black text-[#103173] flex flex-col pt-2">
                                <span className="flex items-center gap-2 text-sm text-[#73AABF] font-bold uppercase tracking-widest italic">Rota {viagem.id}</span>
                                <div className="flex items-center gap-3 mt-1">
                                  <CircleDot className="h-5 w-5 text-[#F2D022]" /> 
                                  {viagem.origem} 
                                  <span className="text-[#73AABF] mx-2">→</span>
                                  <MapPin className="h-5 w-5 text-[#103173]" />
                                  {viagem.destino}
                                </div>
                            </CardTitle>
                          </div>
                        </CardHeader>

                        <CardContent className="p-6 grid md:grid-cols-3 gap-6">
                          <div className="flex items-center gap-4 bg-[#E4F2F1] p-4 rounded-2xl">
                            <Clock className="h-8 w-8 text-[#103173]" />
                            <div>
                              <p className="text-[10px] font-black text-[#73AABF] uppercase tracking-widest">Horário</p>
                              <p className="text-xl font-black text-[#103173]">{viagem.horarioInicio} - {viagem.horarioFim}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 bg-[#E4F2F1] p-4 rounded-2xl">
                            <Users className="h-8 w-8 text-[#103173]" />
                            <div>
                              <p className="text-[10px] font-black text-[#73AABF] uppercase tracking-widest">Passageiros</p>
                              <p className="text-xl font-black text-[#103173]">{viagem.inscritos} / {viagem.capacidade}</p>
                            </div>
                          </div>

                          <div className="flex flex-col justify-center">
                            <div className="flex justify-between text-xs font-black text-[#103173] mb-2 uppercase tracking-tighter">
                              <span>Ocupação do Veículo</span>
                              <span>{Math.round((viagem.inscritos / viagem.capacidade) * 100)}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                              <div 
                                className="h-full bg-[#F2D022] rounded-full transition-all duration-700" 
                                style={{ width: `${(viagem.inscritos / viagem.capacidade) * 100}%` }}
                              />
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="p-6 bg-slate-50 flex flex-col sm:flex-row gap-4 border-t border-slate-100">
                          <Button variant="outline" className="flex-1 h-14 border-2 border-[#103173] text-[#103173] font-black rounded-2xl hover:bg-[#103173] hover:text-white transition-all">
                            <ClipboardList className="h-5 w-5 mr-2" /> LISTA DE PASSAGEIROS
                          </Button>
                          
                          <Button className="flex-1 h-14 bg-[#103173] text-white font-black rounded-2xl shadow-lg shadow-[#103173]/20 hover:bg-[#103B73] transition-all active:scale-95">
                            <QrCode className="h-5 w-5 mr-2" /> GERAR CÓDIGO DE EMBARQUE
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

      {/* --- BARRA DE NAVEGAÇÃO ENTRE PERFIS (DEVELOPER BAR) --- */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#103173] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 z-50 border-2 border-[#F2D022]/30 backdrop-blur-md">
        <div className="flex flex-col border-r border-white/20 pr-4">
          <span className="text-[9px] font-black uppercase text-[#F2D022] tracking-tighter">Modo de Teste</span>
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