import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import "./Analytics.css";

/* 🔥 CHART IMPORTS */
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

function Analytics() {

  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {

    const load = async () => {
      try {
        const profile = await api.get("/api/user/profile");
        const tx = await api.get("/api/transactions/history");

        setUser(profile.data);
        setTransactions(tx.data);

      } catch (err) {
        console.error("Analytics load error:", err);
        navigate("/");
      }
    };

    load();

  }, [navigate]);

  if (!user) return <p style={{ padding: 20 }}>Loading analytics...</p>;

  // 🔥 CALCULATIONS
  let income = 0;
  let expense = 0;

  const now = new Date();

  // 🔥 MONTHLY DATA
  const monthlyData = Array(12).fill(0);

  transactions.forEach((tx) => {

    const isSender =
      tx.sender?._id === user._id ||
      tx.sender?.name === user.name;

    const amount = Number(tx.amount || 0);
    const date = new Date(tx.createdAt);

    if (tx.status === "completed") {

      if (isSender) {
        expense += amount;
      } else {
        income += amount;
      }

      // monthly tracking
      if (date.getFullYear() === now.getFullYear()) {
        const monthIndex = date.getMonth();

        if (isSender) {
          monthlyData[monthIndex] -= amount;
        } else {
          monthlyData[monthIndex] += amount;
        }
      }
    }
  });

  const balance = income - expense;

  /* 🔥 PIE DATA */
  const pieData = [
    { name: "Income", value: income || 0 },
    { name: "Expenses", value: expense || 0 }
  ];

  const COLORS = ["#16a34a", "#dc2626"];

  /* 🔥 BAR CHART DATA */
  const monthlyChartData = monthlyData.map((value, i) => ({
    name: new Date(0, i).toLocaleString("default", { month: "short" }),
    amount: value
  }));

  return (

    <div className="analytics-page">

      <div className="analytics-header">
        <button onClick={() => navigate(-1)}>← Back</button>
        <h2>Financial Analysis</h2>
      </div>

      {/* SUMMARY */}
      <div className="analytics-cards">

        <div className="card income">
          <p>Income</p>
          <h2>${income.toLocaleString()}</h2>
        </div>

        <div className="card expense">
          <p>Expenses</p>
          <h2>${expense.toLocaleString()}</h2>
        </div>

        <div className="card balance">
          <p>Net Balance</p>
          <h2>${balance.toLocaleString()}</h2>
        </div>

      </div>

      {/* 🔥 PIE CHART */}
      <div className="analytics-chart">
        <h3>Spending Overview</h3>

        <ResponsiveContainer width="100%" height={220}>
          <PieChart>

            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip />

          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 🔥 BAR CHART (MONTHLY TREND) */}
      <div className="analytics-chart">
        <h3>Monthly Trend</h3>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthlyChartData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="amount"
              radius={[6, 6, 0, 0]}
            />

          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* EXTRA STATS */}
      <div className="analytics-extra">

        <div className="extra-box">
          <p>Total Transactions</p>
          <h3>{transactions.length}</h3>
        </div>

        <div className="extra-box">
          <p>Successful</p>
          <h3>{transactions.filter(t => t.status === "completed").length}</h3>
        </div>

        <div className="extra-box">
          <p>Failed</p>
          <h3>{transactions.filter(t => t.status === "failed").length}</h3>
        </div>

      </div>

    </div>
  );
}

export default Analytics;