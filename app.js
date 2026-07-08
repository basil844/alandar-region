let currentDex = 'national';
let national = [];
let alandar = [];
let activeList = [];
const dexView = document.getElementById('dex-view');
const pokeView = document.getElementById('pokemon-view');
const search = document.getElementById('search');
const buttons = document.querySelectorAll('.nav-btn');

async function loadData(){
  national = await fetch('data/nationaldex.json').then(r=>r.json());
  alandar = await fetch('data/alandardex.json').then(r=>r.json());
  setDex('national');
}
function setDex(type){
  currentDex = type;
  activeList = type === 'national' ? national : alandar;
  buttons.forEach(b=>b.classList.toggle('active', b.dataset.view===type));
  search.value = '';
  pokeView.classList.add('hidden');
  dexView.classList.remove('hidden');
  renderDex(activeList);
}
function typeBadge(t){return `<span class="type ${t.toLowerCase()}">${t}</span>`}
function renderDex(list){
  dexView.innerHTML = list.map(p=>`<article class="card" onclick="openPokemon('${p.num}')"><div class="num">#${p.num}</div><div class="name">${p.name}</div><div class="types">${p.types.map(typeBadge).join('')}</div></article>`).join('');
}
function openPokemon(num){
  const p = activeList.find(x=>x.num===num);
  if(!p) return;
  dexView.classList.add('hidden');
  pokeView.classList.remove('hidden');
  pokeView.innerHTML = `
    <button class="back" onclick="backToDex()">← Back to Dex</button>
    <div class="poke-title"><div><div class="num">#${p.num}</div><h2>${p.name}</h2><div class="types">${p.types.map(typeBadge).join('')}</div></div></div>
    <div class="section"><h3>Abilities</h3>${p.abilities.map(a=>`<span class="tag">${a}</span>`).join('')}<p><b>Hidden Ability:</b> ${p.hidden || 'None'}</p></div>
    <div class="section"><h3>Evolution</h3><div class="evo">${p.evolution.map((e,i)=>`${i?'<span>→</span>':''}<div class="evo-box"><b>${e.name}</b><br><small>${e.req}</small></div>`).join('')}</div></div>
    <div class="section"><h3>Rank Learnset</h3><table class="rank-table"><thead><tr><th>Rank</th><th>Move</th></tr></thead><tbody>${p.moves.map(m=>`<tr><td class="rank">${m.rank}</td><td>${m.move}</td></tr>`).join('')}</tbody></table></div>
    <div class="section"><h3>TM Moves</h3>${(p.tm||[]).length?p.tm.map(m=>`<span class="tag">${m}</span>`).join(''):'None listed.'}</div>
    <div class="section"><h3>Egg Moves</h3>${(p.egg||[]).length?p.egg.map(m=>`<span class="tag">${m}</span>`).join(''):'None listed.'}</div>
    ${p.notes?`<div class="section"><h3>RP Notes</h3>${p.notes.map(n=>`<span class="tag">${n}</span>`).join('')}</div>`:''}
  `;
}
function backToDex(){pokeView.classList.add('hidden');dexView.classList.remove('hidden')}
search.addEventListener('input',()=>{const q=search.value.toLowerCase();renderDex(activeList.filter(p=>p.name.toLowerCase().includes(q)||p.num.toLowerCase().includes(q)))});
buttons.forEach(b=>b.addEventListener('click',()=>setDex(b.dataset.view)));
loadData();
