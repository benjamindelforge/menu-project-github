import { useState, useEffect } from 'react'
import * as logic from './logic'
import data from './recettes.json' 

function App() {
  const [dateSelectionnee, setDateSelectionnee] = useState(new Date());
  const [lundiRef, setLundiRef] = useState(null);
  const [planning, setPlanning] = useState(Array(14).fill(null));
  const [listeCourses, setListeCourses] = useState(null);

  const phrasesPlatVide = [
    "Une petite envie ?", "Qu'est-ce qu'on mange ?", "À vous de choisir !",
    "Un classique ?", "Inspiration du jour ?", "Un plat plaisir ?", "On tente quoi ?"
  ];

  // --- LOGIQUE CALENDRIER ---
  
  const getISOWeek = (date) => {
    if (!date || isNaN(date.getTime())) return "";
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  const calculerLundi = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.getFullYear(), d.getMonth(), diff, 0, 0, 0);
  };

  const gererChangementDate = (e) => {
    const nouvelleDate = new Date(e.target.value);
    if (isNaN(nouvelleDate.getTime())) return;

    setDateSelectionnee(nouvelleDate);
    setLundiRef(calculerLundi(nouvelleDate));
    setPlanning(Array(14).fill(null));
    setListeCourses(null);
  };

  // --- LOGIQUE DOUBLONS ---
  const trouverEmplacementsDoublons = (nomPlat, indexActuel) => {
    const joursMap = {};
    const nomsJours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    planning.forEach((p, idx) => {
      if (p && p.nom === nomPlat && idx !== indexActuel) {
        const jourIdx = Math.floor(idx / 2);
        const moment = idx % 2 === 0 ? 'midi' : 'soir';
        const dateD = new Date(lundiRef);
        dateD.setDate(lundiRef.getDate() + jourIdx);
        const nomJour = nomsJours[dateD.getDay()];
        if (!joursMap[nomJour]) joursMap[nomJour] = [];
        joursMap[nomJour].push(moment);
      }
    });
    return Object.entries(joursMap).map(([j, m]) => m.length === 2 ? `${j} midi et soir` : `${j} ${m[0]}`);
  };

  const genererToutLePlanning = () => {
    const melange = [...data].sort(() => 0.5 - Math.random());
    setPlanning(melange.slice(0, 14));
  };

  const genererPlatUnique = (index) => {
    const nomsUtilises = planning.filter(p => p).map(p => p.nom);
    const choix = data.filter(r => !nomsUtilises.includes(r.nom));
    const selection = choix.length > 0 ? choix[Math.floor(Math.random() * choix.length)] : data[Math.floor(Math.random() * data.length)];
    const n = [...planning];
    n[index] = selection;
    setPlanning(n);
  };

  useEffect(() => {
    const aujourdhui = new Date();
    setLundiRef(calculerLundi(aujourdhui));
  }, []);

  if (!lundiRef) return null;

  const dimancheRef = new Date(lundiRef);
  dimancheRef.setDate(lundiRef.getDate() + 6);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '25px', backgroundColor: '#2c3e50', color: 'white', padding: '25px', borderRadius: '15px' }}>
        <h1 style={{ margin: '0 0 10px 0' }}>My Menu</h1>
        
        <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '15px' }}>
          Aujourd'hui nous sommes le <strong>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
        </p>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>Sélectionner une date :</label>
          <input 
            type="date" 
            onChange={gererChangementDate}
            onKeyDown={(e) => e.preventDefault()} // Interdit la saisie clavier
            value={dateSelectionnee.toISOString().split('T')[0]}
            style={{ padding: '10px', borderRadius: '8px', border: 'none', fontSize: '16px', cursor: 'pointer' }}
          />
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
            <div style={{ fontSize: '22px', fontWeight: 'bold' }}>Semaine {getISOWeek(lundiRef)}</div>
            <div style={{ fontSize: '14px', margin: '5px 0 20px 0', opacity: 0.8 }}>
                Du {lundiRef.toLocaleDateString()} au {dimancheRef.toLocaleDateString()}
            </div>
        </div>

        <button onClick={genererToutLePlanning} style={{ ...btnStyle, backgroundColor: '#3498db', width: '100%' }}>
           🎲 Génération des repas
        </button>
      </div>

      {Array.from({ length: 7 }).map((_, i) => {
        const dateJ = new Date(lundiRef);
        dateJ.setDate(lundiRef.getDate() + i);
        
        return (
          <div key={i} style={cardStyle}>
            <h3 style={{ margin: '0 0 15px 0', color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
              {logic.get_date_fr(dateJ)}
            </h3>
            
            {['MIDI', 'SOIR'].map((moment, j) => {
              const idx = i * 2 + j;
              const plat = planning[idx];
              const phrase = phrasesPlatVide[idx % phrasesPlatVide.length];
              const doublons = plat ? trouverEmplacementsDoublons(plat.nom, idx) : [];

              return (
                <div key={moment} style={{ marginBottom: '15px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#7f8c8d' }}>{moment}</label>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <select 
                      value={plat?.nom || ""} 
                      onChange={(e) => {
                        const n = [...planning];
                        n[idx] = data.find(r => r.nom === e.target.value);
                        setPlanning(n);
                      }}
                      style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: plat ? '#fff' : '#f9f9f9' }}
                    >
                      <option value="" disabled>{phrase}</option>
                      {data.map(r => <option key={r.nom} value={r.nom}>{r.nom}</option>)}
                    </select>
                    <button onClick={() => genererPlatUnique(idx)} style={{ padding: '0 12px', borderRadius: '6px', border: '1px solid #ddd', cursor: 'pointer', backgroundColor: '#fff' }}>🔄</button>
                  </div>
                  {doublons.length > 0 && (
                    <div style={{ color: '#d35400', fontSize: '11px', fontWeight: 'bold', marginTop: '5px' }}>⚠️ {doublons.join(', ')}</div>
                  )}
                </div>
              );
            })}
          </div>
        )
      })}

      <button 
        onClick={() => {
          const structure = [];
          for (let i = 0; i < 14; i += 2) {
            structure.push({ midi: planning[i], soir: planning[i+1] });
          }
          setListeCourses(logic.compiler_liste_courses(structure));
        }} 
        disabled={planning.some(p => p === null)}
        style={{ ...btnStyle, width: '100%', backgroundColor: planning.some(p => p === null) ? '#bdc3c7' : '#27ae60', fontSize: '16px', marginTop: '10px' }}
      >
        🛒 {planning.some(p => p === null) ? "Sélectionnez tous les repas" : "Générer la liste de courses"}
      </button>

      {listeCourses && (
        <div style={{ ...cardStyle, marginTop: '20px', borderLeft: '5px solid #27ae60' }}>
          <h3 style={{ marginTop: 0 }}>Courses - Semaine {getISOWeek(lundiRef)}</h3>
          <ul style={{ paddingLeft: '20px' }}>
            {Object.entries(listeCourses).map(([ing, qte]) => <li key={ing}><strong>{ing}</strong> : {qte}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

const cardStyle = { backgroundColor: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '15px' };
const btnStyle = { padding: '12px 15px', borderRadius: '8px', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold' };

export default App;