import { Mail, MessageCircle, Phone } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import QuoteForm from '@/components/QuoteForm';
import ContactLine from '@/components/site/ContactLine';
import PageHeader from '@/components/site/PageHeader';
import { CONTACT_INFO } from '@/lib/contact-info';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'quote' });
  return {
    title: `${t('title')} | ZIVAH International`,
    description: t('description'),
  };
}

export default async function QuotePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'quote' });
  const tn = await getTranslations({ locale, namespace: 'nav' });
  const includes = t.raw('includes') as string[];
  const trust = t.raw('trust') as string[];

  return (
    <>
      <PageHeader
        crumbs={[{ label: tn('home'), href: '/' }, { label: tn('quote') }]}
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
      />

      <section className='bg-background pb-16 lg:pb-24'>
        <div className='mx-auto grid w-full max-w-[1200px] gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.4fr] lg:gap-16 lg:px-8'>
          <aside className='lg:sticky lg:top-28 lg:self-start'>
            <h2 className='font-serif text-2xl leading-snug text-foreground'>
              {t('includesTitle')}
            </h2>
            <ul className='mt-4 border-t border-border'>
              {includes.map(item => (
                <li
                  key={item}
                  className='border-b border-border py-3 text-[15px] leading-relaxed text-muted-foreground'
                >
                  {item}
                </li>
              ))}
            </ul>

            <h2 className='mt-10 font-serif text-2xl leading-snug text-foreground'>
              {t('contactTitle')}
            </h2>
            <div className='mt-4'>
              <ContactLine
                label={t('contact.email')}
                href={`mailto:${CONTACT_INFO.email}`}
                icon={<Mail className='size-3.5' />}
              >
                {CONTACT_INFO.email}
              </ContactLine>
              <ContactLine
                label={t('contact.whatsapp')}
                href={CONTACT_INFO.whatsapp}
                icon={<MessageCircle className='size-3.5' />}
                external
              >
                {CONTACT_INFO.phone}
              </ContactLine>
              <ContactLine
                label={t('contact.phone')}
                href={CONTACT_INFO.phoneHref}
                icon={<Phone className='size-3.5' />}
              >
                {CONTACT_INFO.phone}
              </ContactLine>
            </div>

            <ul className='mt-8 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase'>
              {trust.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>

          <div>
            <QuoteForm />
          </div>
        </div>
      </section>
    </>
  );
}
