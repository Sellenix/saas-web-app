import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getQuestionnaireResults } from '../api/questionnaire';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ReportGenerator from '../components/ReportGenerator';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface QuestionResult {
  question: string;
  answers: Record<string, number>;
}

const QuestionnaireResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [results, setResults] = useState<QuestionResult[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getQuestionnaireResults(id);
        setResults(data);
      } catch (error) {
        console.error("Failed to fetch questionnaire results:", error);
      }
    };
    fetchResults();
  }, [id]);

  const renderChart = (question: QuestionResult) => {
    const data = {
      labels: Object.keys(question.answers),
      datasets: [
        {
          label: "Responses",
          data: Object.values(question.answers),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top" as const,
        },
        title: {
          display: true,
          text: question.question,
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Questionnaire Results</h1>
      <ReportGenerator questionnaireId={parseInt(id)} />
      {results.map((question, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{question.question}</h2>
          {renderChart(question)}
        </div>
      ))}
    </div>
  );
};

export default QuestionnaireResults;

