"use client";

import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusFront, CircleDot, MapPin, Users, Clock, QrCode, ClipboardList } from "lucide-react";

const DADOS_MOTORISTA = [
  { id: "ROT-9901", dia: "segunda", origem: "Terminal Central", destino: "UEFS - Pórtico", inicio: "06:40", fim: "07:20", inscritos: 42, total: 44, status: "programada" },
];

export default function PaginaMotorista() {
  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1]">
      <Navigation />
      <main className="flex-1 container max-w-6xl py-10 px-4">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-black text-[#103173] flex items-center gap-3">
            <div className="bg-[#F2D022] p-2 rounded-lg"><BusFront className="h-7 w-7 text-[#103173]" /></div>
            Painel do Motorista
          </h1>
          <p className="text-[#73AABF] font-bold">Gerencie suas escalas para hoje.</p>
        </div>

        <Tabs defaultValue="segunda">
          <TabsList className="grid w-full grid-cols-5 bg-[#103B73]/10 p-1 mb-8 rounded-xl h-14">
            <TabsTrigger value="segunda" className="font-bold">Segunda</TabsTrigger>
            {/* Outros dias... */}
          </TabsList>

          <TabsContent value="segunda" className="grid gap-6 md:grid-cols-2">
            {DADOS_MOTORISTA.map((escala) => (
              <Card key={escala.id} className="border-none shadow-xl bg-white overflow-hidden flex">
                <div className="w-2 bg-[#103173]" />
                <div className="flex-1">
                  <CardHeader>
                    <Badge variant="outline" className="text-[#103173] border-[#103173] w-fit">PROGRAMADA</Badge>
                    <CardTitle className="text-lg text-[#103173] mt-2">
                      <div className="flex items-center gap-2"><CircleDot className="h-3 w-3 text-[#F2D022]"/> {escala.origem}</div>
                      <div className="flex items-center gap-2 mt-1"><MapPin className="h-3 w-3 text-[#103173]"/> {escala.destino}</div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div className="bg-[#E4F2F1] p-3 rounded-xl">
                      <p className="text-[10px] font-bold text-[#73AABF] uppercase tracking-widest">Saída</p>
                      <p className="text-lg font-black text-[#103173]">{escala.inicio}</p>
                    </div>
                    <div className="bg-[#E4F2F1] p-3 rounded-xl">
                      <p className="text-[10px] font-bold text-[#73AABF] uppercase tracking-widest">Ocupação</p>
                      <p className="text-lg font-black text-[#103173]">{escala.inscritos}/{escala.total}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="gap-3 bg-slate-50 border-t">
                    <Button variant="outline" className="flex-1 border-2 border-[#103173] text-[#103173] font-bold">LISTA</Button>
                    <Button className="flex-1 bg-[#103173] text-white font-bold">CÓDIGO</Button>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
      <FooterSection />
    </div>
  );
}