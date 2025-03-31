import { createClient } from '@supabase/supabase-js';
import { Transaction, UserSubscription, DatabaseSubscriptionPlan } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Subscription Plans
export const getSubscriptionPlans = async (): Promise<DatabaseSubscriptionPlan[]> => {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .order('price', { ascending: true });
  
  if (error) {
    console.error('Error fetching subscription plans:', error);
    throw error;
  }
  
  return data || [];
};

// Transactions
export const createTransaction = async (
  userId: string,
  planId: string,
  amount: number,
  paymentMethod: string,
  paymentId?: string
): Promise<Transaction> => {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      plan_id: planId,
      amount,
      payment_method: paymentMethod,
      payment_id: paymentId,
      status: 'pending'
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
  
  return data;
};

export const updateTransactionStatus = async (
  transactionId: string,
  status: string,
  paymentId?: string
): Promise<Transaction> => {
  const updates: any = {
    status,
    updated_at: new Date().toISOString()
  };
  
  if (paymentId) {
    updates.payment_id = paymentId;
  }
  
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', transactionId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
  
  return data;
};

export const getTransactionByPaymentId = async (paymentId: string): Promise<Transaction | null> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('payment_id', paymentId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching transaction:', error);
    throw error;
  }
  
  return data;
};

export const getUserTransactions = async (userId: string): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching user transactions:', error);
    throw error;
  }
  
  return data || [];
};

// User Subscriptions
export const createUserSubscription = async (
  userId: string,
  planId: string,
  isLifetime: boolean,
  expiresAt?: string
): Promise<UserSubscription> => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .insert({
      user_id: userId,
      plan_id: planId,
      is_active: true,
      is_lifetime: isLifetime,
      expires_at: expiresAt
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating user subscription:', error);
    throw error;
  }
  
  return data;
};

export const getUserActiveSubscription = async (userId: string): Promise<UserSubscription | null> => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching user subscription:', error);
    throw error;
  }
  
  return data;
};

export const updateSubscriptionStatus = async (
  subscriptionId: string,
  isActive: boolean
): Promise<UserSubscription> => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .update({
      is_active,
      updated_at: new Date().toISOString()
    })
    .eq('id', subscriptionId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating subscription status:', error);
    throw error;
  }
  
  return data;
};

// Check if user has access to content
export const checkUserAccess = async (userId: string): Promise<boolean> => {
  const subscription = await getUserActiveSubscription(userId);
  
  if (!subscription) {
    return false;
  }
  
  // If lifetime subscription, user always has access
  if (subscription.is_lifetime) {
    return true;
  }
  
  // Check if subscription has expired
  if (subscription.expires_at) {
    const expirationDate = new Date(subscription.expires_at);
    const now = new Date();
    
    if (now > expirationDate) {
      // Subscription has expired, update status
      await updateSubscriptionStatus(subscription.id, false);
      return false;
    }
  }
  
  return true;
};
