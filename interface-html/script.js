// 1. Définition de toutes les pages de ton application
const pages = {
    home: `
        <div class="card">
            <h1>Bienvenue sur My Menu ! 🍽️</h1>
            <p>Sélectionnez une option dans le menu à gauche pour commencer à organiser votre semaine.</p>
        </div>`,

    // VUE AFFICHAGE
    menu: `
    <div class="card">
        <h2 style="text-align: center;">Menu de la Semaine</h2>
        <br>
        <p id="date-du-jour" style="text-align: center; text-transform: capitalize; font-weight: bold;"></p> 
        
        <div style="text-align: center; margin: 15px 0;">
            <label for="calendar-input">Choisis une date :</label>
            <input type="date" id="calendar-input">
        </div>

        <hr class="separator">

        <div style="text-align: center; color: white;">
            <h3 id="info-semaine" style="font-size: 1.5rem; margin-bottom: 5px;">Semaine --</h3>
            <p id="intervalle-dates" style="font-size: 0.9rem; opacity: 0.8;">Du --/-- au --/--</p>
        </div>

        <br>
        <div id="cards-container" class="menu-grid"></div>
    </div>`,

    courses: `<div class="card"><h2>🛒 Liste de courses</h2><p>Contenu à venir...</p></div>`,
    recettes: `<div class="card"><h2>📖 Recettes</h2><div id="liste-recettes-container">Chargement des recettes...</div></div>`,
    settings: `<div class="card"><h2>⚙️ Paramètres</h2><p>Configuration utilisateur...</p></div>`
};

