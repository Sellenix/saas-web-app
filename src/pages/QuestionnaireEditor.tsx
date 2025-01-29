import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getQuestionnaire, saveQuestionnaire, getPublicUrl } from "../api/questionnaire"
import SocialShareButtons from "../components/SocialShareButtons"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { PlusCircle, Trash2, GripVertical } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "../contexts/ThemeContext"

interface Question {
  id: number
  text: string
  type: "text" | "multiple_choice" | "checkbox" | "dropdown" | "rating" | "date"
  options?: string[]
}

interface Questionnaire {
  id?: number
  title: string
  description: string
  questions: Question[]
  theme: {
    primaryColor: string
    secondaryColor: string
    font: string
  }
}

const QuestionnaireEditor: React.FC = () => {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const [questionnaire, setQuestionnaire] = useState<Questionnaire>({
    title: "",
    description: "",
    questions: [],
    theme: {
      primaryColor: "#0a1f44",
      secondaryColor: "#F1C27D",
      font: "Poppins",
    },
  })
  const [publicUrl, setPublicUrl] = useState<string | null>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (id) {
      const fetchQuestionnaire = async () => {
        try {
          const data = await getQuestionnaire(Number.parseInt(id))
          setQuestionnaire(data)
          const urlData = await getPublicUrl(Number.parseInt(id))
          setPublicUrl(urlData.public_url)
        } catch (error) {
          console.error("Failed to fetch questionnaire:", error)
        }
      }
      fetchQuestionnaire()
    }
  }, [id])

  const handleSave = async () => {
    try {
      const savedQuestionnaire = await saveQuestionnaire(questionnaire)
      setQuestionnaire(savedQuestionnaire)
      const urlData = await getPublicUrl(savedQuestionnaire.id)
      setPublicUrl(urlData.public_url)
      navigate(`/questionnaire/${savedQuestionnaire.id}`)
    } catch (error) {
      console.error("Failed to save questionnaire:", error)
    }
  }

  const addQuestion = () => {
    setQuestionnaire({
      ...questionnaire,
      questions: [...questionnaire.questions, { id: Date.now(), text: "", type: "text" }],
    })
  }

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    const updatedQuestions = [...questionnaire.questions]
    updatedQuestions[index] = updatedQuestion
    setQuestionnaire({ ...questionnaire, questions: updatedQuestions })
  }

  const removeQuestion = (index: number) => {
    const updatedQuestions = questionnaire.questions.filter((_, i) => i !== index)
    setQuestionnaire({ ...questionnaire, questions: updatedQuestions })
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return
    }

    const items = Array.from(questionnaire.questions)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setQuestionnaire({ ...questionnaire, questions: items })
  }

  return (
    <div
      className={`container mx-auto px-4 py-8 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {id ? "Edit Questionnaire" : "Create New Questionnaire"}
      </motion.h1>
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={questionnaire.title}
          onChange={(e) => setQuestionnaire({ ...questionnaire, title: e.target.value })}
          className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
            theme === "dark" ? "bg-gray-800 text-white" : ""
          }`}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={questionnaire.description}
          onChange={(e) => setQuestionnaire({ ...questionnaire, description: e.target.value })}
          className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
            theme === "dark" ? "bg-gray-800 text-white" : ""
          }`}
        />
      </div>
      <h2 className="text-2xl font-bold mb-4">Questions</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {questionnaire.questions.map((question, index) => (
                <Draggable key={question.id} draggableId={question.id.toString()} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`mb-4 p-4 border rounded ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
                    >
                      <div className="flex items-center mb-2">
                        <div {...provided.dragHandleProps} className="mr-2">
                          <GripVertical />
                        </div>
                        <input
                          type="text"
                          value={question.text}
                          onChange={(e) => updateQuestion(index, { ...question, text: e.target.value })}
                          className={`mb-2 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                            theme === "dark" ? "bg-gray-700 text-white border-gray-600" : ""
                          }`}
                          placeholder="Question text"
                        />
                        <button onClick={() => removeQuestion(index)} className="ml-2 text-red-500 hover:text-red-700">
                          <Trash2 />
                        </button>
                      </div>
                      <select
                        value={question.type}
                        onChange={(e) =>
                          updateQuestion(index, { ...question, type: e.target.value as Question["type"] })
                        }
                        className={`mb-2 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                          theme === "dark" ? "bg-gray-700 text-white border-gray-600" : ""
                        }`}
                      >
                        <option value="text">Text</option>
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="dropdown">Dropdown</option>
                        <option value="rating">Rating</option>
                        <option value="date">Date</option>
                      </select>
                      {(question.type === "multiple_choice" ||
                        question.type === "checkbox" ||
                        question.type === "dropdown") && (
                        <div>
                          {question.options?.map((option, optionIndex) => (
                            <input
                              key={optionIndex}
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const updatedOptions = [...(question.options || [])]
                                updatedOptions[optionIndex] = e.target.value
                                updateQuestion(index, { ...question, options: updatedOptions })
                              }}
                              className={`mb-2 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                theme === "dark" ? "bg-gray-700 text-white border-gray-600" : ""
                              }`}
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                          ))}
                          <button
                            onClick={() => {
                              const updatedOptions = [...(question.options || []), ""]
                              updateQuestion(index, { ...question, options: updatedOptions })
                            }}
                            className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Add Option
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button
        onClick={addQuestion}
        className="mb-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
      >
        <PlusCircle className="mr-2" />
        Add Question
      </button>
      <h2 className="text-2xl font-bold mb-4">Theme</h2>
      <div className="mb-4">
        <label htmlFor="primaryColor" className="block text-sm font-medium mb-1">
          Primary Color
        </label>
        <input
          type="color"
          id="primaryColor"
          value={questionnaire.theme.primaryColor}
          onChange={(e) =>
            setQuestionnaire({
              ...questionnaire,
              theme: { ...questionnaire.theme, primaryColor: e.target.value },
            })
          }
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="secondaryColor" className="block text-sm font-medium mb-1">
          Secondary Color
        </label>
        <input
          type="color"
          id="secondaryColor"
          value={questionnaire.theme.secondaryColor}
          onChange={(e) =>
            setQuestionnaire({
              ...questionnaire,
              theme: { ...questionnaire.theme, secondaryColor: e.target.value },
            })
          }
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="font" className="block text-sm font-medium mb-1">
          Font
        </label>
        <select
          id="font"
          value={questionnaire.theme.font}
          onChange={(e) =>
            setQuestionnaire({
              ...questionnaire,
              theme: { ...questionnaire.theme, font: e.target.value },
            })
          }
          className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
            theme === "dark" ? "bg-gray-700 text-white border-gray-600" : ""
          }`}
        >
          <option value="Poppins">Poppins</option>
          <option value="Roboto">Roboto</option>
          <option value="Montserrat">Montserrat</option>
          <option value="Inter">Inter</option>
        </select>
      </div>
      <button
        onClick={handleSave}
        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Save Questionnaire
      </button>
      {publicUrl && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Share Your Questionnaire</h2>
          <p className="mb-2">Use the buttons below to share your questionnaire on social media:</p>
          <SocialShareButtons url={publicUrl} title={questionnaire.title} />
        </div>
      )}
    </div>
  )
}

export default QuestionnaireEditor

