import type React from "react"

const PaymentHistory: React.FC = () => {
  const mockPayments = [
    {
      id: 1,
      amount: 14,
      surveys: 2,
      status: "paid",
      created_at: new Date().toISOString(),
    },
  ]

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Payment History</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surveys</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {mockPayments.map((payment) => (
            <tr key={payment.id}>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(payment.created_at).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap">€{payment.amount.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">{payment.surveys}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {payment.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PaymentHistory

