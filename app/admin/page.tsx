"use client";

import { useRouter } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShieldAlert, 
  Plus, 
  Bus, 
  Users, 
  AlertTriangle, 
  Settings,
  UserCircle 
} from "lucide-react";

export default function PaginaAdmin() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1] pb-24">
      <Navigation />
      <main className="flex-1 container max-w-6xl py-10 px-4 space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-[#103173] flex items-center gap-3">
              <div className="bg-[#103173] p-2 rounded-lg">
                <ShieldAlert className="h-7 w-7 text-[#F2D022]" />
              </div>
              Administração
            </h1>
            <p className="text-[#73AABF] font-bold italic text-sm">Painel Gestor UEFS</p>
          </div>
          <Button className="bg-[#23B99A] hover:bg-[#1a8a73] text-white font-black h-12 shadow-lg transition-all active:scale-95">
            <Plus className="mr-2 h-5 w-5" /> NOVA VIAGEM
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard label="Viagens Hoje" valor="12" icon={Bus} />
          <MetricCard label="Passageiros" valor="482" icon={Users} />
          <MetricCard label="Alertas" valor="2" icon={AlertTriangle} />
        </div>

        <Tabs defaultValue="frota">
          <TabsList className="bg-white border p-1 rounded-2xl h-16 w-full max-w-md shadow-sm">
            <TabsTrigger value="frota" className="flex-1 font-black uppercase text-xs">Gestão de Frota</TabsTrigger>
            <TabsTrigger value="usuarios" className="flex-1 font-black uppercase text-xs">Usuários</TabsTrigger>
          </TabsList>
          
          <TabsContent value="frota" className="mt-8">
            <Card className="border-none shadow-xl bg-white overflow-hidden">
              <CardHeader className="border-b border-slate-50"><CardTitle className="text-[#103173] font-black">Ônibus Cadastrados</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="flex justify-between items-center p-6 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#E4F2F1] p-3 rounded-xl"><Bus className="h-5 w-5 text-[#103173]"/></div>
                    <div>
                      <span className="font-black text-[#103173] block">JLS-1020</span>
                      <span className="text-xs font-bold text-[#73AABF]">Marcopolo Torino</span>
                    </div>
                  </div>
                  <Badge className="bg-[#23B99A] font-bold">ATIVO</Badge>
                  <Button variant="ghost" size="icon"><Settings className="h-4 w-4 text-[#73AABF]"/></Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <FooterSection />

      {/* --- BARRA DE NAVEGAÇÃO ENTRE PERFIS --- */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#103173] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 z-50 border-2 border-[#F2D022]/30 backdrop-blur-md">
        <div className="flex flex-col border-r border-white/20 pr-4">
          <span className="text-[9px] font-black uppercase text-[#F2D022] tracking-tighter">Modo de Teste</span>
          <span className="text-xs font-bold">Alternar Perfil</span>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" className="hover:bg-white/10 text-white gap-2 font-bold" onClick={() => router.push("/passageiro")}>
            <UserCircle className="h-4 w-4" /> Passageiro
          </Button>
          <Button size="sm" variant="ghost" className="hover:bg-[#F2D022] hover:text-[#103173] text-white gap-2 font-bold transition-colors" onClick={() => router.push("/motorista")}>
            <Bus className="h-4 w-4" /> Motorista
          </Button>
          <Button size="sm" variant="ghost" className="bg-red-500 text-white gap-2 font-bold transition-colors shadow-lg shadow-red-500/20" onClick={() => router.push("/admin")}>
            <ShieldAlert className="h-4 w-4" /> Admin
          </Button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, valor, icon: Icon }: any) {
  return (
    <Card className="border-none shadow-lg bg-white overflow-hidden group">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-[#73AABF] uppercase tracking-widest">{label}</p>
          <p className="text-3xl font-black text-[#103173]">{valor}</p>
        </div>
        <div className="bg-[#103173]/5 p-3 rounded-2xl group-hover:bg-[#F2D022]/20 transition-colors">
          <Icon className="h-8 w-8 text-[#103173]" />
        </div>
      </CardContent>
    </Card>
  );
}