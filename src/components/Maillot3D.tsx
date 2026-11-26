"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import maillotFace from "@/images/maillot-face.webp";
import maillotVide from "@/images/maillot-vide.webp";
import reliefDos from "@/images/relief-dos.png";
import { jouerClic } from "@/lib/son";
import { MaillotEink } from "./MaillotEink";

type Props = {
  nom: string;
  numero: string;
  alt: string;
  // Si un angle est imposé (en radians, 0 = de dos, Math.PI = de face),
  // c'est lui qui commande et la souris ne fait rien. Sert à la rotation au défilement.
  angleImpose?: number;
  // true pour le hero : image chargée en priorité, et travelling arrière à l'ouverture.
  prioritaire?: boolean;
  className?: string;
};

// La photo fait 928 x 1152 : on garde ce rapport pour le plan 3D.
const LARGEUR = 1;
const HAUTEUR = 1152 / 928;
// Épaisseur du maillot, de la surface jusqu'au milieu du torse.
const EPAISSEUR = 0.13;
// Où se trouve le panneau sur la photo de dos, en proportion de l'image.
const PANNEAU = { x: 0.331, y: 0.216, largeur: 0.34, hauteur: 0.34 };
// La caméra : sa distance normale, et sa position de départ pour le travelling du hero.
const DISTANCE = 2.5;
const GROS_PLAN = { z: 1.05, y: 0.17 };

// Le "vertex shader" s'exécute pour chaque point du plan. Il fait deux choses :
// 1. il avance le point selon la carte de relief, ce qui transforme la photo plate en volume ;
// 2. il calcule vers où "regarde" la surface à cet endroit (la normale), pour l'éclairage.
const deplacement = /* glsl */ `
  uniform sampler2D uRelief;
  uniform float uEpaisseur;
  uniform float uMiroir;
  varying vec2 vUv;
  varying vec2 vUvRelief;
  varying vec3 vNormale;

  // Hauteur du tissu à un endroit de la carte de relief.
  // 0.5 = le bord de la silhouette, 1.0 = le cœur du maillot. Le sinus arrondit les flancs.
  float hauteur(vec2 ou) {
    float bord = texture2D(uRelief, ou).r;
    return sin(clamp((bord - 0.5) * 2.0, 0.0, 1.0) * 1.5708) * uEpaisseur;
  }

  void main() {
    vUv = uv;
    // La face utilise la même carte de relief que le dos, lue en miroir :
    // les deux coques ont ainsi exactement le même contour et se rejoignent sans trou.
    vUvRelief = vec2(mix(uv.x, 1.0 - uv.x, uMiroir), uv.y);

    // La pente du relief : on compare la hauteur un peu à gauche et un peu à droite,
    // puis un peu en bas et un peu en haut. La normale est perpendiculaire à cette pente.
    float pas = 0.012;
    float sens = mix(1.0, -1.0, uMiroir);
    float penteX = (hauteur(vUvRelief + vec2(pas, 0.0)) - hauteur(vUvRelief - vec2(pas, 0.0))) / (2.0 * pas) * sens;
    float penteY = (hauteur(vUvRelief + vec2(0.0, pas)) - hauteur(vUvRelief - vec2(0.0, pas))) / (2.0 * pas * ${HAUTEUR.toFixed(4)});
    vNormale = normalize(normalMatrix * vec3(-penteX, -penteY, 1.0));

    vec3 point = position + vec3(0.0, 0.0, hauteur(vUvRelief));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(point, 1.0);
  }
`;

