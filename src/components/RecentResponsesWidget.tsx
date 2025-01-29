import type React from "react"
import { useState, useEffect } from "react"
import { getRecentResponses } from "../api/responses"
import { Link } from "react-router-dom"

interface Response {
  id: number
  questionnaireTitle: string
  questionnaireId: number
  respondentName: string
  submittedAt: string
}

const RecentResponsesWidget: React.FC = () => {
  const [responses, setResponses] = useState<Response[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecentResponses = async () => {
      try {
        setIsLoading(true)
        const data = await getRecentResponses()
        setResponses(data)
        setError(null)
      } catch (err) {
        setError("Failed to fetch recent responses")
        console.error("Error fetching recent responses:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentResponses()
  }, [])

  if (isLoading) {
    return <div className="text-center">Loading recent responses...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Recent Responses</h2>
      {responses.length === 0 ? (
        <p className="text-gray-500">No recent responses</p>
      ) : (
        <ul className="space-y-2">
          {responses.map((response) => (
            <li key={response.id} className="border-b pb-2">
              <Link
                to={`/questionnaire/${response.questionnaireId}/results`}
                className="text-blue-600 hover:text-blue-800"
              >
                {response.questionnaireTitle}
              </Link>
              <p className="text-sm text-gray-600">Respondent: {response.respondentName}</p>
              <p className="text-xs text-gray-500">Submitted: {new Date(response.submittedAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default RecentResponsesWidget

