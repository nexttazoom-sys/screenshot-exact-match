import { createFileRoute } from '@tanstack/react-router';
import { Benefits } from '@/components/benefits';
import { pageHead } from '@/components/site-shell';
export const Route = createFileRoute('/beneficios')({head:()=>pageHead('Beneficios y coberturas','Conoce redes preferentes, bonificaciones ambulatorias y hospitalarias, GES y CAEC en CruzBlanca.'),component:Page});
function Page(){return <><section className="page-heading"><div className="site-container"><p className="eyebrow mb-3">COBERTURA PARA LO QUE IMPORTA</p><h1>Conoce tus opciones de salud.</h1><p className="section-subtitle">Información clara para elegir un plan de CruzBlanca.</p></div></section><Benefits full/></>;}