const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export const IMG = {
  hero: U("photo-1531747056595-07f6cbbe10ad"),
  dance: U("photo-1620414713230-564d61a36936"),
  hands: U("photo-1498761560229-39e74b243558"),
  wedding: U("photo-1520854221256-17451cc331bf"),
  vineyard: U("photo-1779475501433-69a3a0b310f8"),
  cake: U("photo-1610670444950-0b29430891b4"),
  cake2: U("photo-1545696563-af8f6ec2295a"),
  father: U("photo-1542948843-bf19f4f535cf"),
  grad: U("photo-1627556704302-624286467c65"),
  elders: U("photo-1514415008039-efa173293080"),
  friends: U("photo-1582298538104-fe2e74c27f59"),
  candle: U("photo-1601922046210-41e129a3e64a"),
  flowers: U("photo-1487530811176-3780de880c2d"),
  mother: U("photo-1475609471617-0ef53b59cff5"),
  family: U("photo-1531984929664-2fb2be468d3e"),
  bench: U("photo-1542622475-904e18612fa1"),
  guitar: U("photo-1511379938547-c1f69419868d"),
  vinyl: U("photo-1588532218970-c2cab983746a"),
  cry1: U("photo-1758983241062-1af5ee1d464a"),
  cry2: U("photo-1758600588872-3d340e69650f"),
  laugh: U("photo-1698219922250-d9aa003080a9"),
  bw: U("photo-1764105647126-c54dce2cab31"),
  hill: U("photo-1532712938310-34cb3982ef74"),
};

export const PRICES = { standard: 39, express: 59 };

export const REACTIONS = [
  { img: IMG.cry1, name: "Inês", ctx: "Aniversário de namoro" },
  { img: IMG.laugh, name: "Marta", ctx: "Dia da Mãe" },
  { img: IMG.elders, name: "Rui & Lena", ctx: "40 anos de casados" },
  { img: IMG.cry2, name: "Sofia", ctx: "Reconciliação" },
  { img: IMG.bw, name: "Ana", ctx: "Homenagem ao pai" },
  { img: IMG.father, name: "Tiago", ctx: "Primeiro Dia do Pai" },
  { img: IMG.friends, name: "Beatriz", ctx: "Melhor amiga" },
  { img: IMG.dance, name: "Joana & Pedro", ctx: "Primeira dança" },
];

export const STEPS = [
  { n: "01", title: "Conte-nos a vossa história", tag: "5 minutos", text: "Um questionário guiado sobre a pessoa, a relação e os momentos que só vocês conhecem. Não precisa de saber escrever." },
  { n: "02", title: "Escrevemos a letra", tag: "Letra original", text: "Transformamos as suas palavras em versos com rima, imagens e aquele detalhe que faz a pessoa sorrir ao primeiro refrão." },
  { n: "03", title: "Produzimos em estúdio", tag: "Qualidade de estúdio", text: "Voz, arranjo e mistura no estilo que escolher. Nenhuma música se repete: a sua existe apenas uma vez." },
  { n: "04", title: "Entregamos a emoção", tag: "24 horas", text: "Recebe por e-mail uma página privada com a música, a letra e um link para partilhar quando quiser." },
];

