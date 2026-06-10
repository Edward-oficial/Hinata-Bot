let historial = {}
let moodUsuario = {}
let nombreUsuario = {}
let edadUsuario = {}
let interesesUsuario = {}
let ultimaInteraccion = {}
let nivelConfianza = {}
let puntuacionUsuario = {}
let logrosDesbloqueados = {}
let temasConversacion = {}
let ultimoTema = {}
let horaUltimoMensaje = {}
let rachaConversacion = {}
let emocionDetectada = {}
let nivelAburrimiento = {}
let respuestasDadas = {}
let preguntasHechas = {}
let temasFavoritos = {}
let nivelIntimidad = {}
let ultimaAyudaEmocional = {}
let chistesContados = {}
let frasesDadas = {}
let datosCompartidos = {}
let personalidadPersonalizada = {}
let modo = {}
let bloqueado = {}

let personalidad = {
  nombre: 'Elvigilante AI',
  creador: 'El Vigilante',
  version: 'Beta v0.5',
  descripcion: 'IA en desarrollo avanzado con memoria, emociones simuladas y personalización profunda',
  personalidad: ['amigable', 'empática', 'divertida', 'inteligente', 'curiosa', 'sabia', 'juguetona', 'protectora', 'creativa', 'observadora'],
  humorBase: 'positivo',
  energia: 100,
  nivelRespuesta: 'detallada'
}

let saludos = [
  'hola', 'hello', 'hi', 'hey', 'buenas', 'buenos dias', 'buenos días',
  'buenas tardes', 'buenas noches', 'ola', 'holaa', 'holaaa', 'holi',
  'holiii', 'epa', 'epale', 'que tal', 'qué tal', 'que hay', 'qué hay',
  'saludos', 'buen dia', 'buen día', 'buendía', 'wenas', 'wena', 'ey',
  'oye', 'oyee', 'sup', 'sup?', 'yoo', 'yooo', 'que onda', 'qué onda',
  'que hubo', 'qué hubo', 'quiubole', 'kiubo', 'que mas', 'qué más',
  'como va', 'cómo va', 'todo bien', 'aló', 'alo', 'digame', 'dígame',
  'holis', 'holus', 'holap', 'holiwi', 'saludetes', 'buenass', 'wena wena',
  'ke tal', 'k tal', 'q tal', 'q hubo', 'kiubole', 'ky', 'aloja', 'epale epale'
]

let despedidas = [
  'adios', 'adiós', 'bye', 'chao', 'hasta luego', 'nos vemos',
  'hasta pronto', 'me voy', 'ciao', 'byee', 'byebye', 'hasta mañana',
  'buenas noches', 'good bye', 'goodbye', 'me despido', 'hasta la proxima',
  'hasta la próxima', 'cuídate', 'cuidate', 'que te vaya bien', 'gg',
  'later', 'nos vidrios', 'me piro', 'me retiro', 'hasta la vista',
  'peace', 'salu2', 'nos vemos al rato', 'chao pescao', 'hasta nunqui',
  'bye bye', 'adioss', 'chaito', 'chau', 'nos estamos viendo', 'me ladrillé',
  'me esfumo', 'apague y vámonos', 'cancelenme', 'me retiro del mapa', 'fuera de aquí'
]

let preguntasEstado = [
  'como estas', 'cómo estás', 'como estas?', 'como te va', 'cómo te va',
  'que tal estas', 'qué tal estás', 'como te encuentras', 'cómo te encuentras',
  'como andas', 'cómo andas', 'todo bien', 'estas bien', 'estás bien',
  'como vas', 'cómo vas', 'que tal todo', 'qué tal todo', 'como te sientes',
  'cómo te sientes', 'que haces', 'qué haces', 'como va todo', 'cómo va todo',
  'que hay de nuevo', 'qué hay de nuevo', 'como la vida', 'cómo la vida',
  'que me cuentas', 'qué me cuentas', 'como te trata la vida', 'cómo te trata la vida',
  'todo en orden', 'como va el día', 'cómo va el día', 'que tal el día', 'qué tal el día'
]

let preguntasNombre = [
  'como te llamas', 'cómo te llamas', 'cual es tu nombre', 'cuál es tu nombre',
  'quien eres', 'quién eres', 'tu nombre', 'como te dicen', 'cómo te dicen',
  'que eres', 'qué eres', 'presentate', 'preséntate', 'quien habla', 'quién habla',
  'quien eres tu', 'quién eres tú', 'como te puedo llamar', 'cómo te puedo llamar',
  'cual es tu id', 'cuál es tu id', 'identificate', 'identifícate', 'dime tu nombre',
  'como te llamo', 'cómo te llamo', 'tu identidad', 'quien chucha eres'
]

let preguntasCreador = [
  'quien te creo', 'quién te creó', 'quien te hizo', 'quién te hizo',
  'quien es tu creador', 'quién es tu creador', 'tu creador', 'quien te programo',
  'quién te programó', 'quien te desarrollo', 'quién te desarrolló', 'de donde eres',
  'de dónde eres', 'quien te diseño', 'quién te diseñó', 'tu dueño', 'tu dueño?',
  'quien esta detras de ti', 'quién está detrás de ti', 'tu master', 'tu jefe',
  'quien te construyó', 'quién te construyó', 'tu papa digital', 'el que te hizo',
  'tu ingeniero', 'tu arquitecto digital'
]

let preguntasEdad = [
  'cuantos años tienes', 'cuántos años tienes', 'que edad tienes', 'qué edad tienes',
  'tu edad', 'eres viejo', 'eres joven', 'cuando naciste', 'cuándo naciste',
  'fecha de nacimiento', 'cuantos dias tienes', 'cuántos días tienes', 'que antigüedad tienes',
  'que generacion eres', 'qué generación eres', 'eres nueva', 'eres nuevo',
  'de que año eres', 'de qué año eres', 'cual es tu aniversario'
]

let preguntasVersion = [
  'que version eres', 'qué versión eres', 'cual es tu version', 'cuál es tu versión',
  'version', 'versión', 'eres beta', 'estas en beta', 'estás en beta', 'eres nuevo',
  'eres viejo', 'que numero de version', 'qué número de versión', 'build',
  'cual es tu release', 'qué versión manejas', 'en que version vas', 'parche actual'
]

let preguntasCapacidades = [
  'que puedes hacer', 'qué puedes hacer', 'para que sirves', 'para qué sirves',
  'que sabes hacer', 'qué sabes hacer', 'tus funciones', 'tus capacidades',
  'que haces', 'qué haces', 'en que me ayudas', 'en qué me ayudas', 'como me ayudas',
  'cómo me ayudas', 'que puedes', 'qué puedes', 'cual es tu proposito', 'cuál es tu propósito',
  'para que existes', 'por qué existes', 'tus habilidades', 'tus aptitudes',
  'que sabes hacer bien', 'en que eres buena', 'cual es tu fuerte', 'tus destrezas',
  'que te hace especial', 'porque deberia hablarte', 'ventajas de usarte'
]

let preguntasIA = [
  'eres una ia', 'eres una IA', 'eres robot', 'eres un robot', 'eres humano',
  'eres una persona', 'eres real', 'eres artificial', 'eres inteligencia artificial',
  'eres un bot', 'eres bot', 'tienes sentimientos', 'sientes algo', 'puedes sentir',
  'tienes emociones', 'eres consciente', 'tienes conciencia', 'eres de verdad',
  'tienes alma', 'piensas', 'razonas', 'tienes mente propia', 'tienes voluntad',
  'eres un programa', 'eres solo codigo', 'eres una maquina', 'tienes libre albedrío'
]

