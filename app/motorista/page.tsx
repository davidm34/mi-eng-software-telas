"use client";

import { useRouter } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2 } from "lucide-react";

export default function MotoristaPage() {
  const router = useRouter();

  // Exibição simplificada focada apenas no horário
  const viagem = {
    horario: "08:30",
  };

  const handleCheckIn = () => {
    router.push("/motorista/embarque");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#E4F2F1]"> {/* Logo-UEFS-4: Fundo claro */}
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <Card className="w-full max-w-md border-[#73AABF]/30 bg-white shadow-xl"> {/* Logo-UEFS-3 para bordas */}
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-3xl font-bold tracking-tighter text-[#103173]"> {/* Logo-UEFS-1 */}
              Check-in
            </CardTitle>
            <p className="text-[#73AABF] font-medium">
              Motorista, confirme sua presença
            </p>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center gap-10 py-8">
            {/* Bloco de Horário com destaque em Amarelo UEFS */}
            <div className="flex flex-col items-center p-8 rounded-2xl bg-[#F2D022]/10 border-2 border-[#F2D022]">
              <Clock className="w-12 h-12 text-[#103B73] mb-3" /> {/* Logo-UEFS-2 */}
              <span className="text-6xl font-black text-[#103173] tracking-tight">
                {viagem.horario}
              </span>
              <span className="text-sm font-bold text-[#103B73] uppercase tracking-widest mt-2">
                Horário da Viagem
              </span>
            </div>

            {/* Botão Verde de Ação Única */}
            <Button 
              onClick={handleCheckIn} 
              size="lg"
              className="w-full h-24 text-2xl font-black uppercase tracking-tighter bg-green-600 hover:bg-green-700 text-white shadow-lg transition-transform active:scale-95"
            >
              <CheckCircle2 className="mr-4 h-8 w-8" />
              Fazer Check-in
            </Button>
          </CardContent>
        </Card>
      </main>

      <FooterSection />
    </div>
  );
}