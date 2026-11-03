import type {Metadata,Viewport} from 'next';
import localFont from 'next/font/local';
import {Header,Footer} from '@/components/shell';
import {Consent} from '@/components/consent';
import {companyName,city,site} from '@/lib/content';
import './globals.css';
import {BusinessSchema} from '@/components/seo';
const cyrillic=localFont({src:'../public/fonts/golos-cyrillic.woff2',weight:'100 900',style:'normal',variable:'--font-cyrillic',display:'swap',preload:true,adjustFontFallback:false});
const latin=localFont({src:'../public/fonts/golos-latin.woff2',weight:'100 900',style:'normal',variable:'--font-latin',display:'swap',preload:false,adjustFontFallback:false});

const base=process.env.SITE_URL||site.siteUrl||'http://localhost:3000';
export const metadata:Metadata={metadataBase:new URL(base),title:{default:`Натяжные потолки в ${city} · ${companyName}`,template:`%s · ${companyName}`},description:'Рассчитайте ориентировочную стоимость натяжного потолка. Выберите полотно и свет, сохраните расчёт для замера.',openGraph:{type:'website',locale:'ru_RU',siteName:companyName,images:[{url:'/opengraph-image',width:1200,height:630}]},robots:{index:site.configured,follow:site.configured}};
export const viewport:Viewport={themeColor:'#994f37',width:'device-width',initialScale:1};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="ru" className={`${cyrillic.variable} ${latin.variable}`}><body><a className="skip-link" href="#main">Перейти к содержимому</a><Header/><main id="main">{children}</main><Footer/><Consent/><BusinessSchema/></body></html>}
