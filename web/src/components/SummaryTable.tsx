import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useEffect, useState } from "react"
import { generateDatesFromYearBeginning } from "../Utils/generate-dates-from-year-beginning"
import { HabitDay } from "./HabitDay"
import { api } from "../lib/axios"
import dayjs from "dayjs"

const weekDays = [
  'D',
  'S',
  'T',
  'Q',
  'Q',
  'S',
  'S',
]
const summaryDates = generateDatesFromYearBeginning()
const minimumSummaryDatesSizes = 18 * 7
const amountOfDayToFill = minimumSummaryDatesSizes - summaryDates.length

type summary = Array<{
  id: string;
  date: string;
  amount: number;
  completed: number;
}>

export function SummaryTable() {
  const [summary, setSummary] = useState<summary>([])

  useEffect(() => {
    api.get('summary').then(response => {
      setSummary(response.data)

    })
  }, [])

  return (

    <ScrollArea.Root className='w-full  flex'>

      <div className="grid grid-rows-7 grid-flow-row gap-3 ">
        {weekDays.map((weekDay, i) => {
          return (
            <div
              key={`${weekDay}-${i}`}
              className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center">
              {weekDay}
            </div>
          )
        })}
      </div>
      <ScrollArea.Viewport className=''>
        <div className="grid grid-rows-7 grid-flow-col gap-3">
          {summary.length > 0 && summaryDates.map(date => {
            const dayInSummary = summary.find(day => {
              return dayjs(date).isSame(day.date, 'day')
            })
            return (
              <HabitDay
                key={date.toString()}
                date={date}
                amount={dayInSummary?.amount}
                defaultCompleted={dayInSummary?.completed}
              />
            )
          })}
          {
            amountOfDayToFill > 0 && Array.from({ length: amountOfDayToFill }).map((_, i) => {
              return (
                <div
                  key={i}
                  className="w-10 h-10 bg-zinc-900  border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed" />
              )
            })
          }
        </div>
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar orientation="horizontal" >
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>

      <ScrollArea.Corner/>
    </ScrollArea.Root>

  )
}