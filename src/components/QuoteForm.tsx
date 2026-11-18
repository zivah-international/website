'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
// Note: Using react-select instead of shadcn Select for advanced features:
// - Searchable/filterable options
// - Custom option rendering
// - Async data loading
// For simple selects, prefer @/components/ui/select
import Select from 'react-select';

import { useBusinessTracking } from '@/components/BusinessIntelligence';
import { Button } from '@/components/ui/button';
import {
  calculateLineTotal,
  type CatalogPrice,
  formatCurrency as formatUsd,
  type MeasureCompatibility,
  normalizeQuantityInput,
  resolveUnitPrice,
  sumCurrencyAmounts,
} from '@/lib/quote-pricing';
import { createQuoteSchema } from '@/lib/validations';

const labelClass =
  'mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground';
const inputClass =
  'h-11 w-full rounded-[2px] border border-input bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-accent focus-visible:outline-none';
const errorClass = 'mt-1 text-[13px] text-destructive';

interface QuoteProduct {
  id: number;
  name: string;
  description?: string;
  sku?: string;
  baseMeasureId: number | null;
  prices: CatalogPrice[];
  compatibilities: MeasureCompatibility[];
  eligibleMeasures: Measure[];
}

interface CountryCurrency {
  code?: string;
  symbol?: string;
  name?: string;
}

interface Country {
  id: number;
  name: string;
  code: string;
  icon?: string;
  currency: string | CountryCurrency;
  callingCode?: string;
  phoneFormat?: string;
}

interface Measure {
  id: number;
  name: string;
  shortName: string;
  symbol?: string;
  type: string;
  familyId?: number | null;
  baseUnit?: string;
  conversionFactor?: string | null;
  description?: string;
}

interface QuoteItem {
  productId: number;
  measureId: number;
  measureType: string;
  quantity: string;
  notes?: string;
  specifications?: Record<string, unknown>;
}

interface QuoteFormData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  company?: string;
  countryId: number;
  recipientEmail?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    coordinates?: { lat: number; lng: number };
  };
  message?: string;
  items: QuoteItem[];
}

interface QuoteFormProps {
  initialProducts?: QuoteProduct[];
}

