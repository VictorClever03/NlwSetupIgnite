import { ScrollView, View, Text, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { CheckBox } from "../components/CheckBox";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";
import { HabitEmpty } from "../components/HabitEmpty";
import clsx from "clsx";

interface Params {
    date: string
}

interface DayInfoProps {
    completedHabits: string[];
    possibleHabits: {
        id: string;
        title: string;
    }[];
}
export function Habit() {
    const [loading, setLoading] = useState(true)
    const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null)
    const [completedHabits, setCompletedHabits] = useState<string[]>([])

    const route = useRoute();
    const { date } = route.params as Params;

    const parsedDate = dayjs(date);
    const isDateInPast = parsedDate.endOf('day').isBefore(new Date())
    const dayOfWeek = parsedDate.format('dddd');
    const dayAndMonth = parsedDate.format('DD/MM');


    const habitsProgress = dayInfo?.possibleHabits.length
        ? generateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length)
        : 0;

    const habits = ['2L de agua', 'Exercicio', 'alimentacao', 'Planejar proximo dia', 'Dormir 8h'];

    async function fetchHabits() {
        try {
            setLoading(true);
            const response = await api.get('/day', { params: { date } })
            setDayInfo(response.data)
            setCompletedHabits(response.data.completedHabits)

        } catch (error) {
            console.log(error)
            Alert.alert('Ops', 'Nao foi possivel carregar as informacoes dos habitos')
        } finally {
            setLoading(false)
        }


    }
    async function handleToggleHabits(habitId: string) {
        try {
            await api.patch(`/habits/${habitId}/toggle`)
            if (completedHabits.includes(habitId)) {
                setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId))
            } else {
                setCompletedHabits(prevState => [...prevState, habitId])
            }
        } catch (error) {
            console.log(error)
            Alert.alert('Ops','Nao foi possivel atualizar o status')
        }
    }
    useEffect(() => {
        fetchHabits()
    }, [])

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView
                showsVerticalScrollIndicator
                contentContainerStyle={{ paddingBottom: 100 }}
            >

                <BackButton />

                <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                    {
                        dayOfWeek
                    }
                </Text>

                <Text className="text-zinc-400 font-extrabold text-3xl">
                    {
                        dayAndMonth
                    }
                </Text>

                <ProgressBar progress={habitsProgress} />
                <View className={clsx("mt-6",{
                    ['opacity-50']:isDateInPast
                })}>
                    {
                        dayInfo?.possibleHabits ? dayInfo?.possibleHabits.map(habit => (
                            <CheckBox
                                key={habit.id}
                                title={habit.title}
                                checked={completedHabits.includes(habit.id)}
                                disabled={isDateInPast}
                                onPress={() => handleToggleHabits(habit.id)}
                            />
                        ))
                            : <HabitEmpty />

                    }

                </View>
                {
                    isDateInPast&& 
                   ( <Text
                    className="text-red-300 mt-10 text-center"
                   >
                    Voce nao pode editar um habitos de uma data passada
                    </Text>)
                }
            </ScrollView>
        </View>

    )
}