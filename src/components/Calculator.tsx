import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Calculator as CalculatorIcon,
  TrendingUp,
  Percent,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Calculator() {
  const [faturamento, setFaturamento] = useState<number[] | number>([100000]);
  const [taxaMaquina, setTaxaMaquina] = useState<number>(1.5);
  const [repasse, setRepasse] = useState<number>(60);
  const [regime, setRegime] = useState<string>("simples");
  const [aliquotaManual, setAliquotaManual] = useState<number>(15);

  const currentRevenue = Array.isArray(faturamento)
    ? faturamento[0]
    : faturamento;

  // --- 2. Logic & Calculations ---

  const taxOptions = [
    { id: "simples", label: "Simples Nacional", value: 12 },
    { id: "lucro-presumido", label: "Lucro Presumido", value: 16.33 },
    { id: "outro", label: "Outro (Personalizado)", value: 0 },
  ];

  // Busca o valor baseado no ID selecionado
  const selectedOption = taxOptions.find((opt) => opt.id === regime);

  // Se for "outro", usa o valor manual. Se não, usa o valor da opção ou o padrão de 15%.
  const currentTaxValue =
    regime === "outro" ? aliquotaManual : selectedOption?.value || 12;
  const taxRate = currentTaxValue / 100;
  const machineRate = taxaMaquina / 100;
  const splitRate = repasse / 100;

  // Imposto sobre TUDO
  const impostoSemSplit = currentRevenue * taxRate;
  // Taxa Maquininha sobre TUDO
  const taxaMaquinaSemSplit = currentRevenue * machineRate;

  // Receita Real = Faturamento * (100% - % Repasse) -> Parte que fica na empresa
  // O imposto incide apenas sobre a parte dele (Receita Real)
  const receitaReal = currentRevenue * (1 - splitRate);

  const impostoComSplit = receitaReal * taxRate;

  // Taxa Maquininha (Sua Parte) = Receita Real * Taxa Maquina
  const taxaMaquinaComSplit = receitaReal * machineRate;

  // --- 3. Results ---

  // A) Economia Mensal de Impostos
  const economiaImpostos = impostoSemSplit - impostoComSplit;

  // B) Economia com Taxas de Cartão
  // "Lógica: Aqui mostramos que ele parou de pagar a taxa do cartão sobre o dinheiro do parceiro."
  const economiaTaxas = taxaMaquinaSemSplit - taxaMaquinaComSplit;

  // C) RESULTADO FINAL: Lucro Extra Anual
  const lucroExtraAnual = (economiaImpostos + economiaTaxas) * 12;

  // --- Formatting ---
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Custom accent color style
  const neonGreen = "#29ff00";

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center justify-center font-sans selection:bg-[#29ff00] selection:text-black">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* --- Left Column: Inputs --- */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <CalculatorIcon
                className="w-8 h-8"
                style={{ color: neonGreen }}
              />
              Calculadora de Potencial Financeiro
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Descubra quanto dinheiro você está deixando na mesa. Simule o
              impacto do Split de Pagamentos na sua operação.
            </p>
          </div>

          <div className="space-y-6">
            {/* 1. Faturamento Mensal */}
            <div className="space-y-4 bg-card p-6 rounded-xl border border-border/50 shadow-sm">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-medium">
                  Faturamento Mensal Estimado
                </Label>
                <span
                  className="text-xl font-bold"
                  style={{ color: neonGreen }}
                >
                  {formatCurrency(currentRevenue)}
                </span>
              </div>
              <Slider
                value={[currentRevenue]}
                min={0}
                max={2000000}
                step={1000}
                onValueChange={(val) => setFaturamento(val)}
                className="py-4 cursor-pointer"
              />
              <p className="text-sm text-muted-foreground">
                Arraste para ajustar o faturamento da clínica/empresa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 2. Taxa Maquininha */}
              <div className="space-y-2">
                <Label htmlFor="taxa-maquina">
                  Taxa Média da Maquininha (%)
                </Label>
                <div className="relative">
                  <Input
                    id="taxa-maquina"
                    type="number"
                    value={taxaMaquina}
                    onChange={(e) => setTaxaMaquina(Number(e.target.value))}
                    className="pl-3 pr-8"
                    step="0.1"
                  />
                  <Percent className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              {/* 3. Repasse aos Parceiros */}
              <div className="space-y-2">
                <Label htmlFor="repasse">Repasse aos Parceiros (%)</Label>
                <div className="relative">
                  <Input
                    id="repasse"
                    type="number"
                    value={repasse}
                    onChange={(e) => setRepasse(Number(e.target.value))}
                    className="pl-3 pr-8"
                  />
                  <Percent className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Parcela que vai para parceiros.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Regime Tributário</Label>
                <Select value={regime} onValueChange={setRegime}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o regime" />
                  </SelectTrigger>
                  <SelectContent>
                    {taxOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}{" "}
                        {option.value > 0 && `(${option.value}%)`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Manual Tax Rate Input if "Outro" selected */}
              {regime == "outro" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label htmlFor="aliquota-manual">
                    Alíquota de Imposto Estimada (%)
                  </Label>
                  <div className="relative">
                    <Input
                      id="aliquota-manual"
                      type="number"
                      value={aliquotaManual}
                      onChange={(e) =>
                        setAliquotaManual(Number(e.target.value))
                      }
                      className="pl-3 pr-8"
                    />
                    <Percent className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. Regime Tributário */}

        {/* --- Right Column: Results --- */}
        <div className="lg:col-span-5 relative mt-6 lg:mt-0">
          <Card className="border-border/10 bg-card/50 backdrop-blur-sm shadow-2xl relative overflow-hidden">
            {/* Glow effect at top right */}
            <div
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: neonGreen }}
            />

            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#29ff00]">
                <TrendingUp className="w-5 h-5" />
                POTENCIAL INEXPLORADO
              </CardTitle>
              <CardDescription>
                Veja o quanto você economiza ajustando sua operação.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Monthly Savings Items */}
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Economia Mensal de Impostos
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      {formatCurrency(economiaImpostos)}
                    </span>
                  </div>
                </div>

                <Separator className="bg-border/40" />

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Economia Mensal com Taxas de Cartão
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      {formatCurrency(economiaTaxas)}
                    </span>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/60" />

              {/* Weekly/Annual Total */}
              <div className="pt-2">
                <p className="text-sm uppercase tracking-wider font-semibold text-muted-foreground mb-2">
                  No seu bolso em 1 ano
                </p>
                <div
                  className="text-5xl font-extrabold tracking-tight"
                  style={{
                    color: neonGreen,
                    textShadow: `0 0 20px ${neonGreen}40`,
                  }}
                >
                  {formatCurrency(lucroExtraAnual)}
                </div>
                <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                  Em um ano, você coloca esse valor a mais no bolso sem precisar
                  vender nada a mais, apenas otimizando sua tributação com Split
                  de Pagamentos.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
