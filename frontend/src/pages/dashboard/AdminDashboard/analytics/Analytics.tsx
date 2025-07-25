// 👇 Extend jsPDF with autoTable support
declare module "jspdf" {
  interface jsPDF {
    previousAutoTable?: {
      finalY: number;
    };
  }
}

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";
import { ApiDomain } from "../../../../utils/APIDomain"

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

const Analytics = () => {
  const [salesSummary, setSalesSummary] = useState<any>({});
  const [monthlySales, setMonthlySales] = useState<any[]>([]);
  const [bookingSummary, setBookingSummary] = useState<any>({});
  const [monthlyBookings, setMonthlyBookings] = useState<any[]>([]);
  const [topEvents, setTopEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const sales = await axios.get(`${ApiDomain}/analytics/sales`);
        const bookings = await axios.get(`${ApiDomain}/analytics/bookings`);
        const events = await axios.get(`${ApiDomain}/analytics/events/top`);

        // Parse and format months for chart display
        const formattedSales = sales.data?.monthly?.map((s: any) => ({
          month: dayjs(s.month).format("MMMM YYYY"),
          total: parseFloat(s.total),
        })) ?? [];

        const formattedBookings = bookings.data?.monthly?.map((b: any) => ({
          month: dayjs(b.month).format("MMMM YYYY"),
          count: parseInt(b.count),
        })) ?? [];

        setSalesSummary({ totalSales: parseFloat(sales.data?.total ?? 0) });
        setMonthlySales(formattedSales);

        setBookingSummary({ totalBookings: parseInt(bookings.data?.total ?? 0) });
        setMonthlyBookings(formattedBookings);

        const top = events.data ?? [];
        setTopEvents(top.map((e: any) => ({
          ...e,
          totalTickets: parseInt(e.totalTickets),
        })));
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchAnalytics();
  }, []);

  const handleCSVDownload = () => {
    const csv = Papa.unparse([
      ["Total Sales", salesSummary.totalSales ?? 0],
      ["Total Bookings", bookingSummary.totalBookings ?? 0],
      [],
      ["Monthly Sales"],
      ...monthlySales.map((m) => [m.month, m.total]),
      [],
      ["Monthly Bookings"],
      ...monthlyBookings.map((b) => [b.month, b.count]),
      [],
      ["Top Events"],
      ...topEvents.map((e) => [e.title, e.totalTickets]),
    ]);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "analytics_report.csv");
  };

  const handlePDFDownload = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Analytics Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

    autoTable(doc, {
      startY: 35,
      head: [["Metric", "Value"]],
      body: [
        ["Total Sales", `Ksh ${(salesSummary.totalSales ?? 0).toFixed(2)}`],
        ["Total Bookings", bookingSummary.totalBookings ?? 0],
      ],
    });

    const y1 = doc.previousAutoTable?.finalY ?? 50;

    autoTable(doc, {
      startY: y1 + 10,
      head: [["Month", "Sales"]],
      body: monthlySales.map((s) => [s.month, `Ksh ${s.total.toFixed(2)}`]),
    });

    const y2 = doc.previousAutoTable?.finalY ?? y1 + 20;

    autoTable(doc, {
      startY: y2 + 10,
      head: [["Month", "Bookings"]],
      body: monthlyBookings.map((b) => [b.month, b.count]),
    });

    const y3 = doc.previousAutoTable?.finalY ?? y2 + 20;

    autoTable(doc, {
      startY: y3 + 10,
      head: [["Event Title", "Total Tickets"]],
      body: topEvents.map((e) => [e.title, e.totalTickets]),
    });

    doc.save("analytics_report.pdf");
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex gap-2">
          <button onClick={handleCSVDownload} className="btn btn-primary">Export CSV</button>
          <button onClick={handlePDFDownload} className="btn btn-secondary">Export PDF</button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-lg font-semibold">Total Sales</h4>
          <p className="text-xl text-green-600">
            Ksh {(salesSummary.totalSales ?? 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-lg font-semibold">Total Bookings</h4>
          <p className="text-xl text-purple-600">
            {bookingSummary.totalBookings ?? 0}
          </p>
        </div>
      </div>

      {/* Monthly Sales Chart */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Monthly Sales (Ksh)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlySales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Bookings Chart */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Monthly Bookings</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyBookings}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Events Pie Chart */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Top Booked Events</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={topEvents}
              dataKey="totalTickets"
              nameKey="title"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {topEvents.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
