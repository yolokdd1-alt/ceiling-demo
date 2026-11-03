import {z} from 'zod';
import config from '@/content/booking.json';
import {calculationSchema} from './calculation';
import {leadSchema} from './lead-schema';
export const schedule=config;
export const statuses={hold:'Бронь времени',pending:'Ожидает подтверждения',confirmed:'Подтверждена',completed:'Замер выполнен',cancelled:'Отменена',expired:'Бронь истекла'} as const;
export type BookingStatus=keyof typeof statuses;
export type SlotAvailability={time:string;state:'available'|'held'|'booked'};
export const slotSchema=z.object({id:z.string().uuid(),date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),time:z.string().regex(/^\d{2}:\d{2}$/)});
export const tokenSchema=z.object({id:z.string().uuid(),token:z.string().regex(/^[a-f0-9]{64}$/)});
export const confirmSchema=tokenSchema.extend({name:z.string().trim().min(2,'Укажите имя.').max(80),phone:leadSchema.shape.phone,address:z.string().trim().min(5,'Укажите адрес замера.').max(240),note:z.string().trim().max(500).default(''),consent:z.literal(true,{error:'Нужно согласие на обработку данных.'}),website:z.string().max(0).default(''),calculation:calculationSchema.optional()});
export function dateInZone(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:schedule.timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
export function dateLabel(date:string){return new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',weekday:'short',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z'));}
export function addDays(date:string,days:number){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10);}
// These schedules use Moscow time (UTC+03) until the company's city is configured.
export function slotInstant(date:string,time:string){if(schedule.timezone!=='Europe/Moscow')throw Error('Настройте перевод времени для нового часового пояса.');return new Date(`${date}T${time}:00+03:00`);}
export function validSlot(date:string,time:string,now=new Date()){const day=new Date(date+'T12:00:00Z');if(!Number.isFinite(day.getTime())||day.toISOString().slice(0,10)!==date)return false;const today=dateInZone(now);return date>=today&&date<=addDays(today,schedule.advanceDays)&&schedule.weekdays.includes(day.getUTCDay())&&!schedule.closedDates.includes(date as never)&&schedule.times.includes(time)&&slotInstant(date,time).getTime()>=now.getTime()+schedule.minimumNoticeHours*3600000;}
