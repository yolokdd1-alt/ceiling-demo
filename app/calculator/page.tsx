import {PageIntro} from '@/components/ui';
import {Calculator} from '@/components/calculator';
export const metadata={title:'Калькулятор потолка и визуализатор',description:'Задайте форму и размеры комнаты, выберите полотно и освещение. Получите предварительную смету и отправьте её мастеру.'};
export default function Page(){return <><PageIntro eyebrow="РАЗМЕРЫ → ПОЛОТНО → СВЕТ → СМЕТА" title="Посчитайте свой потолок." text="Начните с примерных размеров. Даже если комната сложной формы. Все параметры можно изменить."/><Calculator/></>}