// Le "fragment shader" s'exécute pour chaque pixel. Il part de la photo,
// puis ajoute une lumière qui suit la souris.
const couleur = /* glsl */ `
  uniform sampler2D uPhoto;
  uniform sampler2D uRelief;
  uniform float uProfil;
  uniform vec3 uLumiere; // direction de la lumière, pilotée par la souris
  varying vec2 vUv;
  varying vec2 vUvRelief;
  varying vec3 vNormale;

  void main() {
    vec4 relief = texture2D(uRelief, vUvRelief);
    if (relief.g < 0.5) discard; // hors de la silhouette : transparent

    vec3 c = texture2D(uPhoto, vUv).rgb;

    // --- Éclairer : une lumière douce qui suit la souris, et un liseré orangé sur les bords. ---
    vec3 normale = normalize(vNormale);
    float eclaire = max(dot(normale, normalize(uLumiere)), 0.0);
    c *= 0.8 + 0.5 * eclaire * eclaire;
    float contour = pow(1.0 - clamp(normale.z, 0.0, 1.0), 3.5);
    c += vec3(1.0, 0.23, 0.15) * contour * 0.16;

    // Vu de profil (uProfil proche de 1), on assombrit les flancs : la jointure
    // entre les deux coques se fond dans l'ombre.
    float flanc = smoothstep(0.0, 0.7, clamp((relief.r - 0.5) * 2.0, 0.0, 1.0));
    c *= mix(1.0, flanc, uProfil);

    gl_FragColor = vec4(c, 1.0);
    #include <colorspace_fragment>
  }
`;

