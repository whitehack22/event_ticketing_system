import db from "../Drizzle/db";
import { PaymentsTable } from "../Drizzle/schema";
import { sql } from "drizzle-orm";

export const getSalesSummary = async () => {
  const totalSales = await db
    .select({ total: sql`SUM(${PaymentsTable.amount})` })
    .from(PaymentsTable)
    .where(sql`${PaymentsTable.paymentStatus} = 'Completed'`);

  return totalSales[0]?.total ?? 0;
};

export const getMonthlySales = async () => {
  const salesByMonth = await db
    .select({
      month: sql`TO_CHAR(${PaymentsTable.paymentDate}, 'YYYY-MM')`,
      total: sql`SUM(${PaymentsTable.amount})`,
    })
    .from(PaymentsTable)
    .where(sql`${PaymentsTable.paymentStatus} = 'Completed'`)
    .groupBy(sql`TO_CHAR(${PaymentsTable.paymentDate}, 'YYYY-MM')`)
    .orderBy(sql`TO_CHAR(${PaymentsTable.paymentDate}, 'YYYY-MM')`);

  return salesByMonth;
};