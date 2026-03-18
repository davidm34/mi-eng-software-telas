"use client";

import { useEffect, useMemo, useState, type ComponentType, type FormEvent } from "react";
import { Suspense } from "react";
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
  PONTOS_ROTA_MOCK,
  VIAGENS_GESTAO_MOCK,
  gerarProximoIdViagem,
  type StatusViagem,
  type ViagemMock,
} from "@/lib/mock/viagens";
import {
  ArrowLeft,
  Bus,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Plus,
  Route,
  Save,
  ShieldAlert,
  UserCircle,
  UserRound,
} from "lucide-react";

interface ViagemFormState {
  id: string;
  rotaCodigo: string;
  data: string;
  diaSemana: string;
  origem: string;
  destino: string;
  horarioSaida: string;
  horarioChegada: string;
  onibusPlaca: string;
  motoristaNome: string;
  inscritos: string;
  capacidade: string;
  quorumMinimo: string;
  status: StatusViagem;
  codigoCheckin: string;
  observacoes: string;
  ultimaAtualizacao: string;
}

function montarEstadoInicial(viagem?: ViagemMock): ViagemFormState {
  if (!viagem) {
    return {
      id: gerarProximoIdViagem(),
      rotaCodigo: "",
      data: "",
      diaSemana: "",
      origem: "",
      destino: "",
      horarioSaida: "",
      horarioChegada: "",
      onibusPlaca: "",
      motoristaNome: "",
      inscritos: "0",
      capacidade: "44",
      quorumMinimo: "20",
      status: "programada",
      codigoCheckin: "",
      observacoes: "",
      ultimaAtualizacao: "Agora",
    };
  }

  return {
    id: viagem.id,
    rotaCodigo: viagem.rotaCodigo,
    data: viagem.data,
    diaSemana: viagem.diaSemana,
    origem: viagem.origem,
    destino: viagem.destino,
    horarioSaida: viagem.horarioSaida,
    horarioChegada: viagem.horarioChegada,
    onibusPlaca: viagem.onibusPlaca,
    motoristaNome: viagem.motoristaNome,
    inscritos: String(viagem.inscritos),
    capacidade: String(viagem.capacidade),
    quorumMinimo: String(viagem.quorumMinimo),
    status: viagem.status,
    codigoCheckin: viagem.codigoCheckin ?? "",
    observacoes: viagem.observacoes,
    ultimaAtualizacao: viagem.ultimaAtualizacao,
  };
}

