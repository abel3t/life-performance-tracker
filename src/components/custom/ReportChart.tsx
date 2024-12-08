
'use client';

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useQuery } from "@tanstack/react-query";
import { getActivities } from "@/actions";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react";
import { IReportFilterType } from "@/types";
import { format } from "date-fns";

export default function ReportChart({ userId: userId }: { userId: string }) {
  const [filterType, setFilterType] = useState<IReportFilterType>("day");

  const { data: activities, refetch } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      return getActivities(userId, filterType);
    }
  });

  useEffect(() => {
    refetch();
  }, [filterType]);

  return (
    <Card className="mx-1 mt-3">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-1 sm:flex-row px-2 md:px-5">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Biểu đồ:</CardTitle>
        </div>

        <div className="w-[100px] flex items-center">
          <Select
            onValueChange={(value) => setFilterType(value as IReportFilterType)}
            defaultValue="day"
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn khung thời gian" />
            </SelectTrigger>
            <SelectContent >
              <SelectItem value="day">Ngày</SelectItem>
              <SelectItem value="week">Tuần</SelectItem>
              <SelectItem value="month">Tháng</SelectItem>
              <SelectItem value="year">Năm</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={{
            point: {
              label: "Point",
              color: "var(--chart-1)",
            }
          } satisfies ChartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={activities}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                if (filterType === "day") {
                  return format(new Date(value), "dd/MM");
                }

                return value;
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    if (filterType === "day") {
                      return format(new Date(value), "dd/MM");
                    }

                    return value;
                  }}
                />
              }
            />
            <Line
              dataKey={'point'}
              type="monotone"
              stroke={"#06D6A0"}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}