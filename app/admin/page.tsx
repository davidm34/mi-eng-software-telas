"use client";

import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, Plus, Bus, Users, AlertTriangle, Settings } from "lucide-react";

export default function PaginaAdmin() {
  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1]">
      <Navigation />
      <main className="flex-1 container max-w-6xl py-10 px-4 space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-[#103173] flex items-center gap-3">
              <div className="bg-[#103173] p-2 rounded-lg"><ShieldCheck className="h-7 w-7 text-[#F2D022]" /></div>
              Administração
            </h1>
          </div>
          <Button className="bg-[#23B99A] text-white font-bold">
            <Plus className="mr-2 h-5 w-5" /> NOVA VIAGEM
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard label="Viagens Hoje" valor="12" icon={Bus} />
          <MetricCard label="Passageiros" valor="482" icon={Users} />
          <MetricCard label="Alertas" valor="2" icon={AlertTriangle} />
        </div>

        <Tabs defaultValue="frota">
          <TabsList className="bg-white border p-1 rounded-2xl h-16 w-full max-w-md">
            <TabsTrigger value="frota" className="flex-1 font-bold">FROTA</TabsTrigger>
            <TabsTrigger value="usuarios" className="flex-1 font-bold">USUÁRIOS</TabsTrigger>
          </TabsList>
          
          <TabsContent value="frota" className="mt-8">
            <Card className="border-none shadow-lg">
              <CardHeader><CardTitle className="text-[#103173]">Ônibus Cadastrados</CardTitle></CardHeader>
              <CardContent>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                  <span className="font-black text-[#103173]">JLS-1020</span>
                  <Badge className="bg-[#23B99A]">Ativo</Badge>
                  <Button variant="ghost"><Settings className="h-4 w-4"/></Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <FooterSection />
    </div>
  );
}

function MetricCard({ label, valor, icon: Icon }: any) {
  return (
    <Card className="border-none shadow-lg bg-white">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-[#73AABF] uppercase">{label}</p>
          <p className="text-3xl font-black text-[#103173]">{valor}</p>
        </div>
        <Icon className="h-10 w-10 text-[#103173] opacity-20" />
      </CardContent>
    </Card>
  );
}