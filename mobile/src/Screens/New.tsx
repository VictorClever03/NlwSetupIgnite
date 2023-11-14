import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { BackButton } from "../components/BackButton";
import { Feather } from '@expo/vector-icons'
import { CheckBox } from "../components/CheckBox";
import { useState } from "react";
import colors from "tailwindcss/colors";
import { api } from "../lib/axios";

const avaiableWeekDays = ['Domingo', 'Segunda F', 'Terça F', 'Quarta F', 'Quinta F', 'Sexta F', 'Sábado',];
export function New() {

    const [title, setTitle] = useState('');
    const [weekDays, setWeekDays] = useState<number[]>([]);

    function handleToggleWeekDay(weekDayIndex: number) {
        if (weekDays.includes(weekDayIndex)) {
            setWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDayIndex));
        } else {
            setWeekDays(prevState => [...prevState, weekDayIndex])
        }
    }

    async function handleCreateNewHabit() {
        try {
            if (!title.trim() || weekDays.length === 0) {
                return Alert.alert('Novo Habito', 'Informe o nome do habito e escolha o periodo')
            }

            await api.post('/habits', {title, weekDays})
            setTitle('');
            setWeekDays([]); 

            Alert.alert('Novo habito','habito criado com sucesso')
        } catch (error) {
            Alert.alert('Ops', 'habito nao criado')
            console.log(error)
        }
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >


                <BackButton />

                <Text className="mt-6 text-white font-extrabold text-3xl">
                    Criar Hábito
                </Text>

                <Text className="mt-6 text-white font-semiblod text-base">
                    Qual seu compromentimento
                </Text>

                <TextInput
                    className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-800 "
                    placeholder="ex.: Exercicios, durmir bem, etc"
                    placeholderTextColor={colors.zinc[400]}
                    onChangeText={setTitle}
                    value={title}
                />
                <Text className="font-semibold mt-4 mb-4 text-white text-base">
                    Qual a recorrência?
                </Text>

                {
                    avaiableWeekDays.map((weekDay, i) => (
                        <CheckBox
                            key={weekDay}
                            title={weekDay}
                            checked={weekDays.includes(i)}
                            onPress={() => handleToggleWeekDay(i)}
                        />
                    ))
                }

                <TouchableOpacity
                    onPress={handleCreateNewHabit}
                    activeOpacity={0.7}
                    className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
                >
                    <Feather
                        name="check"
                        size={20}
                        color={colors.white}
                    />
                    <Text className="font-semibold text-base text-white ml-2">
                        Confirmar
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    )
}