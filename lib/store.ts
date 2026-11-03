"use client";
import {create} from 'zustand';
import {initialCalculation, type CalculationInput} from './calculation';
type Store={input:CalculationInput;update:(v:Partial<CalculationInput>)=>void;reset:()=>void};
export const useCalculation=create<Store>((set)=>({input:initialCalculation,update:(v)=>set(s=>({input:{...s.input,...v}})),reset:()=>set({input:initialCalculation})}));
