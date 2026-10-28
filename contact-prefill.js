/* Kudanil contact page: prefill "You're interested in" and the message from ?interest=&message= (set by the schedule map's CTAs). */
(()=>{
  const filled=new WeakSet();
  function fill(container=document){
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