function getStatusBadge(status: StatusViagem) {
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

function ViagemFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modoNovo = searchParams.get("modo") === "novo";
  const id = searchParams.get("id");

  const viagemSelecionada = useMemo(
    () => (id ? VIAGENS_GESTAO_MOCK.find((item) => item.id === id) : undefined),
    [id],
  );
  const emEdicao = Boolean(viagemSelecionada) && !modoNovo;
  const referenciaInvalida = Boolean(id) && !viagemSelecionada && !modoNovo;

  const [formData, setFormData] = useState<ViagemFormState>(() =>
    montarEstadoInicial(modoNovo ? undefined : viagemSelecionada),
  );

  useEffect(() => {
    setFormData(montarEstadoInicial(modoNovo ? undefined : viagemSelecionada));
  }, [modoNovo, viagemSelecionada]);

  const statusBadge = getStatusBadge(formData.status);
  const inscritosPreview = Math.max(0, Number(formData.inscritos) || 0);
  const capacidadePreview = Math.max(1, Number(formData.capacidade) || 1);
  const quorumPreview = Math.max(0, Number(formData.quorumMinimo) || 0);
  const ocupacaoPreview = Math.max(0, Math.min(100, (inscritosPreview / capacidadePreview) * 100));

  const atualizarCampo = <K extends keyof ViagemFormState>(campo: K, valor: ViagemFormState[K]) => {
    setFormData((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  };

  const preencherRotaSugerida = () => {
    atualizarCampo("rotaCodigo", ROTAS_MOCK[0]);
    atualizarCampo("origem", PONTOS_ROTA_MOCK[0]);
    atualizarCampo("destino", PONTOS_ROTA_MOCK[1]);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !formData.rotaCodigo.trim() ||
      !formData.origem.trim() ||
      !formData.destino.trim() ||
      !formData.horarioSaida.trim() ||
      !formData.horarioChegada.trim()
    ) {
      window.alert("Preencha ao menos Rota, Origem, Destino e Horários.");
      return;
    }

    const mensagem = emEdicao
      ? `Protótipo: viagem ${formData.id} atualizada com sucesso.`
      : `Protótipo: viagem ${formData.id} cadastrada com sucesso.`;

    window.alert(mensagem);
    router.push("/admin/viagens");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1] pb-24">
      <Navigation />

      <main className="flex-1 w-full max-w-6xl mx-auto py-10 px-4 space-y-6">
        <Button
          variant="ghost"
          className="w-fit text-[#103173] font-black hover:bg-[#103173]/10"
          onClick={() => router.push("/admin/viagens")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          VOLTAR PARA GESTÃO DE VIAGENS
        </Button>

        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-[#103173] flex items-center gap-3 tracking-tight">
              <div className="bg-[#103173] p-2 rounded-xl shadow-lg shadow-[#103173]/20">
                <Route className="h-7 w-7 text-[#F2D022]" />
              </div>
              {emEdicao ? "Edição de Viagem" : "Cadastro de Viagem"}
            </h1>
            <p className="text-[#73AABF] font-bold text-sm md:text-base">
              Formulário administrativo mockado para configuração completa de rotas e execução.
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
                Viagem não encontrada para edição. O formulário foi aberto no modo cadastro.
              </p>
            </CardContent>
          </Card>
        ) : null}

        <form className="grid xl:grid-cols-[1.35fr_1fr] gap-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <Card className="border-none shadow-lg bg-white">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-[#103173] font-black text-xl">Identificação da Viagem</CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#103173] font-bold">Código Interno</Label>
                  <Input value={formData.id} disabled className="h-11 bg-slate-50 border-slate-200 font-bold" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="rota-codigo" className="text-[#103173] font-bold">
                      Código da Rota
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 text-[10px] font-black border-[#103173]/20 text-[#103173]"
                      onClick={preencherRotaSugerida}
                    >
                      SUGESTÃO
                    </Button>
                  </div>
                  <Input
                    id="rota-codigo"
                    list="rotas-sugestoes"
                    value={formData.rotaCodigo}
                    onChange={(event) => atualizarCampo("rotaCodigo", event.target.value.toUpperCase())}
                    placeholder="Ex: ROT-001"
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                    required
                  />
                  <datalist id="rotas-sugestoes">
                    {ROTAS_MOCK.map((rota) => (
                      <option key={rota} value={rota} />
                    ))}
                  </datalist>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data" className="text-[#103173] font-bold">
                    Data
                  </Label>
                  <Input
                    id="data"
                    value={formData.data}
                    onChange={(event) => atualizarCampo("data", event.target.value)}
                    placeholder="DD/MM/AAAA"
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dia-semana" className="text-[#103173] font-bold">
                    Dia da Semana
                  </Label>
                  <Input
                    id="dia-semana"
                    value={formData.diaSemana}
                    onChange={(event) => atualizarCampo("diaSemana", event.target.value)}
                    placeholder="Ex: Segunda"
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-[#103173] font-black text-xl">Trajeto e Alocação</CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origem" className="text-[#103173] font-bold">
                    Origem
                  </Label>
                  <Input
                    id="origem"
                    list="pontos-sugestoes"
                    value={formData.origem}
                    onChange={(event) => atualizarCampo("origem", event.target.value)}
                    placeholder="Ex: Salvador"
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destino" className="text-[#103173] font-bold">
                    Destino
                  </Label>
                  <Input
                    id="destino"
                    list="pontos-sugestoes"
                    value={formData.destino}
                    onChange={(event) => atualizarCampo("destino", event.target.value)}
                    placeholder="Ex: Feira de Santana"
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                    required
                  />
                  <datalist id="pontos-sugestoes">
                    {PONTOS_ROTA_MOCK.map((ponto) => (
                      <option key={ponto} value={ponto} />
                    ))}
                  </datalist>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="saida" className="text-[#103173] font-bold">
                    Horário de Saída
                  </Label>
                  <Input
                    id="saida"
                    value={formData.horarioSaida}
                    onChange={(event) => atualizarCampo("horarioSaida", event.target.value)}
                    placeholder="HH:MM"
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chegada" className="text-[#103173] font-bold">
                    Horário de Chegada
                  </Label>
                  <Input
                    id="chegada"
                    value={formData.horarioChegada}
                    onChange={(event) => atualizarCampo("horarioChegada", event.target.value)}
                    placeholder="HH:MM"
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="onibus" className="text-[#103173] font-bold">
                    Ônibus
                  </Label>
                  <Input
                    id="onibus"
                    list="onibus-sugestoes"
                    value={formData.onibusPlaca}
                    onChange={(event) => atualizarCampo("onibusPlaca", event.target.value.toUpperCase())}
                    placeholder="Ex: JLS-1020"
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                  <datalist id="onibus-sugestoes">
                    {FROTA_MOCK.map((onibus) => (
                      <option key={onibus.id} value={onibus.placa} />
                    ))}
                  </datalist>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motorista" className="text-[#103173] font-bold">
                    Motorista
                  </Label>
                  <Input
                    id="motorista"
                    list="motoristas-sugestoes"
                    value={formData.motoristaNome}
                    onChange={(event) => atualizarCampo("motoristaNome", event.target.value)}
                    placeholder="Ex: João Silva"
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                  <datalist id="motoristas-sugestoes">
                    {MOTORISTAS_GESTAO_MOCK.map((motorista) => (
                      <option key={motorista.id} value={motorista.nome} />
                    ))}
                  </datalist>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-[#103173] font-black text-xl">Operação e Controle</CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inscritos" className="text-[#103173] font-bold">
                    Inscritos
                  </Label>
                  <Input
                    id="inscritos"
                    type="number"
                    min={0}
                    max={120}
                    value={formData.inscritos}
                    onChange={(event) => atualizarCampo("inscritos", event.target.value)}
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacidade" className="text-[#103173] font-bold">
                    Capacidade
                  </Label>
                  <Input
                    id="capacidade"
                    type="number"
                    min={1}
                    max={120}
                    value={formData.capacidade}
                    onChange={(event) => atualizarCampo("capacidade", event.target.value)}
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quorum" className="text-[#103173] font-bold">
                    Quórum Mínimo
                  </Label>
                  <Input
                    id="quorum"
                    type="number"
                    min={0}
                    max={120}
                    value={formData.quorumMinimo}
                    onChange={(event) => atualizarCampo("quorumMinimo", event.target.value)}
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
                    onChange={(event) => atualizarCampo("status", event.target.value as StatusViagem)}
                    className="h-11 w-full rounded-md border border-[#73AABF]/30 bg-white px-3 text-sm text-[#103173] font-bold focus:outline-none focus:ring-2 focus:ring-[#103173]/40"
                  >
                    <option value="programada">Programada</option>
                    <option value="em_andamento">Em andamento</option>
                    <option value="concluida">Concluída</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="codigo-checkin" className="text-[#103173] font-bold">
                    Código de Check-in (opcional)
                  </Label>
                  <Input
                    id="codigo-checkin"
                    value={formData.codigoCheckin}
                    onChange={(event) => atualizarCampo("codigoCheckin", event.target.value.toUpperCase())}
                    placeholder="Ex: UEFS-7729-X"
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
                    placeholder="Notas operacionais, regras da rota, restrições ou avisos..."
                    className="min-h-28 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-2">
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
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 xl:sticky xl:top-24 h-fit">
            <Card className="border-none shadow-lg bg-white overflow-hidden">
              <CardHeader className="bg-[#103173] text-white py-5">
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <Route className="h-5 w-5 text-[#F2D022]" />
                  Pré-visualização
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#73AABF]">Viagem</p>
                    <p className="text-xl font-black text-[#103173]">{formData.id}</p>
                  </div>
                  <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-[#E4F2F1] p-4 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#73AABF]">Trajeto</p>
                  <p className="text-sm font-black text-[#103173] flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {formData.origem || "---"}
                    <span className="text-[#73AABF]">→</span>
                    {formData.destino || "---"}
                  </p>
                  <p className="text-xs font-bold text-[#73AABF]">
                    {formData.data || "--/--/----"} • {formData.horarioSaida || "--:--"} -{" "}
                    {formData.horarioChegada || "--:--"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <ResumoItem icon={Bus} label="Ônibus" value={formData.onibusPlaca || "---"} />
                  <ResumoItem icon={UserCircle} label="Motorista" value={formData.motoristaNome || "---"} />
                  <ResumoItem icon={UserRound} label="Inscritos" value={String(inscritosPreview)} />
                  <ResumoItem icon={CheckCircle2} label="Quórum" value={String(quorumPreview)} />
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#73AABF]">Ocupação</p>
                  <div className="w-full h-3 bg-white border border-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#103173]" style={{ width: `${ocupacaoPreview}%` }} />
                  </div>
                  <p className="text-sm font-black text-[#103173]">
                    {inscritosPreview}/{capacidadePreview} ({ocupacaoPreview.toFixed(0)}%)
                  </p>
                </div>

                {formData.codigoCheckin ? (
                  <Badge className="bg-[#103173] text-white font-bold">CHECK-IN {formData.codigoCheckin}</Badge>
                ) : null}
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
                      CADASTRAR VIAGEM
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 border-2 border-[#103173] text-[#103173] font-black hover:bg-[#103173] hover:text-white"
                  onClick={() => router.push("/admin/viagens")}
                >
                  CANCELAR
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-md bg-white">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="bg-[#103173]/10 p-2 rounded-lg">
                  <CalendarDays className="h-4 w-4 text-[#103173]" />
                </div>
                <p className="text-xs font-bold text-[#103173] leading-relaxed">
                  Dados mockados consistentes com as telas já prontas: `ROT-001`, `ROT-9901`,
                  `JLS-1020`, `João Silva` e código `UEFS-7729-X`.
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

export default function CadastroEdicaoViagemPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#E4F2F1]">A carregar formulário...</div>}>
      <ViagemFormContent />
    </Suspense>
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
