import { baseApi } from './baseApi';

const PaymentStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  CANCELED: 'canceled',
} as const;

type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

const PaymentMethod = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  BANK_TRANSFER: 'bank_transfer',
  PAYPAL: 'paypal',
  OTHER: 'other',
} as const;

type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

interface Payment {
  _id: string;
  kidId: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  description?: string;
  paymentDate?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentSummary {
  totalPayments: number;
  paidPayments: number;
  pendingPayments: number;
  totalAmount: number;
}

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new payment
    createPayment: builder.mutation<Payment, Omit<Payment, '_id' | 'createdAt' | 'updatedAt'>>({
      query: (paymentData) => ({
        url: '/payments',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['Payment']
    }),

    // Get all payments for a specific kid
    getPaymentsByKid: builder.query<Payment[], string>({
      query: (kidId) => ({
        url: `/payments/kid/${kidId}`,
        method: 'GET',
      }),
      providesTags: (result = []) => [
        'Payment',
        ...result.map(({ _id }) => ({ type: 'Payment' as const, id: _id })),
      ],
    }),

    // Get a single payment by ID
    getPayment: builder.query<Payment, string>({
      query: (id) => ({
        url: `/payments/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Payment' as const, id }],
    }),

    // Update a payment
    updatePayment: builder.mutation<Payment, { id: string; payment: Partial<Payment> }>({
      query: ({ id, payment }) => ({
        url: `/payments/${id}`,
        method: 'PUT',
        body: payment,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Payment' as const, id }],
    }),

    // Delete a payment
    deletePayment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/payments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Payment'],
    }),

    // Get payment summary for a kid
    getPaymentSummary: builder.query<PaymentSummary, string>({
      query: (kidId) => ({
        url: `/payments/summary/${kidId}`,
        method: 'GET',
      }),
      providesTags: ['Payment'],
    }),
  }),
});

export const {
  useCreatePaymentMutation,
  useGetPaymentsByKidQuery,
  useGetPaymentQuery,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
  useGetPaymentSummaryQuery,
} = paymentsApi;

export { PaymentStatus, PaymentMethod };
export type { Payment, PaymentSummary };