export const REVIEWS = [
  { title: "Ele ficou sem palavras", text: "Estávamos afastados há meses. Enviei-lhe a música sem dizer nada e no fim ele ligou-me a chorar. Voltámos a falar nessa noite.", name: "Carolina M.", ctx: "Reconciliação" },
  { title: "A minha mãe ouviu cinco vezes seguidas", text: "Coloquei as histórias da nossa infância e cada verso era uma memória. Agora toca em todos os almoços de família.", name: "Ricardo S.", ctx: "Dia da Mãe" },
  { title: "O melhor presente de bodas", text: "Trinta anos resumidos em três minutos e meio. A letra tinha o nome da rua onde nos conhecemos. Inacreditável.", name: "Helena P.", ctx: "Aniversário de casamento" },
  { title: "Pedido de casamento perfeito", text: "Toquei a música no miradouro e ajoelhei-me no refrão. Ela disse sim antes de a canção acabar.", name: "Duarte F.", ctx: "Pedido de casamento" },
  { title: "Uma homenagem que nos uniu", text: "Fizemos uma música para o meu avô. Ouvimo-la todos juntos e foi a primeira vez que rimos e chorámos ao mesmo tempo.", name: "Mariana L.", ctx: "Memorial" },
  { title: "Rápido e cheio de alma", text: "Pedi o Express de manhã e à hora de almoço já tinha a música. Parecia escrita por alguém que nos conhece há anos.", name: "Gonçalo R.", ctx: "Aniversário" },
];

export const SAMPLES = [
  { key: "aniversario", label: "Aniversário", title: "Trinta Velas para a Clara", genre: "Pop Acústico", img: IMG.cake2, src: "/samples/s1.mp3",
    blurb: "Esqueça os vales-presente. Ofereça uma canção que conta porque é que essa pessoa importa tanto.",
    bullets: ["Versos feitos das memórias que partilham", "Uma recordação para ouvir todos os anos", "O presente que ninguém está à espera"],
    lyric: ["Trinta velas e um sorriso igual", "ao da menina que corria no quintal"] },
  { key: "reconciliacao", label: "Reconciliação", title: "Volta a Tocar", genre: "Balada", img: IMG.hands, src: "/samples/s2.mp3",
    blurb: "Quando as palavras faltam, uma canção diz o que o coração não consegue. Um primeiro passo de volta.",
    bullets: ["Diga 'desculpa' sem ficar sem voz", "Recorde porque é que tudo começou", "Uma ponte para recomeçar"],
    lyric: ["Se o silêncio for o fim do refrão", "deixa-me cantar a segunda versão"] },
  { key: "casamento", label: "Casamento", title: "Sim, no Meio da Vinha", genre: "Folk Romântico", img: IMG.vineyard, src: "/samples/s3.mp3",
    blurb: "A primeira dança merece uma música que só existe para vocês. Ninguém mais a terá.",
    bullets: ["Perfeita para a primeira dança", "Votos transformados em melodia", "Os convidados vão pedir para repetir"],
    lyric: ["Entre as videiras disseste que sim", "e o verão inteiro cantou para mim"] },
  { key: "mae", label: "Dia da Mãe", title: "Mãos de Farinha", genre: "Fado Pop", img: IMG.mother, src: "/samples/s1.mp3",
    blurb: "Tudo o que nunca conseguiu agradecer em voz alta, finalmente com melodia.",
    bullets: ["Histórias de infância em versos", "Um obrigado que fica para sempre", "Lágrimas boas garantidas"],
    lyric: ["As tuas mãos de farinha e de sal", "ensinaram-me o que é ser casa afinal"] },
  { key: "memorial", label: "Memorial", title: "Ainda Te Ouço", genre: "Piano & Voz", img: IMG.candle, src: "/samples/s2.mp3",
    blurb: "Uma homenagem serena para guardar a voz, as manias e o amor de quem partiu.",
    bullets: ["Celebre uma vida inteira", "Ideal para cerimónias e aniversários", "Uma memória que não se apaga"],
    lyric: ["Ainda te ouço quando a casa adormece", "és a canção que a saudade conhece"] },
  { key: "pai", label: "Dia do Pai", title: "O Meu Primeiro Herói", genre: "Rock Acústico", img: IMG.father, src: "/samples/s3.mp3",
    blurb: "Para o homem que segurou a bicicleta até ao dia em que já não foi preciso.",
    bullets: ["Piadas internas e lições de vida", "Um tributo com energia", "Para ouvir no carro, juntos"],
    lyric: ["Largaste o selim sem eu perceber", "e foi assim que aprendi a crescer"] },
];

