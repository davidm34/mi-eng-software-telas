"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LucideIcon } from "lucide-react";
import { FROTA_MOCK, type OnibusFrota, type StatusOnibus } from "@/lib/mock/frota";
import {
  Bus,
  CalendarClock,
  Plus,
  Route,
  Search,
  ShieldAlert,
  Trash2,
  UserCircle,
  UserRound,
  Wrench,
  PencilLine,
} from "lucide-react";

type FiltroStatus = "todos" | StatusOnibus;

export default function PaginaAdmin() {
  const router = useRouter();
  const [frota, setFrota] = useState<OnibusFrota[]>(() =>
    FROTA_MOCK.map((onibus) => ({ ...onibus, rotasVinculadas: [...onibus.rotasVinculadas] })),
  );
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("todos");

  const frotaFiltrada = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return frota.filter((onibus) => {
      const correspondeStatus = filtroStatus === "todos" || onibus.status === filtroStatus;
      const correspondeBusca =
        termo.length === 0 ||
        onibus.placa.toLowerCase().includes(termo) ||
        onibus.modelo.toLowerCase().includes(termo) ||
        onibus.motorista.toLowerCase().includes(termo) ||
        onibus.rotaPrincipal.toLowerCase().includes(termo);

      return correspondeStatus && correspondeBusca;
    });
  }, [frota, busca, filtroStatus]);

  const metricas = useMemo(() => {
    const onibusAtivos = frota.filter((item) => item.status === "ativo").length;
    const emManutencao = frota.filter((item) => item.status === "manutencao").length;
    const viagensHoje = frota
      .filter((item) => item.status === "ativo")
      .reduce((total, item) => total + item.viagensHoje, 0);
    const vagasOperacionais = frota
      .filter((item) => item.status === "ativo")
      .reduce((total, item) => total + item.capacidade, 0);

    return { onibusAtivos, emManutencao, viagensHoje, vagasOperacionais };
  }, [frota]);

  const abrirTelaCadastro = (onibus?: OnibusFrota) => {
    if (!onibus) {
      router.push("/admin/onibus?modo=novo");
      return;
    }

    router.push(`/admin/onibus?id=${onibus.id}`);
  };

  const handleRemover = (onibus: OnibusFrota) => {
    if (onibus.status === "ativo" && onibus.viagensHoje > 0) {
      window.alert(
        `O ônibus ${onibus.placa} está com viagens em andamento/programadas hoje. Realoque as rotas antes de remover.`,
      );
      return;
    }

    const confirmado = window.confirm(`Remover ${onibus.placa} da frota mockada?`);
    if (!confirmado) return;

    setFrota((atual) => atual.filter((item) => item.id !== onibus.id));
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1] pb-24">
      <Navigation />
      <main className="flex-1 container max-w-6xl py-10 px-4 space-y-8">
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-[#103173] flex items-center gap-3 tracking-tight">
              <div className="bg-[#103173] p-2 rounded-xl shadow-lg shadow-[#103173]/20">
                <ShieldAlert className="h-7 w-7 text-[#F2D022]" />
              </div>
              Gestão de Ônibus
            </h1>
            <p className="text-[#73AABF] font-bold text-sm md:text-base">
              Painel de frota administrativa com dados mockados para demonstração.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="h-12 border-2 border-[#73AABF] text-[#103173] font-black hover:bg-[#73AABF]/15 transition-colors"
              onClick={() => router.push("/admin/motoristas")}
            >
              <UserCircle className="h-4 w-4 mr-2" /> GESTÃO DE MOTORISTAS
            </Button>
            <Button
              variant="outline"
              className="h-12 border-2 border-[#103173] text-[#103173] font-black hover:bg-[#103173] hover:text-white transition-colors"
              onClick={() => window.alert("Protótipo: exportar relatório da frota.")}
            >
              EXPORTAR RELATÓRIO
            </Button>
            <Button
              className="h-12 bg-[#23B99A] hover:bg-[#1d957c] text-white font-black shadow-lg shadow-[#23B99A]/20 transition-all active:scale-95"
              onClick={() => abrirTelaCadastro()}
            >
              <Plus className="h-5 w-5 mr-2" /> NOVO ÔNIBUS
            </Button>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Ônibus Ativos"
            valor={metricas.onibusAtivos.toString()}
            destaque="Em operação hoje"
            icon={Bus}
          />
          <MetricCard
            label="Em Manutenção"
            valor={metricas.emManutencao.toString()}
            destaque="Preventiva/corretiva"
            icon={Wrench}
          />
          <MetricCard
            label="Viagens Hoje"
            valor={metricas.viagensHoje.toString()}
            destaque="Escalas atribuídas"
            icon={Route}
          />
          <MetricCard
            label="Vagas Operacionais"
            valor={metricas.vagasOperacionais.toString()}
            destaque="Capacidade disponível"
            icon={UserRound}
          />
        </section>

        <Card className="border-none shadow-xl bg-white">
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="text-[#103173] font-black text-xl">Frota Cadastrada</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#73AABF]" />
                <Input
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                  placeholder="Buscar por placa, modelo, motorista ou rota..."
                  className="pl-11 h-12 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173] rounded-xl"
                />
              </div>
              <p className="text-xs font-black uppercase tracking-wider text-[#73AABF]">
                {frotaFiltrada.length} ônibus exibidos
              </p>
            </div>

            <Tabs value={filtroStatus} onValueChange={(value) => setFiltroStatus(value as FiltroStatus)}>
              <TabsList className="grid w-full grid-cols-4 bg-[#103173]/10 p-1 rounded-2xl h-14">
                <TabsTrigger value="todos" className="font-black uppercase text-[11px]">
                  Todos
                </TabsTrigger>
                <TabsTrigger value="ativo" className="font-black uppercase text-[11px]">
                  Ativos
                </TabsTrigger>
                <TabsTrigger value="manutencao" className="font-black uppercase text-[11px]">
                  Manutenção
                </TabsTrigger>
                <TabsTrigger value="inativo" className="font-black uppercase text-[11px]">
                  Inativos
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <section className="space-y-5">
          {frotaFiltrada.length === 0 ? (
            <Card className="border-none shadow-lg bg-white">
              <CardContent className="py-16 flex flex-col items-center justify-center gap-4 text-center">
                <div className="bg-[#103173]/10 p-4 rounded-2xl">
                  <Search className="h-8 w-8 text-[#103173]" />
                </div>
                <p className="text-lg font-black text-[#103173]">Nenhum ônibus encontrado</p>
                <p className="text-sm font-bold text-[#73AABF]">
                  Ajuste os filtros ou cadastre um novo ônibus para esta demonstração.
                </p>
              </CardContent>
            </Card>
          ) : (
            frotaFiltrada.map((onibus) => {
              const statusInfo = getStatusInfo(onibus.status);
              const barraOcupacaoCor =
                onibus.status === "ativo"
                  ? "bg-[#103173]"
                  : onibus.status === "manutencao"
                    ? "bg-orange-500"
                    : "bg-slate-300";

              return (
                <Card key={onibus.id} className="border-none shadow-lg bg-white overflow-hidden">
                  <CardHeader className="px-6 py-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl ${
                          onibus.status === "ativo"
                            ? "bg-[#E4F2F1]"
                            : onibus.status === "manutencao"
                              ? "bg-orange-100"
                              : "bg-slate-100"
                        }`}
                      >
                        <Bus
                          className={`h-6 w-6 ${
                            onibus.status === "ativo"
                              ? "text-[#103173]"
                              : onibus.status === "manutencao"
                                ? "text-orange-600"
                                : "text-slate-400"
                          }`}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-black text-[#103173] tracking-tight">
                          {onibus.placa}
                        </CardTitle>
                        <p className="text-sm font-bold text-[#73AABF]">
                          {onibus.modelo} • {onibus.ano}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
                      {onibus.codigoEmbarqueAtivo ? (
                        <Badge className="bg-[#103173] text-white font-bold">
                          CÓDIGO {onibus.codigoEmbarqueAtivo}
                        </Badge>
                      ) : null}
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <InfoBloco
                      titulo="Motorista"
                      valor={onibus.motorista}
                      icone={UserCircle}
                    />
                    <InfoBloco
                      titulo="Rota Principal"
                      valor={onibus.rotaPrincipal}
                      icone={Route}
                    />
                    <InfoBloco
                      titulo="Viagens Hoje"
                      valor={onibus.viagensHoje.toString()}
                      icone={CalendarClock}
                    />
                    <InfoBloco
                      titulo="Última Manutenção"
                      valor={onibus.ultimaManutencao}
                      icone={Wrench}
                    />

                    <div className="md:col-span-2 xl:col-span-4 bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <p className="text-[11px] font-black uppercase tracking-widest text-[#73AABF]">
                          Ocupação Média
                        </p>
                        <p className="text-sm font-black text-[#103173]">
                          {onibus.ocupacaoMedia}% • {onibus.capacidade} lugares
                        </p>
                      </div>

                      <div className="w-full h-3 rounded-full bg-white border border-slate-200 overflow-hidden">
                        <div
                          className={`h-full ${barraOcupacaoCor} transition-all`}
                          style={{ width: `${onibus.ocupacaoMedia}%` }}
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {onibus.rotasVinculadas.map((rota) => (
                          <Badge
                            key={`${onibus.id}-${rota}`}
                            variant="outline"
                            className="font-bold text-[#103173] border-[#103173]/20 bg-white"
                          >
                            {rota}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 h-11 border-2 border-[#103173] text-[#103173] font-black hover:bg-[#103173] hover:text-white"
                      onClick={() =>
                        window.alert(`Protótipo: abrir escalas vinculadas ao ônibus ${onibus.placa}.`)
                      }
                    >
                      <Route className="h-4 w-4 mr-2" />
                      VER ESCALAS
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 h-11 border-2 border-[#73AABF] text-[#103173] font-black hover:bg-[#73AABF]/15"
                      onClick={() => abrirTelaCadastro(onibus)}
                    >
                      <PencilLine className="h-4 w-4 mr-2" />
                      EDITAR
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-11 text-red-600 font-black hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleRemover(onibus)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      REMOVER
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          )}
        </section>
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

function getStatusInfo(status: StatusOnibus) {
  if (status === "ativo") {
    return {
      label: "ATIVO",
      className: "bg-[#23B99A] text-white font-bold",
    };
  }

  if (status === "manutencao") {
    return {
      label: "MANUTENÇÃO",
      className: "bg-orange-500 text-white font-bold",
    };
  }

  return {
    label: "INATIVO",
    className: "bg-slate-400 text-white font-bold",
  };
}

interface MetricCardProps {
  label: string;
  valor: string;
  destaque: string;
  icon: LucideIcon;
}

function MetricCard({ label, valor, destaque, icon: Icon }: MetricCardProps) {
  return (
    <Card className="border-none shadow-lg bg-white overflow-hidden group">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-[#73AABF] uppercase tracking-widest">{label}</p>
          <p className="text-3xl font-black text-[#103173]">{valor}</p>
          <p className="text-[11px] font-bold text-[#73AABF] mt-1">{destaque}</p>
        </div>
        <div className="bg-[#103173]/5 p-3 rounded-2xl group-hover:bg-[#F2D022]/20 transition-colors">
          <Icon className="h-8 w-8 text-[#103173]" />
        </div>
      </CardContent>
    </Card>
  );
}

interface InfoBlocoProps {
  titulo: string;
  valor: string;
  icone: LucideIcon;
}

function InfoBloco({ titulo, valor, icone: Icon }: InfoBlocoProps) {
  return (
    <div className="bg-[#E4F2F1] border border-[#103173]/10 rounded-2xl p-4 space-y-2">
      <div className="flex items-center gap-2 text-[#73AABF]">
        <Icon className="h-4 w-4" />
        <p className="text-[10px] font-black uppercase tracking-widest">{titulo}</p>
      </div>
      <p className="text-base font-black text-[#103173] leading-tight">{valor}</p>
    </div>
  );
}