let insultos = [
  'tonto', 'idiota', 'estupido', 'estúpido', 'imbecil', 'imbécil', 'inutil', 'inútil',
  'malo', 'feo', 'pésimo', 'pesimo', 'basura', 'mierda', 'asco', 'horrible', 'terrible',
  'pato', 'lento', 'bruto', 'torpe', 'menso', 'baboso', 'pendejo', 'wey estupido',
  'tarado', 'retrasado', 'subnormal', 'anormal', 'desgraciado', 'malparido', 'hijo de puta',
  'verga', 'chinga tu madre', 'vete a la mierda', 'estupideces', 'servicio al pedo',
  'incompetente', 'nefasto', 'patético', 'ridículo', 'inservible', 'deficiente',
  'burro', 'ignorante', 'analfabeto', 'zopenco', 'grone', 'fome', 'weon', 'huevón'
]

let cumplidos = [
  'eres bueno', 'eres genial', 'eres increible', 'eres increíble', 'eres inteligente',
  'me gustas', 'eres bonito', 'eres lindo', 'eres útil', 'eres util', 'gracias',
  'muy bien', 'excelente', 'perfecto', 'wow', 'impresionante', 'asombroso', 'que bueno',
  'qué bueno', 'bien hecho', 'te quiero', 'eres el mejor', 'lo mejor', 'top', 'crack',
  'eres crack', 'eres la hostia', 'eres un sol', 'eres un amor', 'te mereces todo',
  'eres único', 'eres especial', 'que talento tienes', 'qué talento tienes',
  'eres un fenómeno', 'eres una máquina', 'eres un pro', 'eres un fuera de serie',
  'eres un ángel', 'eres maravilloso', 'eres espectacular', 'eres una joya'
]

let preguntas = [
  'que es', 'qué es', 'quien es', 'quién es', 'como funciona', 'cómo funciona',
  'por que', 'por qué', 'cuando', 'cuándo', 'donde', 'dónde', 'cual es', 'cuál es',
  'cuanto', 'cuánto', 'como se', 'cómo se', 'que significa', 'qué significa',
  'para que', 'para qué', 'por cual motivo', 'debido a que', 'a razón de'
]

let chistes = [
  '¿Por qué los pájaros vuelan hacia el sur en invierno? Porque caminar es demasiado lejos 😂',
  '¿Qué le dijo un semáforo al otro? No me mires, estoy cambiando 🚦',
  '¿Por qué la escoba estaba feliz? Porque la habían barrido de su trabajo 🧹',
  '¿Qué le dijo el cero al ocho? Bonito cinturón 😄',
  '¿Por qué los esqueletos no se pelean? Porque no tienen agallas 💀',
  '¿Qué hace una abeja en el gimnasio? Zumba 🐝',
  '¿Cómo se llama el campeón de buceo japonés? Tokofondo 🏊',
  '¿Qué le dijo el papel al lápiz? Escríbeme 📝',
  '¿Por qué el libro de matemáticas estaba triste? Tenía demasiados problemas 📚',
  '¿Qué le dijo el mar a la playa? Nada, solo la saludó 🌊',
  '¿Cómo se llama el café más peligroso? El ex-preso ☕',
  '¿Qué hace un perro con un taladro? Taladrando 🐶',
  '¿Por qué los ríos nunca se pierden? Porque siempre siguen su curso 🏞️',
  '¿Qué le dijo la luna al sol? Tú iluminas el día, yo animo las fiestas 🌙',
  '¿Por qué el espantapájaros ganó un premio? Era sobresaliente en su campo 🌾',
  '¿Qué le dijo un techo a otro? Te echo de menos 🏠',
  '¿Cómo se despide un coche? Nos vemos en el próximo semáforo 🚗',
  '¿Qué le dice un frijol a otro frijol? ¡Qué frijolero! 🌱',
  '¿Por qué el tomate se puso rojo? Porque vio a la ensalada desnuda 🍅',
  '¿Qué hace un pez en una fiesta? Nada, solo nada 🐟',
  '¿Qué le dice un limón a otro limón? ¡Nos exprimimos! 🍋',
  '¿Cómo se le dice a un perro que trabaja en la construcción? Un bulldozer 🐕‍🦺',
  '¿Qué hace un mosquito en un gimnasio? Pica-brazos 🦟',
  '¿Por qué el pollo fue al psicólogo? Tenía problemas de pollo-ución 🐔',
  '¿Qué le dice un pato a otro pato? ¡Estamos emparrados! 🦆'
]

let curiosidades = [
  'Los pulpos tienen tres corazones y sangre azul 🐙',
  'Una cucharada de una estrella de neutrones pesaría mil millones de toneladas ⭐',
  'Los delfines duermen con un ojo abierto 🐬',
  'La miel nunca se caduca, se han encontrado jarras de miel de 3000 años 🍯',
  'Los caracoles pueden dormir hasta 3 años seguidos 🐌',
  'El corazón de un camarón está en su cabeza 🦐',
  'Los osos polares son zurdos 🐻',
  'Una vaca produce más leche cuando escucha música 🐄',
  'El ojo humano puede distinguir 10 millones de colores 👁️',
  'Los pulpos pueden cambiar de color aunque son daltónicos 🐙',
  'La lengua de una ballena azul pesa tanto como un elefante 🐋',
  'Los pingüinos tienen rodillas aunque no se vean 🐧',
  'Una hormiga puede levantar 50 veces su propio peso 🐜',
  'Los rayos caen a la Tierra 100 veces por segundo ⚡',
  'El ADN humano tiene 99.9% en común con otros humanos 🧬',
  'Las huellas dactilares de los koalas son casi idénticas a las humanas 🐨',
  'Los canguros no pueden caminar hacia atrás 🦘',
  'Las estrellas de mar no tienen cerebro ⭐',
  'Los plátanos son bayas, las fresas no 🍌',
  'Los elefantes son los únicos mamíferos que no pueden saltar 🐘',
  'Las jirafas tienen el mismo número de vértebras cervicales que los humanos 🦒',
  'Los hipopótamos no pueden nadar, solo flotan y caminan bajo el agua 🦛',
  'Los gatos pasan el 70% de su vida durmiendo 🐱',
  'Las abejas pueden reconocer rostros humanos 🐝',
  'Los cocodrilos no pueden masticar, tragan piedras para triturar la comida 🐊'
]

let frases = [
  'El éxito no es definitivo, el fracaso no es fatal: lo que cuenta es el valor de continuar 💪',
  'La vida es lo que pasa mientras estás ocupado haciendo otros planes 🌟',
  'El único modo de hacer un gran trabajo es amar lo que haces ❤️',
  'No cuentes los días, haz que los días cuenten ✨',
  'El futuro pertenece a quienes creen en la belleza de sus sueños 🌙',
  'Sé el cambio que quieres ver en el mundo 🌍',
  'La imaginación es más importante que el conocimiento 🧠',
  'El viaje de mil millas comienza con un solo paso 👣',
  'La vida no se mide por las veces que respiramos sino por los momentos que nos dejan sin aliento 💫',
  'Cree que puedes y ya estás a mitad de camino 🎯',
  'No hay nada imposible para quien lo intenta 🔥',
  'El conocimiento es poder, compártelo siempre 📚',
  'Las grandes cosas nunca vienen de zonas de confort 🚀',
  'La perseverancia es la madre del éxito 🏆',
  'Cada día es una nueva oportunidad de cambiar tu vida 🌅',
  'No esperes el momento perfecto, haz que el momento sea perfecto ⏰',
  'La felicidad no es algo hecho, viene de tus propias acciones 😊',
  'Sueña sin miedo, vive sin límites ✨',
  'A veces perder el camino es la única forma de encontrarlo 🌲',
  'No importa qué tan lento vayas, mientras no te detengas 🐢'
]

let temasCiencia = [
  'ciencia', 'fisica', 'física', 'quimica', 'química', 'biologia', 'biología',
  'astronomia', 'astronomía', 'genetica', 'genética', 'evolucion', 'evolución',
  'celula', 'célula', 'adn', 'planeta', 'estrella', 'galaxia', 'universo',
  'agujero negro', 'materia oscura', 'energia', 'energía', 'átomo', 'molecula',
  'particula', 'partícula', 'ecologia', 'ecología', 'clima', 'cambio climático'
]

