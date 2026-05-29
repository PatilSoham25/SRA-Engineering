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
      if(window.scrollY>100) btn.classList.add('show');
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

  // WhatsApp Form Handler
function initForms() {
  document.querySelectorAll('form[data-inquiry]').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form values
      const name = form.querySelector('[name="name"]')?.value.trim() || '';
      const phone = form.querySelector('[name="phone"]')?.value.trim() || '';
      const email = form.querySelector('[name="email"]')?.value.trim() || '';
      const company = form.querySelector('[name="company"]')?.value.trim() || 'N/A';
      const product = form.querySelector('[name="product"]')?.value.trim() || 'N/A';
      const message = form.querySelector('[name="message"]')?.value.trim() || '';

      // JavaScript Validation 
      // 1. Email Regex (Basic Structure check)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          alert("Please enter a valid email address.");
          return; // Stop the script from continuing
      }

      // 2. Phone Regex (Exactly 10 numbers)
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
          alert("Please enter exactly 10 digits for your phone number.");
          return; // Stop the script from continuing
      }

      // If validation passes, change button state
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Redirecting...';

      // Array of WhatsApp Numbers - ADD YOUR SECOND NUMBER HERE
      const whatsappNumbers = [
          '919921672536',   // First Number
          '918975041193'    // Second Number
      ]; 

      // WhatsApp Message Layout
      const whatsappMessage = 
`*New Inquiry Received*

*Name:* ${name}
*Phone:* ${phone}
*Email:* ${email}
*Company:* ${company}
*Product:* ${product}

*Message:*
${message}`;

      // Encode message for URL
      const encodedMessage = encodeURIComponent(whatsappMessage);

      // Loop through numbers and open WhatsApp for each
      whatsappNumbers.forEach((number, index) => {
          const whatsappURL = `https://wa.me/${number}?text=${encodedMessage}`;
          
          // Slight delay between opening tabs helps bypass aggressive pop-up blockers
          setTimeout(() => {
              window.open(whatsappURL, `_whatsapp_tab_${index}`);
          }, index * 300);
      });

      // Reset form and button
      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btn.innerHTML = originalText;
      }, 1500);

    });
  });
}
// Initialize
// initForms();

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
