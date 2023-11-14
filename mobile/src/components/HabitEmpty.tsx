import { useNavigation } from "@react-navigation/native"
import { Text } from "react-native"


export function HabitEmpty(){
    const {navigate}=useNavigation()
    return(
        <Text
        className="text-zinc-400 text-base"
        >
            Voce ainda nao esta monitorando nenhum habito{' '}
            <Text 
            className="text-violet-400 text-base underline active:text-violet-500"
            onPress={()=> navigate('new')}
            >
                comece cadastrando um
            </Text>
        </Text>

    )
}