export default function QuoteForm({ initialProducts }: QuoteFormProps = {}) {
  const t = useTranslations('quoteForm');
  const locale = useLocale();
  const [products, setProducts] = useState<QuoteProduct[]>(initialProducts || []);
  const [countries, setCountries] = useState<Country[]>([]);
  const [measures, setMeasures] = useState<Measure[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<QuoteProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProductList, setShowProductList] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [countriesError, setCountriesError] = useState<string | null>(null);
  const [measuresLoading, setMeasuresLoading] = useState(true);
  const [measuresError, setMeasuresError] = useState<string | null>(null);
  const [productsSearching, setProductsSearching] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  const formatCountryCurrency = useCallback((currency: Country['currency'] | undefined) => {
    if (!currency) return '';
    if (typeof currency === 'string') {
      // Try to parse as JSON in case it's a JSON string from the database
      try {
        const parsed = JSON.parse(currency);
        return parsed.code || parsed.symbol || parsed.name || currency;
      } catch {
        // If it's not JSON, return as is (simple currency code)
        return currency;
      }
    }
    return currency.code || currency.symbol || currency.name || '';
  }, []);

  const schema = useMemo(
    () =>
      createQuoteSchema(
        {
          nameMin: t('validation.nameMin'),
          nameMax: t('validation.nameMax'),
          emailInvalid: t('validation.emailInvalid'),
          phoneInvalid: t('validation.phoneInvalid'),
          phoneMin: t('validation.phoneMin'),
          phoneMax: t('validation.phoneMax'),
          countryInvalid: t('validation.countryInvalid'),
          recipientEmailInvalid: t('validation.recipientEmailInvalid'),
          itemsMin: t('validation.itemsMin'),
          phoneCountryInvalid: t('validation.phoneCountryInvalid'),
          quantityInvalid: t('validation.quantityInvalid'),
        },
        locale
      ),
    [t, locale]
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      items: [],
    },
  });

  // Business tracking hook
  const { trackQuoteFormComplete, trackBusinessConversion } = useBusinessTracking();

  const loadCountries = useCallback(async () => {
    setCountriesLoading(true);
    setCountriesError(null);
    try {
      const response = await fetch('/api/quotes/countries');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data.error || !Array.isArray(data.data) || data.data.length === 0) {
        throw new Error('No countries returned');
      }
      setCountries(data.data);
    } catch {
      setCountriesError(t('countriesLoadError'));
    } finally {
      setCountriesLoading(false);
    }
  }, [t]);

  const loadMeasures = useCallback(async () => {
    setMeasuresLoading(true);
    setMeasuresError(null);
    try {
      const response = await fetch('/api/quotes/measures');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data.error || !Array.isArray(data.data) || data.data.length === 0) {
        throw new Error('No measures returned');
      }
      setMeasures(data.data);
    } catch {
      setMeasuresError(t('measuresLoadError'));
    } finally {
      setMeasuresLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadCountries();
    void loadMeasures();
  }, [loadCountries, loadMeasures]);

  const searchProducts = useCallback(
    async (queryText: string) => {
      setSearchQuery(queryText);
      setProductsError(null);

      if (queryText.trim().length < 2) {
        setProducts([]);
        setShowProductList(false);
        return;
      }

      setProductsSearching(true);
      setShowProductList(true);
      try {
        const response = await fetch(
          `/api/quotes/products/search?q=${encodeURIComponent(queryText)}&limit=10&locale=${locale}`
        );
        if (response.status === 429) throw new Error('rate-limit');
        if (!response.ok) throw new Error('request-failed');
        const data = await response.json();
        if (data.error || !Array.isArray(data.data)) throw new Error('request-failed');
        setProducts(data.data);
      } catch (error) {
        setProducts([]);
        setProductsError(
          error instanceof Error && error.message === 'rate-limit'
            ? t('productsRateLimited')
            : t('productsLoadError')
        );
      } finally {
        setProductsSearching(false);
      }
    },
    [locale, t]
  );

  const getAvailableMeasuresForProduct = (product: QuoteProduct): Measure[] =>
    product.eligibleMeasures || [];

  const getPriceForUnit = useCallback(
    (product: QuoteProduct, measureId: number) =>
      resolveUnitPrice({
        prices: product.prices || [],
        baseMeasureId: product.baseMeasureId,
        selectedMeasureId: measureId,
        compatibilities: product.compatibilities || [],
      }),
    []
  );

  const getLineSubtotal = (item: QuoteItem): string | null => {
    const product = selectedProducts.find(candidate => candidate.id === item.productId);
    if (!product) return null;
    const quantity = normalizeQuantityInput(item.quantity, locale, item.measureType);
    const unitPrice = getPriceForUnit(product, item.measureId);
    return quantity && unitPrice ? calculateLineTotal(quantity, unitPrice.rational) : null;
  };

  const addProduct = (product: QuoteProduct) => {
    if (selectedProducts.some(selected => selected.id === product.id)) return;
    const availableMeasures = getAvailableMeasuresForProduct(product);
    const defaultMeasure =
      availableMeasures.find(measure => measure.id === product.baseMeasureId) ||
      availableMeasures[0];
    if (!defaultMeasure) return;

    setSelectedProducts(current => [...current, product]);
    const currentItems = watch('items') || [];
    setValue('items', [
      ...currentItems,
      {
        productId: product.id,
        measureId: defaultMeasure.id,
        measureType: defaultMeasure.type,
        quantity: '1',
      },
    ]);
  };

  const removeProduct = (productId: number) => {
    setSelectedProducts(current => current.filter(product => product.id !== productId));
    const currentItems = watch('items') || [];
    setValue(
      'items',
      currentItems.filter(item => item.productId !== productId)
    );
  };

  const updateQuantity = (productId: number, quantity: string) => {
    const currentItems = watch('items') || [];
    setValue(
      'items',
      currentItems.map(item => (item.productId === productId ? { ...item, quantity } : item)),
      { shouldDirty: true, shouldTouch: true, shouldValidate: true }
    );
  };

  const updateMeasure = (productId: number, measureId: number) => {
    const product = selectedProducts.find(candidate => candidate.id === productId);
    const newMeasure = product?.eligibleMeasures.find(measure => measure.id === measureId);
    if (!newMeasure) return;

    const currentItems = watch('items') || [];
    setValue(
      'items',
      currentItems.map(item =>
        item.productId === productId ? { ...item, measureId, measureType: newMeasure.type } : item
      ),
      { shouldDirty: true, shouldTouch: true, shouldValidate: true }
    );
    void trigger('items');
  };

  // Update item notes
  const updateNotes = (productId: number, notes: string) => {
    const currentItems = watch('items') || [];
    setValue(
      'items',
      currentItems.map(item => (item.productId === productId ? { ...item, notes } : item))
    );
  };

  // Validate phone number based on selected country
  const validatePhone = (phone: string, countryId?: number): string | null => {
    if (!phone || !countryId) return null;

    const cleanPhone = phone.replace(/\s|-|\(|\)/g, '');
    const selectedCountry = countries.find(c => c.id === countryId);

    if (!selectedCountry?.callingCode) return null;

    const callingCode = selectedCountry.callingCode.replace('+', '');

    // Check if phone starts with country code
    if (!cleanPhone.startsWith('+') && !cleanPhone.startsWith(callingCode)) {
      return t('phoneRequiresCode', { code: selectedCountry.callingCode });
    }

    // Basic length validation
    if (cleanPhone.length < 10) {
      return t('phoneMinDigits');
    }

    if (cleanPhone.length > 20) {
      return t('phoneMaxChars');
    }

    return null;
  };

  // Calculate total
  const calculateTotal = () => {
    const items = watch('items') || [];
    if (items.length === 0) return null;
    return sumCurrencyAmounts(items.map(item => getLineSubtotal(item)));
  };

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          company: data.company,
          countryId: data.countryId,
          message: data.message,
          items: data.items.map(({ measureType, ...item }) => ({
            productId: item.productId,
            measureId: item.measureId,
            quantity: normalizeQuantityInput(item.quantity, locale, measureType),
            notes: item.notes,
            specifications: item.specifications,
          })),
          recipientEmail: data.customerEmail, // Send quote email to customer
          locale, // For multi-language email
        }),
      });

      const result = await response.json();

      if (response.ok && !result.error) {
        const emailSent = result.data?.emailSent === true;
        setSubmitMessage({
          type: 'success',
          text: emailSent
            ? t('quoteCreatedSuccess', { email: data.customerEmail })
            : t('quoteCreatedEmailFailed'),
        });

        // Track successful quote submission
        const selectedCountry = countries.find(c => c.id === data.countryId);
        trackQuoteFormComplete({
          products: selectedProducts.map(p => ({
            id: p.id.toString(),
            name: p.name,
            quantity: Number(
              normalizeQuantityInput(
                data.items.find(item => item.productId === p.id)?.quantity || '0',
                locale,
                data.items.find(item => item.productId === p.id)?.measureType || 'QUANTITY'
              ) || 0
            ),
          })),
          contactInfo: {
            name: data.customerName,
            email: data.customerEmail,
            company: data.company,
          },
          deliveryInfo: selectedCountry
            ? {
                country: selectedCountry.name,
                port: undefined, // Could be added to form later
              }
            : undefined,
        });

        // Track business conversion
        trackBusinessConversion('quote_request');

        // Reset form
        setSelectedProducts([]);
        setValue('items', []);
        setSearchQuery('');
        setShowProductList(false);
      } else {
        setSubmitMessage({
          type: 'error',
          text: result.message || t('errorMessage'),
        });
      }
    } catch {
      setSubmitMessage({
        type: 'error',
        text: t('errorMessage'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='rounded-[2px] border border-border bg-surface p-6 sm:p-8'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-6'
      >
        {submitMessage?.type === 'error' && (
          <div
            role='alert'
            className='border border-destructive/40 bg-destructive/5 p-4 text-[13px] text-destructive'
          >
            <p>{submitMessage.text}</p>
            <a
              href='#customerName'
              className='mt-1 inline-block underline underline-offset-4'
            >
              {t('reviewFields')}
            </a>
          </div>
        )}

        <h2 className='font-serif text-2xl leading-snug text-foreground'>{t('title')}</h2>

        {/* Customer Information */}
        <h3 className='font-serif text-lg text-foreground'>{t('contactSection')}</h3>
        <div className='grid gap-6 md:grid-cols-2'>
          <div>
            <label
              htmlFor='customerName'
              className={labelClass}
            >
              {t('fullName')} *
            </label>
            <input
              {...register('customerName')}
              id='customerName'
              type='text'
              className={inputClass}
              placeholder={t('fullNamePlaceholder')}
            />
            {errors.customerName && <p className={errorClass}>{errors.customerName.message}</p>}
          </div>
          <div>
            <label
              htmlFor='customerEmail'
              className={labelClass}
            >
              {t('email')} *
            </label>
            <input
              {...register('customerEmail')}
              id='customerEmail'
              type='email'
              className={inputClass}
              placeholder={t('emailPlaceholder')}
            />
            {errors.customerEmail && <p className={errorClass}>{errors.customerEmail.message}</p>}
          </div>{' '}
          <div>
            <label
              htmlFor='countryId'
              className={labelClass}
            >
              {t('destinationCountry')} *
            </label>
            {countriesLoading ? (
              <div className='flex h-11 w-full items-center rounded-[2px] border border-border bg-muted px-3 text-sm text-muted-foreground'>
                {t('loadingCountries')}
              </div>
            ) : countriesError ? (
              <div
                className='rounded-[2px] border border-destructive/40 bg-destructive/5 px-3 py-2 text-[13px] text-destructive'
                role='alert'
              >
                <p>{countriesError}</p>
                <button
                  type='button'
                  className='mt-2 underline underline-offset-4'
                  onClick={() => void loadCountries()}
                >
                  {t('tryAgain')}
                </button>
              </div>
            ) : (
              <Controller
                name='countryId'
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    inputId='countryId'
                    options={countries.map(country => ({
                      value: country.id,
                      label: `${country.name} (${formatCountryCurrency(country.currency)})`,
                    }))}
                    onChange={option => field.onChange(option?.value)}
                    value={
                      countries.find(c => c.id === field.value)
                        ? {
                            value: field.value,
                            label: `${countries.find(c => c.id === field.value)?.name} (${formatCountryCurrency(countries.find(c => c.id === field.value)?.currency)})`,
                          }
                        : null
                    }
                    className='text-foreground'
                    placeholder={t('selectCountry')}
                    isDisabled={countries.length === 0}
                    menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                    styles={{
                      control: base => ({
                        ...base,
                        minHeight: '44px',
                        backgroundColor: 'var(--surface)',
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)',
                        borderRadius: '2px',
                        boxShadow: 'none',
                      }),
                      valueContainer: base => ({
                        ...base,
                        paddingLeft: '12px',
                        paddingRight: '12px',
                      }),
                      placeholder: base => ({
                        ...base,
                        color: 'var(--muted-foreground)',
                      }),
                      singleValue: base => ({
                        ...base,
                        color: 'var(--foreground)',
                      }),
                      menuPortal: base => ({
                        ...base,
                        zIndex: 9999,
                      }),
                      menu: base => ({
                        ...base,
                        backgroundColor: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '2px',
                        boxShadow: 'none',
                        overflow: 'hidden',
                      }),
                      menuList: base => ({
                        ...base,
                        backgroundColor: 'var(--surface)',
                        borderRadius: '2px',
                        padding: '0.25rem 0',
                        maxHeight: '300px',
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                          ? 'var(--accent)'
                          : state.isFocused
                            ? 'var(--muted)'
                            : 'var(--surface)',
                        color: state.isSelected ? 'var(--accent-foreground)' : 'var(--foreground)',
                        cursor: 'pointer',
                        padding: '10px 12px',
                        transition: 'background-color 0.15s ease',
                      }),
                    }}
                  />
                )}
              />
            )}
            {errors.countryId && (
              <p className={errorClass}>{errors.countryId.message || t('required')}</p>
            )}
          </div>
          <div>
            <label
              htmlFor='customerPhone'
              className={labelClass}
            >
              {t('phone')}
            </label>
            <div className='relative'>
              {watch('countryId') && countries.find(c => c.id === watch('countryId')) && (
                <div className='pointer-events-none absolute top-1/2 left-3 flex -translate-y-1/2 transform items-center'>
                  <span className='text-sm text-muted-foreground'>
                    {countries.find(c => c.id === watch('countryId'))?.callingCode || '+'}
                  </span>
                </div>
              )}
              <input
                {...register('customerPhone', {
                  validate: value => {
                    if (!value) return true; // Optional field
                    const error = validatePhone(value, watch('countryId'));
                    return error || true;
                  },
                })}
                id='customerPhone'
                type='tel'
                className={`${inputClass} ${watch('countryId') ? 'pl-16' : ''}`}
                placeholder={
                  countries.find(c => c.id === watch('countryId'))?.phoneFormat || '+1 234 567 8900'
                }
              />
            </div>
            {errors.customerPhone && <p className={errorClass}>{errors.customerPhone.message}</p>}
          </div>
          <div className='md:col-span-2'>
            <label
              htmlFor='company'
              className={labelClass}
            >
              {t('company')}
            </label>
            <input
              {...register('company')}
              id='company'
              type='text'
              className={inputClass}
              placeholder={t('companyPlaceholder')}
            />
          </div>
        </div>

        {/* Product Search with Multiple Selection */}
        <h3 className='font-serif text-lg text-foreground'>{t('productsSection')}</h3>
        {measuresLoading && <p className='text-sm text-muted-foreground'>{t('loadingMeasures')}</p>}
        {measuresError && (
          <div
            className='border border-destructive/40 bg-destructive/5 p-3 text-[13px] text-destructive'
            role='alert'
          >
            <p>{measuresError}</p>
            <button
              type='button'
              className='mt-2 underline underline-offset-4'
              onClick={() => void loadMeasures()}
            >
              {t('tryAgain')}
            </button>
          </div>
        )}
        <div className='relative'>
          <label
            htmlFor='productSearch'
            className={labelClass}
          >
            {t('searchProducts')} *
          </label>
          <input
            id='productSearch'
            type='text'
            value={searchQuery}
            placeholder={t('searchPlaceholder')}
            onChange={e => searchProducts(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowProductList(true)}
            className={inputClass}
          />
          {errors.items && <p className={errorClass}>{errors.items.message}</p>}

          {productsSearching && searchQuery.length >= 2 && (
            <div className='absolute z-10 mt-2 w-full rounded-[2px] border border-border bg-surface p-4'>
              <div className='flex items-center justify-center text-muted-foreground'>
                <svg
                  className='mr-3 -ml-1 h-5 w-5 animate-spin text-muted-foreground'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  />
                </svg>
                {t('searchingProducts')}
              </div>
            </div>
          )}

          {productsError && searchQuery.length >= 2 && (
            <div
              role='alert'
              className='mt-2 border border-destructive/40 bg-destructive/5 p-3 text-[13px] text-destructive'
            >
              <p>{productsError}</p>
              <button
                type='button'
                className='mt-2 underline underline-offset-4'
                onClick={() => void searchProducts(searchQuery)}
              >
                {t('tryAgain')}
              </button>
            </div>
          )}

          {showProductList && !productsSearching && searchQuery.length >= 2 && (
            <div className='absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-[2px] border border-border bg-surface'>
              {products.length > 0 ? (
                <>
                  <div className='border-b border-border bg-muted p-2'>
                    <small className='text-muted-foreground'>{t('clickToAdd')}</small>
                  </div>
                  {products.map(product => {
                    const isSelected = selectedProducts.find(p => p.id === product.id);
                    const defaultMeasure =
                      product.eligibleMeasures?.find(
                        measure => measure.id === product.baseMeasureId
                      ) || product.eligibleMeasures?.[0];
                    const estimate = defaultMeasure
                      ? getPriceForUnit(product, defaultMeasure.id)
                      : null;
                    return (
                      <button
                        key={product.id}
                        type='button'
                        disabled={!defaultMeasure}
                        className={`w-full cursor-pointer border-b border-border p-3 text-left text-foreground last:border-b-0 hover:bg-muted/50 ${isSelected ? 'border-l-2 border-l-accent' : ''}`}
                        onClick={() => addProduct(product)}
                      >
                        <div className='flex items-start justify-between'>
                          <div className='flex-1'>
                            <div className='flex items-center font-medium'>
                              {product.name}
                              {isSelected && (
                                <span className='ml-2 text-sm text-accent'>{t('added')}</span>
                              )}
                            </div>
                            <div className='text-sm text-muted-foreground'>
                              {estimate
                                ? `${formatUsd(estimate.displayAmount, locale, estimate.converted ? 6 : 2)} ${t('perUnitPrice')}`
                                : t('pricePending')}{' '}
                              - {product.description || t('noDescription')}
                            </div>
                            {!defaultMeasure && (
                              <div className='text-xs text-destructive'>
                                {t('noEligibleMeasures')}
                              </div>
                            )}
                            <div className='text-xs text-muted-foreground'>
                              SKU: {product.sku || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </>
              ) : (
                <div className='p-4 text-center text-muted-foreground'>
                  <div className='text-sm'>
                    {t('noProductsFound')} &quot;{searchQuery}&quot;
                  </div>
                  <div className='mt-1 text-xs text-muted-foreground'>{t('tryOtherTerms')}</div>
                </div>
              )}
              <div className='border-t border-border bg-muted p-2'>
                <button
                  type='button'
                  onClick={() => setShowProductList(false)}
                  className='text-sm text-foreground hover:text-accent'
                >
                  {t('closeList')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Selected Products */}
        {selectedProducts.length > 0 && (
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='font-serif text-lg text-foreground'>
                {t('selectedProducts')} ({selectedProducts.length})
              </h3>
              <button
                type='button'
                onClick={() => {
                  setSelectedProducts([]);
                  setValue('items', []);
                }}
                className='text-sm text-destructive hover:text-destructive/80'
              >
                {t('clearAll')}
              </button>
            </div>

            {selectedProducts.length > 0 && (
              <div className='border-y border-border py-3 text-sm'>
                <p className='mb-2 text-muted-foreground'>
                  <strong>{t('measureUnitsHelp')}</strong>
                </p>
                <ul className='space-y-1 text-xs text-muted-foreground'>
                  <li>
                    <strong>{t('weightUnits')}</strong>
                  </li>
                  <li>
                    <strong>{t('volumeUnits')}</strong>
                  </li>
                  <li>
                    <strong>{t('containerUnits')}</strong>
                  </li>
                  <li>
                    <strong>{t('quantityUnits')}</strong>
                  </li>
                </ul>
              </div>
            )}

            {selectedProducts.map(product => {
              const itemIndex = (watch('items') || []).findIndex(i => i.productId === product.id);
              const item = watch('items')?.[itemIndex];
              const selectedMeasure = measures.find(measure => measure.id === item?.measureId);
              const unitPrice = item ? getPriceForUnit(product, item.measureId) : null;
              const lineSubtotal = item ? getLineSubtotal(item) : null;
              return (
                <div
                  key={product.id}
                  className='border-t border-border pt-4'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1 text-foreground'>
                      <div className='font-medium'>{product.name}</div>
                      <div className='text-sm text-muted-foreground'>
                        {product.description || t('noDescription')}
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        SKU: {product.sku || 'N/A'}
                      </div>
                    </div>
                    <button
                      type='button'
                      onClick={() => removeProduct(product.id)}
                      aria-label={t('removeProduct')}
                      className='ml-4 text-muted-foreground transition-colors hover:text-destructive'
                    >
                      <X
                        aria-hidden='true'
                        className='size-4'
                      />
                    </button>
                  </div>

                  <div className='grid items-end gap-3 md:grid-cols-4'>
                    <div>
                      <label
                        htmlFor={`quantity-${product.id}`}
                        className={labelClass}
                      >
                        {t('quantity')}
                      </label>
                      <input
                        id={`quantity-${product.id}`}
                        type='text'
                        inputMode='decimal'
                        autoComplete='off'
                        aria-invalid={Boolean(errors.items?.[itemIndex]?.quantity)}
                        value={item?.quantity ?? '1'}
                        onChange={e => updateQuantity(product.id, e.target.value)}
                        className={`${inputClass} text-center`}
                      />
                      {errors.items?.[itemIndex]?.quantity?.message && (
                        <p className={errorClass}>{errors.items[itemIndex]?.quantity?.message}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor={`measure-${product.id}`}
                        className={labelClass}
                      >
                        {t('measureUnit')}
                      </label>
                      <select
                        id={`measure-${product.id}`}
                        value={item?.measureId || ''}
                        onChange={e => updateMeasure(product.id, parseInt(e.target.value))}
                        className={inputClass}
                        title={
                          item?.measureId
                            ? measures.find(m => m.id === item.measureId)?.description
                            : t('select')
                        }
                      >
                        <option value=''>{t('select')}...</option>
                        {(() => {
                          // The search API returns the product's active base and explicitly eligible units.
                          const availableMeasures = getAvailableMeasuresForProduct(product);
                          const measuresByType: {
                            [key: string]: typeof availableMeasures;
                          } = {};

                          // Group measures by type
                          availableMeasures.forEach(measure => {
                            if (!measuresByType[measure.type]) {
                              measuresByType[measure.type] = [];
                            }
                            measuresByType[measure.type].push(measure);
                          });

                          return Object.entries(measuresByType).map(([type, typeMeasures]) => {
                            if (typeMeasures.length === 0) return null;

                            // Get translated type name
                            const typeLabel = t(`measureTypes.${type}`) || type;

                            return (
                              <optgroup
                                key={type}
                                label={typeLabel}
                                className='text-foreground'
                              >
                                {typeMeasures.map(measure => {
                                  const unitPrice = getPriceForUnit(product, measure.id);

                                  return (
                                    <option
                                      key={measure.id}
                                      value={measure.id}
                                    >
                                      {measure.name} ({measure.shortName})
                                      {measure.symbol && ` - ${measure.symbol}`}
                                      {unitPrice
                                        ? ` - ${formatUsd(unitPrice.displayAmount, locale, unitPrice.converted ? 6 : 2)}`
                                        : ` - ${t('pricePending')}`}
                                    </option>
                                  );
                                })}
                              </optgroup>
                            );
                          });
                        })()}
                      </select>
                    </div>

                    <div>
                      <span className={labelClass}>
                        {t('unitPrice')}
                        {item?.measureId && (
                          <span className='ml-1'>
                            (
                            {t('perUnit', {
                              unit: selectedMeasure?.symbol || selectedMeasure?.shortName || '',
                            })}
                            )
                          </span>
                        )}
                      </span>
                      <div className='flex h-11 items-center justify-center border border-border bg-transparent px-3 text-sm text-foreground'>
                        {unitPrice
                          ? formatUsd(unitPrice.displayAmount, locale, unitPrice.converted ? 6 : 2)
                          : t('pricePending')}
                      </div>
                    </div>

                    <div>
                      <span className={labelClass}>{t('subtotal')}</span>
                      <div className='flex h-11 items-center justify-center border border-border bg-transparent px-3 text-sm font-medium text-foreground'>
                        {lineSubtotal ? formatUsd(lineSubtotal, locale) : t('pricePending')}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor={`notes-${product.id}`}
                      className={labelClass}
                    >
                      {t('specialNotes')}
                    </label>
                    <textarea
                      id={`notes-${product.id}`}
                      placeholder={t('specialNotesPlaceholder')}
                      value={item?.notes || ''}
                      onChange={e => updateNotes(product.id, e.target.value)}
                      className={`${inputClass} h-auto min-h-[72px] py-2`}
                      rows={2}
                    />
                  </div>
                </div>
              );
            })}

            <div className='text-right'>
              <div className='font-serif text-2xl text-foreground'>
                {t('estimatedTotal')}:{' '}
                {calculateTotal() ? formatUsd(calculateTotal()!, locale) : t('totalPending')}
              </div>
              <div className='mt-1 text-xs text-muted-foreground'>{t('priceDisclaimer')}</div>
            </div>
          </div>
        )}

        {/* Message */}
        <div>
          <label
            htmlFor='message'
            className={labelClass}
          >
            {t('additionalMessage')}
          </label>
          <textarea
            {...register('message')}
            id='message'
            rows={4}
            className={`${inputClass} h-auto min-h-[96px] py-2`}
            placeholder={t('additionalMessagePlaceholder')}
          />
        </div>

        {/* Submit */}
        <div className='space-y-2'>
          <Button
            type='submit'
            variant='brand'
            size='full'
            disabled={isSubmitting}
          >
            {isSubmitting ? t('submitting') : t('submitButton')}
          </Button>
          <p className='text-[13px] leading-relaxed text-muted-foreground'>{t('privacyNote')}</p>
        </div>

        {/* Submit Message */}
        {submitMessage?.type === 'success' && (
          <div
            role='status'
            className='border border-accent/40 p-4 text-[13px] text-accent'
          >
            {submitMessage.text}
          </div>
        )}
      </form>
    </div>
  );
}
