import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { createPayment } from "../api/payment"
import { handleApiError, showSuccessNotification } from "../utils/errorHandler"

interface OrderConfirmationProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  surveys: number
  isYearly: boolean
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ isOpen, onClose, amount, surveys, isYearly }) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [acceptedNoRefund, setAcceptedNoRefund] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptedTerms || !acceptedPrivacy || !acceptedNoRefund) {
      alert("Please accept all terms and conditions before proceeding.")
      return
    }

    try {
      const paymentUrl = await createPayment(amount, surveys, undefined, true)
      showSuccessNotification("Order placed successfully!")
      window.location.href = paymentUrl
    } catch (error) {
      handleApiError(error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Confirm Your Order</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p>
              Amount: €{amount} per {isYearly ? "year" : "month"}
            </p>
            <p>Surveys: {surveys}</p>
            {isYearly && <p>Monthly equivalent: €{(amount / 12).toFixed(2)} per month</p>}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I accept the{" "}
              <button type="button" className="text-blue-500 underline" onClick={() => setShowTerms(true)}>
                Terms and Conditions
              </button>
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="privacy"
              checked={acceptedPrivacy}
              onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
            />
            <label
              htmlFor="privacy"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I accept the{" "}
              <button type="button" className="text-blue-500 underline" onClick={() => setShowPrivacy(true)}>
                Privacy Policy
              </button>
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="noRefund"
              checked={acceptedNoRefund}
              onCheckedChange={(checked) => setAcceptedNoRefund(checked as boolean)}
            />
            <label
              htmlFor="noRefund"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I understand that I cannot cancel or refund the order/payment after submitting
            </label>
          </div>
          <Button type="submit" className="w-full">
            Place Order
          </Button>
        </form>
      </DialogContent>

      {/* Terms and Conditions Dialog */}
      <Dialog open={showTerms} onOpenChange={() => setShowTerms(false)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogTitle>Terms and Conditions</DialogTitle>
          <div className="mt-2">
            <h2 className="text-lg font-semibold">1. Acceptance of Terms</h2>
            <p>By accessing and using WebWizardTool, you agree to be bound by these Terms and Conditions.</p>

            <h2 className="text-lg font-semibold mt-4">2. Use of Service</h2>
            <p>You agree to use WebWizardTool only for lawful purposes and in accordance with these Terms.</p>

            <h2 className="text-lg font-semibold mt-4">3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account and password.</p>

            <h2 className="text-lg font-semibold mt-4">4. Intellectual Property</h2>
            <p>
              All content and materials available on WebWizardTool are the property of WebWizardTool and are protected
              by copyright laws.
            </p>

            <h2 className="text-lg font-semibold mt-4">5. Limitation of Liability</h2>
            <p>
              WebWizardTool shall not be liable for any indirect, incidental, special, consequential or punitive damages
              resulting from your use of the service.
            </p>

            <h2 className="text-lg font-semibold mt-4">6. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of [Your Country/State].</p>

            <h2 className="text-lg font-semibold mt-4">7. Subscription and Pricing</h2>
            <p>7.1 Monthly subscription: €11 per month per survey.</p>
            <p>7.2 Yearly subscription: €5 per month per survey, billed annually.</p>
            <p>7.3 For a single survey, the monthly rate is €11 per month.</p>
            <p>7.4 Subscription fees are subject to change. Any changes will be communicated to users in advance.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Dialog */}
      <Dialog open={showPrivacy} onOpenChange={() => setShowPrivacy(false)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogTitle>Privacy Policy</DialogTitle>
          <div className="mt-2">
            <h2 className="text-lg font-semibold">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, use our services,
              or communicate with us.
            </p>

            <h2 className="text-lg font-semibold mt-4">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, and to communicate with
              you.
            </p>

            <h2 className="text-lg font-semibold mt-4">3. Information Sharing and Disclosure</h2>
            <p>We do not share your personal information with third parties except as described in this policy.</p>

            <h2 className="text-lg font-semibold mt-4">4. Data Security</h2>
            <p>
              We take reasonable measures to help protect your personal information from loss, theft, misuse,
              unauthorized access, disclosure, alteration, and destruction.
            </p>

            <h2 className="text-lg font-semibold mt-4">5. Your Rights</h2>
            <p>You have the right to access, update, or delete your personal information at any time.</p>

            <h2 className="text-lg font-semibold mt-4">6. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new
              privacy policy on this page.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}

export default OrderConfirmation