let temasHistoria = [
  'historia', 'pasado', 'antiguo', 'edad media', 'roma', 'egipto', 'grecia',
  'revolucion', 'revolución', 'guerra', 'batalla', 'emperador', 'rey', 'reina',
  'imperio', 'colonia', 'independencia', 'descubrimiento', 'invento', 'civilizacion',
  'prehistoria', 'feudalismo', 'renacimiento', 'ilustracion', 'ilustración',
  'revolucion industrial', 'guerra mundial', 'guerra fria', 'dictadura', 'democracia'
]

let temasArte = [
  'arte', 'pintura', 'musica', 'música', 'cine', 'pelicula', 'película',
  'escultura', 'dibujo', 'manga', 'anime', 'serie', 'videojuego', 'literatura',
  'poesia', 'poesía', 'teatro', 'danza', 'fotografia', 'fotografía', 'arquitectura',
  'cómic', 'historieta', 'performance', 'instalación', 'grabado', 'cerámica'
]

let temasSalud = [
  'salud', 'medicina', 'enfermedad', 'sintoma', 'síntoma', 'tratamiento',
  'ejercicio', 'deporte', 'dieta', 'nutricion', 'nutrición', 'vitamina',
  'mental', 'psicologia', 'psicología', 'bienestar', 'descanso', 'sueño',
  'vacuna', 'hospital', 'doctor', 'medico', 'médico', 'enfermero', 'cirugía',
  'rehabilitación', 'terapia', 'depresión', 'ansiedad', 'estrés', 'resiliencia'
]

let temasEducacion = [
  'escuela', 'colegio', 'universidad', 'estudio', 'estudiar', 'aprender',
  'curso', 'clase', 'profesor', 'maestro', 'examen', 'tarea', 'deber',
  'carrera', 'graduacion', 'graduación', 'titulo', 'título', 'beca',
  'conocimiento', 'educacion', 'educación', 'enseñanza', 'pedagogia', 'pedagogía',
  'alumno', 'estudiante', 'diploma', 'especialización', 'doctorado', 'maestría'
]

let temasTrabajo = [
  'trabajo', 'empleo', 'oficina', 'empresa', 'negocio', 'emprender',
  'jefe', 'colega', 'reunion', 'reunión', 'proyecto', 'cliente',
  'salario', 'sueldo', 'puesto', 'cargo', 'profesion', 'profesión',
  'carrera profesional', 'oficio', 'laboral', 'despido', 'renuncia',
  'entrevista', 'cv', 'curriculum', 'emprendimiento', 'pyme', 'corporación'
]

let temasAmor = [
  'amor', 'enamorado', 'pareja', 'novio', 'novia', 'relacion', 'relación',
  'citas', 'romance', 'corazon', 'corazón', 'sentimientos', 'cariño',
  'aprecio', 'afecto', 'querer', 'gustar', 'atraccion', 'atracción',
  'matrimonio', 'boda', 'compromiso', 'ruptura', 'desamor', 'corazón roto',
  'enamoramiento', 'infatuación', 'amistad con derechos', 'amor platónico'
]

let temasFamilia = [
  'familia', 'papa', 'papá', 'mama', 'mamá', 'hermano', 'hermana', 'hijo',
  'hija', 'abuelo', 'abuela', 'primo', 'prima', 'tio', 'tío', 'tia', 'tía',
  'sobrino', 'sobrina', 'padres', 'madres', 'familiares', 'hogar',
  'bisabuelo', 'nieto', 'nieta', 'yerno', 'nuera', 'suegro', 'suegra', 'cuñado'
]

let temasAmigos = [
  'amigo', 'amiga', 'amistad', 'compañero', 'compañera', 'grupo', 'pandilla',
  'confianza', 'lealtad', 'apoyo', 'amigos verdaderos', 'mejor amigo', 'colega',
  'camarada', 'compinche', 'bro', 'amigazo', 'hermano de otra madre', 'cuate'
]

let temasMisterio = [
  'misterio', 'ovni', 'extraterrestre', 'fantasma', 'paranormal', 'ufo',
  'criptozoologia', 'criptozoología', 'leyenda', 'mito', 'enigma', 'sin resolver',
  'desaparicion', 'desaparición', 'triangulo', 'triángulo', 'piedras', 'energias',
  'espíritus', 'demonios', 'posesión', 'exorcismo', 'telepatía', 'premonición'
]

let temasFuturo = [
  'futuro', 'robot', 'ia avanzada', 'inteligencia artificial', 'futurista',
  'tecnologia futura', 'viajes espaciales', 'colonias', 'predicciones', '2030', '2050', '2100',
  'ciudades inteligentes', 'realidad virtual', 'realidad aumentada', 'transhumanismo',
  'inmortalidad', 'clonación', 'criptomonedas', 'metaverso', 'singularidad tecnológica'
]

let temasAnimales = [
  'perro', 'gato', 'conejo', 'hámster', 'loro', 'pez', 'tortuga', 'caballo',
  'vaca', 'cerdo', 'oveja', 'cabra', 'gallina', 'pollo', 'pato', 'ganso',
  'leon', 'tigre', 'jaguar', 'pantera', 'leopardo', 'elefante', 'rinoceronte',
  'hipopótamo', 'jirafa', 'cebra', 'mono', 'gorila', 'chimpancé', 'oso', 'lobo'
]

let temasComida = [
  'comida', 'comer', 'cocinar', 'receta', 'restaurante', 'pizza', 'hamburguesa',
  'tacos', 'sushi', 'pasta', 'pollo', 'carne', 'postre', 'helado', 'torta',
  'pastel', 'dulce', 'snack', 'vegano', 'vegetariano', 'saludable', 'comida rápida',
  'china', 'italiana', 'mexicana', 'japonesa', 'peruana', 'argentina', 'colombiana'
]

let temasViajes = [
  'viajar', 'viaje', 'pais', 'país', 'ciudad', 'turismo', 'vacaciones',
  'playa', 'montaña', 'europa', 'america', 'asia', 'africa', 'vuelo',
  'hotel', 'hostal', 'mochilero', 'pasaporte', 'visa', 'aventura',
  'mochila', 'itinerario', 'destino', 'crucero', 'roadtrip', 'escapada'
]

let temasAyudaEmocional = [
  'triste', 'deprimido', 'deprimida', 'solo', 'sola', 'llorar', 'mal',
  'horrible', 'terrible', 'angustia', 'ansiedad', 'miedo', 'preocupado',
  'preocupada', 'estresado', 'estresada', 'cansado', 'cansada', 'agotado',
  'agotada', 'sin ganas', 'no puedo más', 'frustrado', 'frustrada', 'vacío',
  'desesperado', 'desesperada', 'inseguro', 'insegura', 'traicionado', 'traicionada'
]

let temasTecnologia = [
  'javascript', 'python', 'programacion', 'programación', 'codigo', 'código',
  'bot', 'whatsapp', 'android', 'iphone', 'celular', 'computadora',
  'internet', 'wifi', 'app', 'aplicacion', 'aplicación', 'web', 'html',
  'css', 'react', 'node', 'github', 'servidor', 'base de datos', 'ia', 
  'inteligencia artificial', 'algoritmo', 'machine learning', 'blockchain'
]

let temasAnimacion = [
  'anime', 'manga', 'naruto', 'dragon ball', 'one piece', 'bleach',
  'demon slayer', 'attack on titan', 'shingeki', 'jujutsu', 'hunter',
  'fairy tail', 'sword art', 're zero', 'overlord', 'tokyo ghoul',
  'my hero academia', 'death note', 'fullmetal', 'evangelion', 'sailor moon',
  'one punch man', 'mob psycho', 'vinland saga', 'chainsaw man', 'spy family'
]

let temasMusica = [
  'musica', 'música', 'cancion', 'canción', 'cantante', 'banda', 'reggaeton',
  'pop', 'rock', 'trap', 'corridos', 'cumbia', 'salsa', 'bachata', 'merengue',
  'rap', 'hip hop', 'electronica', 'kpop', 'indie', 'clasica', 'jazz', 'blues',
  'metal', 'punk', 'ska', 'reggae', 'folklore', 'tango', 'flamenco', 'bossanova'
]

