// One catalogue is the source for both the hero selector and product details.
export function createProductSelector({products,categories,getLanguage,getText,onOpen}) {
  const $=id=>document.getElementById(id), rail=$('productRail');
  let category='all',items=products,index=0,settleTimer,autoTimer,preferences={},hovered=false;
  const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches||preferences.motion==='reduced';
  const categoryName=product=>categories.find(c=>c.id===product.categoryId).name[getLanguage()];
  function updateCopy(){
    const product=items[index];
    $('featuredBrand').textContent=product.brand;
    $('featuredName').textContent=product.title[getLanguage()];
    $('featuredDescription').textContent=product.description[getLanguage()];
    $('featuredCategory').textContent=categoryName(product);
    $('featuredCounter').textContent=`${String(index+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;
    $('featuredDetail').dataset.product=product.id;
    const format=new Intl.NumberFormat(getLanguage()==='uz'?'uz-Latn-UZ':getLanguage(),{maximumFractionDigits:2});
    const packages=product.variants[0]?.packages||product.packages;
    $('featuredPackages').textContent=packages.length?`${getText('packages')}: ${packages.map(value=>format.format(value)).join(' / ')} ${getLanguage()==='ru'?'кг':'kg'}`:'';
    [...rail.children].forEach((slide,i)=>{slide.classList.toggle('is-selected',i===index);slide.setAttribute('aria-hidden',String(i!==index));});
    $('featuredPrev').disabled=$('featuredNext').disabled=items.length<2;
  }
  function position(animate=false){
    const slide=rail.children[index];
    rail.scrollTo({left:slide.offsetLeft-rail.offsetLeft-(rail.clientWidth-slide.clientWidth)/2,behavior:animate&&!reduced()?'smooth':'instant'});
  }
  function move(direction){index=(index+direction+items.length)%items.length;updateCopy();position(true);}
  function render(){
    const focusedType=document.activeElement?.closest('#featuredTypes button')?.dataset.type;
    $('featuredTypes').replaceChildren();
    for(const type of [{id:'all',name:{[getLanguage()]:getText('all')}},...categories.filter(c=>products.some(p=>p.categoryId===c.id))]){
      const button=document.createElement('button');button.type='button';button.textContent=type.name[getLanguage()];button.dataset.type=type.id;button.setAttribute('aria-pressed',String(type.id===category));
      button.addEventListener('click',()=>{category=type.id;items=products.filter(p=>category==='all'||p.categoryId===category);index=0;render();});
      $('featuredTypes').append(button);
    }
    rail.replaceChildren(...items.map((product,i)=>{
      const slide=document.createElement('div');slide.className='featured-slide';slide.dataset.product=product.id;slide.setAttribute('role','group');slide.setAttribute('aria-label',`${i+1} / ${items.length} · ${product.title[getLanguage()]}`);
      const image=document.createElement('img');image.src=product.image;image.alt=`${product.brand} · ${product.title[getLanguage()]}`;image.width=image.height=1024;image.loading=i===index?'eager':'lazy';image.decoding='async';
      slide.append(image);return slide;
    }));
    updateCopy();position();
    if(focusedType)$('featuredTypes').querySelector(`[data-type="${focusedType}"]`)?.focus({preventScroll:true});
  }
  rail.addEventListener('scroll',()=>{clearTimeout(settleTimer);settleTimer=setTimeout(()=>{
    const center=rail.scrollLeft+rail.clientWidth/2;
    let nearest=0,distance=Infinity;
    [...rail.children].forEach((slide,i)=>{const delta=Math.abs(slide.offsetLeft-rail.offsetLeft+slide.clientWidth/2-center);if(delta<distance){nearest=i;distance=delta;}});
    index=nearest;updateCopy();
  },140);},{passive:true});
  rail.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();if(event.key==='Home'||event.key==='End'){index=event.key==='Home'?0:items.length-1;updateCopy();position(true);}else move(event.key==='ArrowRight'?1:-1);}});
  $('featuredPrev').addEventListener('click',()=>move(-1));$('featuredNext').addEventListener('click',()=>move(1));
  $('featuredDetail').addEventListener('click',()=>onOpen(items[index].id,$('featuredDetail')));
  $('featuredSelector').addEventListener('pointerenter',()=>hovered=true);
  $('featuredSelector').addEventListener('pointerleave',()=>hovered=false);
  const observer=new ResizeObserver(()=>position());observer.observe(rail);
  function configure(value){
    preferences=value;clearInterval(autoTimer);
    if(value.autoSlide&&!reduced())autoTimer=setInterval(()=>{const rect=$('featuredSelector').getBoundingClientRect();if(!document.hidden&&!hovered&&!$('featuredSelector').contains(document.activeElement)&&!document.querySelector('dialog[open]')&&$('brandLoader').hidden&&rect.bottom>0&&rect.top<innerHeight)move(1);},6000);
  }
  render();
  return {setLanguage:render,configure};
}
