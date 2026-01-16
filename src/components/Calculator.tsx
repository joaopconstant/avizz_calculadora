import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Percent } from "lucide-react";
import { toPercent, formatCurrency } from "@/lib/utils";
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

export default function Calculator() {
  const [invoicing, setInvoicing] = useState<number[] | number>([100000]);
  const [terminalTax, setTerminalTax] = useState<number>(1.5);
  const [split, setSplit] = useState<number>(60);
  const [regimeTax, setRegimeTax] = useState<string>("simples");
  const [customTax, setCustomTax] = useState<number>(15);

  const regimeOptions = [
    { id: "simples", label: "Simples Nacional", value: 12 },
    { id: "lucro-presumido", label: "Lucro Presumido", value: 17 },
    { id: "outro", label: "Outro", value: 0 },
  ];

  const currentInvoicing = Array.isArray(invoicing) ? invoicing[0] : invoicing;

  const selectedRegime = regimeOptions.find((opt) => opt.id === regimeTax);
  const taxValue =
    regimeTax === "outro" ? customTax : selectedRegime?.value || 12;

  const netvalue = currentInvoicing - currentInvoicing * toPercent(terminalTax);

  const oldTaxValue = netvalue * toPercent(taxValue);
  const newTaxValue = netvalue * (1 - toPercent(split)) * toPercent(taxValue);

  const monthlyProfit = oldTaxValue - newTaxValue;
  const yearlyProfit = monthlyProfit * 12;

  const neonGreen = "#29ff00";

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 md:gap-8 items-start pb-8">
      {/* --- Left Column: Inputs --- */}
      <div className="w-full max-w-2xl space-y-8">
        <div>
          <h1 className="text-3xl text-center font-bold flex items-center gap-3">
            Calculadora de Potencial Financeiro
          </h1>
          <p className="text-muted-foreground mt-2 text-start">
            Descubra quanto dinheiro você está deixando na mesa. Simule o
            impacto do Split de Pagamentos na sua operação.
          </p>
        </div>

        <div className="space-y-6">
          {/* 1. Faturamento Mensal */}
          <div className="space-y-4 bg-card/50 p-6 pb-11 rounded-xl border border-border/50 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <Label className="text-lg font-medium">
                Faturamento Mensal Estimado
              </Label>
              <span className="text-xl font-bold" style={{ color: neonGreen }}>
                {formatCurrency(currentInvoicing)}
              </span>
            </div>
            <Slider
              value={[currentInvoicing]}
              min={0}
              max={2000000}
              step={5000}
              onValueChange={(val) => setInvoicing(val)}
              className="pt-4 cursor-pointer"
            />
            <p className="text-sm text-muted-foreground">
              Arraste para ajustar o faturamento da sua empresa.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 pt-6 gap-6">
              {/* 2. Taxa Maquininha */}
              <div className="space-y-2">
                <Label htmlFor="taxa-maquina">Taxa da Maquininha</Label>
                <div className="relative">
                  <Input
                    id="taxa-maquina"
                    type="number"
                    value={terminalTax}
                    onChange={(e) => setTerminalTax(Number(e.target.value))}
                    className="pl-3 pr-8"
                    step="0.1"
                  />
                  <Percent className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Taxa média das vendas
                </p>
              </div>

              {/* 3. Repasse aos Parceiros */}
              <div className="space-y-2">
                <Label htmlFor="repasse">Repasse aos Parceiros </Label>
                <div className="relative">
                  <Input
                    id="repasse"
                    type="number"
                    value={split}
                    onChange={(e) => setSplit(Number(e.target.value))}
                    className="pl-3 pr-8"
                  />
                  <Percent className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Total dos repasses
                </p>
              </div>

              {/* 4. Regime Tributário */}
              <div className="space-y-2">
                <Label>Regime Tributário</Label>
                <Select value={regimeTax} onValueChange={setRegimeTax}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o regime" />
                  </SelectTrigger>
                  <SelectContent>
                    {regimeOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}{" "}
                        {option.value > 0 && `(${option.value}%)`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Manual Tax Rate Input if "Outro" selected */}
              {regimeTax == "outro" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label htmlFor="aliquota-manual">Alíquota de Imposto</Label>
                  <div className="relative">
                    <Input
                      id="aliquota-manual"
                      type="number"
                      value={customTax}
                      onChange={(e) => setCustomTax(Number(e.target.value))}
                      className="pl-3 pr-8"
                    />
                    <Percent className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- Right Column: Results --- */}
      <div className="w-full min-w-[320px] mt-6 lg:mt-0 ">
        <Card className="border-border/10 bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden">
          {/* Glow effect at top right */}

          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#29ff00]">
              <TrendingUp className="w-5 h-5" />
              POTENCIAL INEXPLORADO
            </CardTitle>
            <CardDescription>
              Veja o quanto você economiza ajustando sua operação.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-8">
            {/* Monthly Savings Items */}
            <div className="space-y-3 flex flex-col md:flex-row justify-evenly">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Total de Impostos sem Split
                </p>
                <span className="text-3xl font-bold text-red-400 wrap-break-word">
                  - {formatCurrency(oldTaxValue)}
                </span>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Total de Impostos com Split
                </p>
                <span className="text-3xl font-bold wrap-break-word">
                  - {formatCurrency(newTaxValue)}
                </span>
              </div>
            </div>

            <Separator className="bg-border/60" />

            <div>
              <p className="text-sm uppercase tracking-wider font-semibold text-muted-foreground mb-2">
                No seu bolso em 1 mês
              </p>
              <span className="text-4xl font-bold italic wrap-break-word">
                + {formatCurrency(monthlyProfit)}
              </span>
            </div>

            <Separator className="bg-border/60" />

            {/* Weekly/Annual Total */}
            <div>
              <p className="text-sm uppercase tracking-wider font-semibold text-muted-foreground mb-2">
                No seu bolso em 1 ano
              </p>
              <div
                className="text-[40px] lg:text-5xl italic font-extrabold tracking-tight wrap-break-word"
                style={{
                  color: neonGreen,
                  textShadow: `0 0 20px ${neonGreen}40`,
                }}
              >
                + {formatCurrency(yearlyProfit)}
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
  );
}
