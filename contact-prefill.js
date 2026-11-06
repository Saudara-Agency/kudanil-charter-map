/* Kudanil contact page:
   1. Prefill "You're interested in" and the message from ?interest=&message= (set by the schedule map's CTAs).
   2. Add the newsletter opt-in above Submit, pre-ticked (owner decision 6 Nov, told the box is not valid GDPR consent for EU guests).
   Webflow sends the box with the form as "Newsletter" (true/false) in the form submission. */
(()=>{
  const filled=new WeakSet();
  const NEWSLETTER='Keep me updated with Kudanil Explorer news and new expeditions by email. I can unsubscribe at any time. See our <a href="/privacy-policy">Privacy Policy</a>.';
  const tick="url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2.5 6.2 5 8.6l4.5-5' fill='none' stroke='%23fff' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")";
  function addNewsletter(container){
    const form=container.querySelector('#contact-form'),submit=form?.querySelector('.input-submit');
    if(!submit||form.querySelector('[name="Newsletter"]'))return;
    if(!document.getElementById('ke-newsletter-style')){
      const style=document.createElement('style');style.id='ke-newsletter-style';
      style.textContent=`.ke-newsletter{grid-column:1/-1;display:flex;margin:0;font-weight:400;gap:1.2rem;align-items:flex-start;cursor:pointer;color:#000c}
.ke-newsletter input{appearance:none;-webkit-appearance:none;flex:none;width:1.2rem;height:1.2rem;margin:.5rem 0 0;border:max(1px,.1rem) solid #000;border-radius:.2rem;background:#fff center/100% no-repeat;cursor:pointer}
.ke-newsletter input:checked{background-color:#003357;border-color:#003357;background-image:${tick}}
.ke-newsletter input:focus-visible{outline:2px solid #003357;outline-offset:2px}
.ke-newsletter a{color:inherit;text-decoration:underline;text-underline-offset:.3rem}`;
      document.head.append(style);
    }
    const label=document.createElement('label');label.className='ke-newsletter';
    label.innerHTML=`<input type="checkbox" name="Newsletter" data-name="Newsletter" id="newsletter" checked><span class="txt fs-16">${NEWSLETTER}</span>`;
    submit.before(label);
  }
  // Ticked box: sign the email up through the same Mailchimp audience form as the homepage "Stay in the current" box
  // (embedded-form endpoint, no API key; Mailchimp's own audience settings decide double opt-in and the welcome email).
  const MAILCHIMP='https://kudanil.us3.list-manage.com/subscribe/post-json?u=995db5ddd6c2c5f5ab8cd2e38&id=3231707e40&f_id=0071b5e3f0';
  function subscribe(email,done=()=>{}){
    if(window.KE_PREVIEW){console.log('[preview] Mailchimp signup skipped for',email);return done({result:'preview'});}
    const cb=`keMailchimp${Date.now()}`,script=document.createElement('script');
    window[cb]=result=>{delete window[cb];script.remove();done(result);};
    // tags=223730034 = Mailchimp tag "Website contact form" (created 6 Nov 2026), so these signups are easy to find.
    script.src=`${MAILCHIMP}&c=${cb}&EMAIL=${encodeURIComponent(email)}&tags=223730034&b_995db5ddd6c2c5f5ab8cd2e38_3231707e40=`;
    script.onerror=()=>{delete window[cb];script.remove();done({result:'error'});};
    document.head.append(script);
  }
  document.addEventListener('submit',event=>{
    const form=event.target;if(form?.id!=='contact-form')return;
    const box=form.querySelector('[name="Newsletter"]'),email=form.querySelector('[name="Email"]')?.value.trim();
    if(window.KE_PREVIEW){event.preventDefault();event.stopImmediatePropagation();
      console.log('[preview submit]',JSON.stringify(Object.fromEntries([...form.elements].filter(f=>f.name).map(f=>[f.name,f.type==='checkbox'?f.checked:f.value]))));}
    if(box?.checked&&email&&/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))subscribe(email);
  },true);
  function fill(container=document){
    addNewsletter(container);
    const q=new URLSearchParams(location.search),interest=q.get('interest'),message=q.get('message');
    if(!interest&&!message)return;
    const set=(field,value)=>{
      if(!field||!value||filled.has(field))return;
      filled.add(field);
      if(field.value)return;
      field.value=value;
      // The theme's own `filled` toggle binds only after window load, so mark the field directly (hides the textarea's fake placeholder).
      const group=field.closest('.input-field-grp');if(group)group.classList.add('filled');
      field.dispatchEvent(new Event('input',{bubbles:true}));field.dispatchEvent(new Event('change',{bubbles:true}));
    };
    const select=container.querySelector('#you-re-interested-in');
    set(select,interest);
    if(select?.value)select.closest('.select-field-grp,.input-field-grp')?.querySelectorAll('.select-dropdown-opt').forEach(opt=>opt.classList.toggle('active',opt.textContent.trim()===select.value));
    set(container.querySelector('#message'),message);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>fill());else fill();
  window.addEventListener('load',()=>fill());
  // Barba page transitions: fill again whenever the contact page is entered.
  const bind=tries=>{if(window.barba?.hooks)window.barba.hooks.afterEnter(data=>{if(data?.next?.container)fill(data.next.container);});else if(tries<40)setTimeout(()=>bind(tries+1),250);};
  bind(0);
})();
