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
import {
  AlertTriangle,
  Bus,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock3,
  MapPin,
  PencilLine,
  Plus,
  Route,
  Search,
  ShieldAlert,
  Trash2,
  UserCircle,
  UserRound,
  XCircle,
} from "lucide-react";
import { VIAGENS_GESTAO_MOCK, type StatusViagem, type ViagemMock } from "@/lib/mock/viagens";

type FiltroStatusViagem = "todas" | StatusViagem;

function getStatusInfo(status: StatusViagem) {
  if (status === "programada") {
    return {
      label: "PROGRAMADA",
      className: "bg-[#103173] text-white font-bold",
    };
  }

  if (status === "em_andamento") {
    return {
      label: "EM ANDAMENTO",
      className: "bg-[#23B99A] text-white font-bold",
    };
  }

  if (status === "concluida") {
    return {
      label: "CONCLUÍDA",
      className: "bg-[#73AABF] text-white font-bold",
    };
  }

  return {
    label: "CANCELADA",
    className: "bg-red-500 text-white font-bold",
  };
}

export default function GestaoViagensPage() {
  const router = useRouter();
  const [viagens, setViagens] = useState<ViagemMock[]>(() =>
    VIAGENS_GESTAO_MOCK.map((item) => ({ ...item })),
  );
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatusViagem>("todas");

  const viagensFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return viagens.filter((viagem) => {
      const correspondeStatus = filtroStatus === "todas" || viagem.status === filtroStatus;
      const correspondeBusca =
        termo.length === 0 ||
        viagem.id.toLowerCase().includes(termo) ||
        viagem.rotaCodigo.toLowerCase().includes(termo) ||
        viagem.origem.toLowerCase().includes(termo) ||
        viagem.destino.toLowerCase().includes(termo) ||
        viagem.onibusPlaca.toLowerCase().includes(termo) ||
        viagem.motoristaNome.toLowerCase().includes(termo);

      return correspondeStatus && correspondeBusca;
    });
  }, [viagens, busca, filtroStatus]);

  const metricas = useMemo(() => {
    const total = viagens.length;
    const programadas = viagens.filter((item) => item.status === "programada").length;
    const emAndamento = viagens.filter((item) => item.status === "em_andamento").length;
    const ocupacaoMedia =
      total === 0
        ? 0
        : viagens.reduce((acc, item) => acc + (item.inscritos / item.capacidade) * 100, 0) / total;
    const alertas = viagens.filter(
      (item) =>
        item.status === "cancelada" ||
        (item.status === "programada" && item.inscritos < item.quorumMinimo),
    ).length;

    return { total, programadas, emAndamento, ocupacaoMedia, alertas };
  }, [viagens]);

  const abrirCadastro = (viagem?: ViagemMock) => {
    if (!viagem) {
      router.push("/admin/viagens/cadastro?modo=novo");
      return;
    }

    router.push(`/admin/viagens/cadastro?id=${viagem.id}`);
  };

  const handleCancelarOuRemover = (viagem: ViagemMock) => {
    if (viagem.status === "em_andamento") {
      window.alert(`A viagem ${viagem.id} está em andamento e não pode ser cancelada agora.`);
      return;
    }

    if (viagem.status === "cancelada") {
      const confirmarRemocao = window.confirm(`Remover ${viagem.id} da listagem mockada?`);
      if (!confirmarRemocao) return;

      setViagens((atual) => atual.filter((item) => item.id !== viagem.id));
      return;
    }

    const confirmarCancelamento = window.confirm(`Cancelar a viagem ${viagem.id} no protótipo?`);
    if (!confirmarCancelamento) return;

    setViagens((atual) =>
      atual.map((item) =>
        item.id === viagem.id
          ? {
              ...item,
              status: "cancelada",
              ultimaAtualizacao: "Agora",
            }
          : item,
      ),
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1] pb-24">
      <Navigation />

      <main className="flex-1 w-full max-w-6xl mx-auto py-10 px-4 space-y-8">
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-[#103173] flex items-center gap-3 tracking-tight">
              <div className="bg-[#103173] p-2 rounded-xl shadow-lg shadow-[#103173]/20">
                <Route className="h-7 w-7 text-[#F2D022]" />
              </div>
              Gestão de Viagens
            </h1>
            <p className="text-[#73AABF] font-bold text-sm md:text-base">
              Controle administrativo das rotas, alocação operacional e status de execução.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="h-12 border-2 border-[#103173] text-[#103173] font-black hover:bg-[#103173] hover:text-white transition-colors"
              onClick={() => router.push("/admin")}
            >
              <Bus className="h-4 w-4 mr-2" /> GESTÃO DE ÔNIBUS
            </Button>
            <Button
              variant="outline"
              className="h-12 border-2 border-[#73AABF] text-[#103173] font-black hover:bg-[#73AABF]/15 transition-colors"
              onClick={() => router.push("/admin/motoristas")}
            >
              <UserRound className="h-4 w-4 mr-2" /> GESTÃO DE MOTORISTAS
            </Button>
            <Button
              className="h-12 bg-[#23B99A] hover:bg-[#1d957c] text-white font-black shadow-lg shadow-[#23B99A]/20 transition-all active:scale-95"
              onClick={() => abrirCadastro()}
            >
              <Plus className="h-5 w-5 mr-2" /> NOVA VIAGEM
            </Button>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard label="Viagens Hoje" valor={metricas.total.toString()} destaque="Total do calendário" icon={Route} />
          <MetricCard
            label="Programadas"
            valor={metricas.programadas.toString()}
            destaque="Aguardando execução"
            icon={CalendarClock}
          />
          <MetricCard
            label="Em Andamento"
            valor={metricas.emAndamento.toString()}
            destaque="Operação ativa"
            icon={Clock3}
          />
          <MetricCard
            label="Ocupação Média"
            valor={`${metricas.ocupacaoMedia.toFixed(0)}%`}
            destaque="Capacidade utilizada"
            icon={UserRound}
          />
          <MetricCard
            label="Alertas"
            valor={metricas.alertas.toString()}
            destaque="Quórum/cancelamentos"
            icon={AlertTriangle}
          />
        </section>

        <Card className="border-none shadow-xl bg-white">
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="text-[#103173] font-black text-xl">Rotas em Gestão</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#73AABF]" />
                <Input
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                  placeholder="Buscar por código, rota, motorista, ônibus, origem ou destino..."
                  className="pl-11 h-12 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173] rounded-xl"
                />
              </div>
              <p className="text-xs font-black uppercase tracking-wider text-[#73AABF]">
                {viagensFiltradas.length} viagens exibidas
              </p>
            </div>

            <Tabs
              value={filtroStatus}
              onValueChange={(value) => setFiltroStatus(value as FiltroStatusViagem)}
            >
              <TabsList className="grid w-full grid-cols-5 bg-[#103173]/10 p-1 rounded-2xl h-14">
                <TabsTrigger value="todas" className="font-black uppercase text-[11px]">
                  Todas
                </TabsTrigger>
                <TabsTrigger value="programada" className="font-black uppercase text-[11px]">
                  Programadas
                </TabsTrigger>
                <TabsTrigger value="em_andamento" className="font-black uppercase text-[11px]">
                  Em Andamento
                </TabsTrigger>
                <TabsTrigger value="concluida" className="font-black uppercase text-[11px]">
                  Concluídas
                </TabsTrigger>
                <TabsTrigger value="cancelada" className="font-black uppercase text-[11px]">
                  Canceladas
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <section className="space-y-5">
          {viagensFiltradas.length === 0 ? (
            <Card className="border-none shadow-lg bg-white">
              <CardContent className="py-16 flex flex-col items-center justify-center gap-4 text-center">
                <div className="bg-[#103173]/10 p-4 rounded-2xl">
                  <Search className="h-8 w-8 text-[#103173]" />
                </div>
                <p className="text-lg font-black text-[#103173]">Nenhuma viagem encontrada</p>
                <p className="text-sm font-bold text-[#73AABF]">
                  Ajuste os filtros ou cadastre uma nova viagem para demonstração.
                </p>
              </CardContent>
            </Card>
          ) : (
            viagensFiltradas.map((viagem) => {
              const statusInfo = getStatusInfo(viagem.status);
              const ocupacaoPercentual = Math.round((viagem.inscritos / viagem.capacidade) * 100);
              const quorumAtingido = viagem.inscritos >= viagem.quorumMinimo;

              return (
                <Card key={viagem.id} className="border-none shadow-lg bg-white overflow-hidden">
                  <CardHeader className="px-6 py-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap gap-2 items-center">
                        <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
                        <Badge
                          variant="outline"
                          className="font-bold text-[#103173] border-[#103173]/20 bg-white"
                        >
                          {viagem.id}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="font-bold text-[#103173] border-[#103173]/20 bg-white"
                        >
                          {viagem.rotaCodigo}
                        </Badge>
                        {viagem.codigoCheckin ? (
                          <Badge className="bg-[#103173] text-white font-bold">
                            CHECK-IN {viagem.codigoCheckin}
                          </Badge>
                        ) : null}
                      </div>
                      <CardTitle className="text-2xl font-black text-[#103173] tracking-tight flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-[#103173]" />
                        {viagem.origem}
                        <span className="text-[#73AABF]">→</span>
                        {viagem.destino}
                      </CardTitle>
                    </div>
                    <p className="text-xs font-black uppercase tracking-wider text-[#73AABF]">
                      Atualização {viagem.ultimaAtualizacao}
                    </p>
                  </CardHeader>

                  <CardContent className="p-6 grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <InfoBloco titulo="Data" valor={`${viagem.diaSemana}, ${viagem.data}`} icone={CalendarClock} />
                    <InfoBloco titulo="Horário" valor={`${viagem.horarioSaida} - ${viagem.horarioChegada}`} icone={Clock3} />
                    <InfoBloco titulo="Ônibus" valor={viagem.onibusPlaca} icone={Bus} />
                    <InfoBloco titulo="Motorista" valor={viagem.motoristaNome} icone={UserCircle} />

                    <div className="md:col-span-2 xl:col-span-4 bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#73AABF]">
                            Ocupação
                          </p>
                          <p className="text-xl font-black text-[#103173]">
                            {viagem.inscritos}/{viagem.capacidade}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#73AABF]">
                            Quórum Mínimo
                          </p>
                          <p className={`text-xl font-black ${quorumAtingido ? "text-[#23B99A]" : "text-orange-500"}`}>
                            {viagem.quorumMinimo}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#73AABF]">
                            Status de Quórum
                          </p>
                          <p className={`text-sm font-black ${quorumAtingido ? "text-[#23B99A]" : "text-orange-500"}`}>
                            {quorumAtingido ? "ATINGIDO" : "AGUARDANDO"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-black text-[#103173] uppercase tracking-tighter">
                          <span>Ocupação da Viagem</span>
                          <span>{ocupacaoPercentual}%</span>
                        </div>
                        <div className="w-full bg-white h-3 rounded-full overflow-hidden border border-slate-200">
                          <div
                            className={`h-full transition-all ${
                              viagem.status === "cancelada"
                                ? "bg-slate-300"
                                : quorumAtingido
                                  ? "bg-[#103173]"
                                  : "bg-orange-400"
                            }`}
                            style={{ width: `${Math.max(0, Math.min(100, ocupacaoPercentual))}%` }}
                          />
                        </div>
                      </div>

                      <p className="text-xs font-bold text-[#103173]">{viagem.observacoes}</p>
                    </div>
                  </CardContent>

                  {!quorumAtingido && viagem.status === "programada" ? (
                    <div className="mx-6 mb-4 bg-orange-50 border border-orange-100 rounded-xl px-4 py-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="text-[11px] font-black uppercase tracking-wide text-orange-700">
                        Viagem sujeita a cancelamento automático por quórum insuficiente.
                      </span>
                    </div>
                  ) : null}

                  <CardFooter className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 h-11 border-2 border-[#103173] text-[#103173] font-black hover:bg-[#103173] hover:text-white"
                      onClick={() =>
                        window.alert(`Protótipo: abrir lista de passageiros da viagem ${viagem.id}.`)
                      }
                    >
                      <ClipboardList className="h-4 w-4 mr-2" />
                      PASSAGEIROS
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 h-11 border-2 border-[#73AABF] text-[#103173] font-black hover:bg-[#73AABF]/15"
                      onClick={() => abrirCadastro(viagem)}
                    >
                      <PencilLine className="h-4 w-4 mr-2" />
                      EDITAR
                    </Button>
                    <Button
                      variant="outline"
                      className="h-11 border-[#103173]/20 text-[#103173] font-black hover:bg-[#103173]/10"
                      onClick={() =>
                        window.alert(`Protótipo: abrir detalhes da viagem ${viagem.id}.`)
                      }
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      DETALHES
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-11 text-red-600 font-black hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleCancelarOuRemover(viagem)}
                    >
                      {viagem.status === "cancelada" ? (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          REMOVER
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 mr-2" />
                          CANCELAR
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          )}
        </section>
      </main>

      <FooterSection />

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
            className="hover:bg-[#F2D022] hover:text-[#103173] text-white gap-2 font-bold transition-colors"
            onClick={() => router.push("/motorista")}
          >
            <Bus className="h-4 w-4" /> Motorista
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="bg-red-500 text-white gap-2 font-bold transition-colors shadow-lg shadow-red-500/20"
            onClick={() => router.push("/admin")}
          >
            <ShieldAlert className="h-4 w-4" /> Admin
          </Button>
        </div>
      </div>
    </div>
  );
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
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-[#73AABF] uppercase tracking-widest">{label}</p>
          <p className="text-3xl font-black text-[#103173]">{valor}</p>
          <p className="text-[11px] font-bold text-[#73AABF] mt-1">{destaque}</p>
        </div>
        <div className="bg-[#103173]/5 p-3 rounded-2xl group-hover:bg-[#F2D022]/20 transition-colors">
          <Icon className="h-7 w-7 text-[#103173]" />
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
