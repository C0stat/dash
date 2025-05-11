'use client';
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

function downloadCSV(data: any[], filename: string) {
  const csv = [
    Object.keys(data[0]).join(","),
    ...data.map(row => Object.values(row).join(","))
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function InvestmentDashboard() {
  const [modoEscuro, setModoEscuro] = useState(true);
  const [graficoFinanceiro, setGraficoFinanceiro] = useState(true);
  const [rentabilidade, setRentabilidade] = useState(3.55);
  const [investInicial, setInvestInicial] = useState(20000);
  const [aporteMensal, setAporteMensal] = useState(1500);
  const [aporteSazonal, setAporteSazonal] = useState(8000);
  const [mesSazonal, setMesSazonal] = useState(4);
  const [vendasMensais, setVendasMensais] = useState(40);
  const [novosInvestidoresMensaisN1, setNovosInvestidoresMensaisN1] = useState(0);
  const [nMeses, setNMeses] = useState(12);
  const [filtroRange, setFiltroRange] = useState<[number, number]>([1, 12]);
  const [n1, setN1] = useState(5); // Investidores já existentes
  const [n2, setN2] = useState(0);
  const [n3, setN3] = useState(0);
  const [mostrarGraficoRede, setMostrarGraficoRede] = useState(false);
  const [investInicialIndicado, setInvestInicialIndicado] = useState(20000);
  const [aporteMensalIndicado, setAporteMensalIndicado] = useState(1000);
  const [aporteSazonalIndicado, setAporteSazonalIndicado] = useState(5000);
  const [investirLicencas, setInvestirLicencas] = useState(false);
  const [investirComissoes, setInvestirComissoes] = useState(false);
  const historicoInvestidores = [];
  const licencaAfiliado = 1200.0;

const simulate = () => {
  let capital = investInicial;
  let simulacao = [];
  let totalLucro = 0;
  let totalReceitaLicenca = 0;
  let totalComissao = 0;

  let totalN1 = n1;
  let totalN2 = n2;
  let totalN3 = n3;

  let capitalIndicadoN1 = totalN1 * investInicialIndicado;
  let capitalIndicadoN2 = totalN2 * investInicialIndicado;
  let capitalIndicadoN3 = totalN3 * investInicialIndicado;

  for (let mes = 1; mes <= nMeses; mes++) {
    const antigosN1 = totalN1;
    const novosN1 = novosInvestidoresMensaisN1 + vendasMensais;
    totalN1 += novosN1;

    const antigosN2 = totalN2;
    const antigosN3 = totalN3;

    // Aportes mensais apenas nos investidores antigos
    capital += aporteMensal;
    capitalIndicadoN1 += antigosN1 * aporteMensalIndicado;
    capitalIndicadoN2 += antigosN2 * aporteMensalIndicado;
    capitalIndicadoN3 += antigosN3 * aporteMensalIndicado;

    if (mes === mesSazonal) {
      capital += aporteSazonal;
      capitalIndicadoN1 += antigosN1 * aporteSazonalIndicado;
      capitalIndicadoN2 += antigosN2 * aporteSazonalIndicado;
      capitalIndicadoN3 += antigosN3 * aporteSazonalIndicado;
    }

    // Novos N1 entram apenas com investimento inicial
    capitalIndicadoN1 += novosN1 * investInicialIndicado;

    // Crescimento de N2 e N3 (apenas com investimento inicial)
    if (mes % 3 === 0) {
      const novosN2 = Math.floor(totalN1 * 0.05);
      const novosN3 = Math.floor(totalN2 * 0.05);
      totalN2 += novosN2;
      totalN3 += novosN3;
      capitalIndicadoN2 += novosN2 * investInicialIndicado;
      capitalIndicadoN3 += novosN3 * investInicialIndicado;
    }

    // Cálculo de lucros
    const lucro = capital * (rentabilidade / 100);
    const lucroIndicadoN1 = capitalIndicadoN1 * (rentabilidade / 100);
    const lucroIndicadoN2 = capitalIndicadoN2 * (rentabilidade / 100);
    const lucroIndicadoN3 = capitalIndicadoN3 * (rentabilidade / 100);

    capital += lucro;
    capitalIndicadoN1 += lucroIndicadoN1;
    capitalIndicadoN2 += lucroIndicadoN2;
    capitalIndicadoN3 += lucroIndicadoN3;

    const receitaLicenca = vendasMensais * licencaAfiliado;
    const comissao = (lucroIndicadoN1 * 0.55) + (lucroIndicadoN2 * 0.25) + (lucroIndicadoN3 * 0.15);

    if (investirLicencas) capital += receitaLicenca;
    if (investirComissoes) capital += comissao;

    totalLucro += lucro;
    totalReceitaLicenca += receitaLicenca;
    totalComissao += comissao;

    simulacao.push({
      mes: `Mês ${mes}`,
      capital: parseFloat(capital.toFixed(2)),
      lucro: parseFloat(lucro.toFixed(2)),
      receitaLicenca: parseFloat(receitaLicenca.toFixed(2)),
      comissao: parseFloat(comissao.toFixed(2)),
      capitalIndicadoN1: parseFloat(capitalIndicadoN1.toFixed(2)),
      capitalIndicadoN2: parseFloat(capitalIndicadoN2.toFixed(2)),
      capitalIndicadoN3: parseFloat(capitalIndicadoN3.toFixed(2)),
      investidoresN1: totalN1,
      investidoresN2: totalN2,
      investidoresN3: totalN3,
      capitalRedeN1: parseFloat(capitalIndicadoN1.toFixed(2)),
      capitalRedeN2: parseFloat(capitalIndicadoN2.toFixed(2)),
      capitalRedeN3: parseFloat(capitalIndicadoN3.toFixed(2)),
      mediaN1: parseFloat((capitalIndicadoN1 / totalN1).toFixed(2)),
      mediaN2: totalN2 > 0 ? parseFloat((capitalIndicadoN2 / totalN2).toFixed(2)) : 0,
      mediaN3: totalN3 > 0 ? parseFloat((capitalIndicadoN3 / totalN3).toFixed(2)) : 0,
    });

    historicoInvestidores.push({ mes, totalN1, totalN2, totalN3 });
  }

  return {
    data: simulacao,
    totalLucro,
    totalReceitaLicenca,
    totalComissao,
    capitalFinal: capital,
  };
};

  const {
    data,
    totalLucro,
    totalReceitaLicenca,
    totalComissao,
    capitalFinal
  } = simulate();

  const dataFiltrada = data.slice(filtroRange[0] - 1, filtroRange[1]);

  return (
    <div className={`p-6 space-y-6 min-h-screen font-sans ${modoEscuro ? 'bg-[#0c0c0c] text-white' : 'bg-white text-black'}`}>
      <div className="flex items-center gap-4">
        <img
          src="https://www.blackhole.capital/_next/image?url=%2Fstatic%2Fblackholewhite.png&w=256&q=75"
          alt="Blackhole Capital"
          className="h-12"
        />
        <h1 className="text-3xl font-bold text-white">Projeção de Investimentos</h1>
       
      </div>

      <Separator className="bg-cyan-400 my-4" />

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div>
    <label className="text-sm">Investimento Inicial</label>
    <Input
      type="number"
      className="appearance-none"
      style={{ MozAppearance: 'textfield' }}
      value={investInicial}
      onChange={(e) => setInvestInicial(+e.target.value)}
    />
  </div>
  <div>
    <label className="text-sm">Investimento Inicial dos Indicados</label>
    <Input
      type="number"
      className="appearance-none"
      style={{ MozAppearance: 'textfield' }}
      value={investInicialIndicado}
      onChange={(e) => setInvestInicialIndicado(+e.target.value)}
    />
  </div>
  <div>
    <label className="text-sm">Aporte Mensal dos Indicados</label>
    <Input
      type="number"
      className="appearance-none"
      style={{ MozAppearance: 'textfield' }}
      value={aporteMensalIndicado}
      onChange={(e) => setAporteMensalIndicado(+e.target.value)}
    />
  </div>
  <div>
    <label className="text-sm">Aporte Sazonal dos Indicados</label>
    <Input
      type="number"
      className="appearance-none"
      style={{ MozAppearance: 'textfield' }}
      value={aporteSazonalIndicado}
      onChange={(e) => setAporteSazonalIndicado(+e.target.value)}
    />
  </div>
  <div>
    <label className="text-sm">Aporte Mensal</label>
    <Input
      type="number"
      className="appearance-none"
      style={{ MozAppearance: 'textfield' }}
      value={aporteMensal}
      onChange={(e) => setAporteMensal(+e.target.value)}
    />
  </div>
  <div>
    <label className="text-sm">Aporte Sazonal</label>
    <Input
      type="number"
      className="appearance-none"
      style={{ MozAppearance: 'textfield' }}
      value={aporteSazonal}
      onChange={(e) => setAporteSazonal(+e.target.value)}
    />
  </div>
  <div>
    <label className="text-sm">Mês do Aporte Sazonal</label>
    <Input
      type="number"
      className="appearance-none"
      style={{ MozAppearance: 'textfield' }}
      value={mesSazonal}
      onChange={(e) => setMesSazonal(+e.target.value)}
    />
  </div>
  <div>
    <label className="text-sm">Rentabilidade (%)</label>
    <Input
      type="number"
      className="appearance-none"
      style={{ MozAppearance: 'textfield' }}
      value={rentabilidade}
      onChange={(e) => setRentabilidade(+e.target.value)}
    />
  </div>
  <div>
    <label className="text-sm">Vendas Mensais</label>
    <Input
      type="number"
      className="appearance-none"
      style={{ MozAppearance: 'textfield' }}
      value={vendasMensais}
      onChange={(e) => setVendasMensais(+e.target.value)}
    />
  </div>
  <div>
    <label className="text-sm">Investidores N1 (iniciais)</label>
    <Input
      type="number"
      className="appearance-none"
      style={{ MozAppearance: 'textfield' }}
      value={n1}
      onChange={(e) => setN1(+e.target.value)}
    />
  </div>
  <div>
    <label className="text-sm">Meses de Simulação</label>
    <Input
      type="number"
      className="appearance-none"
      style={{ MozAppearance: 'textfield' }}
      value={nMeses}
      onChange={(e) => {
        const novo = +e.target.value;
        setNMeses(novo);
        setFiltroRange([1, novo]);
      }}
    />
  </div>
</div>

      <div className="col-span-1 md:col-span-3 flex items-center gap-6 mt-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={investirLicencas} onChange={(e) => setInvestirLicencas(e.target.checked)} />
          Investir receita de licenças
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={investirComissoes} onChange={(e) => setInvestirComissoes(e.target.checked)} />
          Investir receita de comissões recebidas
        </label>
      </div>

      <Separator className="bg-cyan-400 my-4" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <Card className="bg-gradient-to-br from-cyan-500/30 to-transparent border border-cyan-400">
          <CardContent className="p-4 text-white dark:text-white">
            <p className="text-sm">Capital Final</p>
            <p className="text-xl font-semibold">R$ {capitalFinal.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/30 to-transparent border border-green-400">
          <CardContent className="p-4 text-white dark:text-white">
            <p className="text-sm">Lucro Total</p>
            <p className="text-xl font-semibold">R$ {totalLucro.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/30 to-transparent border border-orange-400">
          <CardContent className="p-4 text-white dark:text-white">
            <p className="text-sm">Receita com Licenças</p>
            <p className="text-xl font-semibold">R$ {totalReceitaLicenca.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500/30 to-transparent border border-red-400">
          <CardContent className="p-4 text-white dark:text-white">
            <p className="text-sm">Comissões Recebidas</p>
            <p className="text-xl font-semibold">R$ {totalComissao.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-4 mt-6">
        <label className="text-sm">Filtrar intervalo de meses:</label>
        <input
          type="range"
          min="1"
          max={nMeses}
          value={filtroRange[0]}
          onChange={(e) => setFiltroRange([+e.target.value, filtroRange[1]])}
          className="w-24"
        />
        <span className="text-sm">de {filtroRange[0]}</span>
        <input
          type="range"
          min="1"
          max={nMeses}
          value={filtroRange[1]}
          onChange={(e) => setFiltroRange([filtroRange[0], +e.target.value])}
          className="w-24"
        />
        <span className="text-sm">até {filtroRange[1]}</span>

        <button
          onClick={() => setGraficoFinanceiro(!graficoFinanceiro)}
          className="ml-auto bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold py-2 px-4 rounded"
        >
          Ver {graficoFinanceiro ? "Evolução da Rede" : "Evolução Financeira"}
        </button>
      </div>

      <Card className="mt-4 bg-[#171717]">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold text-cyan-300 mb-6">
            {graficoFinanceiro ? "Evolução Financeira" : "Evolução da Rede de Indicados"}
          </h2>
          <ResponsiveContainer width="100%" height={450}>
            <LineChart data={dataFiltrada}>
              <CartesianGrid stroke="#ccc" strokeWidth={1} strokeDasharray="3 3" />
              <XAxis dataKey="mes" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />

              {/* GRÁFICOS DE EVOLUÇÃO FINANCEIRA */}
              <Line
                type="monotone"
                dataKey="capital"
                stroke="#00bcd4"
                name="Capital Acumulado"
                strokeWidth={2}
                hide={!graficoFinanceiro}
              />
              <Line
                type="monotone"
                dataKey="lucro"
                stroke="#4caf50"
                name="Lucro Mensal"
                strokeWidth={2}
                hide={!graficoFinanceiro}
              />
              <Line
                type="monotone"
                dataKey="receitaLicenca"
                stroke="#ff9800"
                name="Receita com Licenças"
                strokeWidth={2}
                hide={!graficoFinanceiro}
              />
              <Line
                type="monotone"
                dataKey="comissao"
                stroke="#f44336"
                name="Comissões da Rede"
                strokeWidth={2}
                hide={!graficoFinanceiro}
              />

              {/* GRÁFICOS DE EVOLUÇÃO DA REDE */}
              <Line
                type="monotone"
                dataKey="capitalIndicadoN1"
                stroke="#9575cd"
                name="Capital Nível 1"
                strokeWidth={2}
                hide={graficoFinanceiro}
              />
              <Line
                type="monotone"
                dataKey="capitalIndicadoN2"
                stroke="#4dd0e1"
                name="Capital Nível 2"
                strokeWidth={2}
                hide={graficoFinanceiro}
              />
              <Line
                type="monotone"
                dataKey="capitalIndicadoN3"
                stroke="#f06292"
                name="Capital Nível 3"
                strokeWidth={2}
                hide={graficoFinanceiro}
              />
              <Line
                type="monotone"
                dataKey="investidoresN1"
                stroke="#9fa8da"
                name="Investidores N1"
                strokeDasharray="5 5"
                strokeWidth={2}
                hide={graficoFinanceiro}
              />
              <Line
                type="monotone"
                dataKey="investidoresN2"
                stroke="#80cbc4"
                name="Investidores N2"
                strokeDasharray="5 5"
                strokeWidth={2}
                hide={graficoFinanceiro}
              />
              <Line
                type="monotone"
                dataKey="investidoresN3"
                stroke="#ffab91"
                name="Investidores N3"
                strokeDasharray="5 5"
                strokeWidth={2}
                hide={graficoFinanceiro}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="mt-6 bg-[#171717]">
        <CardContent className="p-4 overflow-x-auto">
          <h2 className="text-lg font-bold text-cyan-400 mb-4">Tabela - Visão Financeira Geral</h2>
          <table className="w-full text-sm text-left text-white border border-cyan-700 bg-[#171717]">
            <thead className="text-xs uppercase bg-cyan-900 text-white">
              <tr>
                <th className="px-4 py-2">Mês</th>
                <th className="px-4 py-2">Capital</th>
                <th className="px-4 py-2">Lucro</th>
                <th className="px-4 py-2">Licenças</th>
                <th className="px-4 py-2">Comissões</th>
              </tr>
            </thead>
            <tbody>
              {dataFiltrada.map((linha, index) => (
                <tr key={index} className="border-t border-cyan-800">
                  <td className="px-4 py-2">{linha.mes}</td>
                  <td className="px-4 py-2">R$ {linha.capital.toLocaleString()}</td>
                  <td className="px-4 py-2">R$ {linha.lucro.toLocaleString()}</td>
                  <td className="px-4 py-2">R$ {linha.receitaLicenca.toLocaleString()}</td>
                  <td className="px-4 py-2">R$ {linha.comissao.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Tabela - Capital da Rede */}
      <Card className="mt-6 bg-[#171717]">
        <CardContent className="p-4 overflow-x-auto">
          <h2 className="text-lg font-bold text-cyan-300 mb-4">Tabela - Capital da Rede</h2>
          <table className="w-full text-sm text-left text-white border border-cyan-700 bg-[#171717]">
            <thead className="text-xs uppercase bg-cyan-900 text-white">
              <tr>
                <th className="px-4 py-2">Mês</th>
                <th className="px-4 py-2">Capital N1</th>
                <th className="px-4 py-2">Capital N2</th>
                <th className="px-4 py-2">Capital N3</th>
              </tr>
            </thead>
            <tbody>
              {dataFiltrada.map((linha, index) => (
                <tr key={index} className="border-t border-cyan-800">
                  <td className="px-4 py-2">{linha.mes}</td>
                  <td className="px-4 py-2">R$ {linha.capitalRedeN1.toLocaleString()}</td>
                  <td className="px-4 py-2">R$ {linha.capitalRedeN2.toLocaleString()}</td>
                  <td className="px-4 py-2">R$ {linha.capitalRedeN3.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Tabela - Média por Investidor */}
      <Card className="mt-6 mb-10 bg-[#171717]">
        <CardContent className="p-4 overflow-x-auto">
          <h2 className="text-lg font-bold text-purple-300 mb-4">Tabela - Média por Investidor por Nível</h2>
          <table className="w-full text-sm text-left text-white border border-purple-700 bg-[#171717]">
            <thead className="text-xs uppercase bg-purple-900 text-white">
              <tr>
                <th className="px-4 py-2">Mês</th>
                <th className="px-4 py-2">Média N1</th>
                <th className="px-4 py-2">Média N2</th>
                <th className="px-4 py-2">Média N3</th>
              </tr>
            </thead>
            <tbody>
              {dataFiltrada.map((linha, index) => (
                <tr key={index} className="border-t border-purple-800">
                  <td className="px-4 py-2">{linha.mes}</td>
                  <td className="px-4 py-2">R$ {linha.mediaN1.toLocaleString()}</td>
                  <td className="px-4 py-2">R$ {linha.mediaN2.toLocaleString()}</td>
                  <td className="px-4 py-2">R$ {linha.mediaN3.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
