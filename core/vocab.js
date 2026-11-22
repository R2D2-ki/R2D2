// Wortschatz für den Trainer (Spanien-Spanisch). es = Spanisch (mit Artikel bei Nomen), de = Deutsch,
// lvl = A1 | A2 | B1 | B2 | C1, theme = Thema. Jedes Wort steht nur einmal, jede deutsche Vorgabe nur einmal.
// Weitere Wörter: einfach in der Datei der Stufe ergänzen (vocab-a1.js ... vocab-c1.js), die App muss nicht umgebaut werden.
import { LEVELS } from './srs.js';
import a1 from './vocab-a1.js';
import a2 from './vocab-a2.js';
import b1 from './vocab-b1.js';
import b2 from './vocab-b2.js';
import c1 from './vocab-c1.js';

const W = (es, de, lvl, theme) => ({ es, de, lvl, theme });
const fromFile = (lvl, data) => Object.entries(data).flatMap(([theme, pairs]) => pairs.map(([es, de]) => W(es, de, lvl, theme)));
const G = (lvl, theme, pairs) => pairs.map(([es, de]) => W(es, de, lvl, theme));

const BASIS = [
  // ---- A1: Grundlagen ----
  W('hola', 'hallo', 'A1', 'saludos'), W('adiós', 'auf Wiedersehen', 'A1', 'saludos'),
  W('por favor', 'bitte', 'A1', 'saludos'), W('gracias', 'danke', 'A1', 'saludos'),
  W('perdone', 'Entschuldigung', 'A1', 'saludos'), W('lo siento', 'es tut mir leid', 'A1', 'saludos'),
  W('buenos días', 'guten Morgen', 'A1', 'saludos'), W('buenas noches', 'gute Nacht', 'A1', 'saludos'),
  W('mucho gusto', 'freut mich', 'A1', 'saludos'),
  W('el agua', 'das Wasser', 'A1', 'comida'), W('el café', 'der Kaffee', 'A1', 'comida'),
  W('la leche', 'die Milch', 'A1', 'comida'), W('el pan', 'das Brot', 'A1', 'comida'),
  W('el vino', 'der Wein', 'A1', 'comida'), W('la cerveza', 'das Bier', 'A1', 'comida'),
  W('la manzana', 'der Apfel', 'A1', 'comida'), W('el queso', 'der Käse', 'A1', 'comida'),
  W('el pescado', 'der Fisch', 'A1', 'comida'), W('la ensalada', 'der Salat', 'A1', 'comida'),
  W('la cuenta', 'die Rechnung', 'A1', 'comida'),
  W('la casa', 'das Haus', 'A1', 'vida'), W('el gato', 'die Katze', 'A1', 'vida'),
  W('el perro', 'der Hund', 'A1', 'vida'), W('la hija', 'die Tochter', 'A1', 'familia'),
  W('el hijo', 'der Sohn', 'A1', 'familia'), W('la madre', 'die Mutter', 'A1', 'familia'),
  W('el padre', 'der Vater', 'A1', 'familia'), W('el amigo', 'der Freund', 'A1', 'familia'),
  W('la amiga', 'die Freundin', 'A1', 'familia'), W('el hombre', 'der Mann', 'A1', 'familia'),
  W('la mujer', 'die Frau', 'A1', 'familia'),
  W('uno', 'eins', 'A1', 'números'), W('dos', 'zwei', 'A1', 'números'), W('tres', 'drei', 'A1', 'números'),
  W('cuatro', 'vier', 'A1', 'números'), W('cinco', 'fünf', 'A1', 'números'), W('seis', 'sechs', 'A1', 'números'),
  W('siete', 'sieben', 'A1', 'números'), W('ocho', 'acht', 'A1', 'números'), W('nueve', 'neun', 'A1', 'números'),
  W('diez', 'zehn', 'A1', 'números'),
  W('rojo', 'rot', 'A1', 'colores'), W('azul', 'blau', 'A1', 'colores'), W('verde', 'grün', 'A1', 'colores'),
  W('blanco', 'weiß', 'A1', 'colores'), W('negro', 'schwarz', 'A1', 'colores'),
  W('grande', 'groß', 'A1', 'adjetivos'), W('pequeño', 'klein', 'A1', 'adjetivos'),
  W('bueno', 'gut', 'A1', 'adjetivos'), W('malo', 'schlecht', 'A1', 'adjetivos'),
  W('hoy', 'heute', 'A1', 'tiempo'), W('mañana', 'morgen', 'A1', 'tiempo'),
  W('ayer', 'gestern', 'A1', 'tiempo'), W('ahora', 'jetzt', 'A1', 'tiempo'),

  // ---- A1: mehr Grundwortschatz ----
  ...G('A1', 'saludos', [
    ['buenas tardes', 'guten Tag (nachmittags)'], ['hasta luego', 'bis später'], ['hasta mañana', 'bis morgen'],
    ['de nada', 'gern geschehen'], ['¿cómo estás?', 'wie geht es dir?'], ['muy bien', 'sehr gut'],
    ['sí', 'ja'], ['no', 'nein'], ['vale', 'okay'], ['encantado', 'angenehm (sehr erfreut)'],
  ]),
  ...G('A1', 'pronombres', [
    ['yo', 'ich'], ['tú', 'du'], ['él', 'er'], ['ella', 'sie (eine Frau)'], ['nosotros', 'wir'], ['ellos', 'sie (mehrere)'],
  ]),
  ...G('A1', 'preguntas', [
    ['¿qué?', 'was?'], ['¿quién?', 'wer?'], ['¿dónde?', 'wo?'], ['¿cuándo?', 'wann?'],
    ['¿cómo?', 'wie?'], ['¿cuánto?', 'wie viel?'], ['¿por qué?', 'warum?'],
  ]),
  ...G('A1', 'verbos', [
    ['ser', 'sein (Wesen, Beruf)'], ['estar', 'sein (Ort, Zustand)'], ['tener', 'haben'], ['querer', 'wollen, mögen'],
    ['ir', 'gehen, fahren'], ['hacer', 'machen, tun'], ['comer', 'essen'], ['beber', 'trinken'],
    ['vivir', 'wohnen, leben'], ['hablar', 'sprechen'], ['trabajar', 'arbeiten'], ['comprar', 'kaufen'],
    ['llamarse', 'heißen'], ['poder', 'können'], ['ver', 'sehen'], ['venir', 'kommen'], ['decir', 'sagen'], ['gustar', 'gefallen'],
  ]),
  ...G('A1', 'comida', [
    ['el arroz', 'der Reis'], ['la carne', 'das Fleisch'], ['el pollo', 'das Hähnchen'], ['el huevo', 'das Ei'],
    ['la sopa', 'die Suppe'], ['la fruta', 'das Obst'], ['la naranja', 'die Orange'], ['el plátano', 'die Banane'],
    ['la patata', 'die Kartoffel'], ['el tomate', 'die Tomate'], ['el zumo', 'der Saft'], ['el té', 'der Tee'],
    ['el azúcar', 'der Zucker'], ['la sal', 'das Salz'], ['el bocadillo', 'das belegte Brötchen'],
    ['la comida', 'das Essen, das Mittagessen'], ['la cena', 'das Abendessen'], ['el helado', 'das Eis'],
  ]),
  ...G('A1', 'casa', [
    ['la cama', 'das Bett'], ['la mesa', 'der Tisch'], ['la silla', 'der Stuhl'], ['la puerta', 'die Tür'],
    ['la ventana', 'das Fenster'], ['la cocina', 'die Küche'], ['el baño', 'das Badezimmer'],
    ['el salón', 'das Wohnzimmer'], ['el jardín', 'der Garten'],
  ]),
  ...G('A1', 'familia', [
    ['el hermano', 'der Bruder'], ['la hermana', 'die Schwester'], ['el abuelo', 'der Großvater'],
    ['la abuela', 'die Großmutter'], ['el marido', 'der Ehemann'], ['el niño', 'der Junge, das Kind'],
    ['la niña', 'das Mädchen'], ['la familia', 'die Familie'],
  ]),
  ...G('A1', 'números', [
    ['once', 'elf'], ['doce', 'zwölf'], ['quince', 'fünfzehn'], ['veinte', 'zwanzig'],
    ['treinta', 'dreißig'], ['cincuenta', 'fünfzig'], ['cien', 'hundert'],
  ]),
  ...G('A1', 'días', [
    ['el lunes', 'Montag'], ['el martes', 'Dienstag'], ['el miércoles', 'Mittwoch'], ['el jueves', 'Donnerstag'],
    ['el viernes', 'Freitag'], ['el sábado', 'Samstag'], ['el domingo', 'Sonntag'],
  ]),
  ...G('A1', 'tiempo', [
    ['la mañana', 'der Morgen, der Vormittag'], ['la tarde', 'der Nachmittag, der Abend'], ['la noche', 'die Nacht'],
    ['el día', 'der Tag'], ['el año', 'das Jahr'], ['el mes', 'der Monat'],
    ['siempre', 'immer'], ['nunca', 'nie'], ['a veces', 'manchmal'],
  ]),
  ...G('A1', 'colores', [
    ['amarillo', 'gelb'], ['gris', 'grau'], ['marrón', 'braun'], ['rosa', 'rosa'], ['morado', 'lila'],
  ]),
  ...G('A1', 'adjetivos', [
    ['nuevo', 'neu'], ['viejo', 'alt (Sache)'], ['bonito', 'hübsch'], ['feo', 'hässlich'], ['joven', 'jung'],
    ['rápido', 'schnell'], ['lento', 'langsam'], ['caliente', 'warm, heiß (Speisen)'], ['frío', 'kalt'],
    ['dulce', 'süß'], ['fácil', 'leicht, einfach'], ['difícil', 'schwierig'],
    ['mucho', 'viel'], ['poco', 'wenig'], ['más', 'mehr'], ['menos', 'weniger'], ['también', 'auch'],
  ]),
  ...G('A1', 'cuerpo', [
    ['la mano', 'die Hand'], ['el ojo', 'das Auge'], ['la boca', 'der Mund'], ['la nariz', 'die Nase'],
    ['la oreja', 'das Ohr'], ['el pie', 'der Fuß'], ['el brazo', 'der Arm'], ['la pierna', 'das Bein'],
  ]),
  ...G('A1', 'animales', [
    ['el pájaro', 'der Vogel'], ['el caballo', 'das Pferd'], ['la vaca', 'die Kuh'], ['el pez', 'der Fisch (lebendig)'],
  ]),
  ...G('A1', 'ropa', [
    ['la camisa', 'das Hemd'], ['los pantalones', 'die Hose'], ['el zapato', 'der Schuh'],
    ['el vestido', 'das Kleid'], ['la chaqueta', 'die Jacke'], ['el sombrero', 'der Hut'],
  ]),
  ...G('A1', 'lugares', [
    ['la ciudad', 'die Stadt'], ['el pueblo', 'das Dorf'], ['el banco', 'die Bank'], ['la iglesia', 'die Kirche'],
    ['el parque', 'der Park'], ['la playa', 'der Strand'], ['el mar', 'das Meer'], ['la montaña', 'der Berg'],
    ['el río', 'der Fluss'], ['el restaurante', 'das Restaurant'], ['el hotel', 'das Hotel'],
  ]),
  ...G('A1', 'transporte', [
    ['el coche', 'das Auto'], ['el tren', 'der Zug'], ['el autobús', 'der Bus'], ['el avión', 'das Flugzeug'],
    ['la bicicleta', 'das Fahrrad'], ['el taxi', 'das Taxi'], ['el barco', 'das Schiff'],
  ]),
  ...G('A1', 'cosas', [
    ['el libro', 'das Buch'], ['el teléfono', 'das Telefon'], ['el dinero', 'das Geld'],
    ['la persona', 'die Person'], ['el nombre', 'der Name'], ['la cosa', 'die Sache'],
  ]),

  // ---- A2: Reisen, Alltag, Gesundheit ----
  W('la habitación', 'das Zimmer', 'A2', 'viaje'), W('la llave', 'der Schlüssel', 'A2', 'viaje'),
  W('el desayuno', 'das Frühstück', 'A2', 'viaje'), W('la maleta', 'der Koffer', 'A2', 'viaje'),
  W('el billete', 'die Fahrkarte', 'A2', 'viaje'), W('la estación', 'der Bahnhof', 'A2', 'viaje'),
  W('el aeropuerto', 'der Flughafen', 'A2', 'viaje'), W('el andén', 'der Bahnsteig', 'A2', 'viaje'),
  W('la reserva', 'die Reservierung', 'A2', 'viaje'), W('el pasaporte', 'der Reisepass', 'A2', 'viaje'),
  W('la calle', 'die Straße', 'A2', 'ciudad'), W('la plaza', 'der Platz', 'A2', 'ciudad'),
  W('a la derecha', 'nach rechts', 'A2', 'ciudad'), W('a la izquierda', 'nach links', 'A2', 'ciudad'),
  W('todo recto', 'geradeaus', 'A2', 'ciudad'), W('cerca', 'nah', 'A2', 'ciudad'), W('lejos', 'weit', 'A2', 'ciudad'),
  W('el supermercado', 'der Supermarkt', 'A2', 'ciudad'), W('la tienda', 'das Geschäft', 'A2', 'ciudad'),
  W('la farmacia', 'die Apotheke', 'A2', 'salud'), W('el médico', 'der Arzt', 'A2', 'salud'),
  W('la cabeza', 'der Kopf', 'A2', 'salud'), W('el estómago', 'der Magen', 'A2', 'salud'),
  W('la garganta', 'der Hals', 'A2', 'salud'), W('la fiebre', 'das Fieber', 'A2', 'salud'),
  W('la tos', 'der Husten', 'A2', 'salud'), W('el dolor', 'der Schmerz', 'A2', 'salud'),
  W('la medicina', 'das Medikament', 'A2', 'salud'), W('la receta', 'das Rezept', 'A2', 'salud'),
  W('la tarjeta', 'die Karte', 'A2', 'dinero'), W('el efectivo', 'das Bargeld', 'A2', 'dinero'),
  W('el cambio', 'das Wechselgeld', 'A2', 'dinero'), W('el precio', 'der Preis', 'A2', 'dinero'),
  W('caro', 'teuer', 'A2', 'dinero'), W('barato', 'billig', 'A2', 'dinero'),
  W('abierto', 'geöffnet', 'A2', 'dinero'), W('cerrado', 'geschlossen', 'A2', 'dinero'),
  W('hace sol', 'die Sonne scheint', 'A2', 'tiempo'), W('llueve', 'es regnet', 'A2', 'tiempo'),
  W('hace calor', 'es ist heiß', 'A2', 'tiempo'), W('hace frío', 'es ist kalt', 'A2', 'tiempo'),
  W('la semana', 'die Woche', 'A2', 'tiempo'), W('el fin de semana', 'das Wochenende', 'A2', 'tiempo'),
  W('el trabajo', 'die Arbeit', 'A2', 'vida'), W('el tiempo libre', 'die Freizeit', 'A2', 'vida'),
  W('la peluquería', 'der Friseursalon', 'A2', 'oficios'), W('el pelo', 'das Haar', 'A2', 'oficios'),
  W('el corte', 'der Schnitt', 'A2', 'oficios'), W('el color', 'die Farbe (Farbton)', 'A2', 'oficios'),
  W('las tijeras', 'die Schere', 'A2', 'oficios'),
  W('el pincel', 'der Pinsel', 'A2', 'arte'), W('el lienzo', 'die Leinwand', 'A2', 'arte'),
  W('la pintura', 'die Malfarbe, das Gemälde', 'A2', 'arte'), W('el dibujo', 'die Zeichnung', 'A2', 'arte'),
  W('aprender', 'lernen', 'A2', 'verbos'), W('viajar', 'reisen', 'A2', 'verbos'),
  W('cocinar', 'kochen', 'A2', 'verbos'), W('pintar', 'malen', 'A2', 'verbos'),
  W('esperar', 'warten', 'A2', 'verbos'), W('necesitar', 'brauchen', 'A2', 'verbos'),
  W('recomendar', 'empfehlen', 'A2', 'verbos'), W('pagar', 'bezahlen', 'A2', 'verbos'),

  // ---- A2: mehr Wortschatz ----
  ...G('A2', 'viaje', [
    ['el equipaje', 'das Gepäck'], ['la salida', 'der Ausgang, die Abfahrt'], ['la llegada', 'die Ankunft'],
    ['el retraso', 'die Verspätung'], ['el vuelo', 'der Flug'], ['la puerta de embarque', 'der Flugsteig'],
    ['la parada', 'die Haltestelle'], ['el mapa', 'die Landkarte, der Stadtplan'], ['la entrada', 'der Eintritt, die Eintrittskarte'],
    ['el albergue', 'die Herberge'], ['el ascensor', 'der Aufzug'], ['la piscina', 'das Schwimmbad'],
    ['alquilar', 'mieten'], ['el seguro', 'die Versicherung'], ['la frontera', 'die Grenze'], ['el viaje', 'die Reise'],
    ['las vacaciones', 'der Urlaub, die Ferien'], ['la excursión', 'der Ausflug'], ['el turista', 'der Tourist'],
    ['el recuerdo', 'das Souvenir, die Erinnerung'], ['reservar', 'reservieren'],
  ]),
  ...G('A2', 'restaurante', [
    ['la carta', 'die Speisekarte'], ['el menú del día', 'das Tagesmenü'], ['el camarero', 'der Kellner'],
    ['la camarera', 'die Kellnerin'], ['el plato', 'der Teller, das Gericht'], ['el vaso', 'das Glas (Wasserglas)'],
    ['la copa', 'das Weinglas'], ['la taza', 'die Tasse'], ['el tenedor', 'die Gabel'], ['el cuchillo', 'das Messer'],
    ['la cuchara', 'der Löffel'], ['el postre', 'der Nachtisch'], ['la propina', 'das Trinkgeld'],
    ['picante', 'scharf'], ['vegetariano', 'vegetarisch'], ['sabroso', 'lecker, schmackhaft'],
    ['la tapa', 'die kleine Vorspeise (Tapa)'], ['pedir', 'bestellen, bitten um'], ['probar', 'probieren'],
  ]),
  ...G('A2', 'compras', [
    ['la talla', 'die Kleidergröße'], ['el probador', 'die Umkleidekabine'], ['las rebajas', 'der Schlussverkauf'],
    ['la bolsa', 'die Tasche, die Tüte'], ['el recibo', 'der Kassenbon'], ['el descuento', 'der Rabatt'],
    ['la caja', 'die Kasse'], ['el mercado', 'der Markt'], ['la panadería', 'die Bäckerei'], ['la carnicería', 'die Metzgerei'],
    ['el kilo', 'das Kilo'], ['la botella', 'die Flasche'], ['la lata', 'die Dose'], ['fresco', 'frisch'],
    ['gratis', 'kostenlos'], ['la oferta', 'das Angebot'], ['cobrar', 'kassieren'], ['devolver', 'zurückgeben'],
  ]),
  ...G('A2', 'salud', [
    ['la espalda', 'der Rücken'], ['el pecho', 'die Brust'], ['el resfriado', 'die Erkältung'], ['la alergia', 'die Allergie'],
    ['la herida', 'die Wunde'], ['la pastilla', 'die Tablette'], ['el hospital', 'das Krankenhaus'],
    ['la ambulancia', 'der Krankenwagen'], ['la urgencia', 'der Notfall'], ['el dentista', 'der Zahnarzt'],
    ['enfermo', 'krank'], ['sano', 'gesund'], ['mareado', 'schwindlig'], ['doler', 'wehtun'], ['toser', 'husten'],
    ['descansar', 'sich ausruhen'], ['la cita', 'der Termin'],
  ]),
  ...G('A2', 'ciudad', [
    ['la esquina', 'die Ecke'], ['el semáforo', 'die Ampel'], ['el puente', 'die Brücke'], ['el cruce', 'die Kreuzung'],
    ['la acera', 'der Gehweg'], ['el edificio', 'das Gebäude'], ['el museo', 'das Museum'], ['el ayuntamiento', 'das Rathaus'],
    ['la biblioteca', 'die Bibliothek'], ['el cine', 'das Kino'], ['el teatro', 'das Theater'],
    ['correos', 'die Post'], ['la gasolinera', 'die Tankstelle'], ['el aparcamiento', 'der Parkplatz'],
    ['el metro', 'die U-Bahn'], ['girar', 'abbiegen'], ['cruzar', 'überqueren'], ['seguir', 'weitergehen, folgen'],
    ['perderse', 'sich verlaufen'],
  ]),
  ...G('A2', 'tiempo', [
    ['la nube', 'die Wolke'], ['el viento', 'der Wind'], ['la nieve', 'der Schnee'], ['la tormenta', 'das Gewitter'],
    ['la lluvia', 'der Regen'], ['el paraguas', 'der Regenschirm'], ['la temperatura', 'die Temperatur'],
    ['el invierno', 'der Winter'], ['el verano', 'der Sommer'], ['la primavera', 'der Frühling'], ['el otoño', 'der Herbst'],
    ['enero', 'Januar'], ['febrero', 'Februar'], ['marzo', 'März'], ['abril', 'April'], ['mayo', 'Mai'], ['junio', 'Juni'],
    ['julio', 'Juli'], ['agosto', 'August'], ['septiembre', 'September'], ['octubre', 'Oktober'],
    ['noviembre', 'November'], ['diciembre', 'Dezember'],
    ['la hora', 'die Stunde, die Uhrzeit'], ['el minuto', 'die Minute'], ['temprano', 'früh'], ['tarde', 'spät'],
    ['pronto', 'bald'], ['el rato', 'die kurze Weile'],
  ]),
  ...G('A2', 'trabajo', [
    ['el jefe', 'der Chef'], ['el compañero', 'der Kollege'], ['la reunión', 'die Besprechung'], ['el sueldo', 'das Gehalt'],
    ['la empresa', 'die Firma'], ['el horario', 'die Arbeitszeit, der Fahrplan'], ['la oficina', 'das Büro'],
    ['el ordenador', 'der Computer'], ['el móvil', 'das Handy'], ['el correo electrónico', 'die E-Mail'],
    ['la contraseña', 'das Passwort'], ['el cargador', 'das Ladegerät'], ['la pantalla', 'der Bildschirm'],
    ['el wifi', 'das WLAN'], ['imprimir', 'drucken'], ['enviar', 'senden'], ['llamar', 'anrufen, rufen'],
  ]),
  ...G('A2', 'hogar', [
    ['la nevera', 'der Kühlschrank'], ['el horno', 'der Backofen'], ['la lavadora', 'die Waschmaschine'],
    ['la ducha', 'die Dusche'], ['la toalla', 'das Handtuch'], ['el espejo', 'der Spiegel'], ['el armario', 'der Schrank'],
    ['el sofá', 'das Sofa'], ['la lámpara', 'die Lampe'], ['la escalera', 'die Treppe'], ['el vecino', 'der Nachbar'],
    ['la basura', 'der Müll'], ['limpiar', 'putzen, reinigen'], ['lavar', 'waschen'], ['la compra', 'der Einkauf'],
  ]),
  ...G('A2', 'verbos', [
    ['abrir', 'öffnen'], ['cerrar', 'schließen'], ['empezar', 'anfangen'], ['terminar', 'beenden'],
    ['entender', 'verstehen'], ['escribir', 'schreiben'], ['leer', 'lesen'], ['escuchar', 'zuhören'], ['mirar', 'anschauen'],
    ['buscar', 'suchen'], ['encontrar', 'finden'], ['perder', 'verlieren'], ['olvidar', 'vergessen'],
    ['recordar', 'sich erinnern'], ['llegar', 'ankommen'], ['salir', 'ausgehen, hinausgehen'], ['volver', 'zurückkehren'],
    ['quedar', 'sich verabreden'], ['llevar', 'tragen, mitnehmen'], ['traer', 'mitbringen'], ['preguntar', 'fragen'],
    ['responder', 'antworten'], ['ayudar', 'helfen'], ['conocer', 'kennen, kennenlernen'], ['saber', 'wissen'],
    ['dormir', 'schlafen'], ['levantarse', 'aufstehen'], ['ducharse', 'duschen (sich)'], ['jugar', 'spielen'],
    ['caminar', 'zu Fuß gehen'], ['correr', 'rennen'], ['nadar', 'schwimmen'], ['bailar', 'tanzen'], ['cantar', 'singen'],
    ['reír', 'lachen'], ['llorar', 'weinen'], ['cambiar', 'ändern, wechseln'], ['coger', 'nehmen (Zug, Bus)'],
    ['subir', 'hinaufgehen, einsteigen'], ['bajar', 'hinuntergehen, aussteigen'], ['sentarse', 'sich hinsetzen'],
    ['preferir', 'bevorzugen'], ['elegir', 'wählen'], ['tener que', 'müssen'], ['deber', 'sollen'],
  ]),
  ...G('A2', 'adjetivos', [
    ['cansado', 'müde'], ['contento', 'zufrieden'], ['triste', 'traurig'], ['nervioso', 'nervös'], ['ocupado', 'beschäftigt'],
    ['libre', 'frei'], ['lleno', 'voll'], ['vacío', 'leer'], ['limpio', 'sauber'], ['sucio', 'schmutzig'],
    ['ruidoso', 'laut'], ['tranquilo', 'ruhig'], ['seguro', 'sicher'], ['peligroso', 'gefährlich'],
    ['importante', 'wichtig'], ['necesario', 'nötig'], ['posible', 'möglich'], ['distinto', 'verschieden'],
    ['antiguo', 'alt (historisch)'], ['moderno', 'modern'], ['amable', 'freundlich'], ['simpático', 'sympathisch'],
    ['divertido', 'lustig'], ['aburrido', 'langweilig'], ['curioso', 'neugierig'], ['trabajador', 'fleißig'],
  ]),
  ...G('A2', 'frases', [
    ['pero', 'aber'], ['porque', 'weil, denn'], ['todavía', 'noch'], ['ya', 'schon'], ['además', 'außerdem'],
    ['quizá', 'vielleicht'], ['por ejemplo', 'zum Beispiel'], ['de repente', 'plötzlich'], ['a menudo', 'oft'],
    ['sobre todo', 'vor allem'], ['enseguida', 'sofort'], ['por supuesto', 'natürlich'],
    ['con mucho gusto', 'sehr gern'], ['no pasa nada', 'macht nichts'], ['de acuerdo', 'einverstanden'],
    ['no entiendo', 'ich verstehe nicht'], ['más despacio, por favor', 'langsamer, bitte'], ['otra vez', 'noch einmal'],
    ['¿cómo se dice…?', 'wie sagt man …?'], ['¡qué pena!', 'wie schade!'], ['¡qué bien!', 'wie schön!'],
    ['¿cuánto cuesta?', 'wie viel kostet das?'], ['no tengo ni idea', 'ich habe keine Ahnung'],
  ]),
  ...G('A2', 'oficios', [
    ['el champú', 'das Shampoo'], ['el secador', 'der Föhn'], ['el flequillo', 'der Pony'], ['las mechas', 'die Strähnchen'],
    ['teñir', 'färben (Haare)'], ['el peine', 'der Kamm'], ['rizado', 'lockig'], ['liso', 'glatt'],
  ]),
  ...G('A2', 'arte', [
    ['la acuarela', 'das Aquarell'], ['el óleo', 'das Ölgemälde'], ['el boceto', 'die Skizze'],
    ['la exposición', 'die Ausstellung'], ['el marco', 'der Bilderrahmen'], ['la artesanía', 'das Kunsthandwerk'],
    ['el pegamento', 'der Kleber'], ['el papel', 'das Papier'], ['hacer manualidades', 'basteln'],
  ]),
  ...G('A2', 'animales', [
    ['la mascota', 'das Haustier'], ['el gatito', 'das Kätzchen'], ['maullar', 'miauen'], ['acariciar', 'streicheln'],
    ['arañar', 'kratzen'], ['el veterinario', 'der Tierarzt'],
  ]),
];