export const GENRES = ["Pop Acústico", "Balada", "Folk Romântico"];

export const OCCASIONS = [
  { label: "Aniversário", img: IMG.cake },
  { label: "Bodas", img: IMG.elders },
  { label: "Dia da Mãe", img: IMG.mother },
  { label: "Amo-te", img: IMG.dance },
  { label: "Casamento", img: IMG.wedding },
  { label: "Memorial", img: IMG.candle },
  { label: "Formatura", img: IMG.grad },
  { label: "Dia do Pai", img: IMG.father },
  { label: "Obrigado", img: IMG.flowers },
  { label: "Saudade", img: IMG.bench },
  { label: "Reconciliação", img: IMG.hands },
  { label: "Conquista", img: IMG.hill },
];

export const FAQ = [
  { q: "E se a primeira versão não me encantar?", a: "Ajustamos. Pode pedir revisões diretamente na página da sua música — uma rima, um nome, o ritmo. Só damos o trabalho por terminado quando sentir que a música é mesmo vossa." },
  { q: "O que recebo exatamente?", a: "Um e-mail com o link para uma página privada só sua: a música completa, a letra e a opção de partilhar ou descarregar. Ninguém tem acesso a não ser que partilhe o link." },
  { q: "Como sei que a música vai soar bem?", a: "Cada canção é escrita a partir da sua história e produzida com cuidado de estúdio. Antes de pagar vê o resumo completo e, se não ficar satisfeito, tem garantia de reembolso." },
  { q: "Quanto tempo demora?", a: "A maioria das músicas fica pronta em 24 horas. Se o presente é para hoje, escolha a entrega Express no último passo e recebe em cerca de 1 hora." },
  { q: "Preciso de escrever a letra?", a: "Não. Responde a algumas perguntas simples sobre a pessoa, a ocasião e o estilo. A partir daí, a escrita, a voz e a produção ficam connosco." },
  { q: "Posso pedir uma música para reconquistar alguém?", a: "Claro — é uma das nossas favoritas. Conte-nos o que vos uniu, o que aconteceu e o que gostaria de dizer. Escrevemos com delicadeza, sem exageros." },
];

export const RECIPIENTS = ["Marido", "Esposa", "Namorado(a)", "Companheiro(a)", "Ex-companheiro(a)", "Noivo(a)", "Mãe", "Pai", "Filho", "Filha", "Avó / Avô", "Neto(a)", "Irmão / Irmã", "Amigo(a)", "Eu próprio", "Outro"];
export const OCCASION_OPTS = ["Aniversário", "Bodas", "Reconciliação", "Amo-te", "Casamento", "Pedido de casamento", "Dia da Mãe", "Dia do Pai", "Memorial", "Formatura", "Obrigado", "Saudade", "Desculpa", "Conquista"];
export const GENRE_OPTS = [
  { label: "Balada Romântica", hint: "piano, cordas, voz próxima" },
  { label: "Pop Acústico", hint: "violão, leve e luminoso" },
  { label: "Fado Pop", hint: "guitarra portuguesa, saudade" },
  { label: "Bossa Nova / MPB", hint: "suave, quente, elegante" },
  { label: "R&B", hint: "groove lento e sensual" },
  { label: "Country / Folk", hint: "histórias com estrada" },
  { label: "Rock Acústico", hint: "energia e coração" },
  { label: "Cinemático", hint: "épico, orquestral" },
];
export const VOICES = ["Feminina", "Masculina", "Dueto"];
export const MOODS = ["Emocionante", "Alegre", "Nostálgico", "Romântico", "Divertido", "Sereno"];
export const STORY_PROMPTS = ["Como se conheceram?", "Uma piada interna só vossa", "O momento em que percebeu que era amor", "O que gostaria de lhe dizer e nunca disse", "Um lugar especial para os dois"];
