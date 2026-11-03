import Link from 'next/link';
import {PageIntro,PriceNotice} from '@/components/ui';
import {site,money} from '@/lib/content';
import {ArrowUpRight} from 'lucide-react';
export const metadata={title:'Типы натяжных потолков'};
export default function Page(){return <><PageIntro eyebrow="КАТАЛОГ" title="Полотно, профиль и свет." text="Посмотрите варианты поверхности и конструкции. В калькуляторе можно сравнить ориентировочную стоимость."/><div className="container page-body">{site.prices.demo&&<PriceNotice/>}<div className="catalog-grid">{site.types.map((t,i)=><article className="catalog-card" key={t.id}><span className="eyebrow">{String(i+1).padStart(2,'0')} / {t.id==='fabric'?'ТКАНЬ':'ПВХ И КОНСТРУКЦИИ'}</span><h2>{t.name}</h2><p>{t.description}</p><span className="price-label">{site.prices.demo?'Демо-тариф: ':''}от {money(t.rate)} / м²</span><Link href={`/catalog/${t.id}`} className="subtle-link">Подробнее<ArrowUpRight size={15}/></Link></article>)}</div></div></>}
