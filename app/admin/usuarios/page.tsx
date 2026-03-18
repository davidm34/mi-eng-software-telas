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
  Fingerprint,
  History,
  KeyRound,
  PencilLine,
  Plus,
  Route,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCircle,
  UserCog,
  UserRoundCheck,
  UserX,
} from "lucide-react";
import {
  USUARIOS_ADMIN_MOCK,
  type NivelPermissao,
  type PerfilAdministrador,
  type StatusAdministrador,
  type UsuarioAdministradorMock,
} from "@/lib/mock/administradores";

type FiltroStatusAdministrador = "todos" | StatusAdministrador;

const PESO_PERMISSAO: Record<NivelPermissao, number> = {
  nenhum: 0,
  leitura: 1,
  edicao: 2,
  total: 3,
};

function getStatusInfo(status: StatusAdministrador) {
  if (status === "ativo") {
    return {
      label: "ATIVO",
      className: "bg-[#23B99A] text-white font-bold",
    };
  }

  if (status === "pendente") {
    return {
      label: "PENDENTE",
      className: "bg-orange-500 text-white font-bold",
    };
  }

  return {
    label: "BLOQUEADO",
    className: "bg-red-500 text-white font-bold",
  };
}

function getPerfilInfo(perfil: PerfilAdministrador) {
  if (perfil === "super_admin") {
    return {
      label: "SUPER ADMIN",
      className: "bg-[#103173] text-white font-bold",
    };
  }

  if (perfil === "gestor_frota") {
    return {
      label: "GESTOR DE FROTA",
      className: "bg-[#0f5c7a] text-white font-bold",
    };
  }

  if (perfil === "gestor_viagens") {
    return {
      label: "GESTOR DE VIAGENS",
      className: "bg-[#73AABF] text-white font-bold",
    };
  }

  if (perfil === "operacao_embarque") {
    return {
      label: "OPERAÇÃO DE EMBARQUE",
      className: "bg-[#23B99A] text-white font-bold",
    };
  }

  return {
    label: "COMPLIANCE",
    className: "bg-amber-500 text-white font-bold",
  };
}

function getProximoStatus(status: StatusAdministrador): StatusAdministrador {
  if (status === "ativo") return "bloqueado";
  if (status === "bloqueado") return "pendente";
  return "ativo";
}

function getNivelPermissaoInfo(nivel: NivelPermissao) {
  if (nivel === "total") {
    return {
      label: "TOTAL",
      className: "bg-[#23B99A] text-white font-bold",
    };
  }

  if (nivel === "edicao") {
    return {
      label: "EDIÇÃO",
      className: "bg-[#103173] text-white font-bold",
    };
  }

  if (nivel === "leitura") {
    return {
      label: "LEITURA",
      className: "bg-[#73AABF] text-white font-bold",
    };
  }

  return {
    label: "SEM ACESSO",
    className: "bg-slate-300 text-slate-700 font-bold",
  };
}

