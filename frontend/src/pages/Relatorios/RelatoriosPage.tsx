import { useEffect, useState } from "react";
import { Send, Calendar, CalendarDays } from "lucide-react";
import { Button } from "@/components/forms/Button";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import {
  convertBRDateToISO,
  convertISODateToBR,
  getThirtyDaysAgoDate,
  getTodayDate,
} from "@/utils/relatorios-utils";
import { handleGenerateAnalysis } from "@/handlers/generate-analysis";
import { PeriodPreview } from "@/components/relatorio/periodo-preview";
import { DateInput } from "@/components/relatorio/data-input";
import { RelatorioConfirm } from "@/components/relatorio/relatorio-confirmacao";
import { Product } from "@/types";
import { productService } from "@/api/productService";

export const RelatoriosPage = () => {
  const { user, token } = useAuthStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [startDate, setStartDate] = useState(
    convertISODateToBR(getThirtyDaysAgoDate())
  );
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [loadingProdutos, setLoadingProdutos] = useState(false);
  const [endDate, setEndDate] = useState(convertISODateToBR(getTodayDate()));
  const [dateErrors, setDateErrors] = useState({ start: false, end: false });

  useEffect(() => {
    const errors = { start: false, end: false };
    if (startDate && endDate) {
      const startISO = convertBRDateToISO(startDate);
      const endISO = convertBRDateToISO(endDate);
      if (startISO && endISO && new Date(startISO) > new Date(endISO)) {
        errors.start = true;
        errors.end = true;
      }
    }
    setDateErrors(errors);
  }, [startDate, endDate]);

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      setLoadingProdutos(true);
      const response = await productService.list(0, 1000);
      const produtosAtualizados: Product[] = response.data.content;
      setProdutos(produtosAtualizados);

      const startISO = convertBRDateToISO(startDate);
      const endISO = convertBRDateToISO(endDate);

      const produtosFiltrados = produtosAtualizados.filter((p) => {
        const dataProduto = new Date(p.createdAt);
        const inicio = new Date(startISO + "T00:00:00");
        const fim = new Date(endISO + "T23:59:59");
        return dataProduto >= inicio && dataProduto <= fim;
      });

      const totalProdutos = produtosFiltrados.reduce(
        (acc, p) => acc + p.quantity,
        0
      );

      const valorTotal = produtosFiltrados.reduce(
        (acc, p) => acc + p.quantity * p.price,
        0
      );

      await handleGenerateAnalysis({
        user,
        token,
        startDate,
        endDate,
        totalProdutos,
        valorTotal,
        setIsGenerating,
        setReportGenerated,
        toast,
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar relatório",
        description:
          "Ocorreu um erro ao buscar os produtos ou gerar o relatório.",
      });
    } finally {
      setLoadingProdutos(false);
      setIsGenerating(false);
    }
  };

  const setPredefinedPeriod = (days: number) => {
    const endISO = getTodayDate();
    const start = new Date();
    start.setDate(start.getDate() - days);
    const startISO = start.toISOString().split("T")[0];
    setEndDate(convertISODateToBR(endISO));
    setStartDate(convertISODateToBR(startISO));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 transition-colors duration-500">
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Consultoria Inteligente
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Gere uma análise detalhada do estoque e receba insights claros e
            objetivos diretamente no seu WhatsApp e e-mail.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
              <CalendarDays className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Período de Análise
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Defina o intervalo de datas para processar os dados do seu
                estoque
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Períodos sugeridos:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Últimos 7 dias", days: 7 },
                { label: "Últimos 15 dias", days: 15 },
                { label: "Últimos 30 dias", days: 30 },
                { label: "Últimos 90 dias", days: 90 },
              ].map((period) => (
                <button
                  key={period.days}
                  onClick={() => setPredefinedPeriod(period.days)}
                  className="px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/50 rounded-lg transition-colors duration-200 border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700"
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DateInput
              label="Data Inicial"
              value={startDate}
              onChange={setStartDate}
              placeholder="Selecione a data inicial"
              icon={Calendar}
              error={dateErrors.start}
              helperText={
                dateErrors.start ? "Verifique o período selecionado" : ""
              }
            />
            <DateInput
              label="Data Final"
              value={endDate}
              onChange={setEndDate}
              placeholder="Selecione a data final"
              icon={Calendar}
              error={dateErrors.end}
              helperText={
                dateErrors.end ? "Verifique o período selecionado" : ""
              }
            />
          </div>

          <PeriodPreview startDate={startDate} endDate={endDate} />
        </div>

        <div className="text-center">
          <Button
            onClick={handleGenerateReport}
            disabled={
              isGenerating ||
              dateErrors.start ||
              dateErrors.end ||
              !startDate ||
              !endDate
            }
            className="px-12 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center gap-4 text-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isGenerating ? (
              <>
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Processando Análise...</span>
              </>
            ) : (
              <>
                <Send className="w-6 h-6" />
                <span>Gerar Análise Completa</span>
              </>
            )}
          </Button>

          {(dateErrors.start || dateErrors.end) && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400 font-medium">
              Corrija o período antes de continuar
            </p>
          )}
        </div>

        {reportGenerated && (
          <RelatorioConfirm
            endDate={endDate}
            startDate={startDate}
            user={user}
            setReportGenerated={setReportGenerated}
          />
        )}
      </div>
    </div>
  );
};