// Alles zusammen, nach Stufe geordnet (innerhalb der Stufe bleibt die Reihenfolge der Dateien).
export const VOCAB = [...BASIS, ...fromFile('A1', a1), ...fromFile('A2', a2), ...fromFile('B1', b1), ...fromFile('B2', b2), ...fromFile('C1', c1)]
  .map((w, i) => ({ w, i }))
  .sort((x, y) => LEVELS.indexOf(x.w.lvl) - LEVELS.indexOf(y.w.lvl) || x.i - y.i)
  .map(x => x.w);

// Einstufungssätze: hören und nachsprechen, je drei pro Niveau, jeweils schwerer.
export const PLACEMENT = {
  A1: ['Me llamo Ana y vivo en Austria.', 'Quiero un café con leche, por favor.', '¿Dónde está el baño?'],
  A2: ['Ayer fui al supermercado y compré pan y leche.',
       '¿Puede decirme cómo llegar a la estación de tren?',
       'El fin de semana me gusta caminar por la montaña con mis amigos.'],
  B1: ['Si tuviera más tiempo libre, viajaría por toda España.',
       'Aunque hacía mucho frío, decidimos salir a dar un paseo.',
       'Me gustaría que me explicaras cómo funciona esta aplicación.'],
  B2: ['Por mucho que lo intentara, no conseguía entender lo que me decían.',
       'Es probable que el tren llegue con retraso debido a la tormenta.',
       'Si hubiera sabido que vendrías, habría preparado algo especial para cenar.'],
  C1: ['No es que me disguste la idea, pero dudo que podamos llevarla a cabo tan pronto.',
       'Cuanto más lo pienso, más me convence de que deberíamos replantearnos el proyecto.',
       'A pesar de las dificultades, la exposición logró atraer a un público inesperadamente numeroso.'],
};
