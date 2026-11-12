import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import ContactLine from '@/components/site/ContactLine';
import PageHeader from '@/components/site/PageHeader';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { CONTACT_INFO } from '@/lib/contact-info';

interface Props {
  params: Promise<{ locale: string }>;
}

const labelClass =
  'mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground';
const inputClass =
  'h-11 w-full rounded-[2px] border border-input bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-accent focus-visible:outline-none';

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return {
    title: `${t('title')} | ZIVAH International`,
    description: t('lead'),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  const tn = await getTranslations({ locale, namespace: 'nav' });

  return (
    <>
      <PageHeader
        crumbs={[{ label: tn('home'), href: '/' }, { label: tn('contact') }]}
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
      />

      <section className='bg-background pb-16 lg:pb-24'>
        <div className='mx-auto grid w-full max-w-[1200px] gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8'>
          <div>
            <h2 className='font-serif text-2xl leading-snug text-foreground'>
              {t('officesTitle')}
            </h2>

            <div className='mt-4 grid gap-6 border-t border-border pt-4 sm:grid-cols-2'>
              <div>
                <p className='text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase'>
                  {t('ecuador.country')}
                </p>
                <p className='mt-1 text-[17px] text-foreground'>{CONTACT_INFO.ecuador}</p>
                <p className='mt-1 text-[14px] leading-relaxed text-muted-foreground'>
                  {t('ecuador.role')}
                </p>
              </div>
              <div>
                <p className='text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase'>
                  {t('miami.country')}
                </p>
                <p className='mt-1 text-[17px] text-foreground'>{CONTACT_INFO.miami}</p>
                <p className='mt-1 text-[14px] leading-relaxed text-muted-foreground'>
                  {t('miami.role')}
                </p>
              </div>
            </div>

            <h2 className='mt-10 font-serif text-2xl leading-snug text-foreground'>
              {t('channelsTitle')}
            </h2>

            <div className='mt-4'>
              <ContactLine
                label={t('emailLabel')}
                href={`mailto:${CONTACT_INFO.email}`}
                icon={<Mail className='size-3.5' />}
              >
                {CONTACT_INFO.email}
              </ContactLine>
              <ContactLine
                label={t('phoneLabel')}
                href={CONTACT_INFO.phoneHref}
                icon={<Phone className='size-3.5' />}
              >
                {CONTACT_INFO.phone}
              </ContactLine>
              <ContactLine
                label={t('whatsappLabel')}
                href={CONTACT_INFO.whatsapp}
                icon={<MessageCircle className='size-3.5' />}
                external
              >
                {t('whatsappAction')}
              </ContactLine>
              <div className='flex items-center justify-between gap-4 border-b border-border py-3'>
                <span className='flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase'>
                  <span
                    className='size-3.5'
                    aria-hidden='true'
                  />
                  {t('hoursLabel')}
                </span>
                <span className='text-right text-[15px] text-foreground'>{t('hours')}</span>
              </div>
            </div>

            <div className='mt-8'>
              <a
                href={CONTACT_INFO.directions}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground underline underline-offset-4 transition-colors hover:text-accent'
              >
                <MapPin
                  aria-hidden='true'
                  className='size-4'
                />
                {t('directions')}
                <ArrowUpRight
                  aria-hidden='true'
                  className='size-3.5'
                />
              </a>
              <p className='mt-2 text-[13px] leading-relaxed text-muted-foreground'>{t('noMap')}</p>
            </div>
          </div>

          <div>
            <h2 className='font-serif text-2xl leading-snug text-foreground'>{t('formTitle')}</h2>

            <form
              action={`mailto:${CONTACT_INFO.email}`}
              method='post'
              encType='text/plain'
              className='mt-4 space-y-5 rounded-[2px] border border-border bg-surface p-6 sm:p-8'
            >
              <div className='grid gap-5 sm:grid-cols-2'>
                <div>
                  <label
                    htmlFor='contact-name'
                    className={labelClass}
                  >
                    {t('form.name')} *
                  </label>
                  <input
                    id='contact-name'
                    type='text'
                    name='name'
                    required
                    className={inputClass}
                    placeholder={t('form.namePlaceholder')}
                  />
                </div>
                <div>
                  <label
                    htmlFor='contact-company'
                    className={labelClass}
                  >
                    {t('form.company')}
                  </label>
                  <input
                    id='contact-company'
                    type='text'
                    name='company'
                    className={inputClass}
                    placeholder={t('form.companyPlaceholder')}
                  />
                </div>
                <div>
                  <label
                    htmlFor='contact-email'
                    className={labelClass}
                  >
                    {t('form.email')} *
                  </label>
                  <input
                    id='contact-email'
                    type='email'
                    name='email'
                    required
                    className={inputClass}
                    placeholder={t('form.emailPlaceholder')}
                  />
                </div>
                <div>
                  <label
                    htmlFor='contact-phone'
                    className={labelClass}
                  >
                    {t('form.phone')}
                  </label>
                  <input
                    id='contact-phone'
                    type='tel'
                    name='phone'
                    className={inputClass}
                    placeholder={t('form.phonePlaceholder')}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor='contact-message'
                  className={labelClass}
                >
                  {t('form.message')} *
                </label>
                <textarea
                  id='contact-message'
                  name='message'
                  required
                  rows={5}
                  className={`${inputClass} h-auto min-h-[120px] py-2`}
                  placeholder={t('form.messagePlaceholder')}
                />
              </div>

              <div className='space-y-2'>
                <Button
                  type='submit'
                  variant='brand'
                  size='full'
                >
                  {t('form.submit')}
                </Button>
                <p className='text-[13px] leading-relaxed text-muted-foreground'>
                  {t('form.privacy')}
                </p>
              </div>
            </form>

            <p className='mt-5 text-[14px] text-muted-foreground'>
              <Link
                href='/quote'
                className='text-foreground underline underline-offset-4 transition-colors hover:text-accent'
              >
                {t('quotePrompt')}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