// 2. LA FONCTION ESSENTIELLE
function showPage(pageKey) {
    console.log("Tentative d'affichage de la page :", pageKey);
    const contentArea = document.getElementById('main-content');
    
    if (pages[pageKey]) {
        contentArea.innerHTML = pages[pageKey];

        // Utilisation du micro-délai pour le rendu mobile
        setTimeout(() => {
if (pageKey === 'menu') {

    const dateElement = document.getElementById('date-du-jour');
    const infoSemaine = document.getElementById('info-semaine');
    const intervalleDates = document.getElementById('intervalle-dates');
    const calendarInput = document.getElementById('calendar-input');
    // On récupère le conteneur où les cartes seront injectées
    const cardsContainer = document.getElementById('cards-container');

    const optionsLongues = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formatCourt = { day: '2-digit', month: '2-digit', year: 'numeric' };

    // --- NOUVELLE FONCTION POUR GÉNÉRER LES CARTES DYNAMIQUEMENT ---
    const genererCartesSemaine = async (lundiRef) => {
        try {
            const reponse = await fetch('recettes.json');
            const recettes = await reponse.json();
            const optionsHTML = recettes.map(r => `<option value="${r.nom}">${r.nom}</option>`).join('');
            
            // Liste des phrases aléatoires
        const phrasesAccroche = [
                "Une petite envie ?", "Qu'est-ce qu'on mange ?", "À vous de choisir !", "Un classique ?", 
                "Inspiration du jour ?", "Un plat plaisir ?", "On tente quoi ?", "Une idée lumineuse ?", 
                "Le chef propose ?", "C'est l'heure du régal !", "Quoi de neuf en cuisine ?", "Une pépite culinaire ?",
                "Un festin en vue ?", "Le choix du roi ?", "On se fait plaisir ?", "Une recette secrète ?",
                "C'est quoi le plan ?", "Menu mystère ?", "La suggestion du moment ?", "Un délice annoncé ?",
                "Votre verdict ?", "Direction les fourneaux !", "Une touche de gourmandise ?", "Le plat qui fait mouche ?",
                "Envie de changement ?", "Une valeur sûre ?", "L'instant gourmet ?", "Miam, c'est quoi ?",
                "Un régal à l'horizon ?", "On craque pour quoi ?", "L'assiette du jour ?", "Faites vos jeux !"
            ];

            // On fait une copie pour pouvoir retirer les phrases déjà utilisées dans la semaine
            let phrasesDisponibles = [...phrasesAccroche];

            // Fonction pour piocher une phrase et la supprimer des dispos
            const extrairePhraseUnique = () => {
                if (phrasesDisponibles.length === 0) phrasesDisponibles = [...phrasesAccroche]; 
                const index = Math.floor(Math.random() * phrasesDisponibles.length);
                return phrasesDisponibles.splice(index, 1)[0];
            };
            
            let htmlGlobal = "";
            const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

            jours.forEach((nomJour, index) => {
                const dateJour = new Date(lundiRef);
                dateJour.setDate(lundiRef.getDate() + index);
                
                // Formatage du titre : "lundi 11 mai"
                const titreCarte = dateJour.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

                htmlGlobal += `
                    <div class="day-card">
                        <h3 style="text-transform: capitalize;">${titreCarte}</h3>
                        <hr style="opacity: 0.1; margin: 10px 0;">
                        
                        <div class="meal-row">
                            <label>MIDI</label>
                            <div class="input-group">
                                <select class="meal-select">
                                    <option value="" disabled selected>${extrairePhraseUnique()}</option>
                                    ${optionsHTML}
                                </select>
                                <button class="btn-refresh" title="Changer de plat">🔄</button>
                            </div>
                        </div>

                        <div class="meal-row">
                            <label>SOIR</label>
                            <div class="input-group">
                                <select class="meal-select">
                                    <option value="" disabled selected>${extrairePhraseUnique()}</option>
                                    ${optionsHTML}
                                </select>
                                <button class="btn-refresh" title="Changer de plat">🔄</button>
                            </div>
                        </div>
                    </div>`;
            });

            if (cardsContainer) cardsContainer.innerHTML = htmlGlobal;
        } catch (error) {
            console.error("Erreur chargement recettes:", error);
        }
    };

    // --- FONCTION DE CALCUL (Réutilisable) ---
    const mettreAJourInfosSemaine = (dateRef) => {
        const d = new Date(dateRef);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const debutAnnee = new Date(d.getFullYear(), 0, 1);
        const numSemaine = Math.ceil((((d - debutAnnee) / 86400000) + 1) / 7);

        const jourCourant = dateRef.getDay() || 7;
        const lundi = new Date(dateRef);
        lundi.setDate(dateRef.getDate() - jourCourant + 1);
        const dimanche = new Date(lundi);
        dimanche.setDate(lundi.getDate() + 6);

        if (infoSemaine) infoSemaine.innerText = "Semaine " + numSemaine;
        if (intervalleDates) {
            const du = lundi.toLocaleDateString('fr-FR', formatCourt);
            const au = dimanche.toLocaleDateString('fr-FR', formatCourt);
            intervalleDates.innerText = `Du ${du} au ${au}`;
        }

        // --- AJOUT : On génère les cartes à chaque mise à jour de la semaine ---
        genererCartesSemaine(lundi);
    };

    // --- INITIALISATION (Date du jour) ---
    const aujourdhui = new Date();
    if (dateElement) {
        dateElement.innerText = "Aujourd'hui : " + aujourdhui.toLocaleDateString('fr-FR', optionsLongues);
    }
    mettreAJourInfosSemaine(aujourdhui);

    // --- ACTION : CHANGEMENT DE DATE ---
    if (calendarInput) {
        calendarInput.addEventListener('change', function() {
            if (this.value) {
                const dateSelectionnee = new Date(this.value);
                mettreAJourInfosSemaine(dateSelectionnee);
            }
        });
    }
}

            if (pageKey === 'recettes') {
                chargerEtAfficherRecettes();
            }
        }, 10);
    } else {
        console.error("La page " + pageKey + " n'existe pas.");
    }
}

// 3. Charger la page d'accueil au démarrage
window.onload = function() {
    showPage('home');
};

// 4. FONCTION RECETTES
async function chargerEtAfficherRecettes() {
    const container = document.getElementById('liste-recettes-container');
    if (!container) return;

    try {
        const reponse = await fetch('recettes.json');
        const liste = await reponse.json();

        let html = '<div class="recettes-grid">';
        liste.forEach(r => {
            let ings = '';
            for (let [i, q] of Object.entries(r.ingredients)) {
                ings += `<li>${i} : ${q}</li>`;
            }
            html += `<div class="day-card"><h3>${r.nom}</h3><ul class="ingredients-list">${ings}</ul></div>`;
        });
        html += '</div>';
        container.innerHTML = html;
    } catch (e) {
        container.innerHTML = "Erreur de chargement du fichier JSON.";
        console.error(e);
    }
}