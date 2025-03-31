import axios from 'axios';

// Token da PushinPay
const API_TOKEN = '22389|wEprJ5GYzi1zBwRfaneBa72B5kMF4BAZkUGb6BbR48686b9c';
const API_BASE_URL = 'https://api.pushinpay.com.br/api';

// Estrutura de resposta da API para geração de PIX
interface PixResponse {
  id: string;
  qr_code: string;
  qr_code_base64: string;
}

// Estrutura de resposta para o status do pagamento
interface PaymentStatus {
  id: string;
  status: string;
}

/**
 * Gera um pagamento PIX
 * @param amount Valor em reais (exemplo: 29.90)
 * @returns Objeto com dados do PIX gerado
 */
export async function generatePixPayment(amount: number) {
  try {
    // Converte o valor para centavos conforme exigido pela API
    const amountInCents = Math.round(amount * 100);
    
    const response = await axios.post<PixResponse>(
      `${API_BASE_URL}/pix/cashIn`, 
      {
        value: amountInCents,
        webhook_url: `${window.location.origin}/api/webhook/payment-confirmation`,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`,
        },
      }
    );

    if (!response.data) {
      throw new Error('Resposta vazia da API de pagamento');
    }

    // Retornamos os dados necessários para exibir o QR code
    return {
      id: response.data.id,
      qr_code: response.data.qr_code,
      qr_code_base64: response.data.qr_code_base64,
    };
  } catch (error) {
    console.error('Erro ao gerar pagamento PIX:', error);
    throw error;
  }
}

/**
 * Verifica o status de um pagamento PIX
 * @param transactionId ID da transação retornado pela API
 * @returns Status do pagamento
 */
export async function checkPaymentStatus(transactionId: string): Promise<PaymentStatus> {
  try {
    const response = await axios.get<any>(
      `${API_BASE_URL}/transaction/${transactionId}`,
      {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
        },
      }
    );

    if (!response.data) {
      throw new Error('Falha ao verificar status do pagamento');
    }

    return {
      id: transactionId,
      status: response.data.status,
    };
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    throw error;
  }
}