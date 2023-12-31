import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "phosphor-react";
import { FormEvent, useState } from "react";
import { api } from "../lib/axios";
const availableWeeksDays = [
  'Domingo',
  'Segunda Feira',
  'Terça Feira',
  'Quarta Feira',
  'Quinta Feira',
  'Sexta Feira',
  'Sábado',
];
export function ModalHabitForm() {
  const [title, setTitle] = useState('');
  const [weekDays, setWeekDays] = useState<number[]>([])

  async function createNewHabit(event: FormEvent) {
    event.preventDefault()
    if (!title || weekDays.length === 0) {
      return
    }
    await api.post('habits', {
      title,
      weekDays,
    })
    setTitle('')
    setWeekDays([])
    alert('Habito criado com sucesso!')
  }

  function handleToggleWeekDay(weekDay:number) {
    if(weekDays.includes(weekDay)){
       const weekDaysWithRemovedOne=weekDays.filter(day=>day!== weekDay)

       setWeekDays(weekDaysWithRemovedOne)
    } else {
      const weekDaysWithAddedOne=[...weekDays, weekDay]

      setWeekDays(weekDaysWithAddedOne)
    }

  }

  return (
    <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
      <label
        htmlFor="title" className=" font-semibold leading-tight mb-4">
        Qual seu compromentimento
      </label>

      <input
        onChange=
        {
          event => setTitle(event.target.value)
        }
        value={title}
        type="text"
        id="title"
        placeholder="ex.: Exercicio, dormir bem, etc..."
        autoFocus
        className="p-4 rounded-lg bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
      />

      <label
        htmlFor="" className=" font-semibold leading-tight mt-4">
        Qual a recorrencia?
      </label>

      <div className="mt-6 flex flex-col gap-3">
        {
          availableWeeksDays.map((weekDay, i) => (
            <Checkbox.Root
            checked={weekDays.includes(i)}
              key={weekDay}
              className='flex items-center gap-3 group focus:outline-none'
              onCheckedChange={() => {
                handleToggleWeekDay(i)
              }}
            >
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-violet-500 group-focus:ring-offset-2 group-focus:ring-offset-background">
                <Checkbox.Indicator >
                  <Check
                    className='text-white'
                    size={20}

                  />
                </Checkbox.Indicator>
              </div>
              <span
                className='text-white leading-tight'>
                {weekDay}
              </span>
            </Checkbox.Root>
          ))
        }

      </div>


      <button
        type="submit"
        className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3  font-semibold bg-green-600 hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
      >
        <Check size={28} weight="bold" />
        Confirmar
      </button>
    </form>
  )
}