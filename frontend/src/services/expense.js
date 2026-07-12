import api from "./api";

export function normalizeExpense(expense) {
  return {
    ...expense,
    trip_id: expense.trip_id == null ? null : Number(expense.trip_id),
    vehicle_id: Number(expense.vehicle_id),
    amount: Number(expense.amount || 0),
    date: expense.date || expense.expense_date,
  };
}

export function toExpensePayload(values) {
  return {
    trip_id: values.trip_id ? Number(values.trip_id) : null,
    vehicle_id: Number(values.vehicle_id),
    type: values.type,
    amount: String(values.amount || 0),
    description: values.description || null,
    expense_date: values.expense_date || values.date,
  };
}

export async function listExpenses(params = {}) {
  const { data } = await api.get("/expenses/", { params });
  return data.map(normalizeExpense);
}

export async function createExpense(values) {
  const { data } = await api.post("/expenses/", toExpensePayload(values));
  return normalizeExpense(data);
}

export async function updateExpense(id, values) {
  const { data } = await api.put(`/expenses/${id}`, toExpensePayload(values));
  return normalizeExpense(data);
}

export async function deleteExpense(id) {
  await api.delete(`/expenses/${id}`);
}
