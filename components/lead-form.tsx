"use client";
import type {Lead} from '@/lib/lead-schema';
import type {CalculationInput} from '@/lib/calculation';
import {BookingWidget} from './booking-widget';
export function LeadForm(props:{source:Lead['source'];calculation?:CalculationInput}){return <BookingWidget calculation={props.calculation}/>}