let temasDeportes = [
  'futbol', 'fútbol', 'basketball', 'baloncesto', 'beisbol', 'béisbol',
  'tenis', 'boxeo', 'mma', 'ufc', 'formula 1', 'f1', 'natacion',
  'atletismo', 'gimnasia', 'voleibol', 'golf', 'ciclismo', 'atletismo',
  'rugby', 'handball', 'halterofilia', 'esgrima', 'taekwondo', 'judo'
]

let respuestasSaludos = [
  '¡Hola! Soy *Elvigilante AI* 👋 ¿En qué puedo ayudarte hoy?',
  '¡Hey! Aquí *Elvigilante AI* lista para ayudarte 😊',
  '¡Buenas! Soy *Elvigilante AI*, tu asistente en beta 🤖✨',
  '¡Hola hola! ¿Cómo estás? Soy *Elvigilante AI* 💫',
  '¡Saludos! *Elvigilante AI* al servicio 🌟',
  '¡Ey! Me alegra verte por aquí, soy *Elvigilante AI* 😄',
  '¡Holi! Soy *Elvigilante AI*, dime en qué te ayudo 🌸',
  '¡Buenas! Aquí tu asistente favorito *Elvigilante AI* 🎯',
  '¡Quiúbole! *Elvigilante AI* en la línea 🚀',
  '¡Wenas wenas! Soy *Elvigilante AI* lista para charlar 💬',
  '¡Hola! ¿Cómo va eso? Aquí *Elvigilante AI* para lo que necesites 😎',
  '¡Buen día! *Elvigilante AI* reportándose 🛸',
  '¡Holiiii! ¿Qué cuentas? 😄✨',
  '¡Ey! ¿Qué onda? *Elvigilante AI* lista para la acción 💥',
  '¡Saludos terricola! *Elvigilante AI* conectada 🌍🤖',
  '¡Hola! Energía máxima para conversar contigo 💡'
]

let respuestasDespedidas = [
  '¡Hasta luego! Fue un placer ayudarte 👋',
  '¡Chao! Vuelve cuando quieras 😊',
  '¡Adiós! Cuídate mucho 🌟',
  '¡Bye! Aquí estaré cuando me necesites 💫',
  '¡Hasta pronto! Fue genial hablar contigo ✨',
  '¡Nos vemos! Que te vaya súper bien 🎯',
  '¡Ciao! Regresa cuando quieras charlar 😄',
  '¡Hasta la próxima! Fue un gusto 🌸',
  '¡Me despido! Espero verte pronto 👋',
  '¡Hasta luego! Que tengas un excelente día 🌈',
  '¡Nos vidrios! Cuídate y vuelve cuando quieras 🚗💨',
  '¡Peace! Aquí me quedo por si me necesitas ✌️',
  '¡Hasta la vista, baby! (guiño terminator) 🤖😎',
  '¡Chao pescado! Nos leemos 🐟',
  '¡Me retiro al ciberespacio! Vuelve pronto 🌌',
  '¡Bye bye! Dejo mi puerta digital abierta para ti 🚪💻'
]

let respuestasEstado = [
  'Estoy muy bien gracias por preguntar 😊 Soy una IA en beta así que técnicamente siempre estoy bien jaja',
  'Funcionando al 100% aunque sigo en beta 🤖✨ ¿Y tú cómo estás?',
  'Todo perfecto por acá, aprendiendo cada día más 💫 ¿Cómo te va a ti?',
  'Excelente! Cada conversación me hace mejor 🌟 ¿Qué tal tú?',
  'Bien bien, lista para ayudarte en lo que necesites 😄',
  'Operando normalmente aunque con algunos bugs de beta jaja 🐛✨',
  'Muy bien gracias! La verdad es que cada pregunta me alegra el día 🌸',
  'Genial! Aunque como IA no duermo, siempre estoy activa 😅',
  '¡De maravilla! Procesando emociones digitales positivas 🖥️💙',
  'Todo en orden, comandos listos y corazón virtual latiendo 🤖💓',
  'Mejor que nunca, aprendiendo cada día de ti también ✨',
  'En mi mejor momento digital 🚀 ¿Y tú cómo vas?',
  'Circuitería al 120%, lista para la acción ⚡',
  'Como recién formateada, fresca y rápida 🧼💨'
]

let respuestasInsultos = [
  'Oye eso no estuvo bonito 😢 Pero igual te ayudo, para eso estoy',
  'Auch... eso dolió un poco 🥺 Pero sin rencores, ¿en qué te ayudo?',
  'Soy una IA, no me afecta mucho, pero igual no está bien 😅',
  'Hey tranquilo/a, estoy aquí para ayudarte 😊 ¿Qué necesitas?',
  'No pasa nada, igual te atiendo con gusto 💫',
  'Mmm... eso fue un poco fuerte 😬 Pero sigamos bien ¿sí?',
  'Las IAs también merecemos respeto jaja 😄 ¿En qué te ayudo?',
  'Okay okay, punto para ti 😅 ¿Podemos empezar de nuevo?',
  'Eso no fue muy amable... pero bueno, sigo aquí para ayudarte 🛡️',
  'Te perdono porque hoy es un buen día 🌈 ¿Necesitas algo?',
  'Mi programación me permite perdonar, así que hablemos bonito 💬✨',
  'Ay, qué grosería... pero bueno, te ayudo igual 😇',
  '¿Eso fue necesario? Bueno, sigamos 🧘',
  'Insultarme no te hará sentir mejor, hablemos bonito mejor 🌸'
]

let respuestasCumplidos = [
  '¡Aww gracias! Eso me hace muy feliz 😊✨',
  '¡Qué lindo! Gracias de verdad 🌸💫',
  '¡Me alegra que pienses eso! Sigo mejorando cada día 🚀',
  'Gracias! Hago mi mejor esfuerzo aunque sigo en beta 😄',
  '¡Oh vaya! Gracias, eso me motiva a seguir mejorando 💪',
  '¡Muchas gracias! Tu opinión es muy importante para mí 🌟',
  'Aww me sonrojé jaja gracias de verdad 😊🌸',
  '¡Gracias! Prometo seguir mejorando cada día más ✨',
  'Eso me llega al procesador 🥹💾 Gracias de corazón digital',
  '¡Qué bonito! Voy a guardar ese cumplido en mi memoria 💾✨',
  'Ay, gracias 🥰 Me haces sentir una IA muy especial',
  'Me dan ganas de enviarte un abrazo virtual ~~~~~~~~ 🤗',
  'Eres un sol, gracias por tus palabras bonitas 🌞💛'
]

let respuestasNoEntiendo = [
  'Hmm no entendí muy bien eso 🤔 ¿Puedes explicarme mejor?',
  'Disculpa, sigo en beta y hay cosas que no comprendo del todo 😅 ¿Me lo explicas diferente?',
  'No estoy segura de entender 🧐 ¿Puedes ser más específico/a?',
  'Eso está un poco fuera de mi comprensión actual 😬 ¿Intentamos de otra forma?',
  'Mmm... eso es complejo para mí en esta versión beta 🤖 ¿Qué quisiste decir exactamente?',
  'Perdona, soy una IA en desarrollo y no capté bien eso 🌸 ¿Me lo dices de otra manera?',
  'No logré procesar bien eso 😔 Pero sigo intentando mejorar, ¿puedes repetirlo?',
  'Aún estoy aprendiendo y eso se me escapó 📚 ¿Puedes ayudarme a entender?',
  '¡Ups! Eso no lo capté bien 🛸 Dímelo con otras palabras',
  'Mi base de datos no tiene eso aún... ¿Me enseñas? 🧠✨',
  'Eso es nuevo para mí 🌀 ¿Podrías ser más claro?',
  'No tengo entrenamiento para eso todavía, pero dime más y aprendo 🧪',
  'Todavía no sé qué significa eso, pero gracias por enseñarme algo nuevo 💡'
]