// Un maillot en vraie 3D, construit à partir de deux photos (dos et face) gonflées
// par une carte de relief. Le volume est convaincant de trois quarts, moins de profil :
// la page ne s'arrête donc jamais sur la tranche. Tant que la 3D n'est pas prête
// (ou si elle est indisponible), on voit la version en image : la page reste complète sans WebGL.
export function Maillot3D({
  nom,
  numero,
  alt,
  angleImpose,
  prioritaire = false,
  className = "",
}: Props) {
  const conteneur = useRef<HTMLDivElement>(null);
  const toile = useRef<HTMLCanvasElement>(null);
  const [pret, setPret] = useState(false);

  // Les valeurs lues par la boucle de dessin. Des "refs" plutôt qu'un état :
  // les modifier ne relance pas le rendu React.
  const angle = useRef(angleImpose);
  const flocage = useRef({ nom, numero });
  const redessinerPanneau = useRef<() => void>(() => {});

  useEffect(() => {
    angle.current = angleImpose;
  }, [angleImpose]);

  // Quand le nom ou le numéro change, on redessine la texture du dos.
  useEffect(() => {
    flocage.current = { nom, numero };
    redessinerPanneau.current();
  }, [nom, numero]);

  useEffect(() => {
    const zone = conteneur.current;
    const element = toile.current;
    if (!zone || !element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rendu: THREE.WebGLRenderer;
    try {
      rendu = new THREE.WebGLRenderer({ canvas: element, alpha: true, antialias: true });
    } catch {
      return; // Pas de WebGL : on garde l'image.
    }
    rendu.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendu.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, LARGEUR / HAUTEUR, 0.1, 10);
    camera.position.z = DISTANCE;

    const chargeur = new THREE.TextureLoader();
    const charger = (url: string, couleurs: boolean) => {
      const texture = chargeur.load(url);
      if (couleurs) texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    // --- Le dos : la photo du maillot, sur laquelle on écrit le nom et le numéro. ---
    const dessin = document.createElement("canvas");
    dessin.width = 928;
    dessin.height = 1152;
    const crayon = dessin.getContext("2d");
    const textureDos = new THREE.CanvasTexture(dessin);
    textureDos.colorSpace = THREE.SRGBColorSpace;
    // La police du flocage, telle que Next.js l'a nommée.
    const police = getComputedStyle(zone).getPropertyValue("--font-barlow-condensed") || "sans-serif";

    const photoDos = new window.Image();
    let flash = 0; // de 1 (panneau noir) à 0 : le clignotement e-ink
    let visible = true;

    const dessinerDos = () => {
      if (!crayon || !photoDos.complete || photoDos.naturalWidth === 0) return;
      crayon.clearRect(0, 0, dessin.width, dessin.height);
      crayon.drawImage(photoDos, 0, 0, dessin.width, dessin.height);

      const x = PANNEAU.x * dessin.width;
      const y = PANNEAU.y * dessin.height;
      const l = PANNEAU.largeur * dessin.width;
      const h = PANNEAU.hauteur * dessin.height;
      const centre = x + l / 2;
      const { nom: texteNom, numero: texteNumero } = flocage.current;

      // "multiply" : le texte fonce la photo, les ombres du tissu restent visibles dessous.
      crayon.globalCompositeOperation = "multiply";
      crayon.fillStyle = "#191817";
      crayon.textAlign = "center";
      crayon.textBaseline = "middle";

      const tailleNom = Math.min(70, 520 / Math.max(texteNom.length, 1));
      crayon.font = `700 ${tailleNom}px ${police}`;
      crayon.fillText(texteNom.toUpperCase(), centre, y + h * 0.26);
      crayon.font = `700 214px ${police}`;
      crayon.fillText(texteNumero, centre, y + h * 0.64);

      if (flash > 0.01) {
        crayon.globalAlpha = flash;
        crayon.fillRect(x, y, l, h);
        crayon.globalAlpha = 1;
      }
      crayon.globalCompositeOperation = "source-over";
      textureDos.needsUpdate = true;
    };

    redessinerPanneau.current = () => {
      flash = 1;
      dessinerDos();
      // Le clic e-ink, seulement si ce maillot est à l'écran (et si le son est allumé).
      if (visible) jouerClic();
    };
    photoDos.onload = dessinerDos;
    photoDos.src = maillotVide.src;
    // Une fois la police chargée, on redessine avec les bonnes lettres.
    document.fonts.load(`700 100px ${police}`).then(dessinerDos, () => {});

    // --- Les deux coques : un plan très découpé pour le dos, un autre pour la face. ---
    const plan = new THREE.PlaneGeometry(LARGEUR, HAUTEUR, 150, 186);
    const relief = charger(reliefDos.src, false);
    // Ces valeurs sont partagées par les deux coques : les changer une fois suffit.
    const communs = {
      uRelief: { value: relief },
      uEpaisseur: { value: EPAISSEUR },
      uProfil: { value: 0 },
      uLumiere: { value: new THREE.Vector3(0.3, 0.4, 1) },
    };
    const coque = (photo: THREE.Texture, miroir: number) =>
      new THREE.Mesh(
        plan,
        new THREE.ShaderMaterial({
          uniforms: { ...communs, uPhoto: { value: photo }, uMiroir: { value: miroir } },
          vertexShader: deplacement,
          fragmentShader: couleur,
        }),
      );

    const dos = coque(textureDos, 0);
    const face = coque(charger(maillotFace.src, true), 1);
    face.rotation.y = Math.PI; // la face regarde de l'autre côté

    const maillot = new THREE.Group();
    maillot.add(dos, face);
    scene.add(maillot);

    // --- Les commandes : la souris fait pencher le maillot, un glisser le fait tourner. ---
    let actuel = angle.current ?? 0;
    let incline = 0;
    let penche = { x: 0, y: 0 }; // position de la souris, de -1 à 1
    let tire = false;
    let dernierX = 0;
    let tour = 0; // rotation ajoutée par le glisser
    let elan = 0; // vitesse restante après avoir relâché
    let dernierGeste = 0;
    const libre = () => angle.current === undefined;
    const debut = performance.now();

    const bouger = (event: PointerEvent) => {
      if (tire) {
        const ecart = event.clientX - dernierX;
        dernierX = event.clientX;
        tour += ecart * 0.012;
        elan = ecart * 0.012;
        dernierGeste = performance.now();
        return;
      }
      penche = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      };
    };
    const saisir = (event: PointerEvent) => {
      if (!libre()) return;
      tire = true;
      dernierX = event.clientX;
      element.setPointerCapture(event.pointerId);
    };
    const lacher = () => {
      tire = false;
    };

    const dimensionner = () => {
      const { width, height } = zone.getBoundingClientRect();
      rendu.setSize(width, height, false);
    };

    const observateur = new IntersectionObserver(([entree]) => {
      visible = entree.isIntersecting;
    });

    let image = 0;

    const dessiner = () => {
      image = requestAnimationFrame(dessiner);
      if (!visible) return; // On ne calcule rien quand le maillot est hors de l'écran.
      const maintenant = performance.now();
      const temps = maintenant / 1000;

      // Le clignotement du panneau s'éteint par paliers.
      if (flash > 0.01) {
        flash = flash > 0.12 ? flash * 0.86 : 0;
        dessinerDos();
      }

      // Le travelling du hero : la caméra part d'un gros plan sur le panneau, puis recule.
      // Il démarre quand l'écran de chargement se lève (1,3 s) et dure 2,2 s.
      if (prioritaire) {
        const t = Math.min(1, Math.max(0, (maintenant - debut - 1300) / 2200));
        const doux = 1 - (1 - t) ** 3;
        camera.position.z = GROS_PLAN.z + (DISTANCE - GROS_PLAN.z) * doux;
        camera.position.y = GROS_PLAN.y * (1 - doux);
      }

      let cible: number;
      if (libre()) {
        if (!tire) {
          tour += elan;
          elan *= 0.94;
          // Deux secondes après le dernier geste, le maillot revient montrer son dos.
          if (maintenant - dernierGeste > 2000) {
            const tourComplet = Math.round(tour / (Math.PI * 2)) * Math.PI * 2;
            tour += (tourComplet - tour) * 0.04;
          }
        }
        // Un léger balancement, plus l'effet de la souris.
        // Le sinus "déforme" le tour : le maillot s'attarde de dos et de face,
        // et file quand il passe par la tranche.
        cible = tour - 0.38 * Math.sin(2 * tour) + penche.x * 0.5 + Math.sin(temps * 0.6) * 0.08;
      } else {
        cible = angle.current ?? 0;
      }

      actuel += (cible - actuel) * (libre() ? 0.08 : 0.2);
      incline += ((libre() ? -penche.y * 0.18 : 0) - incline) * 0.08;
      maillot.rotation.y = actuel;
      maillot.rotation.x = incline;
      // 0 de dos ou de face, 1 pile de profil.
      communs.uProfil.value = Math.abs(Math.sin(actuel)) ** 3;
      // La lumière vient de là où se trouve la souris.
      communs.uLumiere.value.set(penche.x * 1.4, -penche.y * 1.1 + 0.3, 1);
      rendu.render(scene, camera);
    };

    dimensionner();
    observateur.observe(zone);
    window.addEventListener("resize", dimensionner);
    window.addEventListener("pointermove", bouger);
    element.addEventListener("pointerdown", saisir);
    window.addEventListener("pointerup", lacher);
    image = requestAnimationFrame(dessiner);
    // On attend d'avoir dessiné une première image avant de masquer la photo.
    const apparition = setTimeout(() => setPret(true), 400);

    return () => {
      clearTimeout(apparition);
      cancelAnimationFrame(image);
      observateur.disconnect();
      window.removeEventListener("resize", dimensionner);
      window.removeEventListener("pointermove", bouger);
      element.removeEventListener("pointerdown", saisir);
      window.removeEventListener("pointerup", lacher);
      redessinerPanneau.current = () => {};
      plan.dispose();
      rendu.dispose();
    };
  }, [prioritaire]);

  const interactif = angleImpose === undefined;

  return (
    <div ref={conteneur} className={`relative font-flocage ${className}`}>
      {/* La version image : visible au chargement, puis masquée quand la 3D est prête. */}
      <div className={`transition-opacity duration-500 ${pret ? "opacity-0" : "opacity-100"}`}>
        <MaillotEink nom={nom} numero={numero} alt={alt} prioritaire={prioritaire} />
      </div>
      <canvas
        ref={toile}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${pret ? "opacity-100" : "opacity-0"} ${
          interactif ? "cursor-grab touch-pan-y active:cursor-grabbing" : "pointer-events-none"
        }`}
      />
    </div>
  );
}
