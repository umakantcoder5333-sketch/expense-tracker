
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import "./App.css";

const API_URL = "http://localhost:8080/api/expenses";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [expenseDate, setExpenseDate] = useState(
    new Date().getFullYear() +
      "-" +
      String(new Date().getMonth() + 1).padStart(2, "0") +
      "-" +
      String(new Date().getDate()).padStart(2, "0")
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  // Fetch expenses from Spring Boot when the page loads
  async function fetchExpenses() {
    try {
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Could not load expenses.");
      }

      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      setError(
        "Unable to connect to the backend. Check that Spring Boot is running on port 8080."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchExpenses();
  }, []);

  const filteredExpenses = expenses.filter((expense) => {
    const matchesCategory =
      !categoryFilter ||
      expense.category?.toLowerCase() === categoryFilter.toLowerCase();

    const matchesStartDate =
      !startDateFilter || expense.expenseDate >= startDateFilter;

    const matchesEndDate =
      !endDateFilter || expense.expenseDate <= endDateFilter;

    return matchesCategory && matchesStartDate && matchesEndDate;
  });

  const COLORS = [
    "#7c3aed",
    "#3b82f6",
    "#14b8a6",
    "#f59e0b",
    "#ec4899",
    "#64748b",
    "#6366f1",
  ];

  const categoryData = Object.values(
    filteredExpenses.reduce((acc, expense) => {
      const category = expense.category || "Other";

      if (!acc[category]) {
        acc[category] = { name: category, amount: 0 };
      }

      acc[category].amount += Number(expense.amount || 0);

      return acc;
    }, {})
  );

  const categoryTotal = categoryData.reduce(
    (sum, category) => sum + Number(category.amount || 0),
    0
  );

  const dateData = Object.values(
    filteredExpenses.reduce((acc, expense) => {
      const date = expense.expenseDate;

      if (!acc[date]) {
        acc[date] = { date, amount: 0 };
      }

      acc[date].amount += Number(expense.amount || 0);

      return acc;
    }, {})
  ).sort((a, b) => a.date.localeCompare(b.date));

  const total = filteredExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );

  const average = filteredExpenses.length
    ? total / filteredExpenses.length
    : 0;

  const formatMoney = (value) =>
    Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  // Create an expense in MySQL through Spring Boot
  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Please enter an expense title.");
      setSuccess("");
      return;
    }

    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0.01) {
      setError("Amount must be greater than ₹0.01.");
      setSuccess("");
      return;
    }

    if (!category) {
      setError("Please select a category.");
      setSuccess("");
      return;
    }

    if (!expenseDate) {
      setError("Please select an expense date.");
      setSuccess("");
      return;
    }

    if (expenseDate > new Date().toLocaleDateString("en-CA")) {
      setError("Expense date cannot be in the future.");
      setSuccess("");
      return;
    }

    setSaving(true);
    setError("");

    const newExpense = {
      title: title.trim(),
      amount: Number(amount),
      category,
      expenseDate,
      description: "",
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newExpense),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const message = data.errors?.join(", ") || data.message;
        throw new Error(message || "Failed to create expense.");
      }

      const savedExpense = await response.json();

      setExpenses((previous) => [savedExpense, ...previous]);
      setTitle("");
      setAmount("");
      setCategory("Food");
    } catch (err) {
      setError(err.message || "Failed to create expense.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(expense) {
    setEditingId(expense.id);
    setTitle(expense.title);
    setAmount(String(expense.amount));
    setCategory(expense.category);
    setExpenseDate(expense.expenseDate);
    setError("");
    setSuccess("");
  }

  // Delete an expense from the database
  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete expense.");
      }

      setExpenses((previous) =>
        previous.filter((expense) => expense.id !== id)
      );
    } catch (err) {
      setError(err.message || "Failed to delete expense.");
    }
  }

  return (
    <main className="app">
      <header className="header">
        <div>
          <p className="eyebrow">PERSONAL FINANCE</p>
          <h1>Expense Tracker</h1>
          <p className="subtitle">
            Track your spending. Stay in control.
          </p>
        </div>

        <span className="header-icon">₹</span>
      </header>

      <section className="summary">
        <div className="summary-card">
          <p>Total Expenses</p>
          <h2>₹{formatMoney(total)}</h2>
          <span>Across all entries</span>
        </div>

        <div className="summary-card">
          <p>Transactions</p>
          <h2>{expenses.length}</h2>
          <span>Expenses recorded</span>
        </div>

        <div className="summary-card">
          <p>Average Expense</p>
          <h2>₹{formatMoney(average)}</h2>
          <span>Per transaction</span>
        </div>
      </section>

      {error && (
        <div className="error-message" role="alert">
          {error}
          <button
            type="button"
            onClick={fetchExpenses}
            style={{ marginLeft: 12 }}
          >
            Retry
          </button>
        </div>
      )}

      <section className="content">
        <form className="panel expense-form" onSubmit={handleSubmit}>
          <h2>Add an expense</h2>
          <p className="panel-subtitle">
            Enter the details of your spending.
          </p>

          <label htmlFor="title">Expense title</label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Lunch, groceries"
            required
            maxLength={100}
          />

          <label htmlFor="amount">Amount (₹)</label>
          <input
            id="amount"
            type="number"
            min="0.02"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />

          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option>Food</option>
            <option>Transport</option>
            <option>Shopping</option>
            <option>Education</option>
            <option>Bills</option>
            <option>Health</option>
            <option>Other</option>
          </select>

          <label htmlFor="expenseDate">Date</label>
          <input
            id="expenseDate"
            type="date"
            value={expenseDate}
            max={new Date().toLocaleDateString("en-CA")}
            onChange={(event) => setExpenseDate(event.target.value)}
            required
          />

          <button
            className="primary-button"
            type="submit"
            disabled={saving}
          >
            {saving ? "Saving..." : "+ Add Expense"}
          </button>
        </form>

        <div className="charts-grid">
          <div className="chart-card">
            <h3>Spending by Category</h3>

            {categoryData.length === 0 ? (
              <p className="chart-empty">No expense data to display.</p>
            ) : (
              <div className="category-chart-layout">
                <div className="category-donut">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="amount"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={58}
                        outerRadius={78}
                        paddingAngle={2}
                        stroke="#141c2e"
                        strokeWidth={2}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>

                      <Tooltip formatter={(value) => `₹${value}`} />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="donut-center">
                    <strong>₹{formatMoney(categoryTotal)}</strong>
                    <span>Total Spending</span>
                  </div>
                </div>

                <div className="category-legend">
                  {categoryData.map((entry, index) => {
                    const percentage = (entry.amount / categoryTotal) * 100;

                    return (
                      <div className="category-legend-item" key={entry.name}>
                        <span
                          className="category-legend-dot"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <span className="category-legend-name">
                          {entry.name}
                        </span>
                        <span className="category-legend-value">
                          ₹{formatMoney(entry.amount)}
                          <small>{percentage.toFixed(0)}%</small>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="chart-card">
            <h3>Expenses by Date</h3>

            {dateData.length === 0 ? (
              <p className="chart-empty">No expense data to display.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={dateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Bar
                    dataKey="amount"
                    name="Expense"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <section className="panel expense-list">
          <div className="filters">
            <div className="filter-field">
              <label htmlFor="categoryFilter">Category</label>
              <select
                id="categoryFilter"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                <option value="">All categories</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Education">Education</option>
                <option value="Bills">Bills</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="filter-field">
              <label htmlFor="startDateFilter">From date</label>
              <input
                id="startDateFilter"
                type="date"
                value={startDateFilter}
                max={endDateFilter || undefined}
                onChange={(event) => setStartDateFilter(event.target.value)}
              />
            </div>

            <div className="filter-field">
              <label htmlFor="endDateFilter">To date</label>
              <input
                id="endDateFilter"
                type="date"
                value={endDateFilter}
                min={startDateFilter || undefined}
                onChange={(event) => setEndDateFilter(event.target.value)}
              />
            </div>

            <button
              className="reset-filter-button"
              type="button"
              onClick={() => {
                setCategoryFilter("");
                setStartDateFilter("");
                setEndDateFilter("");
              }}
            >
              Reset filters
            </button>
          </div>

          <div className="list-header">
            <div>
              <h2>Recent expenses</h2>
              <p className="panel-subtitle">
                Your latest transactions
              </p>
            </div>

            <span className="count">
              {filteredExpenses.length} entries
            </span>
          </div>

          {loading ? (
            <div className="empty-state">
              <p>Loading expenses...</p>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">₹</div>
              <h3>No expenses yet</h3>
              <p>Add your first expense using the form.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Expense</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {[...filteredExpenses]
                    .sort(
                      (a, b) =>
                        (b.id ?? 0) - (a.id ?? 0)
                    )
                    .map((expense) => (
                      <tr key={expense.id}>
                        <td>{expense.title}</td>
                        <td>
                          <span className="category">
                            {expense.category}
                          </span>
                        </td>
                        <td>{expense.expenseDate}</td>
                        <td className="amount">
                          ₹{formatMoney(expense.amount)}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              type="button"
                              className="edit-button"
                              onClick={() => handleEdit(expense)}
                            >
                              Edit
                            </button>

                            <button
                              className="delete-button"
                              type="button"
                              onClick={() => handleDelete(expense.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>

      <footer>Expense Tracker · Manage your money wisely</footer>
    </main>
  );
}

export default App;
