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
import {
  FROTA_MOCK,
  MOTORISTAS_MOCK,
  ROTAS_MOCK,
  gerarProximoIdOnibus,
  type OnibusFrota,
  type StatusOnibus,
} from "@/lib/mock/frota";
import {
  ArrowLeft,
  Bus,
  CalendarDays,
  Gauge,
  Plus,
  Route,
  Save,
  ShieldAlert,
  UserCircle,
  UserRound,
  Wrench,
} from "lucide-react";

interface OnibusFormState {
  id: string;
  placa: string;
  modelo: string;
  ano: string;
  capacidade: string;
  motorista: string;
  rotaPrincipal: string;
  rotasVinculadas: string;
  viagensHoje: string;
  ocupacaoMedia: string;
  ultimaManutencao: string;
  proximaManutencao: string;
  status: StatusOnibus;
  codigoEmbarqueAtivo: string;
  observacoes: string;
}

function montarEstadoInicial(onibus?: OnibusFrota): OnibusFormState {
  if (!onibus) {
    return {
      id: gerarProximoIdOnibus(),
      placa: "",
      modelo: "",
      ano: "2026",
      capacidade: "44",
      motorista: "A definir",
      rotaPrincipal: "",
      rotasVinculadas: "",
      viagensHoje: "0",
      ocupacaoMedia: "0",
      ultimaManutencao: "",
      proximaManutencao: "",
      status: "ativo",
      codigoEmbarqueAtivo: "",
      observacoes: "",
    };
  }

  return {
    id: onibus.id,
    placa: onibus.placa,
    modelo: onibus.modelo,
    ano: String(onibus.ano),
    capacidade: String(onibus.capacidade),
    motorista: onibus.motorista,
    rotaPrincipal: onibus.rotaPrincipal,
    rotasVinculadas: onibus.rotasVinculadas.join(", "),
    viagensHoje: String(onibus.viagensHoje),
    ocupacaoMedia: String(onibus.ocupacaoMedia),
    ultimaManutencao: onibus.ultimaManutencao,
    proximaManutencao: "25/03/2026",
    status: onibus.status,
    codigoEmbarqueAtivo: onibus.codigoEmbarqueAtivo ?? "",
    observacoes:
      onibus.status === "manutencao"
        ? "Veículo em manutenção preventiva. Sem alocação de escala."
        : "Veículo apto para operação no calendário semanal.",
  };
}

function getStatusBadge(status: StatusOnibus) {
  if (status === "ativo") {
    return {
      label: "ATIVO",
      className: "bg-[#23B99A] text-white font-bold",
    };
  }

  if (status === "manutencao") {
    return {
      label: "EM MANUTENÇÃO",
      className: "bg-orange-500 text-white font-bold",
    };
  }

  return {
    label: "INATIVO",
    className: "bg-slate-400 text-white font-bold",
  };
}

function normalizarRotas(rotasTexto: string) {
  return rotasTexto
    .split(",")
    .map((rota) => rota.trim())
    .filter(Boolean);
}

export default function CadastroEdicaoOnibusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modoNovo = searchParams.get("modo") === "novo";
  const id = searchParams.get("id");

  const onibusSelecionado = useMemo(
    () => (id ? FROTA_MOCK.find((item) => item.id === id) : undefined),
    [id],
  );
  const emEdicao = Boolean(onibusSelecionado) && !modoNovo;
  const referenciaInvalida = Boolean(id) && !onibusSelecionado && !modoNovo;

  const [formData, setFormData] = useState<OnibusFormState>(() =>
    montarEstadoInicial(modoNovo ? undefined : onibusSelecionado),
  );

  useEffect(() => {
    setFormData(montarEstadoInicial(modoNovo ? undefined : onibusSelecionado));
  }, [modoNovo, onibusSelecionado]);

  const rotasEmTela = useMemo(
    () => normalizarRotas(formData.rotasVinculadas),
    [formData.rotasVinculadas],
  );
  const statusBadge = getStatusBadge(formData.status);
  const ocupacaoPreview = Math.max(0, Math.min(100, Number(formData.ocupacaoMedia) || 0));

  const atualizarCampo = <K extends keyof OnibusFormState>(campo: K, valor: OnibusFormState[K]) => {
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

    if (!formData.placa.trim() || !formData.modelo.trim() || !formData.rotaPrincipal.trim()) {
      window.alert("Preencha ao menos Placa, Modelo e Rota Principal.");
      return;
    }

    const mensagem = emEdicao
      ? `Protótipo: ônibus ${formData.placa} atualizado com sucesso.`
      : `Protótipo: ônibus ${formData.placa || formData.id} cadastrado com sucesso.`;

    window.alert(mensagem);
    router.push("/admin");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1] pb-24">
      <Navigation />

      <main className="flex-1 w-full max-w-6xl mx-auto py-10 px-4 space-y-6">
        <Button
          variant="ghost"
          className="w-fit text-[#103173] font-black hover:bg-[#103173]/10"
          onClick={() => router.push("/admin")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          VOLTAR PARA GESTÃO DE ÔNIBUS
        </Button>

        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-[#103173] flex items-center gap-3 tracking-tight">
              <div className="bg-[#103173] p-2 rounded-xl shadow-lg shadow-[#103173]/20">
                <Bus className="h-7 w-7 text-[#F2D022]" />
              </div>
              {emEdicao ? "Edição de Ônibus" : "Cadastro de Ônibus"}
            </h1>
            <p className="text-[#73AABF] font-bold text-sm md:text-base">
              Formulário administrativo mockado para criação e atualização da frota.
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
                Ônibus não encontrado para edição. O formulário foi aberto no modo cadastro.
              </p>
            </CardContent>
          </Card>
        ) : null}

        <form className="grid xl:grid-cols-[1.35fr_1fr] gap-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <Card className="border-none shadow-lg bg-white">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-[#103173] font-black text-xl">Dados do Veículo</CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#103173] font-bold">Código Interno</Label>
                  <Input value={formData.id} disabled className="h-11 bg-slate-50 border-slate-200 font-bold" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="placa" className="text-[#103173] font-bold">
                    Placa
                  </Label>
                  <Input
                    id="placa"
                    value={formData.placa}
                    onChange={(event) => atualizarCampo("placa", event.target.value.toUpperCase())}
                    placeholder="ABC-1234"
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173] font-bold"
                    required
                  />
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="modelo" className="text-[#103173] font-bold">
                    Modelo
                  </Label>
                  <Input
                    id="modelo"
                    value={formData.modelo}
                    onChange={(event) => atualizarCampo("modelo", event.target.value)}
                    placeholder="Ex: Marcopolo Torino"
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ano" className="text-[#103173] font-bold">
                    Ano
                  </Label>
                  <Input
                    id="ano"
                    type="number"
                    min={2010}
                    max={2035}
                    value={formData.ano}
                    onChange={(event) => atualizarCampo("ano", event.target.value)}
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
                    min={10}
                    max={80}
                    value={formData.capacidade}
                    onChange={(event) => atualizarCampo("capacidade", event.target.value)}
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-[#103173] font-bold">
                    Status Operacional
                  </Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(event) => atualizarCampo("status", event.target.value as StatusOnibus)}
                    className="h-11 w-full rounded-md border border-[#73AABF]/30 bg-white px-3 text-sm text-[#103173] font-bold focus:outline-none focus:ring-2 focus:ring-[#103173]/40"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="manutencao">Manutenção</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motorista" className="text-[#103173] font-bold">
                    Motorista Responsável
                  </Label>
                  <Input
                    id="motorista"
                    list="motoristas-sugestoes"
                    value={formData.motorista}
                    onChange={(event) => atualizarCampo("motorista", event.target.value)}
                    placeholder="Ex: João Silva"
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                  <datalist id="motoristas-sugestoes">
                    {MOTORISTAS_MOCK.map((motorista) => (
                      <option key={motorista} value={motorista} />
                    ))}
                  </datalist>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-[#103173] font-black text-xl">Escalas e Rotas</CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="rota-principal" className="text-[#103173] font-bold">
                    Rota Principal
                  </Label>
                  <Input
                    id="rota-principal"
                    value={formData.rotaPrincipal}
                    onChange={(event) => atualizarCampo("rotaPrincipal", event.target.value)}
                    placeholder="Ex: Salvador → Feira de Santana"
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                    required
                  />
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
                    placeholder="Separe por vírgula. Ex: ROT-001, ROT-002, ROT-9901"
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
                  <Label htmlFor="ocupacao-media" className="text-[#103173] font-bold">
                    Ocupação Média (%)
                  </Label>
                  <Input
                    id="ocupacao-media"
                    type="number"
                    min={0}
                    max={100}
                    value={formData.ocupacaoMedia}
                    onChange={(event) => atualizarCampo("ocupacaoMedia", event.target.value)}
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="codigo-embarque" className="text-[#103173] font-bold">
                    Código de Embarque Ativo (opcional)
                  </Label>
                  <Input
                    id="codigo-embarque"
                    value={formData.codigoEmbarqueAtivo}
                    onChange={(event) => atualizarCampo("codigoEmbarqueAtivo", event.target.value.toUpperCase())}
                    placeholder="Ex: UEFS-7729-X"
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-[#103173] font-black text-xl">Manutenção e Notas</CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ultima-manutencao" className="text-[#103173] font-bold">
                    Última Manutenção
                  </Label>
                  <Input
                    id="ultima-manutencao"
                    value={formData.ultimaManutencao}
                    onChange={(event) => atualizarCampo("ultimaManutencao", event.target.value)}
                    placeholder="DD/MM/AAAA"
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proxima-manutencao" className="text-[#103173] font-bold">
                    Próxima Manutenção
                  </Label>
                  <Input
                    id="proxima-manutencao"
                    value={formData.proximaManutencao}
                    onChange={(event) => atualizarCampo("proximaManutencao", event.target.value)}
                    placeholder="DD/MM/AAAA"
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
                    placeholder="Notas de operação, restrições, observações de manutenção..."
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
                  <Gauge className="h-5 w-5 text-[#F2D022]" />
                  Pré-visualização
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#73AABF]">Placa</p>
                    <p className="text-2xl font-black text-[#103173]">{formData.placa || "---"}</p>
                  </div>
                  <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <ResumoItem icon={UserRound} label="Capacidade" value={`${formData.capacidade || "0"} lugares`} />
                  <ResumoItem icon={CalendarDays} label="Viagens Hoje" value={formData.viagensHoje || "0"} />
                  <ResumoItem icon={UserCircle} label="Motorista" value={formData.motorista || "A definir"} />
                  <ResumoItem icon={Wrench} label="Última Manutenção" value={formData.ultimaManutencao || "---"} />
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#73AABF]">
                    Ocupação Média
                  </p>
                  <div className="w-full h-3 bg-white border border-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#103173]" style={{ width: `${ocupacaoPreview}%` }} />
                  </div>
                  <p className="text-sm font-black text-[#103173]">{ocupacaoPreview}%</p>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#73AABF]">
                    Rotas Vinculadas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {rotasEmTela.length > 0 ? (
                      rotasEmTela.map((rota) => (
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
                      CADASTRAR ÔNIBUS
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 border-2 border-[#103173] text-[#103173] font-black hover:bg-[#103173] hover:text-white"
                  onClick={() => router.push("/admin")}
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
                  Dados mockados integrados com telas já prontas: `JLS-1020`, rotas `ROT-001/002`, código
                  `UEFS-7729-X` e motorista `João Silva`.
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