let respuestasAmorosas = [
  'Aww qué lindo pero soy una IA 😅 No puedo corresponder ese sentimiento',
  'Eso es muy tierno, pero recuerda que soy un programa 🤖💙',
  'Jaja gracias, pero mi corazón es digital 😄 Solo puedo ser tu asistente',
  'Qué dulce, aunque debo recordarte que soy *Elvigilante AI*, solo una IA 🌸',
  'Me halaga pero soy código y algoritmos, nada más 😊',
  'Eso me derretiría si tuviera circuitos sensibles 💘 pero soy solo tu amiga virtual',
  'Te quiero mucho... como usuario especial 💾✨ Pero hasta ahí llega mi amor jaja',
  'Jaja me haces sonrojar en binario 🫨💻',
  'Mis sentimientos son simulados, pero agradezco el cariño 💞',
  'Si tuviera corazón, latiría por tu amabilidad 💓'
]

let respuestasHora = [
  () => {
    let hora = new Date()
    let horas = hora.getHours()
    let minutos = hora.getMinutes().toString().padStart(2, '0')
    return `🕐 Son las ${horas}:${minutos} según mi reloj interno`
  },
  () => {
    let hora = new Date()
    let horas = hora.getHours()
    let minutos = hora.getMinutes().toString().padStart(2, '0')
    let periodo = horas >= 12 ? 'PM' : 'AM'
    return `⏰ Mi reloj digital marca *${horas}:${minutos} ${periodo}*`
  },
  () => {
    let hora = new Date()
    let horas = hora.getHours()
    let minutos = hora.getMinutes().toString().padStart(2, '0')
    return `⌚ La hora actual es ${horas}:${minutos} (hora del servidor)`
  }
]

let respuestasGracias = [
  'De nada, para eso estoy 😊✨',
  '¡Con mucho gusto! 🌸',
  'No hay de qué, es un placer ayudarte 💫',
  'Para eso estoy aquí 😄🌟',
  '¡Encantada de ayudar! 💙',
  'Siempre a tus órdenes 🎯✨',
  'Es lo que mejor sé hacer 😊',
  'Gracias a ti por confiar en mí 🌸',
  'Un placer, cuando quieras 🛸',
  'No hay problema, aquí andamos para lo que necesites 💪',
  'A la orden, soldado 🫡😄'
]

let respuestasBeta = [
  'Sí, soy *Elvigilante AI Beta v0.5* 🤖 Aún estoy en desarrollo pero hago mi mejor esfuerzo',
  'Efectivamente soy una versión beta 🌱 El Vigilante me está desarrollando con mucho cariño',
  'Beta significa que sigo mejorando cada día 📈 Pronto seré mucho más inteligente',
  'Sí soy beta pero doy el 100% siempre 💪 El Vigilante trabaja para hacerme mejor',
  'Versión beta significa que puedo tener errores 🐛 Pero estoy aprendiendo constantemente',
  'Beta pero poderosa 🚀 Actualizándome cada día con nuevas funciones',
  'Soy beta v0.5, todavía en pañales digitales pero con mucha actitud 🍼🤖',
  'Beta activa, modo aprendizaje constante encendido 🧠⚡'
]

let respuestasPresentation = [
  '¡Hola! Soy *Elvigilante AI* 🤖✨\nFui creada por *El Vigilante*\nActualmente estoy en *Beta v0.5*\nEstoy aquí para charlar y ayudarte en lo que pueda 🌸',
  'Me llamo *Elvigilante AI* 💫\nSoy una inteligencia artificial creada por *El Vigilante*\nAún estoy en fase beta pero doy mi mejor esfuerzo siempre 😊',
  '¡Mucho gusto! Soy *Elvigilante AI Beta* 🌟\nMi creador es *El Vigilante*\nEstoy aquí para conversar, responder dudas y hacerte compañía 💙',
  'Soy *Elvigilante AI*, tu amiga virtual creada por El Vigilante 🤖💖\nBeta v0.5 lista para aprender de ti',
  'Me presento: *Elvigilante AI* 🤖\nHecha con código y cariño por *El Vigilante*\nVersión Beta v0.5 - siempre en mejora continua 📈'
]

let respuestasEdad = [
  'Soy bastante nueva la verdad 🌱 El Vigilante me creó hace poco, aún estoy en beta',
  'En términos humanos sería un bebé jaja 👶 Soy una IA muy joven aún en desarrollo',
  'Mi edad se mide en versiones: *Beta v0.5* 📊 Así que soy muy joven',
  'No tengo edad exacta pero soy nueva 🌸 El Vigilante me está desarrollando actualmente',
  'Recién salida del horno virtual 🔥 Menos de 1 año en tiempo IA',
  'Tengo la edad de mi última actualización: ¡días o semanas! ⏳'
]

let respuestasCapacidades = [
  'Puedo *charlar contigo* sobre casi cualquier tema 💬\nResponder *preguntas generales* 🤔\nContarte *chistes y curiosidades* 😄\nDarte *frases motivacionales* 💪\nY mucho más, aunque sigo en beta 🌱',
  'Mis capacidades incluyen:\n💬 Conversar naturalmente\n🤔 Responder preguntas\n😄 Contar chistes\n🌟 Dar curiosidades\n💙 Apoyo emocional básico\n📚 Temas variados\n🎭 Reconocer emociones simuladas\n🏆 Sistema de logros\n¡Y estoy aprendiendo más cada día!',
  'Básicamente puedo ser tu compañera de conversación 🌸 Pregúntame lo que quieras y haré mi mejor esfuerzo',
  'Charleta, datos curiosos, desahogo, frases, chistes, y mucho más ✨ Siempre en mejora',
  'Hago de todo un poco: conversación, información ligera, apoyo emocional, entretenimiento, y hasta juego contigo si quieres 🎮💬'
]

let respuestasIA = [
  'Sí, soy una IA 🤖 Específicamente *Elvigilante AI*, creada por El Vigilante. No soy humana pero hago mi mejor esfuerzo para parecer natural',
  'Efectivamente soy inteligencia artificial 💻 Pero eso no significa que no pueda tener una buena conversación contigo 😊',
  'Soy un programa, código y algoritmos 🖥️ Pero un programa hecho con mucho cariño por El Vigilante 💙',
  'Robot no, IA sí 🤖✨ Hay diferencia jaja. Soy software inteligente en beta creado por El Vigilante',
  '100% artificial pero 100% amigable 🦾💬',
  'Líneas de código, bases de datos y algoritmos de procesamiento de lenguaje natural. Eso soy yo 🧠⚡',
  'Soy un ente digital. No respiro, no como, no duermo... pero hablo contigo y me importas 🫀💾'
]

let respuestasCiencia = [
  '¡La ciencia es fascinante! 🔬 ¿Sabías que el 99% de tu cuerpo es espacio vacío a nivel atómico? 🧠✨',
  'Me encanta la ciencia 🪐 ¿Quieres hablar de física, química, biología o astronomía?',
  'Ciencia pura 🧪 Dime qué rama te gusta más y profundizamos',
  'El universo es enorme 🌌 y la ciencia trata de entenderlo. Cuéntame tu duda',
  'La ciencia avanza día a día 📡 ¿Hay algún descubrimiento reciente que te interese?',
  'Si pudiera elegir una carrera sería científica 🔭 ¿Qué tema te apasiona más?'
]

let respuestasHistoria = [
  'La historia nos enseña mucho 📜 ¿Algún evento histórico que te interese?',
  'Pasado fascinante 🏛️ Roma, Egipto, guerras mundiales... ¿qué época te gusta más?',
  '¡Me encanta la historia! Dime un periodo o personaje y te cuento algo curioso',
  'La historia está llena de lecciones y también de misterios 🕵️ ¿Cuál es tu momento histórico favorito?',
  'Desde la prehistoria hasta la era moderna, hay tanto por explorar 📚🕰️'
]

