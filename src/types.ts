import { ActivityType } from "@prisma/client";

export type ICreateActivity = {
  name: string;
  type: ActivityType;
  description?: string;
  duration: number;
  date: Date;
}

export type IReportFilterType = "day" | "week" | "month" | "year";