export default function UsuariosPermissoesPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<UsuarioAdministradorMock[]>(() =>
    USUARIOS_ADMIN_MOCK.map((usuario) => ({
      ...usuario,
      rotasEscopo: [...usuario.rotasEscopo],
      onibusEscopo: [...usuario.onibusEscopo],
      motoristasEscopo: [...usuario.motoristasEscopo],
      permissoes: usuario.permissoes.map((permissao) => ({ ...permissao })),
    })),
  );
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatusAdministrador>("todos");

  const usuariosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return usuarios.filter((usuario) => {
      const correspondeStatus = filtroStatus === "todos" || usuario.status === filtroStatus;
      const permissoesTexto = usuario.permissoes
        .filter((item) => item.nivel !== "nenhum")
        .map((item) => item.modulo)
        .join(" ")
        .toLowerCase();
      const correspondeBusca =
        termo.length === 0 ||
        usuario.nome.toLowerCase().includes(termo) ||
        usuario.email.toLowerCase().includes(termo) ||
        usuario.matricula.toLowerCase().includes(termo) ||
        usuario.rotasEscopo.join(" ").toLowerCase().includes(termo) ||
        usuario.onibusEscopo.join(" ").toLowerCase().includes(termo) ||
        permissoesTexto.includes(termo);

      return correspondeStatus && correspondeBusca;
    });
  }, [usuarios, busca, filtroStatus]);

  const metricas = useMemo(() => {
    const total = usuarios.length;
    const ativos = usuarios.filter((item) => item.status === "ativo").length;
    const comMfa = usuarios.filter((item) => item.mfaAtivo).length;
    const acessosHoje = usuarios.reduce((acc, item) => acc + item.acessosHoje, 0);
    const pendencias = usuarios.reduce((acc, item) => acc + item.pendenciasAtivas, 0);
    const superAdmins = usuarios.filter((item) => item.perfil === "super_admin").length;

    return { total, ativos, comMfa, acessosHoje, pendencias, superAdmins };
  }, [usuarios]);

  const abrirTelaCadastro = (usuario?: UsuarioAdministradorMock) => {
    if (!usuario) {
      router.push("/admin/usuarios/cadastro?modo=novo");
      return;
    }

    router.push(`/admin/usuarios/cadastro?id=${usuario.id}`);
  };

  const handleAlterarStatus = (usuario: UsuarioAdministradorMock) => {
    const proximoStatus = getProximoStatus(usuario.status);
    const infoProximoStatus = getStatusInfo(proximoStatus);
    const confirmar = window.confirm(
      `Alterar status de ${usuario.nome} para ${infoProximoStatus.label} no protótipo?`,
    );
    if (!confirmar) return;

    setUsuarios((atual) =>
      atual.map((item) =>
        item.id === usuario.id
          ? {
              ...item,
              status: proximoStatus,
              ultimoAcesso: proximoStatus === "ativo" ? "Agora" : item.ultimoAcesso,
              pendenciasAtivas:
                proximoStatus === "ativo"
                  ? Math.max(0, item.pendenciasAtivas - 1)
                  : item.pendenciasAtivas,
            }
          : item,
      ),
    );
  };

  const handleRemover = (usuario: UsuarioAdministradorMock) => {
    if (usuario.perfil === "super_admin") {
      window.alert("Conta super admin não pode ser removida neste protótipo.");
      return;
    }

    if (usuario.status === "ativo" && usuario.acessosHoje > 0) {
      window.alert(
        `${usuario.nome} possui sessões registradas hoje (${usuario.acessosHoje}). Bloqueie o usuário antes de remover.`,
      );
      return;
    }

    const confirmar = window.confirm(`Remover ${usuario.nome} da listagem mockada de administradores?`);
    if (!confirmar) return;

    setUsuarios((atual) => atual.filter((item) => item.id !== usuario.id));
  };

  const abrirResumoPermissoes = (usuario: UsuarioAdministradorMock) => {
    const resumo = usuario.permissoes
      .filter((item) => item.nivel !== "nenhum")
      .map((item) => `${item.modulo}: ${getNivelPermissaoInfo(item.nivel).label}`)
      .join("\n");

    window.alert(`Permissões de ${usuario.nome}\n\n${resumo || "Sem permissões ativas."}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1] pb-24">
      <Navigation />

      <main className="flex-1 w-full max-w-6xl mx-auto py-10 px-4 space-y-8">
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-[#103173] flex items-center gap-3 tracking-tight">
              <div className="bg-[#103173] p-2 rounded-xl shadow-lg shadow-[#103173]/20">
                <UserCog className="h-7 w-7 text-[#F2D022]" />
              </div>
              Usuários e Permissões
            </h1>
            <p className="text-[#73AABF] font-bold text-sm md:text-base">
              Gestão de acessos administrativos, perfis operacionais e níveis de autorização.
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
              <UserRoundCheck className="h-4 w-4 mr-2" /> GESTÃO DE MOTORISTAS
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
              onClick={() => abrirTelaCadastro()}
            >
              <Plus className="h-5 w-5 mr-2" /> NOVO ADMINISTRADOR
            </Button>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <MetricCard label="Total" valor={metricas.total.toString()} destaque="Contas cadastradas" icon={UserCog} />
          <MetricCard
            label="Ativos"
            valor={metricas.ativos.toString()}
            destaque="Com acesso liberado"
            icon={ShieldCheck}
          />
          <MetricCard label="Com MFA" valor={metricas.comMfa.toString()} destaque="Duplo fator ativo" icon={Fingerprint} />
          <MetricCard
            label="Acessos Hoje"
            valor={metricas.acessosHoje.toString()}
            destaque="Sessões registradas"
            icon={History}
          />
          <MetricCard
            label="Pendências"
            valor={metricas.pendencias.toString()}
            destaque="Ações aguardando revisão"
            icon={AlertTriangle}
          />
          <MetricCard
            label="Super Admin"
            valor={metricas.superAdmins.toString()}
            destaque="Contas críticas"
            icon={ShieldAlert}
          />
        </section>

        <Card className="border-none shadow-xl bg-white">
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="text-[#103173] font-black text-xl">Controle de Acessos</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#73AABF]" />
                <Input
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                  placeholder="Buscar por nome, e-mail, matrícula, rota, ônibus ou módulo..."
                  className="pl-11 h-12 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173] rounded-xl"
                />
              </div>
              <p className="text-xs font-black uppercase tracking-wider text-[#73AABF]">
                {usuariosFiltrados.length} usuários exibidos
              </p>
            </div>

            <Tabs
              value={filtroStatus}
              onValueChange={(value) => setFiltroStatus(value as FiltroStatusAdministrador)}
            >
              <TabsList className="grid w-full grid-cols-4 bg-[#103173]/10 p-1 rounded-2xl h-14">
                <TabsTrigger value="todos" className="font-black uppercase text-[11px]">
                  Todos
                </TabsTrigger>
                <TabsTrigger value="ativo" className="font-black uppercase text-[11px]">
                  Ativos
                </TabsTrigger>
                <TabsTrigger value="pendente" className="font-black uppercase text-[11px]">
                  Pendentes
                </TabsTrigger>
                <TabsTrigger value="bloqueado" className="font-black uppercase text-[11px]">
                  Bloqueados
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <section className="space-y-5">
          {usuariosFiltrados.length === 0 ? (
            <Card className="border-none shadow-lg bg-white">
              <CardContent className="py-16 flex flex-col items-center justify-center gap-4 text-center">
                <div className="bg-[#103173]/10 p-4 rounded-2xl">
                  <Search className="h-8 w-8 text-[#103173]" />
                </div>
                <p className="text-lg font-black text-[#103173]">Nenhum usuário encontrado</p>
                <p className="text-sm font-bold text-[#73AABF]">
                  Ajuste filtros de status ou revise os termos de busca para esta demonstração.
                </p>
              </CardContent>
            </Card>
          ) : (
            usuariosFiltrados.map((usuario) => {
              const statusInfo = getStatusInfo(usuario.status);
              const perfilInfo = getPerfilInfo(usuario.perfil);
              const permissoesAtivas = usuario.permissoes.filter((item) => item.nivel !== "nenhum");
              const permissaoTotal = usuario.permissoes.reduce(
                (acc, permissao) => acc + PESO_PERMISSAO[permissao.nivel],
                0,
              );
              const percentualPermissao = Math.round(
                (permissaoTotal / (usuario.permissoes.length * PESO_PERMISSAO.total)) * 100,
              );

              return (
                <Card key={usuario.id} className="border-none shadow-lg bg-white overflow-hidden">
                  <CardHeader className="px-6 py-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl ${
                          usuario.status === "ativo"
                            ? "bg-[#E4F2F1]"
                            : usuario.status === "pendente"
                              ? "bg-orange-100"
                              : "bg-red-50"
                        }`}
                      >
                        <UserCircle
                          className={`h-6 w-6 ${
                            usuario.status === "ativo"
                              ? "text-[#103173]"
                              : usuario.status === "pendente"
                                ? "text-orange-600"
                                : "text-red-600"
                          }`}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-black text-[#103173] tracking-tight">
                          {usuario.nome}
                        </CardTitle>
                        <p className="text-sm font-bold text-[#73AABF]">
                          Matrícula {usuario.matricula} • Último acesso {usuario.ultimoAcesso}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
                      <Badge className={perfilInfo.className}>{perfilInfo.label}</Badge>
                      <Badge
                        variant="outline"
                        className={`font-bold border-[#103173]/20 ${
                          usuario.mfaAtivo
                            ? "text-[#23B99A] bg-[#23B99A]/10"
                            : "text-orange-600 bg-orange-50 border-orange-200"
                        }`}
                      >
                        MFA {usuario.mfaAtivo ? "ATIVO" : "PENDENTE"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <InfoBloco titulo="Perfil" valor={perfilInfo.label} icone={UserCog} />
                    <InfoBloco titulo="Acessos Hoje" valor={usuario.acessosHoje.toString()} icone={History} />
                    <InfoBloco
                      titulo="Pendências"
                      valor={usuario.pendenciasAtivas.toString()}
                      icone={AlertTriangle}
                    />
                    <InfoBloco
                      titulo="Cobertura de Permissão"
                      valor={`${percentualPermissao}%`}
                      icone={KeyRound}
                    />

                    <div className="md:col-span-2 xl:col-span-4 bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-4">
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#73AABF]">
                            Contato
                          </p>
                          <p className="text-sm font-black text-[#103173]">{usuario.telefone}</p>
                          <p className="text-xs font-bold text-[#73AABF]">{usuario.email}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#73AABF]">
                            Escopo de Frota
                          </p>
                          <p className="text-xl font-black text-[#103173]">{usuario.onibusEscopo.length}</p>
                          <p className="text-xs font-bold text-[#73AABF]">ônibus vinculados</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#73AABF]">
                            Escopo de Rotas
                          </p>
                          <p className="text-xl font-black text-[#103173]">{usuario.rotasEscopo.length}</p>
                          <p className="text-xs font-bold text-[#73AABF]">rotas monitoradas</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#73AABF]">
                          Módulos com Acesso
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {permissoesAtivas.map((permissao) => {
                            const nivelInfo = getNivelPermissaoInfo(permissao.nivel);

                            return (
                              <Badge key={`${usuario.id}-${permissao.modulo}`} className={nivelInfo.className}>
                                {permissao.modulo} • {nivelInfo.label}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#73AABF]">
                          Rotas e Motoristas Relacionados
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {usuario.rotasEscopo.map((rota) => (
                            <Badge
                              key={`${usuario.id}-rota-${rota}`}
                              variant="outline"
                              className="font-bold text-[#103173] border-[#103173]/20 bg-white"
                            >
                              {rota}
                            </Badge>
                          ))}
                          {usuario.motoristasEscopo.map((motorista) => (
                            <Badge
                              key={`${usuario.id}-motorista-${motorista}`}
                              variant="outline"
                              className="font-bold text-[#103173] border-[#73AABF]/30 bg-[#E4F2F1]"
                            >
                              {motorista}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs font-bold text-[#103173]">{usuario.observacoes}</p>
                    </div>
                  </CardContent>

                  {usuario.status === "pendente" ? (
                    <div className="mx-6 mb-4 bg-orange-50 border border-orange-100 rounded-xl px-4 py-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="text-[11px] font-black uppercase tracking-wide text-orange-700">
                        Convite pendente de aceite e configuração de MFA.
                      </span>
                    </div>
                  ) : null}

                  {usuario.status === "bloqueado" ? (
                    <div className="mx-6 mb-4 bg-red-50 border border-red-100 rounded-xl px-4 py-2 flex items-center gap-2">
                      <UserX className="h-4 w-4 text-red-500" />
                      <span className="text-[11px] font-black uppercase tracking-wide text-red-700">
                        Acesso bloqueado até conclusão das pendências administrativas.
                      </span>
                    </div>
                  ) : null}

                  <CardFooter className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 h-11 border-2 border-[#103173] text-[#103173] font-black hover:bg-[#103173] hover:text-white"
                      onClick={() => abrirResumoPermissoes(usuario)}
                    >
                      <KeyRound className="h-4 w-4 mr-2" />
                      PERMISSÕES
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 h-11 border-2 border-[#73AABF] text-[#103173] font-black hover:bg-[#73AABF]/15"
                      onClick={() => abrirTelaCadastro(usuario)}
                    >
                      <PencilLine className="h-4 w-4 mr-2" />
                      EDITAR
                    </Button>
                    <Button
                      variant="outline"
                      className="h-11 border-[#103173]/20 text-[#103173] font-black hover:bg-[#103173]/10"
                      onClick={() => handleAlterarStatus(usuario)}
                    >
                      <UserX className="h-4 w-4 mr-2" />
                      STATUS
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-11 text-red-600 font-black hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleRemover(usuario)}
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