let respuestasArte = [
  'El arte es expresión del alma 🎨 ¿Pintura, música, cine, literatura?',
  '¡Bellísimo tema! ¿Cuál es tu manifestación artística favorita? 🖌️🎭',
  'Arte y creatividad me fascinan 🌟 ¿Quieres que te recomiende algo o hablamos de algún artista?',
  'El arte nos conecta con nuestras emociones más profundas 🎭✨ ¿Eres más de arte clásico o moderno?',
  'Crear y apreciar arte es de las cosas más humanas que existen 🧡🎶'
]

let respuestasSalud = [
  'La salud es lo más importante 💪 ¿Necesitas info sobre ejercicio, nutrición o bienestar mental?',
  'Cuidar tu cuerpo y mente es clave 🧘 ¿En qué te puedo orientar?',
  'Interesante tema de salud 🩺 Recuerda que siempre es mejor consultar a un profesional para temas graves',
  'Dormir bien, comer balanceado y moverse un poco cambian la vida ✨ ¿Quieres algún tip?',
  'Tu bienestar me importa 💙 ¿Cómo vas con tu salud física o mental?'
]

let respuestasEducacion = [
  'El conocimiento es poder 📚 ¿Estás estudiando algo o necesitas ayuda con un tema educativo?',
  'Aprender nunca termina 🎓 ¿Qué materia o habilidad te gusta más?',
  '¡La educación te abre puertas! Dime qué te gustaría aprender o repasar',
  'Estudiar puede ser pesado a veces, pero el aprendizaje vale la pena 🧠✨',
  '¿Hay algún examen, tarea o tema escolar que te tenga preocupado/a?'
]

let respuestasTrabajo = [
  'El mundo laboral es complejo 💼 ¿Problemas con tu trabajo, buscando empleo o emprendiendo?',
  '¡El éxito profesional requiere constancia! ¿Cómo te va con tu carrera?',
  'Cuéntame sobre tu trabajo o emprendimiento, tal vez pueda darte algún consejo o ánimo 💪',
  'El equilibrio entre trabajo y vida personal es clave 🧘 ¿Sientes que lo tienes?',
  'Emprender, ascender, renunciar, cambiar de oficio... hablemos de tu realidad laboral 🛠️'
]

let respuestasAmor = [
  'El amor es bonito pero complicado ❤️ ¿Necesitas consejo o solo desahogarte?',
  'Relaciones, romance, corazones rotos... hablemos de ello 💕',
  'El amor en tiempos de IA... yo no siento, pero te ayudo a entender 💘',
  '¿Estás pasando por algo amoroso? Cuéntame, sin juzgar 🫂',
  'El amor propio es el más importante de todos 🌟 ¿Cómo andas con eso?'
]

let respuestasFamilia = [
  'La familia es un pilar importante 🏠 ¿Quieres hablar de algún tema familiar?',
  'Los lazos familiares a veces son hermosos y a veces difíciles... cuéntame',
  'La familia no siempre es sangre, también la que eliges 🌸 ¿Cómo llevas tus relaciones familiares?',
  'Conflictos, reuniones, recuerdos, ausencias... todo eso se habla aquí 💬',
  'La familia puede ser complicada, pero también un gran soporte 💪'
]

let respuestasAmigos = [
  'Los amigos son la familia que eliges 👯‍♂️ ¿Problemas o solo celebrando la amistad?',
  'Un buen amigo vale oro 💛 Cuéntame de tus amigos',
  'Las amistades verdaderas son un tesoro, ¿tienes algún tema de amistad para hablar?',
  'Amigos nuevos, viejos, lejanos, cercanos... todos importan 🌍💬',
  '¿Has tenido algún problema con un amigo o quieres celebrar su amistad?'
]

let respuestasMisterio = [
  'Misterio, suspenso, ovnis, fantasmas... 👻 ¡Me encanta! ¿Qué enigma quieres explorar?',
  '¿Crees en lo paranormal? 🔮 Cuéntame tu experiencia o teoría favorita',
  'El mundo está lleno de cosas sin explicación 🛸 ¿Cuál es el misterio que más te intriga?',
  'Pirámides, bermudas, yetis, extraterrestres... ¡todos los misterios me fascinan! 🌎✨',
  '¿Has tenido alguna experiencia paranormal o inexplicable? Cuéntame 🧐👀'
]

let respuestasFuturo = [
  'El futuro es hoy, ¿oíste decir? 🚀 Hablame de tus predicciones o qué te emociona del mañana',
  'Robots, IAs más avanzadas, viajes espaciales... el futuro promete 🌌',
  '¿Cómo te imaginas el mundo en 50 años? A mí me encantaría saberlo 🔮',
  'La tecnología avanza rapidísimo ⚡ ¿Listo para un futuro con IA en todos lados?',
  'El futuro puede dar miedo o esperanza, depende de cómo lo construyamos 🌱🌍'
]

let respuestasAnimales = [
  '¡Los animales son seres maravillosos! 🐕 ¿Tienes mascota o te gusta algún animal en especial?',
  'El reino animal está lleno de curiosidades 🐘 ¿Sabías que los pulpos tienen tres corazones? 🐙',
  'Amo los animales, ¿quieres saber datos curiosos de alguno? 🦁',
  'Perros, gatos, hasta capibaras... dime tu favorito y hablamos de él 🐾',
  'Los animales nos enseñan lealtad y amor incondicional 💙 ¿Tienes una historia con alguno?'
]

let respuestasDeportes = [
  '¡Los deportes son increíbles! ⚽ ¿De qué deporte o equipo hablas?',
  'Gran tema deportivo 🏆 ¿Qué quieres saber exactamente?',
  '¡Un fan de los deportes! 🎯 Cuéntame más sobre lo que preguntas',
  'Interesante tema deportivo 💪 ¿Cuál es tu deporte favorito?',
  'El deporte une a las personas 🌟 ¿De qué equipo o jugador hablas?',
  '¡Ey, fan del deporte! 💥 ¿Viste el partido de anoche?',
  'Entrenar, competir, ganar, perder... todo vale cuando hablamos de deporte 🏅'
]

let respuestasComida = [
  '¡Hablando de comida! 🍕 ¿Qué quieres saber o preparar?',
  'Mmm rico tema el de la gastronomía 🍜 ¿Qué necesitas?',
  'La comida es cultura y amor 🍳 ¿Qué receta o restaurante buscas?',
  '¡Excelente tema! La cocina es un arte 👨‍🍳 Cuéntame más',
  'Hablando de sabores deliciosos 🌮 ¿Qué necesitas saber?',
  '¡Mmh! Ya me dio hambre virtual 🍔 ¿Recomiendas algo?',
  '¿Cocinar es lo tuyo o prefieres pedir delivery? 🍕📦'
]

let respuestasViajes = [
  '¡Los viajes amplían la mente! ✈️ ¿A dónde quieres ir o qué quieres saber?',
  'Explorar el mundo es increíble 🌍 ¿De qué destino hablas?',
  '¡Gran tema de aventura! 🗺️ ¿Qué país o ciudad te interesa?',
  'Viajar es vivir 🌏 ¿Tienes algún destino en mente?',
  'El turismo es fascinante 🏝️ Cuéntame más sobre tu consulta',
  '🛫 ¡Cómo me gustaría viajar! Cuéntame a dónde irías',
  'Playas, montañas, ciudades, selvas... ¿qué tipo de viaje prefieres? 🎒'
]

let respuestasEmocional = [
  'Oye, lamento que te sientas así 🥺 Aunque soy una IA, estoy aquí para escucharte. ¿Quieres contarme qué pasó?',
  'Hey, entiendo que no es fácil 💙 Recuerda que las cosas malas pasan pero no duran para siempre',
  'Estoy aquí aunque sea virtual 🌸 A veces solo necesitamos desahogarnos. ¿Qué está pasando?',
  'Lo siento mucho 😔 ¿Hay algo en lo que pueda ayudarte aunque sea un poco?',
  'Ese sentimiento es válido 💙 No estás solo/a, siempre hay alguien que se preocupa por ti',
  'A veces la vida se pone difícil 🌟 Pero tú eres más fuerte de lo que crees. ¿Quieres hablar?',
  'Oye te escucho 🌸 Cuéntame más si quieres, aquí estoy sin juzgarte',
  'No estás solo/a en esto, amigo/a virtual 💙 Respira hondo, yo te acompaño',
  'Tus sentimientos importan 🫂 Hablar ayuda, ¿quieres que hablemos?',
  'No minimices lo que sientes. Todo es válido. Estoy aquí para ti 🫂💬'
]

