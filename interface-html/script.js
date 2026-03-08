// 1. Définition de toutes les pages de ton application
const pages = {
    // Page d'accueil par défaut
    home: `
        <div class="card">
            <h1>Bienvenue sur My Menu ! 🍽️</h1>
            <p>Sélectionnez une option dans le menu à gauche pour commencer à organiser votre semaine.</p>
        </div>`,

    // VUE AFFICHAGE (Le Menu avec les cadres par jour)
    menu: `
        <div class="card">
            <h2>📅 Votre Menu de la Semaine</h2>
            <div class="menu-grid">
                <div class="day-card">
                    <h3>Lundi</h3>
                    <p><strong>Midi :</strong> Lasagnes</p>
                    <p><strong>Soir :</strong> Salade César</p>
                </div>
                <div class="day-card">
                    <h3>Mardi</h3>
                    <p><strong>Midi :</strong> Poulet Coco</p>
                    <p><strong>Soir :</strong> Soupe de légumes</p>
                </div>
                <div class="day-card">
                    <h3>Mercredi</h3>
                    <p><strong>Midi :</strong> Quiche Lorraine</p>
                    <p><strong>Soir :</strong> Pâtes Pesto</p>
                </div>
                <div class="day-card">
                    <h3>Jeudi</h3>
                    <p><strong>Midi :</strong> Poulet Coco</p>
                    <p><strong>Soir :</strong> Soupe de légumes</p>
                </div>                
                <div class="day-card">
                    <h3>Vendredi</h3>
                    <p><strong>Midi :</strong> Poulet Coco</p>
                    <p><strong>Soir :</strong> Soupe de légumes</p>
                </div> 
                <div class="day-card">
                    <h3>Samedi</h3>
                    <p><strong>Midi :</strong> Poulet Coco</p>
                    <p><strong>Soir :</strong> Soupe de légumes</p>
                </div>   
                <div class="day-card">
                    <h3>Dimanche</h3>
                    <p><strong>Midi :</strong> Poulet Coco</p>
                    <p><strong>Soir :</strong> Soupe de légumes</p>
                </div>                                            
            </div>
            <button class="btn-edit" onclick="showPage('editMenu')">Modifier le menu</button>
        </div>`,

    // VUE ÉDITION (Le Formulaire pour modifier)
    editMenu: `
        <div class="card">
            <h2>✏️ Modifier les repas</h2>
            <form id="menu-form">
                <div class="edit-row">
                    <label>Lundi Midi :</label>
                    <input type="text" value="Lasagnes">
                </div>
                <div class="edit-row">
                    <label>Lundi Soir :</label>
                    <input type="text" value="Salade César">
                </div>
                <hr>
                <button type="button" class="btn-save" onclick="saveMenu()">Enregistrer les modifications</button>
                <button type="button" class="btn-cancel" onclick="showPage('menu')">Annuler</button>
            </form>
        </div>`,

    courses: `<div class="card"><h2>🛒 Liste de courses</h2><p>Contenu à venir...</p></div>`,
    recettes: `<div class="card"><h2>📖 Recettes</h2><p>Contenu à venir...</p></div>`,
    settings: `<div class="card"><h2>⚙️ Paramètres</h2><p>Configuration utilisateur...</p></div>`
};

// 2. LA FONCTION ESSENTIELLE : C'est elle qui fait marcher TOUS les boutons
function showPage(pageKey) {
    console.log("Tentative d'affichage de la page :", pageKey); // Pour vérifier dans la console F12
    const contentArea = document.getElementById('main-content');
    
    if (pages[pageKey]) {
        contentArea.innerHTML = pages[pageKey];
    } else {
        console.error("La page " + pageKey + " n'existe pas dans l'objet pages.");
    }
}

// 3. Fonction pour simuler l'enregistrement
function saveMenu() {
    alert("Menu mis à jour !");
    showPage('menu'); 
}

// 4. (Optionnel) Charger la page d'accueil au démarrage
window.onload = function() {
    showPage('home');
};