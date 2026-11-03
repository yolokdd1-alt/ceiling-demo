import {z} from 'zod';
import {calculationSchema} from './calculation';
export const leadSchema=z.object({name:z.string().trim().max(80).default(''),phone:z.string().transform(v=>v.replace(/[^\d+]/g,'')).refine(v=>/^\+7[0-9]{10}$/.test(v),'Введите телефон полностью: +7 и 10 цифр.'),consent:z.literal(true,{error:'Нужно согласие на обработку данных.'}),source:z.enum(['home','calculator','contacts','quiz','callback','booking']),website:z.string().max(0).default(''),calculation:calculationSchema.optional()});
export type Lead=z.infer<typeof leadSchema>;
export function maskPhone(value:string){let d=value.replace(/\D/g,'');if(d.startsWith('7')||d.startsWith('8'))d=d.slice(1);d=d.slice(0,10);return '+7'+(d.length?' ('+d.slice(0,3):'')+(d.length>=3?') ':'')+d.slice(3,6)+(d.length>6?'-'+d.slice(6,8):'')+(d.length>8?'-'+d.slice(8,10):'');}
