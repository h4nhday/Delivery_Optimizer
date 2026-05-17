import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface FitnessChartProps {
  history: number[];
}

export default function FitnessChart({ history }: FitnessChartProps) {
  const data = {
    labels: history.map((_, index) => index + 1),
    datasets: [
      {
        label: 'Tổng quãng đường di chuyển của đội xe (Km)',
        data: history,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.05)',
        tension: 0.15,
        fill: true,
        pointRadius: 1
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: 'Chu kỳ thế hệ tiến hóa (Generations)', font: { weight: '600' as const } } },
      y: { title: { display: true, text: 'Hàm chi phí tối ưu (Km)', font: { weight: '600' as const } } }
    },
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'XU THẾ HỘI TỤ TOÀN CỤC CỦA THUẬT TOÁN DI TRUYỀN (GA)', font: { size: 13, weight: '700' as const } }
    },
  };

  return (
    <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', height: '240px' }}>
      <Line data={data} options={options} />
    </div>
  );
}