"use client";
import {motion,useReducedMotion} from 'motion/react';
export function Reveal({children}:{children:React.ReactNode}){const reduce=useReducedMotion();return <motion.div initial={reduce?false:{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:.32}}>{children}</motion.div>}