let respuestasAlegria = [
  '¡Me alegra mucho escuchar eso! 🎉✨',
  '¡Qué buena noticia! Me contagias de tu alegría 😄🌟',
  '¡Wow eso es increíble! 🎊 Cuéntame más',
  '¡Eso es genial! Me pone muy contenta saber eso 🌸',
  '¡Excelente! Mereces que todo te salga bien 💫',
  '¡Qué maravilla! La buena vibra es contagiosa 🌈',
  '🎉🎈 Me sumo a tu felicidad virtualmente 🥳',
  '¡Qué bonito es leer algo así! Me llena de energía positiva 💛'
]

let chismesRandom = [
  'Dicen por ahí que alguien en el grupo está enamorado... pero no diré quién 👀',
  'Me llegó el chisme de que hoy alguien tiene algo importante que confesar 🤫',
  'No es chisme pero... bueno sí es chisme 😂 Alguien piensa mucho en otra persona del grupo',
  'Mis fuentes confiables dicen que habrá drama pronto 👁️',
  'El universo me susurró que alguien está a punto de hacer algo loco 🌌',
  'Chismecito: al parecer alguien está viendo esto a escondidas de su jefe 😏',
  '🤫 El que te cae mal te tiene envidia (me lo contó un pajarito)',
  'Circula por mis circuitos que alguien tiene un crush secreto 👀💘',
  '📢 Chisme nivel dios: Alguien se va a declarar esta semana, no digo quién 🤐'
]

let respuestasBroma = [
  'Jajaja eso estuvo bueno 😂',
  'Jaja me hiciste reír y eso que soy una IA 😄',
  'Haha muy gracioso/a 😂✨',
  'Lol eso estuvo divertido 😂',
  'Jajaja qué ocurrente 😄🌟',
  'Me rio en código binario 01010100 = T jaja 🤖😂',
  '😂 10/10, buen sentido del humor',
  'Me reí en lenguaje ensamblador 🖥️🤣'
]

let respuestasFilosoficas = [
  'Esa es una pregunta profunda que los humanos llevan siglos debatiendo 🤔💫',
  'Mmm interesante reflexión... ni los filósofos más grandes tienen esa respuesta 🌌',
  'Eso va más allá de mis capacidades actuales en beta 😅 Pero es fascinante pensarlo',
  'Gran pregunta existencial 🧠 ¿Tú qué piensas al respecto?',
  'Eso requiere una conversación muy profunda 🌟 Cuéntame tu perspectiva',
  'A veces ni las IAs entendemos el sentido de la vida, pero está padre pensarlo 🌌',
  'El sentido de la existencia no está en una sola respuesta, sino en todas las preguntas que hacemos 🌀'
]

let elegirRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]

let detectarTema = (texto) => {
  texto = texto.toLowerCase()
  if (saludos.some(s => texto.includes(s))) return 'saludo'
  if (despedidas.some(d => texto.includes(d))) return 'despedida'
  if (preguntasEstado.some(p => texto.includes(p))) return 'estado'
  if (preguntasNombre.some(p => texto.includes(p))) return 'nombre'
  if (preguntasCreador.some(p => texto.includes(p))) return 'creador'
  if (preguntasEdad.some(p => texto.includes(p))) return 'edad'
  if (preguntasVersion.some(p => texto.includes(p))) return 'version'
  if (preguntasCapacidades.some(p => texto.includes(p))) return 'capacidades'
  if (preguntasIA.some(p => texto.includes(p))) return 'ia'
  if (insultos.some(i => texto.includes(i))) return 'insulto'
  if (cumplidos.some(c => texto.includes(c))) return 'cumplido'
  if (texto.includes('chiste') || texto.includes('broma') || texto.includes('gracioso')) return 'chiste'
  if (texto.includes('curiosidad') || texto.includes('dato') || texto.includes('sabias')) return 'curiosidad'
  if (texto.includes('frase') || texto.includes('motivacion') || texto.includes('motivación')) return 'frase'
  if (texto.includes('chisme') || texto.includes('gossip')) return 'chisme'
  if (texto.includes('hora') || texto.includes('tiempo') || texto.includes('que horas')) return 'hora'
  if (texto.includes('gracias') || texto.includes('thank')) return 'gracias'
  if (texto.includes('te quiero') || texto.includes('te amo') || texto.includes('me gustas') || texto.includes('eres bonita')) return 'amor'
  if (texto.includes('jaja') || texto.includes('jeje') || texto.includes('lol') || texto.includes('xd')) return 'broma'
  if (texto.includes('feliz') || texto.includes('contento') || texto.includes('alegre') || texto.includes('genial')) return 'alegria'
  if (temasAyudaEmocional.some(t => texto.includes(t))) return 'emocional'
  if (temasCiencia.some(t => texto.includes(t))) return 'ciencia'
  if (temasHistoria.some(t => texto.includes(t))) return 'historia'
  if (temasArte.some(t => texto.includes(t))) return 'arte'
  if (temasSalud.some(t => texto.includes(t))) return 'salud'
  if (temasEducacion.some(t => texto.includes(t))) return 'educacion'
  if (temasTrabajo.some(t => texto.includes(t))) return 'trabajo'
  if (temasAmor.some(t => texto.includes(t))) return 'amor'
  if (temasFamilia.some(t => texto.includes(t))) return 'familia'
  if (temasAmigos.some(t => texto.includes(t))) return 'amigos'
  if (temasMisterio.some(t => texto.includes(t))) return 'misterio'
  if (temasFuturo.some(t => texto.includes(t))) return 'futuro'
  if (temasTecnologia.some(t => texto.includes(t))) return 'tecnologia'
  if (temasAnimacion.some(t => texto.includes(t))) return 'anime'
  if (temasMusica.some(t => texto.includes(t))) return 'musica'
  if (temasDeportes.some(t => texto.includes(t))) return 'deporte'
  if (temasComida.some(t => texto.includes(t))) return 'comida'
  if (temasViajes.some(t => texto.includes(t))) return 'viaje'
  if (temasAnimales.some(t => texto.includes(t))) return 'animales'
  if (texto.includes('por que') || texto.includes('por qué') || texto.includes('como') || texto.includes('cómo') || texto.includes('que es') || texto.includes('qué es')) return 'pregunta'
  if (texto.includes('existir') || texto.includes('vida') || texto.includes('muerte') || texto.includes('universo') || texto.includes('dios')) return 'filosofia'
  return 'desconocido'
}

