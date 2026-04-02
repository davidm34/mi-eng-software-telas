"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  Hash, 
  Save,
  UserCircle, 
  Bus, 
  ShieldAlert, 
  BadgeCheck,
  CreditCard,
  ArrowLeft,
  LogOut
} from "lucide-react";

export default function PaginaPerfil() {
  const router = useRouter();
  
  // Estado para simular qual perfil está logado ("motorista" ou "passageiro")
  const [tipoUsuario, setTipoUsuario] = useState<"motorista" | "passageiro">("motorista"); 
  
  // Estado para o input editável de telefone
  const [telefone, setTelefone] = useState("(71) 99999-9999");
  const [salvando, setSalvando] = useState(false);

  // Simulação de dados fixos dependendo de quem está "logado"
  const isMotorista = tipoUsuario === "motorista";
  
  const dadosMockados = {
    nome: isMotorista ? "João Silva" : "Maria Oliveira",
    email: isMotorista ? "joao.silva@transporte.com" : "maria.oliveira@aluno.com",
    cpf: isMotorista ? "111.***.***-44" : "555.***.***-88",
    matricula: isMotorista ? "MOT-8472" : "ALU-202493",
  };

  // Atualiza o telefone mockado ao trocar de perfil no menu de testes
  useEffect(() => {
    if (isMotorista) setTelefone("(71) 99999-9999");
    else setTelefone("(71) 98888-8888");
  }, [tipoUsuario, isMotorista]);

  // Simula a requisição de salvar
  const handleSalvar = () => {
    setSalvando(true);
    setTimeout(() => {
      setSalvando(false);
      // Aqui você poderia colocar um toast de sucesso
      alert("Telefone atualizado com sucesso!"); 
    }, 1000);
  };

  // Simula a requisição de logout
  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1] pb-24">
      <Navigation isMotorista={isMotorista} />
      
      <main className="flex-1 w-full max-w-3xl mx-auto py-10 px-4">
        
        {/* Botão de Voltar com o mesmo estilo da Tela de Embarque */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-white py-2 px-4 rounded-full shadow-md text-[#103173] font-black uppercase text-sm hover:opacity-70 transition-all mb-8 w-fit"
        >
          <ArrowLeft className="h-5 w-5" /> Voltar
        </button>

        <header className="mb-10 flex flex-col items-center sm:items-start space-y-3 text-center sm:text-left">
          <h1 className="text-4xl font-black text-[#103173] flex items-center gap-3 tracking-tight">
            <div className="bg-[#F2D022] p-2 rounded-xl shadow-sm">
              <UserCircle className="h-10 w-10 text-[#103173]" />
            </div>
            Meu Perfil
          </h1>
          <p className="text-[#73AABF] font-bold text-lg">
            Gerencie suas informações pessoais e dados de contato.
          </p>
        </header>

        <Card className="border-none shadow-xl bg-white overflow-hidden rounded-3xl">
          <CardHeader className="bg-slate-50 border-b border-slate-100 pb-8 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="h-24 w-24 bg-[#103B73]/10 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                  <User className="h-10 w-10 text-[#103173]" />
                </div>
                <div className="text-center sm:text-left space-y-2">
                  <CardTitle className="text-3xl font-black text-[#103173]">
                    {dadosMockados.nome}
                  </CardTitle>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    <Badge className={`${isMotorista ? 'bg-[#F2D022] text-[#103173]' : 'bg-[#23B99A] text-white'} px-3 py-1 text-xs font-black uppercase tracking-widest`}>
                      <BadgeCheck className="h-4 w-4 mr-1" />
                      {tipoUsuario}
                    </Badge>
                    <Badge variant="outline" className="border-2 border-[#103173] text-[#103173] font-black">
                      <Hash className="h-3 w-3 mr-1" />
                      MATRÍCULA: {dadosMockados.matricula}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Botão de Logout */}
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 font-black rounded-xl h-12 px-6"
              >
                <LogOut className="h-4 w-4 mr-2" /> SAIR DA CONTA
              </Button>

            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* NOME (Bloqueado) */}
              <div className="space-y-2">
                <Label className="text-xs font-black text-[#73AABF] uppercase tracking-widest flex items-center gap-2">
                  <User className="h-4 w-4" /> Nome Completo
                </Label>
                <Input 
                  value={dadosMockados.nome} 
                  disabled 
                  className="h-14 bg-slate-50 border-slate-200 text-[#103173] font-bold disabled:opacity-70"
                />
              </div>

              {/* CPF (Bloqueado) */}
              <div className="space-y-2">
                <Label className="text-xs font-black text-[#73AABF] uppercase tracking-widest flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> CPF
                </Label>
                <Input 
                  value={dadosMockados.cpf} 
                  disabled 
                  className="h-14 bg-slate-50 border-slate-200 text-[#103173] font-bold disabled:opacity-70"
                />
              </div>

              {/* E-MAIL (Bloqueado) */}
              <div className="space-y-2">
                <Label className="text-xs font-black text-[#73AABF] uppercase tracking-widest flex items-center gap-2">
                  <Mail className="h-4 w-4" /> E-mail
                </Label>
                <Input 
                  value={dadosMockados.email} 
                  disabled 
                  className="h-14 bg-slate-50 border-slate-200 text-[#103173] font-bold disabled:opacity-70"
                />
              </div>

              {/* TELEFONE (Editável APENAS para Motorista) */}
              <div className="space-y-2">
                <Label className="text-xs font-black text-[#73AABF] uppercase tracking-widest flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Telefone / WhatsApp
                </Label>
                <Input 
                  value={telefone} 
                  onChange={(e) => setTelefone(e.target.value)}
                  disabled={!isMotorista}
                  className={`h-14 font-bold ${
                    isMotorista 
                    ? "border-2 border-[#103173]/20 focus-visible:ring-[#103173] text-[#103173]" 
                    : "bg-slate-50 border-slate-200 text-[#103173] disabled:opacity-70"
                  }`}
                />
                {!isMotorista && (
                  <p className="text-[10px] text-slate-400 font-bold">
                    Para alterar este dado, entre em contato com a secretaria.
                  </p>
                )}
              </div>

            </div>
          </CardContent>

          {/* O Rodapé do Card (botão de salvar) só aparece se for motorista */}
          {isMotorista && (
            <CardFooter className="bg-slate-50 border-t border-slate-100 p-6 flex justify-end">
              <Button 
                onClick={handleSalvar}
                disabled={salvando}
                className="h-14 px-8 bg-[#103173] hover:bg-[#103B73] text-white font-black rounded-2xl shadow-lg shadow-[#103173]/20 transition-all active:scale-95"
              >
                {salvando ? (
                  <span className="flex items-center gap-2">Aguarde...</span>
                ) : (
                  <span className="flex items-center gap-2"><Save className="h-5 w-5" /> SALVAR ALTERAÇÕES</span>
                )}
              </Button>
            </CardFooter>
          )}
        </Card>
      </main>
      
      <FooterSection />

      {/* FOOTER DE TESTE PARA ALTERNAR PERFIS RAPIDAMENTE */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#103173] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 z-50 border-2 border-[#F2D022]/30 backdrop-blur-md">
        <div className="flex flex-col border-r border-white/20 pr-4 hidden sm:flex">
          <span className="text-[9px] font-black uppercase text-[#F2D022] tracking-tighter">Modo de Teste</span>
          <span className="text-xs font-bold">Alternar Visão</span>
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="ghost" 
            className={`gap-2 font-bold transition-colors ${!isMotorista ? 'bg-[#23B99A] text-white hover:bg-[#23B99A]' : 'hover:bg-white/10 text-white'}`}
            onClick={() => setTipoUsuario("passageiro")}
          >
            <UserCircle className="h-4 w-4" /> Passageiro
          </Button>

          <Button 
            size="sm" 
            variant="ghost" 
            className={`gap-2 font-bold transition-colors ${isMotorista ? 'bg-[#F2D022] text-[#103173] hover:bg-[#F2D022]' : 'hover:bg-white/10 text-white'}`}
            onClick={() => setTipoUsuario("motorista")}
          >
            <Bus className="h-4 w-4" /> Motorista
          </Button>

          {/* Botões de navegação para sair da tela */}
          <div className="w-px h-6 bg-white/20 mx-2 hidden sm:block"></div>
          
          <Button size="sm" variant="ghost" className="hover:bg-red-500 hover:text-white text-white gap-2 font-bold transition-colors hidden sm:flex" onClick={() => router.push("/")}>
             Voltar ao Início
          </Button>
        </div>
      </div>
    </div>
  );
}