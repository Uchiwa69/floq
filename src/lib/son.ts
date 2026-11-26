// Le son de la page : le petit "clic-clic" d'un écran e-ink qui se rafraîchit.
// Il est fabriqué par le navigateur (Web Audio), il n'y a aucun fichier audio à charger.
// Le son est coupé par défaut : un navigateur n'autorise le son qu'après un clic du visiteur.

let contexte: AudioContext | null = null;
let actif = false;

export function reglerSon(allume: boolean) {
  actif = allume;
  if (allume) {
    // Le contexte audio est créé au premier clic sur le bouton "Son".
    contexte ??= new AudioContext();
    void contexte.resume();
  }
}

export function jouerClic() {
  if (!actif || !contexte) return;
  const audio = contexte;
  const maintenant = audio.currentTime;

  // Deux clics rapprochés, comme les deux passages d'un écran e-ink.
  for (const decalage of [0, 0.09]) {
    const duree = 0.05;
    const tampon = audio.createBuffer(1, Math.floor(audio.sampleRate * duree), audio.sampleRate);
    const echantillons = tampon.getChannelData(0);
    // Du bruit blanc qui s'éteint très vite : c'est ce qui donne un "clic" sec.
    for (let i = 0; i < echantillons.length; i++) {
      echantillons[i] = (Math.random() * 2 - 1) * (1 - i / echantillons.length) ** 3;
    }

    const source = audio.createBufferSource();
    source.buffer = tampon;
    // Le filtre ne garde que les fréquences moyennes, pour un son mat.
    const filtre = audio.createBiquadFilter();
    filtre.type = "bandpass";
    filtre.frequency.value = 2200;
    const volume = audio.createGain();
    volume.gain.value = 0.3;

    source.connect(filtre).connect(volume).connect(audio.destination);
    source.start(maintenant + decalage);
  }
}
