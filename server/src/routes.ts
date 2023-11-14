
import dayjs from 'dayjs';
import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { prisma } from "./lib/prisma"

export async function appRoutes(app: FastifyInstance) {
  // Metodo Http: get, post, put, patch, delete
  app.post("/habits", async (request) => {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(z.number().min(0).max(6))
    });
    const { title, weekDays } = createHabitBody.parse(request.body);

    const today = dayjs().startOf('day').toDate()
    //    
    await prisma.habit.create({
      data: {
        title,
        created_at: today,
        weekDays: {
          create: weekDays.map(weekDay => {
            return {
              week_day: weekDay
            }
          })
        }
      }

    })
  })

  app.get('/day', async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date()
    })
    const { date } = getDayParams.parse(request.query)
    const parsedDate = dayjs(date).startOf('day')
    const weekDay = parsedDate.get('day')

   
 

    // todos habitos possives e habitos que ja foram completados 
    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date,
        }, 
        weekDays: {
          some: {
            week_day: weekDay,
          }
        }
      }
    })
    
    const day = await prisma.day.findUnique({
      where: {
        date: date,
      },
      include: {
        dayHabits: true,
      }
    })
   
// console.log(dayjs(date).startOf('day'))
    const completedHabits = day?.dayHabits.map(dayHabits => {
      return dayHabits.habit_id
    })??[]
    return {
      possibleHabits,
      // day,
      completedHabits,
    }
  })

  app.patch('/habits/:id/toggle', async (request) => {
    const toggleHabitsParams = z.object({
      id: z.string().uuid(),
    })

    const { id } = toggleHabitsParams.parse(request.params)

    const today = dayjs().startOf('day').toDate()
    let day = await prisma.day.findUnique({
      where: {
        date: today,
      }
    })


    if (!day) {
      day = await prisma.day.create({
        data: {
          date: today,
        }
      })
    }
    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: day.id,
          habit_id: id,
        }
      }
    })

    if (dayHabit) {
      await prisma.dayHabit.delete({
        where: {
          id: dayHabit.id,
        }
      })
    } else {
      // completar o habito nesse dia
      await prisma.dayHabit.create({
        data: {
          day_id: day.id,
          habit_id: id,
        }
      })
    }
   


  })

  app.get('/summary', async()=>{
    // [ {date: 17/01, amount: 5, completed: 1},{date: 18/01 amount:02, completed:02 },{}, ]
    // prisma ORM: RAW SQL => SQLite
    // usamos tambem sub query's
    const summary = await prisma.$queryRaw`
      SELECT 
      D.id,
      D.date,
      (
        -- completados
        SELECT 
         cast(count(*) as float)
        FROM day_habits DH 
        WHERE DH.day_id = D.id
      ) as completed,
      (
        SELECT
         cast(count(*) as float)
        FROM habit_week_days HWD 
        JOIN habits H
          ON H.id = HWD.habit_id
        WHERE
          HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
        AND H.created_at <= D.date
      ) as amount
      FROM days D
    `;
    return summary
  })

}

