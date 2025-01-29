import type React from "react"
import { useState, useEffect } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { getAnalyticsData } from "../api/analytics"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface AnalyticsData {
  dates: string[]
  responses: number[]
  completionRates: number[]
}

const DashboardAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const data = await getAnalyticsData()
        setAnalyticsData(data)
      } catch (error) {
        console.error("Failed to fetch analytics data:", error)
      }
    }

    fetchAnalyticsData()
  }, [])

  if (!analyticsData) {
    return <div>Loading analytics...</div>
  }

  const responseData = {
    labels: analyticsData.dates,
    datasets: [
      {
        label: "Responses",
        data: analyticsData.responses,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  }

  const completionRateData = {
    labels: analyticsData.dates,
    datasets: [
      {
        label: "Completion Rate (%)",
        data: analyticsData.completionRates,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Analytics Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Response Trend</h3>
          <Line data={responseData} />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Completion Rate Trend</h3>
          <Line data={completionRateData} />
        </div>
      </div>
    </div>
  )
}

export default DashboardAnalytics

