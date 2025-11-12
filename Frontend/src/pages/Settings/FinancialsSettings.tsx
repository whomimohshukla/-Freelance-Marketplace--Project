import React, { useEffect, useState } from 'react';
import clientApi from '../../api/clientApi';
import { getClientProfileFromCache, setClientProfileCache } from '../../utils/clientProfileCache';

interface FinancialsForm {
  currency: string;
  billingEmail: string;
  invoiceNotes: string;
}

interface BillingAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface PaymentMethod {
  type: 'Credit Card' | 'PayPal' | 'Bank Transfer';
  isDefault: boolean;
  lastFour?: string;
  expiryDate?: string; // ISO string after submit
  _id?: string;
}

const FinancialsSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [financials, setFinancials] = useState<FinancialsForm>({ currency: 'USD', billingEmail: '', invoiceNotes: '' });
  const [errors, setErrors] = useState<{ billingEmail?: string }>({});
  const [billingAddress, setBillingAddress] = useState<BillingAddress>({ street: '', city: '', state: '', country: '', zipCode: '' });
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [newMethod, setNewMethod] = useState<PaymentMethod>({ type: 'Credit Card', isDefault: false, lastFour: '', expiryDate: '' });
  const [methodErrors, setMethodErrors] = useState<{ lastFour?: string; expiryDate?: string }>({});
  const [initialFinancials, setInitialFinancials] = useState<FinancialsForm | null>(null);
  const [initialBillingAddress, setInitialBillingAddress] = useState<BillingAddress | null>(null);
  const [initialMethods, setInitialMethods] = useState<PaymentMethod[] | null>(null);

  const load = async () => {
    setMessage('');
    setToast(null);
    try {
      const { data } = await clientApi.getMyProfile();
      const p = data.data;
      if (p?.financials) {
        setFinancials({
          currency: p.financials.currency || 'USD',
          billingEmail: p.financials.billingEmail || '',
          invoiceNotes: p.financials.invoiceNotes || '',
        });
        setBillingAddress({
          street: p.financials.billingAddress?.street || '',
          city: p.financials.billingAddress?.city || '',
          state: p.financials.billingAddress?.state || '',
          country: p.financials.billingAddress?.country || '',
          zipCode: p.financials.billingAddress?.zipCode || '',
        });
        const pm = Array.isArray(p.financials.paymentMethods) ? p.financials.paymentMethods : [];
        setMethods(pm);
        setInitialFinancials({
          currency: p.financials.currency || 'USD',
          billingEmail: p.financials.billingEmail || '',
          invoiceNotes: p.financials.invoiceNotes || '',
        });
        setInitialBillingAddress({
          street: p.financials.billingAddress?.street || '',
          city: p.financials.billingAddress?.city || '',
          state: p.financials.billingAddress?.state || '',
          country: p.financials.billingAddress?.country || '',
          zipCode: p.financials.billingAddress?.zipCode || '',
        });
        setInitialMethods(pm);
      }
      if (data?.data) {
        const remember = !!localStorage.getItem('user');
        setClientProfileCache(data.data, remember);
      }
    } catch (e: any) {
      setToast({ type: 'error', text: e?.response?.data?.error || 'Failed to load financials' });
    }
  };

  const formatExpiryInput = (raw: string): string => {
    const digits = raw.replace(/[^0-9]/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const cached = getClientProfileFromCache();
    const p = cached?.financials;
    if (p) {
      setFinancials({
        currency: p.currency || 'USD',
        billingEmail: p.billingEmail || '',
        invoiceNotes: p.invoiceNotes || '',
      });
      setBillingAddress({
        street: p.billingAddress?.street || '',
        city: p.billingAddress?.city || '',
        state: p.billingAddress?.state || '',
        country: p.billingAddress?.country || '',
        zipCode: p.billingAddress?.zipCode || '',
      });
      const pm = Array.isArray(p.paymentMethods) ? p.paymentMethods : [];
      setMethods(pm);
      setInitialFinancials((prev) => prev ?? {
        currency: p.currency || 'USD',
        billingEmail: p.billingEmail || '',
        invoiceNotes: p.invoiceNotes || '',
      });
      setInitialBillingAddress((prev) => prev ?? {
        street: p.billingAddress?.street || '',
        city: p.billingAddress?.city || '',
        state: p.billingAddress?.state || '',
        country: p.billingAddress?.country || '',
        zipCode: p.billingAddress?.zipCode || '',
      });
      setInitialMethods((prev) => prev ?? pm);
    }
  }, []);

  const saveFinancials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setToast(null);
    try {
      // basic validation
      const nextErrors: { billingEmail?: string } = {};
      if (financials.billingEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(financials.billingEmail)) {
          nextErrors.billingEmail = 'Enter a valid billing email';
        }
      }
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length) { setLoading(false); return; }
      await clientApi.updateFinancials({
        ...financials,
        billingAddress,
        paymentMethods: methods,
      });
      // reload canonical
      await load();
      // load() will update cache. No need to set manually here.
      setToast({ type: 'success', text: 'Financial settings saved' });
    } catch (e: any) {
      setToast({ type: 'error', text: e?.response?.data?.error || 'Failed to save financial settings' });
    } finally { setLoading(false); }
  };

  const validateNewMethod = (): boolean => {
    const errs: { lastFour?: string; expiryDate?: string } = {};
    if (newMethod.type === 'Credit Card') {
      const last4 = (newMethod.lastFour || '').trim();
      if (!/^\d{4}$/.test(last4)) errs.lastFour = 'Enter last 4 digits';
      const exp = (newMethod.expiryDate || '').trim();
      if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(exp)) errs.expiryDate = 'Use MM/YY (e.g. 12/24)';
    }
    setMethodErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const addPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateNewMethod()) return;
    const payload: any = { type: newMethod.type, isDefault: newMethod.isDefault };
    if (newMethod.type === 'Credit Card') {
      const last4 = (newMethod.lastFour || '').trim();
      payload.lastFour = last4;
      const [mm, yy] = (newMethod.expiryDate as string).split('/');
      const iso = new Date(Date.UTC(2000 + Number(yy), Number(mm) - 1, 1)).toISOString();
      payload.expiryDate = iso;
    }
    try {
      await clientApi.addPaymentMethod(payload);
      await load();
      setToast({ type: 'success', text: 'Payment method added' });
      setNewMethod({ type: 'Credit Card', isDefault: false, lastFour: '', expiryDate: '' });
      setMethodErrors({});
    } catch (err: any) {
      setToast({ type: 'error', text: err?.response?.data?.error || 'Failed to add method' });
    }
  };

  const removePaymentMethod = async (idx: number) => {
    const m = methods[idx];
    if (!m?._id) { await load(); return; }
    try {
      await clientApi.removePaymentMethod(m._id);
      await load();
      setToast({ type: 'success', text: 'Payment method removed' });
    } catch (err: any) {
      setToast({ type: 'error', text: err?.response?.data?.error || 'Failed to remove method' });
    }
  };

  const makeDefault = async (idx: number) => {
    const next = methods.map((m, i) => ({ ...m, isDefault: i === idx }));
    setMethods(next);
    try {
      await clientApi.updateFinancials({ ...financials, billingAddress, paymentMethods: next });
      await load();
      setToast({ type: 'success', text: 'Default method updated' });
    } catch (err: any) {
      setToast({ type: 'error', text: err?.response?.data?.error || 'Failed to set default' });
    }
  };

  return (
    <section className="w-full bg-primary text-white pb-20 pt-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-3xl font-semibold">Financials</h1>

        {toast && (
          <div className={`px-4 py-2 rounded-lg text-sm ${toast.type === 'success' ? 'bg-green-600/20 text-green-300 border border-green-700/50' : 'bg-red-600/20 text-red-300 border border-red-700/50'}`}>{toast.text}</div>
        )}

        <form onSubmit={saveFinancials} className="space-y-6 bg-gray-900/60 border border-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold">Financial Settings</h2>
          <div>
            <label className="block text-sm mb-1">Currency</label>
            <select value={financials.currency} onChange={(e) => setFinancials({ ...financials, currency: e.target.value })} className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Billing Email</label>
            <input value={financials.billingEmail} onChange={(e) => { setFinancials({ ...financials, billingEmail: e.target.value }); setErrors({ ...errors, billingEmail: undefined }); }} className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700" placeholder="billing@company.com" />
            {errors.billingEmail && <p className="text-xs text-red-400 mt-1">{errors.billingEmail}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">Invoice Notes</label>
            <textarea value={financials.invoiceNotes} onChange={(e) => setFinancials({ ...financials, invoiceNotes: e.target.value })} className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700" rows={3} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Billing Address</h3>
              <div className="space-y-3">
                <input value={billingAddress.street} onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })} className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700" placeholder="Street" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input value={billingAddress.city} onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })} className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700" placeholder="City" />
                  <input value={billingAddress.state} onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })} className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700" placeholder="State" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input value={billingAddress.country} onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })} className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700" placeholder="Country" />
                  <input value={billingAddress.zipCode} onChange={(e) => setBillingAddress({ ...billingAddress, zipCode: e.target.value })} className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700" placeholder="ZIP / Postal Code" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Payment Methods</h3>
              <ul className="space-y-2 mb-3">
                {methods.map((m, idx) => (
                  <li key={idx} className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg px-3 py-2">
                    <div className="text-sm">
                      <span className="text-white">{m.type}</span>
                      {m.type === 'Credit Card' && m.lastFour && <span className="text-gray-400 ml-2">•••• {m.lastFour}</span>}
                      {m.expiryDate && <span className="text-gray-500 ml-2 text-xs">exp {new Date(m.expiryDate).toLocaleDateString(undefined, { month: '2-digit', year: '2-digit' })}</span>}
                      {m.isDefault && <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full bg-green-900/30 text-green-300 border border-green-700/40">Default</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {!m.isDefault && <button type="button" onClick={() => makeDefault(idx)} className="text-xs px-2 py-1 rounded bg-gray-800 border border-gray-700 hover:bg-gray-700">Make default</button>}
                      <button type="button" onClick={() => removePaymentMethod(idx)} className="text-xs px-2 py-1 rounded bg-red-900/30 border border-red-700/40 text-red-300 hover:bg-red-900/50">Remove</button>
                    </div>
                  </li>
                ))}
                {!methods.length && <p className="text-gray-400 text-sm">No payment methods added.</p>}
              </ul>

              <div className="flex flex-wrap items-end gap-3">
                <div className="min-w-[180px]">
                  <label className="block text-xs text-gray-400 mb-1">Type</label>
                  <select
                    value={newMethod.type}
                    onChange={(e) => {
                      const nextType = e.target.value as PaymentMethod['type'];
                      setNewMethod({ type: nextType, isDefault: newMethod.isDefault, lastFour: '', expiryDate: '' });
                      setMethodErrors({});
                    }}
                    className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 w-full"
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                {newMethod.type === 'Credit Card' && (
                  <>
                    <div className="min-w-[120px]">
                      <label className="block text-xs text-gray-400 mb-1">Last 4</label>
                      <input value={newMethod.lastFour || ''} onChange={(e) => setNewMethod({ ...newMethod, lastFour: e.target.value })} className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 w-full" placeholder="1234" />
                      {methodErrors.lastFour && <p className="text-xs text-red-400 mt-1">{methodErrors.lastFour}</p>}
                    </div>
                    <div className="min-w-[140px]">
                      <label className="block text-xs text-gray-400 mb-1">Expiry</label>
                      <input
                        value={newMethod.expiryDate || ''}
                        onChange={(e) => {
                          const v = formatExpiryInput(e.target.value);
                          setNewMethod({ ...newMethod, expiryDate: v });
                          // live validate month
                          const m = v.match(/^(\d{2})/);
                          if (m) {
                            const mm = Number(m[1]);
                            if (mm < 1 || mm > 12) setMethodErrors(prev => ({ ...prev, expiryDate: 'Month 01-12' }));
                            else setMethodErrors(prev => ({ ...prev, expiryDate: undefined }));
                          } else {
                            setMethodErrors(prev => ({ ...prev, expiryDate: undefined }));
                          }
                        }}
                        className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 w-full"
                        placeholder="MM/YY"
                        inputMode="numeric"
                      />
                      {methodErrors.expiryDate && <p className="text-xs text-red-400 mt-1">{methodErrors.expiryDate}</p>}
                    </div>
                  </>
                )}
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={newMethod.isDefault} onChange={(e) => setNewMethod({ ...newMethod, isDefault: e.target.checked })} />
                  <span>Set as default</span>
                </label>
                {(() => {
                  const ccInvalid = newMethod.type === 'Credit Card' && (!newMethod.lastFour || !/^[0-9]{4}$/.test(newMethod.lastFour || '') || !/^(0[1-9]|1[0-2])\/(\d{2})$/.test((newMethod.expiryDate || '')));
                  const isAddDisabled = ccInvalid;
                  return (
                    <button type="button" onClick={addPaymentMethod} disabled={isAddDisabled} className="px-3 py-2 bg-code-green text-black rounded-lg disabled:opacity-50">
                      Add Method
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>

          {(() => {
            const isDirty = !!initialFinancials && !!initialBillingAddress && !!initialMethods && (
              JSON.stringify(initialFinancials) !== JSON.stringify(financials) ||
              JSON.stringify(initialBillingAddress) !== JSON.stringify(billingAddress) ||
              JSON.stringify(initialMethods) !== JSON.stringify(methods)
            );
            return (
              <button disabled={loading || !isDirty} className="px-4 py-2 bg-code-green text-black rounded-lg disabled:opacity-50">{loading ? 'Saving…' : 'Save Financial Settings'}</button>
            );
          })()}
        </form>
      </div>
    </section>
  );
};

export default FinancialsSettings;
