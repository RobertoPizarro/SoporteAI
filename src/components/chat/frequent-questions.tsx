import { Bot } from "lucide-react";

interface FrequentQuestions {
  text: string;
  description: string;
  icon: React.ElementType;
}

interface FrequentQuestionsProps {
  frequentQuestions: FrequentQuestions[];
  handleQuestionClick: (question: string) => void;
}

const FrequentQuestions = ({
  frequentQuestions,
  handleQuestionClick,
}: FrequentQuestionsProps) => (
  <div className="max-w-4xl mx-auto mb-8 animate-fade-in-down">
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Bot className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
        Hola, soy tu Asistente Virtual
      </h2>
      <p className="text-gray-600 text-lg">
        Estoy aquí para ayudarte con cualquier consulta o incidencia. ¿En qué
        puedo asistirte?
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {frequentQuestions.map((question, index) => {
        const IconComponent = question.icon;
        return (
          <button
            key={index}
            onClick={() => handleQuestionClick(question.text)}
            className="group p-6 bg-white rounded-2xl border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] text-left"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center transition-colors">
                <IconComponent className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 transition-colors">
                  {question.text}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {question.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

export default FrequentQuestions;