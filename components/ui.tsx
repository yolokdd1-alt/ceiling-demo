import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
export function ButtonLink({href,children,secondary=false}:{href:string;children:React.ReactNode;secondary?:boolean}){return <Link href={href} className={`button ${secondary?'secondary':''}`}>{children}<ArrowUpRight size={18} aria-hidden="true"/></Link>}
export function PageIntro({eyebrow,title,text}:{eyebrow:string;title:string;text?:string}){return <div className="page-intro container"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{text&&<p className="intro-copy">{text}</p>}</div>}
export function Photo({src,alt,label='TODO · Фото реального объекта',large=false}:{src?:string|null;alt:string;label?:string;large?:boolean}){return <div className={`photo-placeholder ${large?'large':''}`}>{src?<Image src={src} alt={alt} fill sizes={large?'(max-width: 800px) 100vw, 60vw':'(max-width: 800px) 100vw, 33vw'} className="object-cover"/>:<><div className="photo-grid" aria-hidden="true"/><div className="placeholder-cross" aria-hidden="true">+</div><div className="placeholder-caption"><span>{label}</span><small>{alt}</small></div></>}</div>}
export function PriceNotice(){return <p className="notice">Демонстрационные цены. TODO: заменить тарифами компании в content/site.json.</p>}
