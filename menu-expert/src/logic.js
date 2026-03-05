// src/logic.js

export const get_date_fr = (date) => {
    const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return `${jours[date.getDay()]} ${date.getDate()} ${mois[date.getMonth()]}`;
};

export const compiler_liste_courses = (selection) => {
    let courses = {};
    selection.forEach(repas => {
        // On vérifie le midi et le soir
        [repas.midi, repas.soir].forEach(plat => {
            if (plat && plat.ingredients) {
                Object.entries(plat.ingredients).forEach(([ing, qte]) => {
                    // On additionne les valeurs numériques
                    if (courses[ing]) {
                        courses[ing] += qte;
                    } else {
                        courses[ing] = qte;
                    }
                });
            }
        });
    });
    return courses;
};