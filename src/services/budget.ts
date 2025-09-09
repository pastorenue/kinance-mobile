

import { apiService } from './api';
import { ENDPOINTS } from '../constants/config';
import type { Budget, CreateBudgetRequest } from '../types';

// Create a new budget

export async function createBudget(data: CreateBudgetRequest): Promise<Budget> {
    const res = await apiService.post<Budget>(ENDPOINTS.BUDGETS.LIST, data);
    return res.data;
}

// Get a budget by ID

export async function getBudget(budgetId: string): Promise<Budget> {
    const res = await apiService.get<Budget>(ENDPOINTS.BUDGETS.DETAIL(budgetId));
    return res.data;
}

// Update a budget by ID

export async function updateBudget(budgetId: string, data: Partial<CreateBudgetRequest>): Promise<Budget> {
    const res = await apiService.put<Budget>(ENDPOINTS.BUDGETS.DETAIL(budgetId), data);
    return res.data;
}