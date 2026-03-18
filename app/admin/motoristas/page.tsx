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
  IdCard,
  PencilLine,
  Plus,
  Route,
  Search,
  ShieldAlert,
  Star,
  Trash2,
  UserCircle,
  UserRound,
  UserX,
} from "lucide-react";
import { MOTORISTAS_GESTAO_MOCK, type MotoristaMock, type StatusMotorista } from "@/lib/mock/motoristas";

type FiltroStatusMotorista = "todos" | StatusMotorista;

function getStatusInfo(status: StatusMotorista) {
  if (status === "em_rota") {
    return {
      label: "EM ROTA",
      className: "bg-[#23B99A] text-white font-bold",
    };
  }

  if (status === "disponivel") {
    return {
      label: "DISPONÍVEL",
      className: "bg-[#103173] text-white font-bold",
    };
  }

  if (status === "ferias") {
    return {
      label: "FÉRIAS",
      className: "bg-[#73AABF] text-white font-bold",
    };
  }

  return {
    label: "AFASTADO",
    className: "bg-red-500 text-white font-bold",
  };
}

function getProximoStatus(status: StatusMotorista): StatusMotorista {
  if (status === "em_rota") return "disponivel";
  if (status === "disponivel") return "afastado";
  return "disponivel";
}

export default function GestaoMotoristasPage() {
  const router = useRouter();
  const [motoristas, setMotoristas] = useState<MotoristaMock[]>(() =>
    MOTORISTAS_GESTAO_MOCK.map((item) => ({
      ...item,
      rotasVinculadas: [...item.rotasVinculadas],
    })),
  );
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatusMotorista>("todos");

  const motoristasFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return motoristas.filter((motorista) => {
      const correspondeStatus = filtroStatus === "todos" || motorista.status === filtroStatus;
      const correspondeBusca =
        termo.length === 0 ||
        motorista.nome.toLowerCase().includes(termo) ||
        motorista.matricula.toLowerCase().includes(termo) ||
        motorista.onibusAtual.toLowerCase().includes(termo) ||
        motorista.rotasVinculadas.join(" ").toLowerCase().includes(termo);

      return correspondeStatus && correspondeBusca;
    });
  }, [motoristas, busca, filtroStatus]);

  const metricas = useMemo(() => {
    const totalMotoristas = motoristas.length;
    const emRota = motoristas.filter((item) => item.status === "em_rota").length;
    const disponiveis = motoristas.filter((item) => item.status === "disponivel").length;
    const comPendencia = motoristas.filter(
      (item) => item.status === "afastado" || item.penalidadesAtivas > 0,
    ).length;
    const mediaAvaliacao = motoristas.reduce((acc, item) => acc + item.avaliacaoMedia, 0) / totalMotoristas;

    return {
      totalMotoristas,
      emRota,
      disponiveis,
      comPendencia,
      mediaAvaliacao,
    };
  }, [motoristas]);

  const handleRemover = (motorista: MotoristaMock) => {
    if (motorista.status === "em_rota") {
      window.alert(
        `O motorista ${motorista.nome} está em rota neste momento. Finalize a viagem antes de remover.`,
      );
      return;
    }

    const confirmar = window.confirm(`Remover ${motorista.nome} da base mockada de motoristas?`);
    if (!confirmar) return;

    setMotoristas((atual) => atual.filter((item) => item.id !== motorista.id));
  };

  const handleAlterarStatus = (motorista: MotoristaMock) => {
    const proximoStatus = getProximoStatus(motorista.status);
    const descricao =
      proximoStatus === "disponivel"
        ? "DISPONÍVEL"
        : proximoStatus === "afastado"
          ? "AFASTADO"
          : "EM ROTA";

    const confirmar = window.confirm(
      `Alterar status de ${motorista.nome} para ${descricao} no protótipo?`,
    );
    if (!confirmar) return;

    setMotoristas((atual) =>
      atual.map((item) =>
        item.id === motorista.id
          ? {
              ...item,
              status: proximoStatus,
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
                <UserRound className="h-7 w-7 text-[#F2D022]" />
              </div>
              Gestão de Motoristas
            </h1>
            <p className="text-[#73AABF] font-bold text-sm md:text-base">
              Administração de condutores, disponibilidade e vínculos operacionais da frota.
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
              className="h-12 border-2 border-[#103173]/30 text-[#103173] font-black hover:bg-[#103173]/10 transition-colors"
              onClick={() => router.push("/admin/viagens")}
            >
              <Route className="h-4 w-4 mr-2" /> GESTÃO DE VIAGENS
            </Button>
            <Button
              className="h-12 bg-[#23B99A] hover:bg-[#1d957c] text-white font-black shadow-lg shadow-[#23B99A]/20 transition-all active:scale-95"
              onClick={() => router.push("/admin/motoristas/cadastro?modo=novo")}
            >
              <Plus className="h-5 w-5 mr-2" /> NOVO MOTORISTA
            </Button>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard
            label="Total"
            valor={metricas.totalMotoristas.toString()}
            destaque="Motoristas cadastrados"
            icon={UserRound}
          />
          <MetricCard label="Em Rota" valor={metricas.emRota.toString()} destaque="Operação ativa" icon={Route} />
          <MetricCard
            label="Disponíveis"
            valor={metricas.disponiveis.toString()}
            destaque="Prontos para escala"
            icon={CalendarClock}
          />
          <MetricCard
            label="Pendências"
            valor={metricas.comPendencia.toString()}
            destaque="Afastados/penalizados"
            icon={AlertTriangle}
          />
          <MetricCard
            label="Avaliação"
            valor={metricas.mediaAvaliacao.toFixed(1)}
            destaque="Média mensal"
            icon={Star}
          />
        </section>

        <Card className="border-none shadow-xl bg-white">
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="text-[#103173] font-black text-xl">Equipe de Motoristas</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#73AABF]" />
                <Input
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                  placeholder="Buscar por nome, matrícula, ônibus ou rota..."
                  className="pl-11 h-12 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173] rounded-xl"
                />
              </div>
              <p className="text-xs font-black uppercase tracking-wider text-[#73AABF]">
                {motoristasFiltrados.length} motoristas exibidos
              </p>
            </div>

            <Tabs
              value={filtroStatus}
              onValueChange={(value) => setFiltroStatus(value as FiltroStatusMotorista)}
            >
              <TabsList className="grid w-full grid-cols-5 bg-[#103173]/10 p-1 rounded-2xl h-14">
                <TabsTrigger value="todos" className="font-black uppercase text-[11px]">
                  Todos
                </TabsTrigger>
                <TabsTrigger value="em_rota" className="font-black uppercase text-[11px]">
                  Em Rota
                </TabsTrigger>
                <TabsTrigger value="disponivel" className="font-black uppercase text-[11px]">
                  Disponível
                </TabsTrigger>
                <TabsTrigger value="ferias" className="font-black uppercase text-[11px]">
                  Férias
                </TabsTrigger>
                <TabsTrigger value="afastado" className="font-black uppercase text-[11px]">
                  Afastado
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <section className="space-y-5">
          {motoristasFiltrados.length === 0 ? (
            <Card className="border-none shadow-lg bg-white">
              <CardContent className="py-16 flex flex-col items-center justify-center gap-4 text-center">
                <div className="bg-[#103173]/10 p-4 rounded-2xl">
                  <Search className="h-8 w-8 text-[#103173]" />
                </div>
                <p className="text-lg font-black text-[#103173]">Nenhum motorista encontrado</p>
                <p className="text-sm font-bold text-[#73AABF]">
                  Ajuste o filtro de status ou revise os termos de busca.
                </p>
              </CardContent>
            </Card>
          ) : (
            motoristasFiltrados.map((motorista) => {
              const statusInfo = getStatusInfo(motorista.status);

              return (
                <Card key={motorista.id} className="border-none shadow-lg bg-white overflow-hidden">
                  <CardHeader className="px-6 py-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#E4F2F1] p-3 rounded-xl">
                        <UserCircle className="h-6 w-6 text-[#103173]" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-black text-[#103173] tracking-tight">
                          {motorista.nome}
                        </CardTitle>
                        <p className="text-sm font-bold text-[#73AABF]">
                          Matrícula {motorista.matricula} • Atualização {motorista.ultimaAtualizacao}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
                      <Badge variant="outline" className="font-bold text-[#103173] border-[#103173]/20 bg-white">
                        Ônibus {motorista.onibusAtual}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <InfoBloco titulo="CNH" valor={`Categoria ${motorista.cnhCategoria}`} icone={IdCard} />
                    <InfoBloco titulo="Validade CNH" valor={motorista.validadeCnh} icone={CalendarClock} />
                    <InfoBloco titulo="Viagens Hoje" valor={motorista.viagensHoje.toString()} icone={Route} />
                    <InfoBloco titulo="Check-ins no Mês" valor={motorista.checkinsMes.toString()} icone={Bus} />

                    <div className="md:col-span-2 xl:col-span-4 bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#73AABF]">Contato</p>
                          <p className="text-sm font-black text-[#103173]">{motorista.telefone}</p>
                          <p className="text-xs font-bold text-[#73AABF]">{motorista.email}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#73AABF]">
                            Avaliação Média
                          </p>
                          <p className="text-xl font-black text-[#103173] flex items-center gap-1">
                            {motorista.avaliacaoMedia.toFixed(1)}
                            <Star className="h-4 w-4 text-[#F2D022] fill-[#F2D022]" />
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#73AABF]">
                            Penalidades Ativas
                          </p>
                          <p
                            className={`text-xl font-black ${
                              motorista.penalidadesAtivas > 0 ? "text-red-600" : "text-[#103173]"
                            }`}
                          >
                            {motorista.penalidadesAtivas}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {motorista.rotasVinculadas.map((rota) => (
                          <Badge
                            key={`${motorista.id}-${rota}`}
                            variant="outline"
                            className="font-bold text-[#103173] border-[#103173]/20 bg-white"
                          >
                            {rota}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>

                  {motorista.penalidadesAtivas > 0 ? (
                    <div className="mx-6 mb-4 bg-red-50 border border-red-100 rounded-xl px-4 py-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-[11px] font-black uppercase tracking-wide text-red-700">
                        Motorista com pendência disciplinar ativa.
                      </span>
                    </div>
                  ) : null}

                  <CardFooter className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 h-11 border-2 border-[#103173] text-[#103173] font-black hover:bg-[#103173] hover:text-white"
                      onClick={() =>
                        window.alert(`Protótipo: abrir escalas do motorista ${motorista.nome}.`)
                      }
                    >
                      <Route className="h-4 w-4 mr-2" />
                      VER ESCALAS
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 h-11 border-2 border-[#73AABF] text-[#103173] font-black hover:bg-[#73AABF]/15"
                      onClick={() => router.push(`/admin/motoristas/cadastro?id=${motorista.id}`)}
                    >
                      <PencilLine className="h-4 w-4 mr-2" />
                      EDITAR
                    </Button>
                    <Button
                      variant="outline"
                      className="h-11 border-red-200 text-red-600 font-black hover:bg-red-50"
                      onClick={() => handleAlterarStatus(motorista)}
                    >
                      <UserX className="h-4 w-4 mr-2" />
                      STATUS
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-11 text-red-600 font-black hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleRemover(motorista)}
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
