import { reportService } from "@/api/reportService";
import { convertBRDateToISO } from "@/utils/relatorios-utils";

interface HandleGenerateAnalysisParams {
  user: { email: string; name?: string };
  token?: string;
  startDate: string;
  endDate: string;
  totalProdutos: number;
  valorTotal: number;
  setIsGenerating: (value: boolean) => void;
  setReportGenerated: (value: boolean) => void;
  toast: (data: { title: string; description: string }) => void;
}

export const handleGenerateAnalysis = async ({
  user,
  token,
  startDate,
  endDate,
  totalProdutos,
  valorTotal,
  setIsGenerating,
  setReportGenerated,
  toast,
}: HandleGenerateAnalysisParams) => {
  if (!user?.email) {
    toast({
      title: "Sessão inválida",
      description: "Entre novamente para gerar análises.",
    });
    return;
  }

  if (!startDate || !endDate) {
    toast({
      title: "Período obrigatório",
      description: "Selecione a data inicial e final para a análise.",
    });
    return;
  }

  const startISO = convertBRDateToISO(startDate);
  const endISO = convertBRDateToISO(endDate);

  if (new Date(startISO) > new Date(endISO)) {
    toast({
      title: "Período inválido",
      description: "A data inicial deve ser anterior ou igual à data final.",
    });
    return;
  }

  try {
    setIsGenerating(true);

    const res = await reportService.generate(
      {
        type: "Custom",
        email: user.email,
        name: user.name,
        startDate: startISO,
        endDate: endISO,
        totalProdutos,
        valorTotal,
      },
      token || undefined
    );

    setReportGenerated(!!res?.ok || true);

    toast({
      title: "Análise concluída!",
      description: `Período analisado: ${startDate} a ${endDate}`,
    });
  } catch (e) {
    toast({
      title: "Erro ao gerar análise",
      description:
        e?.response?.data?.message || "Verifique os dados e tente novamente.",
    });
  } finally {
    setIsGenerating(false);
    setTimeout(() => setReportGenerated(false), 8000);
  }
};
