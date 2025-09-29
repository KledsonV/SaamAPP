import { CalendarDays, CheckCircle2, Info, Mail } from "lucide-react";
import { Button } from "../ui/button";
import { convertBRDateToISO } from "@/utils/relatorios-utils";

export const RelatorioConfirm = ({
  startDate,
  endDate,
  user,
  setReportGenerated,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-md p-4 sm:p-6 transform animate-in zoom-in-95 duration-300 border border-gray-100 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-3 sm:mb-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 animate-pulse">
            <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
            🎉 Análise Concluída!
          </h3>
          <p className="text-sm sm:text-base text-gray-600">
            Sua consultoria inteligente está pronta
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 mb-3 sm:mb-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
            <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <span className="text-sm sm:text-base font-semibold text-blue-900">
              Período Analisado
            </span>
          </div>
          <p className="text-sm sm:text-base text-blue-800 font-medium">
            {startDate} até {endDate}
          </p>
          <p className="text-xs sm:text-sm text-blue-600 mt-1">
            {(() => {
              const startISO = convertBRDateToISO(startDate);
              const endISO = convertBRDateToISO(endDate);
              if (!startISO || !endISO) return "";
              const start = new Date(startISO);
              const end = new Date(endISO);
              const diffTime = Math.abs(end.getTime() - start.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
              return `${diffDays} ${
                diffDays === 1 ? "dia" : "dias"
              } de dados processados`;
            })()}
          </p>
        </div>

        <div className="mb-3 sm:mb-4">
          <h4 className="text-sm sm:text-base font-semibold text-gray-900 text-center mb-2 sm:mb-3">
            📬 Sua análise foi enviada para:
          </h4>

          <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-700">
                  E-mail
                </p>
                <p className="text-sm sm:text-base text-blue-700 font-semibold truncate">
                  {user?.email}
                </p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 mb-3 sm:mb-4 border border-amber-200">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-amber-100 rounded-md sm:rounded-lg flex items-center justify-center mt-0.5 flex-shrink-0">
              <Info className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h5 className="text-sm sm:text-base font-semibold text-amber-900 mb-1">
                Próximos Passos
              </h5>
              <ul className="text-xs sm:text-sm text-amber-800 space-y-0.5 sm:space-y-1">
                <li>• Verifique sua caixa de entrada</li>
                <li>• Revise os insights gerados</li>
                <li>• Implemente as recomendações</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => setReportGenerated(false)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] text-sm sm:text-base"
          >
            Perfeito! 👍
          </Button>
        </div>

        <div className="mt-3 sm:mt-4 text-center">
          <p className="text-xs text-gray-500">
            Esta mensagem fechará automaticamente em alguns segundos
          </p>
        </div>
      </div>
    </div>
  );
};