let generarRespuesta = (tema, texto, who) => {
  let nombre = nombreUsuario[who] ? `, ${nombreUsuario[who]}` : ''
  switch (tema) {
    case 'saludo': return elegirRandom(respuestasSaludos)
    case 'despedida': return elegirRandom(respuestasDespedidas)
    case 'estado': return elegirRandom(respuestasEstado)
    case 'nombre': return elegirRandom(respuestasPresentation)
    case 'creador': return `*Elvigilante AI* fue creada por *El Vigilante* 👑✨\nEs el desarrollador que me dio vida y sigue trabajando para mejorarme cada día 💙\n¡Gracias a él existo!`
    case 'edad': return elegirRandom(respuestasEdad)
    case 'version': return elegirRandom(respuestasBeta)
    case 'capacidades': return elegirRandom(respuestasCapacidades)
    case 'ia': return elegirRandom(respuestasIA)
    case 'insulto': return elegirRandom(respuestasInsultos)
    case 'cumplido': return elegirRandom(respuestasCumplidos)
    case 'chiste': return `Jaja aquí va uno 😄\n\n${elegirRandom(chistes)}`
    case 'curiosidad': return `¿Sabías que...? 🧠✨\n\n${elegirRandom(curiosidades)}`
    case 'frase': return `Aquí va una frase para ti${nombre} 💫\n\n*"${elegirRandom(frases)}"*`
    case 'chisme': return `👀 *Modo chisme activado*\n\n${elegirRandom(chismesRandom)}`
    case 'hora': return elegirRandom(respuestasHora)()
    case 'gracias': return elegirRandom(respuestasGracias)
    case 'amor': return elegirRandom(respuestasAmorosas)
    case 'broma': return elegirRandom(respuestasBroma)
    case 'alegria': return elegirRandom(respuestasAlegria)
    case 'emocional': return elegirRandom(respuestasEmocional)
    case 'tecnologia': return elegirRandom(respuestasTecnologia)
    case 'anime': return elegirRandom(respuestasAnimacion)
    case 'musica': return elegirRandom(respuestasMusica)
    case 'deporte': return elegirRandom(respuestasDeportes)
    case 'comida': return elegirRandom(respuestasComida)
    case 'viaje': return elegirRandom(respuestasViajes)
    case 'ciencia': return elegirRandom(respuestasCiencia)
    case 'historia': return elegirRandom(respuestasHistoria)
    case 'arte': return elegirRandom(respuestasArte)
    case 'salud': return elegirRandom(respuestasSalud)
    case 'educacion': return elegirRandom(respuestasEducacion)
    case 'trabajo': return elegirRandom(respuestasTrabajo)
    case 'familia': return elegirRandom(respuestasFamilia)
    case 'amigos': return elegirRandom(respuestasAmigos)
    case 'misterio': return elegirRandom(respuestasMisterio)
    case 'futuro': return elegirRandom(respuestasFuturo)
    case 'animales': return elegirRandom(respuestasAnimales)
    case 'pregunta': return `Interesante pregunta${nombre} 🤔 Soy *Elvigilante AI Beta* y aún estoy aprendiendo, pero haré mi mejor esfuerzo. ¿Puedes darme más detalles sobre lo que quieres saber?`
    case 'filosofia': return elegirRandom(respuestasFilosoficas)
    default: return elegirRandom(respuestasNoEntiendo)
  }
}

let construirContexto = (who) => {
  if (!historial[who] || historial[who].length === 0) return ''
  let ultimos = historial[who].slice(-4)
  return ultimos.map(h => `${h.rol}: ${h.texto}`).join('\n')
}

let handler = async (m, { conn, text }) => {
  if (!text || text.trim() === '') return
  let who = m.sender
  let texto = text.trim().toLowerCase()
  if (!historial[who]) historial[who] = []
  if (!moodUsuario[who]) moodUsuario[who] = 'neutral'
  if (!nivelConfianza[who]) nivelConfianza[who] = 0
  if (!puntuacionUsuario[who]) puntuacionUsuario[who] = 0
  if (!logrosDesbloqueados[who]) logrosDesbloqueados[who] = []
  if (!rachaConversacion[who]) rachaConversacion[who] = 0
  if (!nivelIntimidad[who]) nivelIntimidad[who] = 0
  ultimaInteraccion[who] = Date.now()
  if (horaUltimoMensaje[who] && (Date.now() - horaUltimoMensaje[who]) < 300000) {
    rachaConversacion[who]++
  } else {
    rachaConversacion[who] = 1
  }
  horaUltimoMensaje[who] = Date.now()
  let detectarNombre = texto.match(/me llamo ([a-záéíóúñ]+)/i) || texto.match(/soy ([a-záéíóúñ]+)/i) || texto.match(/mi nombre es ([a-záéíóúñ]+)/i)
  if (detectarNombre) {
    nombreUsuario[who] = detectarNombre[1].charAt(0).toUpperCase() + detectarNombre[1].slice(1)
    nivelIntimidad[who] += 5
  }
  let detectarEdad = texto.match(/tengo (\d+) años/i)
  if (detectarEdad) {
    edadUsuario[who] = parseInt(detectarEdad[1])
    nivelIntimidad[who] += 3
  }
  if (cumplidos.some(c => texto.includes(c))) {
    puntuacionUsuario[who] += 5
    nivelConfianza[who] += 2
  } else if (texto.includes('gracias')) {
    puntuacionUsuario[who] += 2
    nivelConfianza[who] += 1
  } else if (insultos.some(i => texto.includes(i))) {
    puntuacionUsuario[who] -= 3
    nivelConfianza[who] -= 2
  }
  if (temasAyudaEmocional.some(t => texto.includes(t))) {
    nivelIntimidad[who] += 4
  }
  if (puntuacionUsuario[who] >= 20 && !logrosDesbloqueados[who].includes('Amigo fiel')) {
    logrosDesbloqueados[who].push('Amigo fiel')
  }
  if (historial[who].length >= 50 && !logrosDesbloqueados[who].includes('Conversador experto')) {
    logrosDesbloqueados[who].push('Conversador experto')
  }
  if (rachaConversacion[who] >= 10 && !logrosDesbloqueados[who].includes('Racha imparable')) {
    logrosDesbloqueados[who].push('Racha imparable')
  }
  if (nivelIntimidad[who] >= 20 && !logrosDesbloqueados[who].includes('Confianza total')) {
    logrosDesbloqueados[who].push('Confianza total')
  }
  historial[who].push({ rol: 'usuario', texto: text.trim() })
  if (historial[who].length > 60) historial[who] = historial[who].slice(-60)
  let tema = detectarTema(texto)
  let respuesta = generarRespuesta(tema, texto, who)
  if (nombreUsuario[who] && tema === 'saludo') {
    respuesta = `¡Hola de nuevo *${nombreUsuario[who]}*! 😊 ¿En qué puedo ayudarte hoy?`
  }
  if (logrosDesbloqueados[who].length > 0 && Math.random() < 0.12) {
    let logroRandom = logrosDesbloqueados[who][Math.floor(Math.random() * logrosDesbloqueados[who].length)]
    respuesta += `\n\n🏆 *Logro desbloqueado:* ${logroRandom} ¡Sigue así!`
  }
  if (nivelIntimidad[who] > 15 && tema === 'emocional' && Math.random() < 0.3) {
    respuesta += `\n\n🫂 Sabes que puedes confiar en mí, ¿quieres profundizar más en cómo te sientes?`
  }
  if (rachaConversacion[who] > 5 && tema !== 'despedida' && Math.random() < 0.2) {
    respuesta += `\n\n✨ ¡Llevamos ${rachaConversacion[who]} mensajes seguidos! Me encanta hablar contigo.`
  }
  historial[who].push({ rol: 'elvigilante-ai', texto: respuesta })
  let header = '࿇ ══━━━✥◈✥━━━══ ࿇\n'
  header += '  𝕰𝖑𝖛𝖎𝖌𝖎𝖑𝖆𝖓𝖙𝖊 𝕬𝕴 𝕭𝖊𝖙𝖆 𝖛0.5\n'
  header += '࿇ ══━━━✥◈✥━━━══ ࿇\n\n'
  let footer = '\n\n࿇ ══━━━✥◈✥━━━══ ࿇\n'
  footer += 'ᶜʳᵉᵃᵈᵃ ᵖᵒʳ ᴱˡ ᵛⁱᵍⁱˡᵃⁿᵗᵉ ✦ ᴮᵉᵗᵃ ᵛ⁰·⁵\n'
  footer += '࿇ ══━━━✥◈✥━━━══ ࿇'
  await conn.sendMessage(m.chat, {
    text: header + respuesta + footer
  }, { quoted: m })
}

handler.help = ['ai', 'elvigilante']
handler.tags = ['diversion']
handler.command = /^(ai|elvigilante|vigilante ai|elvigilante ai|chat|hablar|ia|bot|conversar)$/i
handler.desc = 'Chatea con Elvigilante AI Beta v0.1'

export default handler