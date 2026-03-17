"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Scan, Keyboard, CheckCircle2 } from "lucide-react";

export default function ValidarCodigoPassageiro() {
  const router = useRouter();
  const [codigoDigitado, setCodigoDigitado] = useState("");

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1] items-center justify-center p-4">
      {/* Botão de Voltar */}
      <button 
        onClick={() => router.back()}
        className="absolute top-8 left-6 flex items-center gap-2 text-[#103173] font-black uppercase text-sm hover:opacity-70 transition-all"
      >
        <ArrowLeft className="h-5 w-5" /> Voltar
      </button>

      <Card className="w-full max-w-md border-none shadow-2xl bg-white overflow-hidden rounded-[40px]">
        <CardHeader className="bg-[#103173] text-white text-center py-10">
          <CardTitle className="text-3xl font-black uppercase tracking-tighter">
            Validar Embarque
          </CardTitle>
          <div className="mt-2 space-y-1">
            <p className="text-[#F2D022] text-sm font-black tracking-widest uppercase">Escaneie o QR Code</p>
            <p className="text-[#73AABF] text-[10px] font-bold uppercase tracking-wider">
              Aponte a câmera para o celular do motorista
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col items-center p-8">
          
          {/* MOLDURA DE SCAN (Simulando Câmera) */}
          <div className="relative mb-8 group">
            {/* Cantos da Moldura */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-[#F2D022] rounded-tl-lg" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-[#F2D022] rounded-tr-lg" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-[#F2D022] rounded-bl-lg" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-[#F2D022] rounded-br-lg" />
            
            <div className="bg-slate-900 w-64 h-64 flex flex-col items-center justify-center rounded-3xl overflow-hidden relative shadow-inner">
               {/* Linha de Scanner Animada (Simulada) */}
               <div className="absolute top-0 w-full h-1 bg-[#F2D022]/50 shadow-[0_0_15px_#F2D022] animate-bounce mt-10" />
               
               <Scan className="h-20 w-20 text-white/20" />
               <p className="text-white/40 text-[10px] font-bold mt-4 uppercase">Câmera Ativa</p>
            </div>
          </div>

          {/* DIVISOR OU CÓDIGO MANUAL */}
          <div className="w-full space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-[10px] font-black text-[#73AABF] uppercase tracking-widest">Ou digite o código</span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            <div className="relative">
              <Keyboard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#73AABF]" />
              <Input 
                placeholder="EX: UEFS-7729-X"
                value={codigoDigitado}
                onChange={(e) => setCodigoDigitado(e.target.value.toUpperCase())}
                className="h-14 pl-12 rounded-2xl border-2 border-slate-100 focus:border-[#103173] font-bold text-[#103173] placeholder:text-slate-300 transition-all"
              />
            </div>

            <Button 
              disabled={!codigoDigitado}
              className={`w-full h-14 rounded-2xl font-black transition-all shadow-lg ${
                codigoDigitado 
                ? "bg-[#23B99A] hover:bg-[#1d9e83] text-white" 
                : "bg-slate-100 text-slate-400"
              }`}
            >
              <CheckCircle2 className="mr-2 h-5 w-5" /> CONFIRMAR EMBARQUE
            </Button>
          </div>

          <p className="pt-8 text-[10px] text-[#73AABF] font-bold leading-relaxed text-center max-w-[250px]">
            Problemas na validação? Peça ao motorista para verificar sua inscrição na lista.
          </p>
        </CardContent>
      </Card>
      
      <div className="mt-8 flex items-center gap-2 opacity-40">
        <div className="h-1 w-1 bg-[#103173] rounded-full" />
        <p className="text-[#103173] font-black text-[10px] uppercase tracking-widest text-center">
          Validação segura via Roteiro SIT
        </p>
        <div className="h-1 w-1 bg-[#103173] rounded-full" />
      </div>
    </div>
  );
}