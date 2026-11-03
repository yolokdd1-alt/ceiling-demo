import { z } from 'zod';
import { site } from './content';
export const pointSchema = z.object({ x: z.number().min(0).max(30), y: z.number().min(0).max(30) });
export const calculationSchema = z.object({shape:z.enum(['rectangle','l-shape','custom']), width:z.number().min(1).max(20), length:z.number().min(1).max(20), cutWidth:z.number().min(.2).max(19), cutLength:z.number().min(.2).max(19), points:z.array(pointSchema).min(3).max(16), column:z.boolean(), columnWidth:z.number().min(.2).max(5), columnLength:z.number().min(.2).max(5), type:z.string().refine(v=>site.types.some(t=>t.id===v)),color:z.string().refine(v=>site.colors.some(t=>t.id===v)),lights:z.number().int().min(0).max(100),chandelier:z.boolean(),cornice:z.number().min(0).max(30),track:z.number().min(0).max(50)});
export type CalculationInput = z.infer<typeof calculationSchema>;
export type Point = z.infer<typeof pointSchema>;
export const initialCalculation: CalculationInput = { shape:'rectangle',width:4,length:4.5,cutWidth:1,cutLength:1.5, points:[{x:0,y:0},{x:4,y:0},{x:4,y:4.5},{x:0,y:4.5}],column:false,columnWidth:.5,columnLength:.5,type:'matte',color:'white',lights:6,chandelier:false,cornice:0,track:0 };
export function roomPoints(c: CalculationInput): Point[] { if(c.shape==='custom') return c.points; const w=c.width,h=c.length; if(c.shape==='l-shape') return [{x:0,y:0},{x:w,y:0},{x:w,y:h-c.cutLength},{x:w-c.cutWidth,y:h-c.cutLength},{x:w-c.cutWidth,y:h},{x:0,y:h}]; return [{x:0,y:0},{x:w,y:0},{x:w,y:h},{x:0,y:h}]; }
const cross=(a:Point,b:Point,c:Point)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
function intersects(a:Point,b:Point,c:Point,d:Point){const eps=1e-8;const on=(a:Point,b:Point,p:Point)=>Math.abs(cross(a,b,p))<eps&&p.x>=Math.min(a.x,b.x)-eps&&p.x<=Math.max(a.x,b.x)+eps&&p.y>=Math.min(a.y,b.y)-eps&&p.y<=Math.max(a.y,b.y)+eps;return (cross(a,b,c)*cross(a,b,d)<0&&cross(c,d,a)*cross(c,d,b)<0)||on(a,b,c)||on(a,b,d)||on(c,d,a)||on(c,d,b);}
export function contains(p:Point,poly:Point[]){ let yes=false; for(let i=0,j=poly.length-1;i<poly.length;j=i++) {const a=poly[i],b=poly[j];if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x) yes=!yes;} return yes; }
export function geometry(c:CalculationInput){
 if(c.shape==='l-shape'&&(c.cutWidth>=c.width||c.cutLength>=c.length)) throw Error('Вырез должен быть меньше комнаты.');
 const p=roomPoints(c); let area=0,perimeter=0;
 for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length];const distance=Math.hypot(b.x-a.x,b.y-a.y);if(distance<.1)throw Error('Расстояние между соседними углами должно быть от 0,1 м.');area+=a.x*b.y-b.x*a.y;perimeter+=distance;for(let j=i+1;j<p.length;j++){if(j===i+1||i===0&&j===p.length-1)continue;if(intersects(a,b,p[j],p[(j+1)%p.length]))throw Error('Стороны комнаты пересекаются. Переместите углы.');}}
 area=Math.abs(area)/2;if(area<1)throw Error('Площадь должна быть не меньше 1 м².');
 const minX=Math.min(...p.map(v=>v.x)),maxX=Math.max(...p.map(v=>v.x)),minY=Math.min(...p.map(v=>v.y)),maxY=Math.max(...p.map(v=>v.y));
 const cx=(minX+maxX)/2,cy=(minY+maxY)/2;
 const columnPoints=[{x:cx-c.columnWidth/2,y:cy-c.columnLength/2},{x:cx+c.columnWidth/2,y:cy-c.columnLength/2},{x:cx+c.columnWidth/2,y:cy+c.columnLength/2},{x:cx-c.columnWidth/2,y:cy+c.columnLength/2}];
 if(c.column){if(!columnPoints.every(v=>contains(v,p))||columnPoints.some((a,i)=>p.some((v,j)=>intersects(a,columnPoints[(i+1)%4],v,p[(j+1)%p.length]))))throw Error('Колонна выходит за границы комнаты. Уменьшите размеры или измените форму.');area-=c.columnWidth*c.columnLength;perimeter+=2*(c.columnWidth+c.columnLength);if(area<1)throw Error('Колонна слишком большая.');}
 return {area,perimeter,corners:p.length+(c.column?4:0),points:p,columnPoints};
}
export function calculate(input:CalculationInput){const c=calculationSchema.parse(input);const g=geometry(c);const type=site.types.find(t=>t.id===c.type)!;const lines=[{name:'Полотно',amount:g.area*type.rate},{name:'Профиль',amount:g.perimeter*site.prices.profile},{name:'Углы',amount:Math.max(0,g.corners-4)*site.prices.corner},{name:'Светильники',amount:c.lights*site.prices.light},{name:'Крепление люстры',amount:c.chandelier?site.prices.chandelier:0},{name:'Карниз',amount:c.cornice*site.prices.cornice},{name:'Трек',amount:c.track*site.prices.track}];const raw=lines.reduce((s,v)=>s+v.amount,0);const low=Math.ceil(Math.max(site.prices.minOrder,raw)/100)*100;const high=Math.ceil(low*site.prices.rangeFactor/100)*100;return {...g,lines,low,high,minOrderApplied:raw<site.prices.minOrder};}
