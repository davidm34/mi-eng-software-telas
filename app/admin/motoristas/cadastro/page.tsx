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
import {
  CATEGORIAS_CNH_MOCK,
  MOTORISTAS_GESTAO_MOCK,
  gerarProximoIdMotorista,
  type MotoristaMock,
  type StatusMotorista,
} from "@/lib/mock/motoristas";
import {
  ArrowLeft,
  Bus,
  IdCard,
  Mail,
  Phone,
  Plus,
  Route,
  Save,
  ShieldAlert,
  Star,
  UserCircle,
  UserRound,
} from "lucide-react";

interface MotoristaFormState {
  id: string;
  nome: string;
  matricula: string;
  cnhCategoria: string;
  validadeCnh: string;
  telefone: string;
  email: string;
  onibusAtual: string;
  rotasVinculadas: string;
  viagensHoje: string;
  checkinsMes: string;
  avaliacaoMedia: string;
  penalidadesAtivas: string;
  status: StatusMotorista;
  ultimaAtualizacao: string;
  observacoes: string;
}

function montarEstadoInicial(motorista?: MotoristaMock): MotoristaFormState {
  if (!motorista) {
    return {
      id: gerarProximoIdMotorista(),
      nome: "",
      matricula: "",
      cnhCategoria: "D",
      validadeCnh: "",
      telefone: "",
      email: "",
      onibusAtual: "Sem alocação",
      rotasVinculadas: "",
      viagensHoje: "0",
      checkinsMes: "0",
      avaliacaoMedia: "4.5",
      penalidadesAtivas: "0",
      status: "disponivel",
      ultimaAtualizacao: "Agora",
      observacoes: "",
    };
  }

  return {
    id: motorista.id,
    nome: motorista.nome,
    matricula: motorista.matricula,
    cnhCategoria: motorista.cnhCategoria,
    validadeCnh: motorista.validadeCnh,
    telefone: motorista.telefone,
    email: motorista.email,
    onibusAtual: motorista.onibusAtual,
    rotasVinculadas: motorista.rotasVinculadas.join(", "),
    viagensHoje: String(motorista.viagensHoje),
    checkinsMes: String(motorista.checkinsMes),
    avaliacaoMedia: String(motorista.avaliacaoMedia),
    penalidadesAtivas: String(motorista.penalidadesAtivas),
    status: motorista.status,
    ultimaAtualizacao: motorista.ultimaAtualizacao,
    observacoes:
      motorista.status === "afastado"
        ? "Acompanhamento administrativo ativo por pendência operacional."
        : "Condutor apto para escala padrão.",
  };
}

