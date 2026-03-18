"use client";

import { useEffect, useMemo, useState, type ComponentType, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { FROTA_MOCK, ROTAS_MOCK } from "@/lib/mock/frota";
import { MOTORISTAS_GESTAO_MOCK } from "@/lib/mock/motoristas";
import {
  MODULOS_SISTEMA_MOCK,
  PERFIS_ADMINISTRADOR_MOCK,
  USUARIOS_ADMIN_MOCK,
  gerarProximoIdAdministrador,
  type ModuloSistema,
  type NivelPermissao,
  type PerfilAdministrador,
  type StatusAdministrador,
  type UsuarioAdministradorMock,
} from "@/lib/mock/administradores";
import {
  AlertTriangle,
  ArrowLeft,
  Bus,
  History,
  LockKeyhole,
  Plus,
  Route,
  Save,
  ShieldAlert,
  ShieldCheck,
  UserCircle,
  UserCog,
} from "lucide-react";

interface PermissoesFormState extends Record<ModuloSistema, NivelPermissao> {}

interface AdministradorFormState {
  id: string;
  nome: string;
  matricula: string;
  email: string;
  telefone: string;
  perfil: PerfilAdministrador;
  status: StatusAdministrador;
  mfaAtivo: boolean;
  ultimoAcesso: string;
  acessosHoje: string;
  pendenciasAtivas: string;
  rotasEscopo: string;
  onibusEscopo: string;
  motoristasEscopo: string;
  observacoes: string;
  permissoes: PermissoesFormState;
}

const PESO_PERMISSAO: Record<NivelPermissao, number> = {
  nenhum: 0,
  leitura: 1,
  edicao: 2,
  total: 3,
};

function normalizarLista(texto: string) {
  return texto
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function montarPermissoesVazias(): PermissoesFormState {
  return MODULOS_SISTEMA_MOCK.reduce((acc, modulo) => {
    acc[modulo] = "nenhum";
    return acc;
  }, {} as PermissoesFormState);
}

function montarPermissoesPorPerfil(perfil: PerfilAdministrador): PermissoesFormState {
  const permissoes = montarPermissoesVazias();

  if (perfil === "super_admin") {
    MODULOS_SISTEMA_MOCK.forEach((modulo) => {
      permissoes[modulo] = "total";
    });
    return permissoes;
  }

  if (perfil === "gestor_frota") {
    permissoes["Ônibus"] = "total";
    permissoes["Motoristas"] = "edicao";
    permissoes["Viagens"] = "leitura";
    permissoes["Rotas Disponíveis"] = "edicao";
    permissoes["Passageiros da Viagem"] = "leitura";
    permissoes["Código de Check-in"] = "leitura";
    permissoes["Histórico Operacional"] = "total";
    return permissoes;
  }

  if (perfil === "gestor_viagens") {
    permissoes["Ônibus"] = "leitura";
    permissoes["Motoristas"] = "leitura";
    permissoes["Viagens"] = "total";
    permissoes["Rotas Disponíveis"] = "total";
    permissoes["Passageiros da Viagem"] = "edicao";
    permissoes["Código de Check-in"] = "edicao";
    permissoes["Histórico Operacional"] = "edicao";
    return permissoes;
  }

  if (perfil === "operacao_embarque") {
    permissoes["Viagens"] = "leitura";
    permissoes["Rotas Disponíveis"] = "leitura";
    permissoes["Passageiros da Viagem"] = "edicao";
    permissoes["Código de Check-in"] = "total";
    permissoes["Histórico Operacional"] = "leitura";
    return permissoes;
  }

  permissoes["Motoristas"] = "leitura";
  permissoes["Viagens"] = "leitura";
  permissoes["Penalidades"] = "total";
  permissoes["Histórico de Penalidades"] = "total";
  permissoes["Histórico Operacional"] = "edicao";
  return permissoes;
}

function montarPermissoesIniciais(usuario?: UsuarioAdministradorMock): PermissoesFormState {
  if (!usuario) {
    return montarPermissoesPorPerfil("operacao_embarque");
  }

  const permissoes = montarPermissoesVazias();
  usuario.permissoes.forEach((item) => {
    permissoes[item.modulo] = item.nivel;
  });

  return permissoes;
}

function montarEstadoInicial(usuario?: UsuarioAdministradorMock): AdministradorFormState {
  if (!usuario) {
    return {
      id: gerarProximoIdAdministrador(),
      nome: "",
      matricula: "",
      email: "",
      telefone: "",
      perfil: "operacao_embarque",
      status: "pendente",
      mfaAtivo: false,
      ultimoAcesso: "Nunca acessou",
      acessosHoje: "0",
      pendenciasAtivas: "1",
      rotasEscopo: "ROT-001, ROT-002",
      onibusEscopo: "JLS-1020",
      motoristasEscopo: "João Silva",
      observacoes: "Convite inicial para operação de embarque e validação de presença.",
      permissoes: montarPermissoesIniciais(),
    };
  }

  return {
    id: usuario.id,
    nome: usuario.nome,
    matricula: usuario.matricula,
    email: usuario.email,
    telefone: usuario.telefone,
    perfil: usuario.perfil,
    status: usuario.status,
    mfaAtivo: usuario.mfaAtivo,
    ultimoAcesso: usuario.ultimoAcesso,
    acessosHoje: String(usuario.acessosHoje),
    pendenciasAtivas: String(usuario.pendenciasAtivas),
    rotasEscopo: usuario.rotasEscopo.join(", "),
    onibusEscopo: usuario.onibusEscopo.join(", "),
    motoristasEscopo: usuario.motoristasEscopo.join(", "),
    observacoes: usuario.observacoes,
    permissoes: montarPermissoesIniciais(usuario),
  };
}

function getStatusBadge(status: StatusAdministrador) {
  if (status === "ativo") {
    return { label: "ATIVO", className: "bg-[#23B99A] text-white font-bold" };
  }

  if (status === "pendente") {
    return { label: "PENDENTE", className: "bg-orange-500 text-white font-bold" };
  }

  return { label: "BLOQUEADO", className: "bg-red-500 text-white font-bold" };
}

function getPerfilBadge(perfil: PerfilAdministrador) {
  if (perfil === "super_admin") {
    return { label: "SUPER ADMIN", className: "bg-[#103173] text-white font-bold" };
  }

  if (perfil === "gestor_frota") {
    return { label: "GESTOR DE FROTA", className: "bg-[#0f5c7a] text-white font-bold" };
  }

  if (perfil === "gestor_viagens") {
    return { label: "GESTOR DE VIAGENS", className: "bg-[#73AABF] text-white font-bold" };
  }

  if (perfil === "operacao_embarque") {
    return { label: "OPERAÇÃO DE EMBARQUE", className: "bg-[#23B99A] text-white font-bold" };
  }

  return { label: "COMPLIANCE", className: "bg-amber-500 text-white font-bold" };
}

function getNivelPermissaoInfo(nivel: NivelPermissao) {
  if (nivel === "total") {
    return { label: "TOTAL", className: "bg-[#23B99A] text-white font-bold" };
  }

  if (nivel === "edicao") {
    return { label: "EDIÇÃO", className: "bg-[#103173] text-white font-bold" };
  }

  if (nivel === "leitura") {
    return { label: "LEITURA", className: "bg-[#73AABF] text-white font-bold" };
  }

  return { label: "SEM ACESSO", className: "bg-slate-300 text-slate-700 font-bold" };
}

export default function CadastroEdicaoAdministradorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modoNovo = searchParams.get("modo") === "novo";
  const id = searchParams.get("id");

  const usuarioSelecionado = useMemo(
    () => (id ? USUARIOS_ADMIN_MOCK.find((item) => item.id === id) : undefined),
    [id],
  );
  const emEdicao = Boolean(usuarioSelecionado) && !modoNovo;
  const referenciaInvalida = Boolean(id) && !usuarioSelecionado && !modoNovo;

  const [formData, setFormData] = useState<AdministradorFormState>(() =>
    montarEstadoInicial(modoNovo ? undefined : usuarioSelecionado),
  );

  useEffect(() => {
    setFormData(montarEstadoInicial(modoNovo ? undefined : usuarioSelecionado));
  }, [modoNovo, usuarioSelecionado]);

  const statusBadge = getStatusBadge(formData.status);
  const perfilBadge = getPerfilBadge(formData.perfil);

  const rotasPreview = useMemo(() => normalizarLista(formData.rotasEscopo), [formData.rotasEscopo]);
  const onibusPreview = useMemo(() => normalizarLista(formData.onibusEscopo), [formData.onibusEscopo]);
  const motoristasPreview = useMemo(
    () => normalizarLista(formData.motoristasEscopo),
    [formData.motoristasEscopo],
  );

  const permissoesAtivasPreview = useMemo(
    () => MODULOS_SISTEMA_MOCK.filter((modulo) => formData.permissoes[modulo] !== "nenhum"),
    [formData.permissoes],
  );

  const coberturaPermissoes = useMemo(() => {
    const soma = MODULOS_SISTEMA_MOCK.reduce(
      (acc, modulo) => acc + PESO_PERMISSAO[formData.permissoes[modulo]],
      0,
    );
    return Math.round((soma / (MODULOS_SISTEMA_MOCK.length * PESO_PERMISSAO.total)) * 100);
  }, [formData.permissoes]);

  const atualizarCampo = <K extends keyof AdministradorFormState>(
    campo: K,
    valor: AdministradorFormState[K],
  ) => {
    setFormData((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  };

  const atualizarPermissao = (modulo: ModuloSistema, nivel: NivelPermissao) => {
    setFormData((atual) => ({
      ...atual,
      permissoes: {
        ...atual.permissoes,
        [modulo]: nivel,
      },
    }));
  };

  const preencherEscopoSugerido = () => {
    atualizarCampo("rotasEscopo", ROTAS_MOCK.join(", "));
    atualizarCampo("onibusEscopo", FROTA_MOCK.map((onibus) => onibus.placa).join(", "));
    atualizarCampo(
      "motoristasEscopo",
      MOTORISTAS_GESTAO_MOCK.map((motorista) => motorista.nome).join(", "),
    );
  };

  const preencherPermissoesPorPerfil = () => {
    setFormData((atual) => ({
      ...atual,
      permissoes: montarPermissoesPorPerfil(atual.perfil),
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const possuiPermissaoAtiva = MODULOS_SISTEMA_MOCK.some(
      (modulo) => formData.permissoes[modulo] !== "nenhum",
    );

    if (!formData.nome.trim() || !formData.matricula.trim() || !formData.email.trim()) {
      window.alert("Preencha ao menos Nome, Matrícula e E-mail institucional.");
      return;
    }

    if (!possuiPermissaoAtiva) {
      window.alert("Defina pelo menos uma permissão de módulo para este administrador.");
      return;
    }

    const mensagem = emEdicao
      ? `Protótipo: administrador ${formData.nome} atualizado com sucesso.`
      : `Protótipo: administrador ${formData.nome || formData.id} cadastrado com sucesso.`;

    window.alert(mensagem);
    router.push("/admin/usuarios");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1] pb-24">
      <Navigation />

      <main className="flex-1 container max-w-6xl py-10 px-4 space-y-6">
        <Button
          variant="ghost"
          className="w-fit text-[#103173] font-black hover:bg-[#103173]/10"
          onClick={() => router.push("/admin/usuarios")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          VOLTAR PARA USUÁRIOS E PERMISSÕES
        </Button>

        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-[#103173] flex items-center gap-3 tracking-tight">
              <div className="bg-[#103173] p-2 rounded-xl shadow-lg shadow-[#103173]/20">
                <UserCog className="h-7 w-7 text-[#F2D022]" />
              </div>
              {emEdicao ? "Edição de Administrador" : "Cadastro de Administrador"}
            </h1>
            <p className="text-[#73AABF] font-bold text-sm md:text-base">
              Formulário administrativo mockado para controle de acesso, escopo e permissões por módulo.
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
            <Badge className={perfilBadge.className}>{perfilBadge.label}</Badge>
            <Badge className="bg-[#103173] text-white font-bold">
              {emEdicao ? "MODO EDIÇÃO" : "MODO CADASTRO"}
            </Badge>
          </div>
        </header>

        {referenciaInvalida ? (
          <Card className="border-none shadow-md bg-amber-50 border border-amber-100">
            <CardContent className="p-4">
              <p className="text-sm font-bold text-amber-800">
                Administrador não encontrado para edição. O formulário foi aberto no modo cadastro.
              </p>
            </CardContent>
          </Card>
        ) : null}

        <form className="grid xl:grid-cols-[1.35fr_1fr] gap-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <Card className="border-none shadow-lg bg-white">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-[#103173] font-black text-xl">Dados da Conta</CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#103173] font-bold">Código Interno</Label>
                  <Input value={formData.id} disabled className="h-11 bg-slate-50 border-slate-200 font-bold" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="matricula" className="text-[#103173] font-bold">
                    Matrícula
                  </Label>
                  <Input
                    id="matricula"
                    value={formData.matricula}
                    onChange={(event) => atualizarCampo("matricula", event.target.value)}
                    placeholder="Ex: 2026031"
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                    required
                  />
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="nome" className="text-[#103173] font-bold">
                    Nome Completo
                  </Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(event) => atualizarCampo("nome", event.target.value)}
                    placeholder="Ex: Marina Almeida"
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone" className="text-[#103173] font-bold">
                    Telefone
                  </Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(event) => atualizarCampo("telefone", event.target.value)}
                    placeholder="(75) 99999-0000"
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#103173] font-bold">
                    E-mail Institucional
                  </Label>
                  <Input
                    id="email"
                    value={formData.email}
                    onChange={(event) => atualizarCampo("email", event.target.value.toLowerCase())}
                    placeholder="nome@uefs.br"
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-[#103173] font-black text-xl">Perfil e Segurança</CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="perfil" className="text-[#103173] font-bold">
                    Perfil
                  </Label>
                  <select
                    id="perfil"
                    value={formData.perfil}
                    onChange={(event) => atualizarCampo("perfil", event.target.value as PerfilAdministrador)}
                    className="h-11 w-full rounded-md border border-[#73AABF]/30 bg-white px-3 text-sm text-[#103173] font-bold focus:outline-none focus:ring-2 focus:ring-[#103173]/40"
                  >
                    {PERFIS_ADMINISTRADOR_MOCK.map((perfil) => (
                      <option key={perfil} value={perfil}>
                        {getPerfilBadge(perfil).label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-[#103173] font-bold">
                    Status
                  </Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(event) => atualizarCampo("status", event.target.value as StatusAdministrador)}
                    className="h-11 w-full rounded-md border border-[#73AABF]/30 bg-white px-3 text-sm text-[#103173] font-bold focus:outline-none focus:ring-2 focus:ring-[#103173]/40"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="pendente">Pendente</option>
                    <option value="bloqueado">Bloqueado</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mfa" className="text-[#103173] font-bold">
                    MFA
                  </Label>
                  <select
                    id="mfa"
                    value={formData.mfaAtivo ? "sim" : "nao"}
                    onChange={(event) => atualizarCampo("mfaAtivo", event.target.value === "sim")}
                    className="h-11 w-full rounded-md border border-[#73AABF]/30 bg-white px-3 text-sm text-[#103173] font-bold focus:outline-none focus:ring-2 focus:ring-[#103173]/40"
                  >
                    <option value="sim">Ativo</option>
                    <option value="nao">Pendente</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ultimo-acesso" className="text-[#103173] font-bold">
                    Último Acesso
                  </Label>
                  <Input
                    id="ultimo-acesso"
                    value={formData.ultimoAcesso}
                    onChange={(event) => atualizarCampo("ultimoAcesso", event.target.value)}
                    placeholder="Ex: Hoje, 08:17"
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="acessos-hoje" className="text-[#103173] font-bold">
                    Acessos Hoje
                  </Label>
                  <Input
                    id="acessos-hoje"
                    type="number"
                    min={0}
                    max={120}
                    value={formData.acessosHoje}
                    onChange={(event) => atualizarCampo("acessosHoje", event.target.value)}
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pendencias" className="text-[#103173] font-bold">
                    Pendências Ativas
                  </Label>
                  <Input
                    id="pendencias"
                    type="number"
                    min={0}
                    max={20}
                    value={formData.pendenciasAtivas}
                    onChange={(event) => atualizarCampo("pendenciasAtivas", event.target.value)}
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-[#103173] font-black text-xl">Escopo e Permissões</CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="rotas-escopo" className="text-[#103173] font-bold">
                      Rotas sob Escopo
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 text-[10px] font-black border-[#103173]/20 text-[#103173]"
                      onClick={preencherEscopoSugerido}
                    >
                      PREENCHER SUGESTÃO
                    </Button>
                  </div>
                  <Textarea
                    id="rotas-escopo"
                    value={formData.rotasEscopo}
                    onChange={(event) => atualizarCampo("rotasEscopo", event.target.value)}
                    placeholder="Separe por vírgula. Ex: ROT-001, ROT-002"
                    className="min-h-20 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="onibus-escopo" className="text-[#103173] font-bold">
                    Ônibus sob Escopo
                  </Label>
                  <Textarea
                    id="onibus-escopo"
                    value={formData.onibusEscopo}
                    onChange={(event) => atualizarCampo("onibusEscopo", event.target.value.toUpperCase())}
                    placeholder="Ex: JLS-1020, QTX-4B31"
                    className="min-h-20 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motoristas-escopo" className="text-[#103173] font-bold">
                    Motoristas Relacionados
                  </Label>
                  <Textarea
                    id="motoristas-escopo"
                    value={formData.motoristasEscopo}
                    onChange={(event) => atualizarCampo("motoristasEscopo", event.target.value)}
                    placeholder="Ex: João Silva, Carla Nascimento"
                    className="min-h-20 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-[#103173] font-bold">Matriz de Permissões por Módulo</Label>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 text-[10px] font-black border-[#103173]/20 text-[#103173]"
                      onClick={preencherPermissoesPorPerfil}
                    >
                      PREENCHER PELO PERFIL
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    {MODULOS_SISTEMA_MOCK.map((modulo) => (
                      <div key={modulo} className="rounded-xl border border-slate-100 bg-[#E4F2F1] p-3 space-y-2">
                        <p className="text-xs font-black text-[#103173] leading-tight">{modulo}</p>
                        <select
                          value={formData.permissoes[modulo]}
                          onChange={(event) =>
                            atualizarPermissao(modulo, event.target.value as NivelPermissao)
                          }
                          className="h-9 w-full rounded-md border border-[#73AABF]/30 bg-white px-3 text-xs text-[#103173] font-bold focus:outline-none focus:ring-2 focus:ring-[#103173]/40"
                        >
                          <option value="nenhum">Sem Acesso</option>
                          <option value="leitura">Leitura</option>
                          <option value="edicao">Edição</option>
                          <option value="total">Total</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-[#103173] font-black text-xl">Observações</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Label htmlFor="observacoes" className="text-[#103173] font-bold">
                    Notas Administrativas
                  </Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(event) => atualizarCampo("observacoes", event.target.value)}
                    placeholder="Justificativa de acesso, regras operacionais e pendências de aprovação..."
                    className="min-h-28 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 xl:sticky xl:top-24 h-fit">
            <Card className="border-none shadow-lg bg-white overflow-hidden">
              <CardHeader className="bg-[#103173] text-white py-5">
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <LockKeyhole className="h-5 w-5 text-[#F2D022]" />
                  Pré-visualização
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#73AABF]">Administrador</p>
                    <p className="text-xl font-black text-[#103173]">{formData.nome || "---"}</p>
                  </div>
                  <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className={perfilBadge.className}>{perfilBadge.label}</Badge>
                  <Badge
                    className={
                      formData.mfaAtivo
                        ? "bg-[#23B99A] text-white font-bold"
                        : "bg-orange-500 text-white font-bold"
                    }
                  >
                    MFA {formData.mfaAtivo ? "ATIVO" : "PENDENTE"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <ResumoItem icon={UserCircle} label="Matrícula" value={formData.matricula || "---"} />
                  <ResumoItem icon={History} label="Acessos Hoje" value={formData.acessosHoje || "0"} />
                  <ResumoItem icon={AlertTriangle} label="Pendências" value={formData.pendenciasAtivas || "0"} />
                  <ResumoItem
                    icon={ShieldCheck}
                    label="Permissões Ativas"
                    value={String(permissoesAtivasPreview.length)}
                  />
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#73AABF]">
                    Cobertura de Permissões
                  </p>
                  <div className="w-full h-3 bg-white border border-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#103173]" style={{ width: `${coberturaPermissoes}%` }} />
                  </div>
                  <p className="text-sm font-black text-[#103173]">{coberturaPermissoes}%</p>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#73AABF]">
                    Módulos com Permissão
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {permissoesAtivasPreview.length > 0 ? (
                      permissoesAtivasPreview.slice(0, 8).map((modulo) => {
                        const nivelInfo = getNivelPermissaoInfo(formData.permissoes[modulo]);
                        return (
                          <Badge key={modulo} className={nivelInfo.className}>
                            {modulo} • {nivelInfo.label}
                          </Badge>
                        );
                      })
                    ) : (
                      <span className="text-xs font-bold text-[#73AABF]">Nenhuma permissão ativa.</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#73AABF]">
                    Escopo Operacional
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {rotasPreview.slice(0, 4).map((rota) => (
                      <Badge
                        key={`rota-${rota}`}
                        variant="outline"
                        className="font-bold text-[#103173] border-[#103173]/20 bg-white"
                      >
                        {rota}
                      </Badge>
                    ))}
                    {onibusPreview.slice(0, 3).map((onibus) => (
                      <Badge
                        key={`onibus-${onibus}`}
                        variant="outline"
                        className="font-bold text-[#103173] border-[#73AABF]/30 bg-[#E4F2F1]"
                      >
                        {onibus}
                      </Badge>
                    ))}
                    {motoristasPreview.slice(0, 2).map((motorista) => (
                      <Badge
                        key={`motorista-${motorista}`}
                        variant="outline"
                        className="font-bold text-[#103173] border-[#73AABF]/30 bg-[#E4F2F1]"
                      >
                        {motorista}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0 flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full h-12 bg-[#23B99A] hover:bg-[#1d957c] text-white font-black shadow-lg shadow-[#23B99A]/20"
                >
                  {emEdicao ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      SALVAR ALTERAÇÕES
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      CADASTRAR ADMINISTRADOR
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 border-2 border-[#103173] text-[#103173] font-black hover:bg-[#103173] hover:text-white"
                  onClick={() => router.push("/admin/usuarios")}
                >
                  CANCELAR
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-md bg-white">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="bg-[#103173]/10 p-2 rounded-lg">
                  <Route className="h-4 w-4 text-[#103173]" />
                </div>
                <p className="text-xs font-bold text-[#103173] leading-relaxed">
                  Dados mockados alinhados com as telas existentes: rotas `ROT-001/002/9901`,
                  ônibus `JLS-1020`, motoristas `João Silva` e `Carla Nascimento`.
                </p>
              </CardContent>
            </Card>
          </div>
        </form>
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

interface ResumoItemProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

function ResumoItem({ icon: Icon, label, value }: ResumoItemProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-[#E4F2F1] p-3 space-y-1">
      <div className="flex items-center gap-1 text-[#73AABF]">
        <Icon className="h-3.5 w-3.5" />
        <p className="text-[9px] uppercase font-black tracking-widest">{label}</p>
      </div>
      <p className="text-xs font-black text-[#103173] leading-tight">{value}</p>
    </div>
  );
}
