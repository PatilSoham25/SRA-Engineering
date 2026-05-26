// SRA Engineering Works - Main JS
(function(){
  // Load reusable header & footer
  async function loadPartial(id,url,activePage){
    const el=document.getElementById(id);
    if(!el) return;
    try{
      const res=await fetch(url);
      let html=await res.text();
      el.innerHTML=html;
      if(activePage){
        el.querySelectorAll('[data-nav]').forEach(a=>{
          if(a.getAttribute('data-nav')===activePage) a.classList.add('active');
        });
      }
      if(id==='site-header') initNavbar();
    }catch(e){console.warn('Partial load failed',url,e)}
  }

  function initNavbar(){
    const nav=document.querySelector('.navbar-sra');
    if(!nav) return;
    const setSticky=()=>{
      if(window.scrollY>80) nav.classList.add('sticky-active');
      else nav.classList.remove('sticky-active');
    };
    window.addEventListener('scroll',setSticky);
    setSticky();
  }

  // Scroll-to-top button
  function initScrollTop(){
    const btn=document.querySelector('.fb-top');
    if(!btn) return;
    window.addEventListener('scroll',()=>{
      if(window.scrollY>400) btn.classList.add('show');
      else btn.classList.remove('show');
    });
    btn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  }

  // Counter animation
  function initCounters(){
    const counters=document.querySelectorAll('.counter-item .num');
    if(!counters.length) return;
    const animate=el=>{
      const target=+el.getAttribute('data-count');
      const dur=2000;const start=performance.now();
      const tick=now=>{
        const p=Math.min((now-start)/dur,1);
        el.textContent=Math.floor(p*target).toLocaleString()+(el.dataset.suffix||'');
        if(p<1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const obs=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){animate(e.target);obs.unobserve(e.target)}
      });
    },{threshold:.4});
    counters.forEach(c=>obs.observe(c));
  }

  // Fade-up animation
  function initFadeUp(){
    const els=document.querySelectorAll('.fade-up');
    if(!els.length) return;
    const obs=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target)}
      });
    },{threshold:.15});
    els.forEach(el=>obs.observe(el));
  }

  // Form basic handler
  function initForms(){
    document.querySelectorAll('form[data-inquiry]').forEach(f=>{
      f.addEventListener('submit',e=>{
        e.preventDefault();
        const btn=f.querySelector('button[type="submit"]');
        const orig=btn.innerHTML;
        btn.disabled=true;btn.innerHTML='Sending...';
        setTimeout(()=>{
          f.reset();btn.disabled=false;btn.innerHTML=orig;
          alert('Thank you! Your inquiry has been received. Our team will contact you shortly.');
        },900);
      });
    });
  }

  document.addEventListener('DOMContentLoaded',()=>{
    const page=document.body.getAttribute('data-page')||'';
    loadPartial('site-header','partials/header.html',page);
    loadPartial('site-footer','partials/footer.html');
    initScrollTop();
    initCounters();
    initFadeUp();
    initForms();
  });
})();