function getStatusBadge(status: StatusMotorista) {
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

function normalizarRotas(rotasTexto: string) {
  return rotasTexto
    .split(",")
    .map((rota) => rota.trim())
    .filter(Boolean);
}

export default function CadastroEdicaoMotoristaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modoNovo = searchParams.get("modo") === "novo";
  const id = searchParams.get("id");

  const motoristaSelecionado = useMemo(
    () => (id ? MOTORISTAS_GESTAO_MOCK.find((item) => item.id === id) : undefined),
    [id],
  );
  const emEdicao = Boolean(motoristaSelecionado) && !modoNovo;
  const referenciaInvalida = Boolean(id) && !motoristaSelecionado && !modoNovo;

  const [formData, setFormData] = useState<MotoristaFormState>(() =>
    montarEstadoInicial(modoNovo ? undefined : motoristaSelecionado),
  );

  useEffect(() => {
    setFormData(montarEstadoInicial(modoNovo ? undefined : motoristaSelecionado));
  }, [modoNovo, motoristaSelecionado]);

  const rotasPreview = useMemo(() => normalizarRotas(formData.rotasVinculadas), [formData.rotasVinculadas]);
  const statusBadge = getStatusBadge(formData.status);
  const avaliacaoPreview = Math.max(0, Math.min(5, Number(formData.avaliacaoMedia) || 0));
  const penalidadesPreview = Math.max(0, Number(formData.penalidadesAtivas) || 0);

  const atualizarCampo = <K extends keyof MotoristaFormState>(
    campo: K,
    valor: MotoristaFormState[K],
  ) => {
    setFormData((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  };

  const preencherRotasSugeridas = () => {
    atualizarCampo("rotasVinculadas", ROTAS_MOCK.join(", "));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.nome.trim() || !formData.matricula.trim() || !formData.telefone.trim()) {
      window.alert("Preencha ao menos Nome, Matrícula e Telefone.");
      return;
    }

    const mensagem = emEdicao
      ? `Protótipo: motorista ${formData.nome} atualizado com sucesso.`
      : `Protótipo: motorista ${formData.nome || formData.id} cadastrado com sucesso.`;

    window.alert(mensagem);
    router.push("/admin/motoristas");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1] pb-24">
      <Navigation />

      <main className="flex-1 container max-w-6xl py-10 px-4 space-y-6">
        <Button
          variant="ghost"
          className="w-fit text-[#103173] font-black hover:bg-[#103173]/10"
          onClick={() => router.push("/admin/motoristas")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          VOLTAR PARA GESTÃO DE MOTORISTAS
        </Button>

        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-[#103173] flex items-center gap-3 tracking-tight">
              <div className="bg-[#103173] p-2 rounded-xl shadow-lg shadow-[#103173]/20">
                <UserRound className="h-7 w-7 text-[#F2D022]" />
              </div>
              {emEdicao ? "Edição de Motorista" : "Cadastro de Motorista"}
            </h1>
            <p className="text-[#73AABF] font-bold text-sm md:text-base">
              Formulário administrativo mockado para criação e atualização de condutores.
            </p>
          </div>

          <Badge className={statusBadge.className}>
            {emEdicao ? "MODO EDIÇÃO" : "MODO CADASTRO"}
          </Badge>
        </header>

        {referenciaInvalida ? (
          <Card className="border-none shadow-md bg-amber-50 border border-amber-100">
            <CardContent className="p-4">
              <p className="text-sm font-bold text-amber-800">
                Motorista não encontrado para edição. O formulário foi aberto no modo cadastro.
              </p>
            </CardContent>
          </Card>
        ) : null}

        <form className="grid xl:grid-cols-[1.35fr_1fr] gap-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <Card className="border-none shadow-lg bg-white">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-[#103173] font-black text-xl">
                  Dados do Condutor
                </CardTitle>
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
                    placeholder="Ex: 2021001"
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
                    placeholder="Ex: João Silva"
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
                    placeholder="(75) 99999-9999"
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#103173] font-bold">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    value={formData.email}
                    onChange={(event) => atualizarCampo("email", event.target.value)}
                    placeholder="nome@uefs.br"
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-[#103173] font-black text-xl">
                  CNH e Operação
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoria-cnh" className="text-[#103173] font-bold">
                    Categoria CNH
                  </Label>
                  <select
                    id="categoria-cnh"
                    value={formData.cnhCategoria}
                    onChange={(event) => atualizarCampo("cnhCategoria", event.target.value)}
                    className="h-11 w-full rounded-md border border-[#73AABF]/30 bg-white px-3 text-sm text-[#103173] font-bold focus:outline-none focus:ring-2 focus:ring-[#103173]/40"
                  >
                    {CATEGORIAS_CNH_MOCK.map((categoria) => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="validade-cnh" className="text-[#103173] font-bold">
                    Validade CNH
                  </Label>
                  <Input
                    id="validade-cnh"
                    value={formData.validadeCnh}
                    onChange={(event) => atualizarCampo("validadeCnh", event.target.value)}
                    placeholder="DD/MM/AAAA"
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-[#103173] font-bold">
                    Status
                  </Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(event) => atualizarCampo("status", event.target.value as StatusMotorista)}
                    className="h-11 w-full rounded-md border border-[#73AABF]/30 bg-white px-3 text-sm text-[#103173] font-bold focus:outline-none focus:ring-2 focus:ring-[#103173]/40"
                  >
                    <option value="em_rota">Em Rota</option>
                    <option value="disponivel">Disponível</option>
                    <option value="ferias">Férias</option>
                    <option value="afastado">Afastado</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="onibus-atual" className="text-[#103173] font-bold">
                    Ônibus Atual
                  </Label>
                  <Input
                    id="onibus-atual"
                    list="onibus-sugestoes"
                    value={formData.onibusAtual}
                    onChange={(event) => atualizarCampo("onibusAtual", event.target.value.toUpperCase())}
                    placeholder="Ex: JLS-1020"
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                  <datalist id="onibus-sugestoes">
                    {FROTA_MOCK.map((onibus) => (
                      <option key={onibus.id} value={onibus.placa} />
                    ))}
                    <option value="Reserva" />
                    <option value="Sem alocação" />
                  </datalist>
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="rotas-vinculadas" className="text-[#103173] font-bold">
                      Rotas Vinculadas
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 text-[10px] font-black border-[#103173]/20 text-[#103173]"
                      onClick={preencherRotasSugeridas}
                    >
                      PREENCHER SUGESTÃO
                    </Button>
                  </div>
                  <Textarea
                    id="rotas-vinculadas"
                    value={formData.rotasVinculadas}
                    onChange={(event) => atualizarCampo("rotasVinculadas", event.target.value)}
                    placeholder="Separe por vírgula. Ex: ROT-001, ROT-002"
                    className="min-h-24 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="viagens-hoje" className="text-[#103173] font-bold">
                    Viagens Hoje
                  </Label>
                  <Input
                    id="viagens-hoje"
                    type="number"
                    min={0}
                    max={20}
                    value={formData.viagensHoje}
                    onChange={(event) => atualizarCampo("viagensHoje", event.target.value)}
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkins-mes" className="text-[#103173] font-bold">
                    Check-ins no Mês
                  </Label>
                  <Input
                    id="checkins-mes"
                    type="number"
                    min={0}
                    max={120}
                    value={formData.checkinsMes}
                    onChange={(event) => atualizarCampo("checkinsMes", event.target.value)}
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avaliacao" className="text-[#103173] font-bold">
                    Avaliação Média
                  </Label>
                  <Input
                    id="avaliacao"
                    type="number"
                    min={0}
                    max={5}
                    step="0.1"
                    value={formData.avaliacaoMedia}
                    onChange={(event) => atualizarCampo("avaliacaoMedia", event.target.value)}
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="penalidades" className="text-[#103173] font-bold">
                    Penalidades Ativas
                  </Label>
                  <Input
                    id="penalidades"
                    type="number"
                    min={0}
                    max={20}
                    value={formData.penalidadesAtivas}
                    onChange={(event) => atualizarCampo("penalidadesAtivas", event.target.value)}
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-[#103173] font-black text-xl">
                  Observações e Controle
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ultima-atualizacao" className="text-[#103173] font-bold">
                    Última Atualização
                  </Label>
                  <Input
                    id="ultima-atualizacao"
                    value={formData.ultimaAtualizacao}
                    onChange={(event) => atualizarCampo("ultimaAtualizacao", event.target.value)}
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="observacoes" className="text-[#103173] font-bold">
                    Observações
                  </Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(event) => atualizarCampo("observacoes", event.target.value)}
                    placeholder="Anotações de conduta, escalas, treinamentos e histórico..."
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
                  <UserCircle className="h-5 w-5 text-[#F2D022]" />
                  Pré-visualização
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#73AABF]">Condutor</p>
                    <p className="text-xl font-black text-[#103173]">{formData.nome || "---"}</p>
                  </div>
                  <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <ResumoItem icon={IdCard} label="Matrícula" value={formData.matricula || "---"} />
                  <ResumoItem icon={Bus} label="Ônibus" value={formData.onibusAtual || "---"} />
                  <ResumoItem icon={Phone} label="Telefone" value={formData.telefone || "---"} />
                  <ResumoItem icon={Mail} label="E-mail" value={formData.email || "---"} />
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#73AABF]">
                    Avaliação e Penalidades
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-black text-[#103173] flex items-center gap-1">
                      {avaliacaoPreview.toFixed(1)}
                      <Star className="h-4 w-4 text-[#F2D022] fill-[#F2D022]" />
                    </p>
                    <p className={`text-sm font-black ${penalidadesPreview > 0 ? "text-red-600" : "text-[#103173]"}`}>
                      {penalidadesPreview} penalidade(s)
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#73AABF]">
                    Rotas Vinculadas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {rotasPreview.length > 0 ? (
                      rotasPreview.map((rota) => (
                        <Badge
                          key={rota}
                          variant="outline"
                          className="font-bold text-[#103173] border-[#103173]/20 bg-white"
                        >
                          {rota}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs font-bold text-[#73AABF]">Nenhuma rota vinculada.</span>
                    )}
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
                      CADASTRAR MOTORISTA
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 border-2 border-[#103173] text-[#103173] font-black hover:bg-[#103173] hover:text-white"
                  onClick={() => router.push("/admin/motoristas")}
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
                  Dados mockados consistentes com as telas anteriores: `João Silva`, `JLS-1020`,
                  `ROT-001/002/9901` e fluxo de escalas administrativas.
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
