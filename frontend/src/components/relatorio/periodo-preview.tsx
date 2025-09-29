import {
  convertBRDateToISO,
  formatDateExtended,
} from "@/utils/relatorios-utils";
import { AlertTriangle, CalendarDays, Clock } from "lucide-react";

interface IPeriodPreview {
  startDate: string;
  endDate: string;
}

export const PeriodPreview = ({ startDate, endDate }: IPeriodPreview) => {
  if (!startDate || !endDate) return null;

  const calculateDays = () => {
    const startISO = convertBRDateToISO(startDate);
    const endISO = convertBRDateToISO(endDate);
    if (!startISO || !endISO) return 0;

    const start = new Date(startISO);
    const end = new Date(endISO);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const startISO = convertBRDateToISO(startDate);
  const endISO = convertBRDateToISO(endDate);
  const isValidPeriod =
    startISO && endISO && new Date(startISO) <= new Date(endISO);

  return (
    <div
      className={`
      mt-6 p-4 rounded-xl border-2 transition-all duration-300
      ${
        isValidPeriod
          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
          : "bg-red-50 border-red-200"
      }
    `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`
          p-2 rounded-lg
          ${isValidPeriod ? "bg-blue-100" : "bg-red-100"}
        `}
        >
          {isValidPeriod ? (
            <CalendarDays className="w-5 h-5 text-blue-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600" />
          )}
        </div>
        <div className="flex-1">
          {isValidPeriod ? (
            <>
              <h3 className="font-semibold text-gray-900 mb-1">
                Período de Análise Selecionado
              </h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">De:</span>{" "}
                  {formatDateExtended(startISO)}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Até:</span>{" "}
                  {formatDateExtended(endISO)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-medium text-blue-700">
                    {calculateDays()} {calculateDays() === 1 ? "dia" : "dias"}{" "}
                    de dados para análise
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="font-semibold text-red-800 mb-1">
                Período Inválido
              </h3>
              <p className="text-sm text-red-600">
                A data inicial deve ser anterior à data final.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
