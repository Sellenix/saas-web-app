import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { getPublicQuestionnaire, submitQuestionnaireResponse } from "../api/questionnaire"
import SocialShareButtons from "../components/SocialShareButtons"

interface Question {
  id: number
  text: string
  type: "text" | "multiple_choice" | "checkbox"
  options?: string[]
}

interface Questionnaire {
  id: number
  title: string
  description: string
  questions: Question[]
  theme: {
    primaryColor: string
    secondaryColor: string
    font: string
  }
}

const PublicQuestionnaire: React.FC = () => {
  const { customUrl } = useParams<{ customUrl: string }>()
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null)
  const [responses, setResponses] = useState<Record<number, string | string[]>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      try {
        const data = await getPublicQuestionnaire(customUrl)
        setQuestionnaire(data)
      } catch (error) {
        console.error("Failed to fetch questionnaire:", error)
      }
    }
    fetchQuestionnaire()
  }, [customUrl])

  const handleInputChange = (questionId: number, value: string | string[]) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!questionnaire) return

    setIsSubmitting(true)
    try {
      await submitQuestionnaireResponse(questionnaire.id, responses)
      setSubmitSuccess(true)
    } catch (error) {
      console.error("Failed to submit responses:", error)
      alert("Failed to submit responses. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!questionnaire) {
    return <div>Loading...</div>
  }

  const shareUrl = `${window.location.origin}/${customUrl}`

  return (
    <div
      style={
        {
          fontFamily: questionnaire.theme.font,
          "--primary-color": questionnaire.theme.primaryColor,
          "--secondary-color": questionnaire.theme.secondaryColor,
        } as React.CSSProperties
      }
    >
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--primary-color)" }}>
          {questionnaire.title}
        </h1>
        <p className="text-lg mb-8">{questionnaire.description}</p>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Share this questionnaire</h2>
          <SocialShareButtons url={shareUrl} title={questionnaire.title} />
        </div>

        {submitSuccess ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded" role="alert">
            <p className="font-bold">Thank you for completing the questionnaire!</p>
            <p>Your responses have been successfully submitted.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {questionnaire.questions.map((question) => (
              <div key={question.id} className="border-b pb-4">
                <label htmlFor={`question-${question.id}`} className="block text-lg font-medium mb-2">
                  {question.text}
                </label>
                {question.type === "text" && (
                  <input
                    type="text"
                    id={`question-${question.id}`}
                    className="w-full px-3 py-2 border rounded-md"
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                    aria-describedby={`question-${question.id}-description`}
                  />
                )}
                {question.type === "multiple_choice" && (
                  <div className="space-y-2">
                    {question.options?.map((option, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="radio"
                          id={`question-${question.id}-option-${index}`}
                          name={`question-${question.id}`}
                          value={option}
                          onChange={(e) => handleInputChange(question.id, e.target.value)}
                          className="mr-2"
                        />
                        <label htmlFor={`question-${question.id}-option-${index}`}>{option}</label>
                      </div>
                    ))}
                  </div>
                )}
                {question.type === "checkbox" && (
                  <div className="space-y-2">
                    {question.options?.map((option, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`question-${question.id}-option-${index}`}
                          value={option}
                          onChange={(e) => {
                            const currentResponses = (responses[question.id] as string[]) || []
                            const updatedResponses = e.target.checked
                              ? [...currentResponses, option]
                              : currentResponses.filter((r) => r !== option)
                            handleInputChange(question.id, updatedResponses)
                          }}
                          className="mr-2"
                        />
                        <label htmlFor={`question-${question.id}-option-${index}`}>{option}</label>
                      </div>
                    ))}
                  </div>
                )}
                <p id={`question-${question.id}-description`} className="sr-only">
                  Please provide your answer for the question: {question.text}
                </p>
              </div>
            ))}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              style={{ backgroundColor: "var(--secondary-color)" }}
              disabled={isSubmitting}
              aria-live="polite"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default PublicQuestionnaire

