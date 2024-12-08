'use client';

import { createNewActivity } from "@/actions";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { z } from "zod"
import { ActivityType } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react";
import { cn } from "@/lib/utils";
import ReportChart from "@/components/custom/ReportChart";
import { ICreateActivity } from "@/types";


export default function Home() {
  const userId = '1j9zt48iey3wv2om7rsn0dkl';
  const [isOpen, setIsOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: (activity: ICreateActivity) => {
      return createNewActivity(userId, activity);
    },
  });

  const formSchema = z.object({
    name: z.string().min(2).max(50),
    type: z.nativeEnum(ActivityType),
    description: z.string().max(100).optional(),
    duration: z.number().min(5).max(180),
    date: z.date(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: ActivityType.X1,
      description: "",
      duration: 5,
      date: new Date(),
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutation.mutate({
      name: data.name,
      type: data.type,
      description: data.description,
      duration: data.duration,
      date: data.date,
    });

    form.reset();
    setIsOpen(false);
  };

  return (
    <div>
      <div className="p-1">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-end">
            <PopoverTrigger asChild>
              <Button variant="default">Thêm hoạt động</Button>
            </PopoverTrigger>
          </div>

          <PopoverContent className="w-80">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên hoạt động</FormLabel>
                      <FormControl>
                        <Input placeholder="Tên hoạt động" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Input placeholder="Mô tả hoạt động" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          switch (value) {
                            case "1x":
                              field.onChange(ActivityType.X1);
                              break;
                            case "2x":
                              field.onChange(ActivityType.X2);
                              break;
                            case "3x":
                              field.onChange(ActivityType.X3);
                              break;
                            case "5x":
                              field.onChange(ActivityType.X5);
                              break;
                            case "10x":
                              field.onChange(ActivityType.X10);
                              break;
                          }
                        }}
                        defaultValue={'1x'}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1x">1x</SelectItem>
                          <SelectItem value="2x">2x</SelectItem>
                          <SelectItem value="3x">3x</SelectItem>
                          <SelectItem value="5x">5x</SelectItem>
                          <SelectItem value="10x">10x</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thời gian</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number" step={1} min={5} max={180} placeholder="Thời gian"
                          onChange={(event) => field.onChange(parseInt(event.target.value) ?? 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Ngày</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Chọn Ngày</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Gửi</Button>
              </form>
            </Form>
          </PopoverContent>
        </Popover>
      </div>


      <ReportChart userId={userId} />
    </div>
  );
}
