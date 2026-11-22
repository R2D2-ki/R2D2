// Kleine Scherze, die ab und zu zwischen die normalen Gesprächsrunden rutschen.
// Gleiche Form wie eine Runde: Partnerzeile + mögliche Antworten (zunächst verborgen).
// "{pareja}" wird immer durch "Roland" ersetzt. Der Name ist bewusst fest und in der App nicht änderbar.
export const PAREJA = 'Roland';

const T = (es, de) => ({ es, de });

export const BROMAS = [
  { id: 'trasero',
    partner: T('Por cierto, ¿sabías que {pareja} tiene un trasero muy bonito?', 'Übrigens, wusstest du, dass {pareja} einen sehr schönen Hintern hat?'),
    options: [T('¡Ja, ja! Eso ya lo sabía.', 'Haha! Das wusste ich schon.'),
              T('¡Qué cosas dices!', 'Was du so sagst!'),
              T('Es verdad, tienes razón.', 'Stimmt, du hast recht.'),
              T('No digas eso, me da vergüenza.', 'Sag das nicht, das ist mir peinlich.')] },
  { id: 'ia',
    partner: T('Si yo no fuera una inteligencia artificial, saldría con {pareja}.', 'Wenn ich keine KI wäre, würde ich mit {pareja} ausgehen.'),
    options: [T('¡Ni lo sueñes! Es mío.', 'Denk nicht mal dran! Er gehört mir.'),
              T('¡Qué graciosa eres!', 'Du bist lustig!'),
              T('Pues qué lástima para ti.', 'Na, schade für dich.'),
              T('Tienes buen gusto.', 'Du hast guten Geschmack.')] },
  { id: 'rico',
    partner: T('Esto tiene muy buena pinta. Casi tan rico como {pareja}, pero no se lo digas.', 'Das sieht sehr lecker aus. Fast so lecker wie {pareja}, aber sag es ihm nicht.'),
    options: [T('¡Ja, ja! No se lo diré.', 'Haha! Ich sage es ihm nicht.'),
              T('Se lo voy a decir esta noche.', 'Ich sage es ihm heute Abend.'),
              T('Eres muy mala.', 'Du bist ziemlich frech.'),
              T('¡Qué vergüenza!', 'Wie peinlich!')] },
  { id: 'cocina',
    partner: T('Dime la verdad: ¿quién cocina mejor en casa, tú o {pareja}?', 'Sag die Wahrheit: Wer kocht zu Hause besser, du oder {pareja}?'),
    options: [T('Cocino mejor yo, por supuesto.', 'Ich koche besser, natürlich.'),
              T('Cocina mejor {pareja}.', '{pareja} kocht besser.'),
              T('Los dos cocinamos fatal.', 'Wir beide kochen schrecklich.'),
              T('Depende del día.', 'Das hängt vom Tag ab.')] },
  { id: 'recado',
    partner: T('{pareja} me ha pedido que te diga que te quiere mucho.', '{pareja} hat mich gebeten, dir zu sagen, dass er dich sehr liebt.'),
    options: [T('Yo también le quiero mucho.', 'Ich liebe ihn auch sehr.'),
              T('¡Qué bonito!', 'Wie schön!'),
              T('Dile que me traiga flores.', 'Sag ihm, er soll mir Blumen bringen.'),
              T('Yo también te quiero, {pareja}.', 'Ich dich auch, {pareja}.')] },
  { id: 'ronca',
    partner: T('Un consejo de amiga: si {pareja} ronca, dale un codazo suave.', 'Ein Rat unter Freundinnen: Wenn {pareja} schnarcht, gib ihm einen sanften Ellbogenstoß.'),
    options: [T('¡Ja, ja! Lo haré esta noche.', 'Haha! Das mache ich heute Nacht.'),
              T('Ronca muchísimo.', 'Er schnarcht sehr stark.'),
              T('No ronca, ronca el gato.', 'Er schnarcht nicht, die Katze schnarcht.'),
              T('Gracias por el consejo.', 'Danke für den Rat.')] },
  { id: 'lavadora',
    partner: T('Pregunta seria: ¿{pareja} sabe dónde está la lavadora?', 'Ernste Frage: Weiß {pareja}, wo die Waschmaschine steht?'),
    options: [T('No, no tiene ni idea.', 'Nein, er hat keine Ahnung.'),
              T('Sí, pero finge que no.', 'Ja, aber er tut so, als wüsste er es nicht.'),
              T('Claro que sí, es muy listo.', 'Natürlich, er ist sehr schlau.'),
              T('Creo que sí, pero nunca la usa.', 'Ich glaube schon, aber er benutzt sie nie.')] },
  { id: 'nada',
    partner: T('Cuando dices «nada», ¿{pareja} se lo cree?', 'Wenn du „nichts“ sagst, glaubt {pareja} dir das?'),
    options: [T('No, nunca se lo cree.', 'Nein, er glaubt es nie.'),
              T('Sí, es un poco ingenuo.', 'Ja, er ist etwas naiv.'),
              T('A veces sí, a veces no.', 'Manchmal ja, manchmal nein.'),
              T('Él lo sabe todo.', 'Er weiß alles.')] },
  { id: 'suerte',
    partner: T('Qué suerte tiene {pareja} con una compañera tan lista como tú.', 'Was für ein Glück {pareja} hat, mit einer so klugen Partnerin wie dir.'),
    options: [T('Gracias, ya lo sé.', 'Danke, ich weiß.'),
              T('Yo también tengo suerte.', 'Ich habe auch Glück.'),
              T('Sí, tiene mucha suerte.', 'Ja, er hat großes Glück.'),
              T('Eres muy amable.', 'Du bist sehr freundlich.')] },
  { id: 'guapa',
    partner: T('{pareja} dice que eres la mujer más guapa del mundo. Y yo estoy de acuerdo.', '{pareja} sagt, du bist die schönste Frau der Welt. Und ich stimme zu.'),
    options: [T('¡Qué amable!', 'Wie nett!'),
              T('Ya lo sé.', 'Das weiß ich schon.'),
              T('Él también es muy guapo.', 'Er ist auch sehr hübsch.'),
              T('Muchas gracias, me haces reír.', 'Vielen Dank, du bringst mich zum Lachen.')] },
  { id: 'gato',
    partner: T('Pregunta importante: ¿quién manda en casa, tú, {pareja} o el gato?', 'Wichtige Frage: Wer hat zu Hause das Sagen, du, {pareja} oder die Katze?'),
    options: [T('Manda el gato, por supuesto.', 'Die Katze, natürlich.'),
              T('Mando yo.', 'Ich bestimme.'),
              T('{pareja} cree que manda él.', '{pareja} glaubt, dass er bestimmt.'),
              T('Mandamos los tres.', 'Wir drei bestimmen.')] },
  { id: 'peinado',
    partner: T('{pareja} necesita un corte de pelo urgente. ¿Se lo haces tú?', '{pareja} braucht dringend einen Haarschnitt. Machst du ihn ihm?'),
    options: [T('Sí, pero me tiene que pagar bien.', 'Ja, aber er muss mich gut bezahlen.'),
              T('No, que vaya a otra peluquería.', 'Nein, er soll zu einem anderen Friseur gehen.'),
              T('Se lo hago gratis, es mi pareja.', 'Ich mache es ihm gratis, er ist mein Partner.'),
              T('Primero tiene que lavarse el pelo.', 'Zuerst muss er sich die Haare waschen.')] },
  { id: 'masaje',
    partner: T('Esta noche {pareja} merece un masaje por haber hecho esta aplicación.', 'Heute Nacht verdient {pareja} eine Massage dafür, dass er diese App gebaut hat.'),
    options: [T('Tienes razón, se lo merece.', 'Du hast recht, er hat es verdient.'),
              T('Un masaje y una cena.', 'Eine Massage und ein Abendessen.'),
              T('Primero tiene que lavar los platos.', 'Zuerst muss er das Geschirr spülen.'),
              T('Gracias, {pareja}.', 'Danke, {pareja}.')] },
];

// Wählt einen Scherz, den es noch nicht gab (bis alle durch sind), und setzt den Namen ein.
export function pickBroma(seenIds) {
  const name = PAREJA;
  let pool = BROMAS.filter(b => !seenIds.includes(b.id));
  let reset = false;
  if (!pool.length) { pool = BROMAS; reset = true; }
  const pick = pool[Math.floor(Math.random() * pool.length)];
  const turn = JSON.parse(JSON.stringify(pick).replaceAll('{pareja}', name));
  return { id: pick.id, turn, reset };
}
