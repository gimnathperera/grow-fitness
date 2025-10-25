import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaymentMethod, paymentsApi } from "@/services/paymentsAPI";
import { toast } from 'react-toastify';

interface KidPaymentsProps {
  kidId: string;
}

interface PaymentFormData {
  amount: string;
  paymentMethod: PaymentMethod;
  description: string;
  dueDate: string;
}

export function KidPayments({ kidId }: KidPaymentsProps) {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentForm, setPaymentForm] = useState<PaymentFormData>({
    amount: '',
    paymentMethod: PaymentMethod.CREDIT_CARD,
    description: 'Monthly training fee',
    dueDate: new Date().toISOString().split('T')[0],
  });

  const [createPayment] = paymentsApi.useCreatePaymentMutation();


  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const paymentData = {
        kidId,
        amount: parseFloat(paymentForm.amount),
        paymentMethod: paymentForm.paymentMethod,
        description: paymentForm.description,
        status: 'pending' as const,
        dueDate: paymentForm.dueDate,
      };

      await createPayment(paymentData).unwrap();
      
      // Reset form and show success
      setPaymentForm({
        amount: '',
        paymentMethod: PaymentMethod.CREDIT_CARD,
        description: 'Monthly training fee',
        dueDate: new Date().toISOString().split('T')[0],
      });
      setShowPaymentForm(false);
      
      toast.success("Payment recorded successfully!");
    } catch (error) {
      console.error('Error recording payment:', error);
       toast.error("Failed to record payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Payment summary data - replace with actual data from your API
  const paymentSummary = {
    totalPayments: 0,
    paidPayments: 0,
    pendingPayments: 0,
    totalAmount: 0,
  };

  // Recent payments - replace with actual data from your API
  const recentPayments: Array<{
    _id: string;
    amount: number;
    status: 'pending' | 'paid' | 'failed' | 'refunded' | 'canceled';
    paymentMethod: PaymentMethod;
    paymentDate?: string;
    createdAt: string;
  }> = [];

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Payments</CardTitle>
        {!showPaymentForm && (
          <Button 
            size="sm" 
            onClick={() => setShowPaymentForm(true)}
            variant="default"
          >
            Add Payment
          </Button>
        )}
      </CardHeader>
      
      <CardContent>
        {showPaymentForm ? (
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                    className="pl-8"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  value={paymentForm.paymentMethod}
                  onValueChange={(value: PaymentMethod) => 
                    setPaymentForm({...paymentForm, paymentMethod: value})
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PaymentMethod.CREDIT_CARD}>Credit Card</SelectItem>
                    <SelectItem value={PaymentMethod.DEBIT_CARD}>Debit Card</SelectItem>
                    <SelectItem value={PaymentMethod.BANK_TRANSFER}>Bank Transfer</SelectItem>
                    <SelectItem value={PaymentMethod.PAYPAL}>PayPal</SelectItem>
                    <SelectItem value={PaymentMethod.OTHER}>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={paymentForm.dueDate}
                  onChange={(e) => setPaymentForm({...paymentForm, dueDate: e.target.value})}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={paymentForm.description}
                  onChange={(e) => setPaymentForm({...paymentForm, description: e.target.value})}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowPaymentForm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Record Payment'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold">${paymentSummary.totalAmount.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{paymentSummary.paidPayments}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{paymentSummary.pendingPayments}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{paymentSummary.totalPayments}</p>
              </div>
            </div>

            {recentPayments.length > 0 ? (
              <div className="space-y-2">
                <h3 className="font-medium">Recent Payments</h3>
                <div className="space-y-2">
                  {recentPayments.map((payment) => (
                    <div key={payment._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">${payment.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(payment.paymentDate || payment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm px-2 py-1 rounded-full ${
                          payment.status === 'paid' ? 'bg-green-100 text-green-800' : 
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {payment.paymentMethod.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No payment history found</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowPaymentForm(true)}
                >
                  Record a Payment
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
