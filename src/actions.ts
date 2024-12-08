'use server';

import prisma from "./db/prisma";
import { getPointFromActivityType } from "./lib/utils";
import { toZonedTime } from 'date-fns-tz'
import { ICreateActivity, IReportFilterType } from "./types";
import { add, endOfDay, format, getISOWeek, startOfDay } from "date-fns";

export const createNewActivity = async (userId: string, activity: ICreateActivity) => {
  await prisma.activity.create({
    data: {
      userId,
      name: activity.name,
      type: activity.type,
      duration: activity.duration,
      description: activity.description || '',
      date: toZonedTime(activity.date, 'Asia/Saigon'),
    },
  });
}

export const getActivities = async (userId: string, filterType: IReportFilterType) => {
  let from: Date;
  let to: Date = endOfDay(new Date());

  switch (filterType) {
    case "day":
      from = add(to, { days: -30 }); // 30 days ago
      break;
    case "week":
      from = add(to, { days: -12 * 7 }); // 12 weeks ago
      break;
    case "month":
      from = add(to, { days: -12 * 30 }); // 12 months ago
      break;
    case "year":
      from = add(to, { days: -7 * 365 }); // 7 years ago
      break;
  }
  
  from = startOfDay(from);

  const activities = await prisma.activity.findMany({
    where: {
      userId,
      date: {
        gte: from,
        lt: to,
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  const groupActivities = activities.reduce((acc, activity) => {
    const date = new Date(activity.date);
  
    let dateFormat = "";
    switch (filterType) {
      case "day":
        dateFormat = format(date, "dd/MM"); // Format as "10/22/2024"
        break;
      case "week":
        dateFormat = `Tuần ${getISOWeek(date)}/${format(date, "yyyy")}`; // Format as "Tuần 48/2024"
        break;
      case "month":
        dateFormat = `Tháng ${format(date, "MM/yyyy")}`; // Format as "Tháng 12/2024"
        break;
      case "year":
        dateFormat = `Năm ${format(date, "yyyy")}`; // Format as "Năm 2024"
        break;
      default:
        dateFormat = format(date, "dd/MM/yyyy"); // Default to day
    }
  
    // Calculate points
    const point = activity.duration * getPointFromActivityType(activity.type);
  
    // Accumulate points
    if (!acc[dateFormat]) {
      acc[dateFormat] = 0;
    }
    acc[dateFormat] += point;
  
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(groupActivities).map(([date, point]) => ({
    date,
    point,
  }));
}