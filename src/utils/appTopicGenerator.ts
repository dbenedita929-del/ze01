import { AppInfo, Review } from '../types';

interface TopicDefinition {
  category: string;
  rating: number;
  ratingCount: string;
  ratingCountNumber: number;
  downloads: string;
  downloadsNumber: number;
  contentRating: string;
  contentRatingNotes: string[];
  tags: string[];
  developerSuffix: string;
  descriptionShort: (name: string) => string;
  descriptionFull: (name: string) => string[];
  whatsNew: (name: string) => string[];
  features: (name: string) => { title: string; desc: string; icon: string }[];
  installButtonText?: string;
  sampleReviews: (name: string) => Review[];
  logoPreset?: 'assai' | 'aimirror' | 'supermarket' | 'shopping' | 'delivery';
  logoIconSymbol?: 'sun' | 'cart' | 'sparkles' | 'store' | 'package' | 'badge-percent';
  logoBgColor?: string;
}

const TOPICS: { [key: string]: TopicDefinition } = {
  finance: {
    category: 'Finanças',
    rating: 4.8,
    ratingCount: '890 mil avaliações',
    ratingCountNumber: 890450,
    downloads: '50 mi+',
    downloadsNumber: 50000000,
    contentRating: 'Livre',
    contentRatingNotes: ['Classificação Livre', 'Compras no aplicativo'],
    tags: ['Finanças', 'Bancos digitais', 'PIX 24h', 'Cartão de Crédito', 'Investimentos', 'Rendimento CDI'],
    developerSuffix: 'Pagamentos e Serviços Financeiros S.A.',
    installButtonText: 'Instalar',
    logoIconSymbol: 'badge-percent',
    logoBgColor: '#0a58ca',
    descriptionShort: (name) =>
      `Gerencie seu dinheiro, realize transferências PIX instantâneas, acompanhe investimentos e tenha total controle do seu cartão sem anuidade no app ${name}.`,
    descriptionFull: (name) => [
      `Seja bem-vindo ao aplicativo oficial do ${name}, a sua conta digital completa, segura e sem burocracia para transformar a forma como você cuida do seu dinheiro.`,
      `Abra sua conta gratuita em poucos minutos diretamente pelo celular e tenha acesso a soluções financeiras modernas, cartão de crédito internacional e rendimento diário superior à poupança.`,
      `💳 RECURSOS E VANTAGENS DO ${name.toUpperCase()}:`,
      `• PIX Grátis e Ilimitado: Envie e receba pagamentos a qualquer hora do dia ou da noite em segundos com comprovante instantâneo.`,
      `• Cartão de Crédito Sem Anuidade: Cartão virtual para compras seguras na internet e controle de limites direto na tela.`,
      `• Rendimento Automático com Liquidez Diária: Seu dinheiro rende todo dia útil a 100% do CDI com total segurança.`,
      `• Pagamento de Contas e Boletos: Pague faturas, água, luz e tributos escaneando o código de barras ou linha digitável.`,
      `• Proteção Avançada e Biometria: Autenticação facial de alta tecnologia, aviso de golpe e seguro PIX opcional.`
    ],
    whatsNew: (name) => [
      `🔒 Novidades da versão mais recente do ${name}:`,
      `• Nova área PIX ultrarrápida com favoritos inteligentes e comprovantes instantâneos.`,
      `• Modo Noturno aprimorado com menor consumo de bateria em telas AMOLED.`,
      `• Autenticação biométrica acelerada: acesse sua conta em menos de 1 segundo.`
    ],
    features: (name) => [
      { title: 'PIX Instantâneo', desc: 'Transferências em segundos para qualquer banco sem tarifas.', icon: 'CheckCircle2' },
      { title: 'Cartão Sem Anuidade', desc: 'Controle de fatura em tempo real e cartão virtual dinâmico.', icon: 'CreditCard' },
      { title: 'Rendimento CDI', desc: 'Seu saldo rendendo todo dia útil mais que a poupança.', icon: 'TrendingUp' },
      { title: 'Segurança Máxima', desc: 'Proteção biométrica avançada e suporte prioritário 24h.', icon: 'ShieldCheck' }
    ],
    sampleReviews: (name) => [
      {
        id: 'rev-fin-1',
        author: 'Eduardo Mello',
        avatarColor: 'bg-blue-600',
        rating: 5,
        date: '31 de outubro de 2026',
        device: 'Samsung Galaxy S24 Ultra',
        content: `O melhor aplicativo de banco digital que já usei! O ${name} é extremamente rápido para transferir PIX, a interface não trava e o cartão virtual dinâmico me dá total segurança em compras online.`,
        helpfulCount: 524,
        developerResponse: {
          date: '1 de novembro de 2026',
          content: `Olá Eduardo! Muito obrigado pelo feedback. Nossa equipe se dedica diariamente para oferecer a melhor segurança e agilidade para sua vida financeira.`
        }
      },
      {
        id: 'rev-fin-2',
        author: 'Camila Fernandes',
        avatarColor: 'bg-indigo-600',
        rating: 5,
        date: '27 de outubro de 2026',
        device: 'Motorola Edge 50 Pro',
        content: `Interface limpa, sem propagandas chatas e tudo muito fácil de achar. O extrato detalhado do ${name} ajuda muito no controle dos gastos mensais.`,
        helpfulCount: 218
      },
      {
        id: 'rev-fin-3',
        author: 'Rodrigo Barbosa',
        avatarColor: 'bg-emerald-600',
        rating: 4,
        date: '21 de outubro de 2026',
        device: 'Xiaomi Redmi Note 13',
        content: `Muito bom e estável. Reconhecimento facial funciona de primeira mesmo no escuro. Recomendo a todos!`,
        helpfulCount: 96
      }
    ]
  },

  food: {
    category: 'Comida e Bebidas',
    rating: 4.8,
    ratingCount: '1,6 mi avaliações',
    ratingCountNumber: 1620000,
    downloads: '100 mi+',
    downloadsNumber: 100000000,
    contentRating: 'Livre',
    contentRatingNotes: ['Classificação Livre', 'Compras no aplicativo'],
    tags: ['Comida e bebidas', 'Delivery de comida', 'Restaurantes', 'Cupons de desconto', 'Entrega grátis', 'Mercado'],
    developerSuffix: 'Soluções em Delivery de Alimentos Ltda.',
    installButtonText: 'Pedir agora',
    logoIconSymbol: 'package',
    logoBgColor: '#e11d48',
    descriptionShort: (name) =>
      `Peça sua comida favorita, lanches, pizzas, bebidas e compras de mercado com entrega rápida e cupons diários de desconto no app ${name}.`,
    descriptionFull: (name) => [
      `Fome de quê? O aplicativo ${name} conecta você aos melhores restaurantes, padarias, hamburguerias, pizzarias e mercados da sua região.`,
      `Encontre opções com entrega grátis, pratos a partir de R$ 9,99 e acompanhe em tempo real o preparo do seu pedido até a chegada do entregador à sua porta.`,
      `🍔 POR QUE PEDIR PELO ${name.toUpperCase()}?`,
      `• Milhares de Restaurantes: Desde os favoritos do seu bairro até grandes redes internacionais com cardápio completo.`,
      `• Rastreamento em Tempo Real: Acompanhe no mapa interativo o trajeto exato do motoboy até seu endereço.`,
      `• Cupons Diários de Desconto: Ative cupons exclusivos no carrinho e economize em todos os pedidos.`,
      `• Mercado e Farmácia: Peça itens essenciais do dia a dia e receba em até 30 minutos sem sair de casa.`,
      `• Pagamento Fácil: Pague com PIX com 1 clique, cartão de crédito, débito ou vale-refeição.`
    ],
    whatsNew: (name) => [
      `🍕 Novidades da versão do ${name}:`,
      `• Busca aprimorada por pratos específicos e filtros de restrições alimentares.`,
      `• Rastreamento do entregador ainda mais preciso com estimativa minuto a minuto.`,
      `• Novo catálogo de cupons com aplicação automática no fechamento da compra.`
    ],
    features: (name) => [
      { title: 'Entrega Rápida', desc: 'Seus pratos quentinhos chegando em média de 25 a 35 minutos.', icon: 'Bike' },
      { title: 'Cupons Todo Dia', desc: 'Descontos de até 50% e opções de frete grátis garantidas.', icon: 'Tag' },
      { title: 'Rastreio ao Vivo', desc: 'Acompanhe no mapa cada etapa da sua entrega em tempo real.', icon: 'MapPin' },
      { title: 'Variedade Total', desc: 'De pizzas artesanais a sushi, açaí, café e mercado express.', icon: 'Utensils' }
    ],
    sampleReviews: (name) => [
      {
        id: 'rev-food-1',
        author: 'Juliana Pires',
        avatarColor: 'bg-rose-500',
        rating: 5,
        date: '30 de outubro de 2026',
        device: 'Samsung Galaxy A54',
        content: `O ${name} nunca decepciona! Os cupons funcionam de verdade, o rastreamento no mapa é perfeito e o pedido sempre chega antes do tempo estimado.`,
        helpfulCount: 382,
        developerResponse: {
          date: '31 de outubro de 2026',
          content: `Ficamos muito felizes em saber, Juliana! Bom apetite e conte sempre com o ${name} para matar sua fome com muita agilidade.`
        }
      },
      {
        id: 'rev-food-2',
        author: 'Marcio Toledo',
        avatarColor: 'bg-amber-600',
        rating: 5,
        date: '26 de outubro de 2026',
        device: 'Google Pixel 7',
        content: `Moro em condomínio fechado e as instruções para o entregador chegam certinho. Aplicativo leve, rápido e fácil de usar.`,
        helpfulCount: 145
      }
    ]
  },

  games: {
    category: 'Jogos de Ação',
    rating: 4.7,
    ratingCount: '4,2 mi avaliações',
    ratingCountNumber: 4210000,
    downloads: '100 mi+',
    downloadsNumber: 100000000,
    contentRating: '12',
    contentRatingNotes: ['Violência de fantasia leve', 'Interação de usuários online', 'Compras no jogo'],
    tags: ['Jogos', 'Ação', 'Multijogador online', 'Gráficos 3D Ultra', '60 FPS', 'Competitivo', 'Battle Royale'],
    developerSuffix: 'Interactive Game Studios Inc.',
    installButtonText: 'Jogar',
    logoIconSymbol: 'sparkles',
    logoBgColor: '#7c3aed',
    descriptionShort: (name) =>
      `Entre na arena de combate épica do jogo ${name}! Gráficos em alta definição a 60 FPS, partidas multijogador em tempo real e controles responsivos no Android.`,
    descriptionFull: (name) => [
      `Prepare-se para uma experiência de jogo eletrizante com ${name}! Monte seu esquadrão, enfrente jogadores de todo o mundo em batalhas dinâmicas e domine as tabelas de classificação global.`,
      `Otimizado para rodar com fluidez impecável em todos os dispositivos Android modernos, com suporte a controles Bluetooth e taxas de atualização de 90Hz e 120Hz.`,
      `🎮 DESTAQUES E RECURSOS DO ${name.toUpperCase()}:`,
      `• Gráficos 3D de Última Geração: Texturas em alta resolução, iluminação dinâmica e efeitos sonoros envolventes em Dolby Atmos.`,
      `• Modos Competitivos e Ranqueadas: Suba de elo nas temporadas ranqueadas e conquiste recompensas exclusivas.`,
      `• Personalização Profunda: Dezenas de skins de personagens, trajes customizados e armas lendárias.`,
      `• Ping Baixo e Servidores no Brasil: Jogabilidade lisa, sem travamentos ou lag nas partidas mais acirradas.`,
      `• Eventos Semanais Gratuitos: Participe de missões temporárias e desbloqueie itens épicos sem gastar nada.`
    ],
    whatsNew: (name) => [
      `⚔️ Atualização de Temporada do ${name}:`,
      `• Novo mapa expansivo com áreas táticas e clima dinâmico em tempo real.`,
      `• Otimizações na taxa de quadros (60 FPS / 120 FPS estáveis) e redução de aquecimento.`,
      `• Novo Passe de Batalha repleto de cosméticos e recompensas exclusivas.`
    ],
    features: (name) => [
      { title: 'Taxa de 60 FPS', desc: 'Desempenho fluido sem engasgos mesmo em combates cheios de efeitos.', icon: 'Zap' },
      { title: 'Multiplayer Real', desc: 'Jogue com amigos em chat de voz integrado com áudio cristalino.', icon: 'Users' },
      { title: 'Gráficos HD', desc: 'Visual cinematográfico adaptável à potência do seu dispositivo.', icon: 'Eye' },
      { title: 'Baixo Ping', desc: 'Servidores dedicados no Brasil para conexões rápidas e estáveis.', icon: 'Wifi' }
    ],
    sampleReviews: (name) => [
      {
        id: 'rev-game-1',
        author: 'Vinicius K.',
        avatarColor: 'bg-purple-600',
        rating: 5,
        date: '29 de outubro de 2026',
        device: 'Poco F5 Pro',
        content: `Gráficos absurdos! O ${name} roda cravado a 60 FPS sem esquentar o celular. A jogabilidade é muito responsiva e o pareamento é instantâneo. Melhor jogo do ano!`,
        helpfulCount: 712,
        developerResponse: {
          date: '30 de outubro de 2026',
          content: `Valeu Vinicius! Nos dedicamos muito para manter a taxa de quadros impecável e os servidores locais com o menor ping possível. Nos vemos na arena!`
        }
      },
      {
        id: 'rev-game-2',
        author: 'Guilherme Sampaio',
        avatarColor: 'bg-indigo-600',
        rating: 5,
        date: '25 de outubro de 2026',
        device: 'Samsung Galaxy S23',
        content: `O passe de batalha é justo e dá pra progredir bastante só jogando as missões gratuitas. Muito viciante!`,
        helpfulCount: 310
      }
    ]
  },

  shopping: {
    category: 'Compras',
    rating: 4.6,
    ratingCount: '580 mil avaliações',
    ratingCountNumber: 582100,
    downloads: '50 mi+',
    downloadsNumber: 50000000,
    contentRating: 'Livre',
    contentRatingNotes: ['Classificação Livre', 'Compras no aplicativo'],
    tags: ['Compras', 'Supermercado', 'Ofertas exclusivas', 'Descontos no caixa', 'Encarte digital', 'Economia', 'Cashback'],
    developerSuffix: 'Varejo e Comércio Eletrônico S/A',
    installButtonText: 'Instalar',
    logoIconSymbol: 'cart',
    logoBgColor: '#059669',
    descriptionShort: (name) =>
      `Aproveite ofertas imperdíveis, descontos ativados no caixa, folhetos promocionais e compre com preço baixo garantido no app ${name}.`,
    descriptionFull: (name) => [
      `Economize de verdade nas suas compras do dia a dia com o aplicativo ${name}! Encontre promoções exclusivas para clientes cadastrados e ative descontos com apenas um toque no celular.`,
      `Consulte os encartes de ofertas da sua loja mais próxima, faça listas de compras inteligentes e receba notificações sempre que seus produtos favoritos entrarem em promoção.`,
      `🛒 BENEFÍCIOS EXCLUSIVOS DO ${name.toUpperCase()}:`,
      `• Desconto Ativado no Celular: Ative as promoções no app e ganhe o abatimento instantâneo no caixa digitando seu CPF.`,
      `• Encartes e Folhetos Digitais: Veja todas as ofertas da semana em alta definição sem precisar de panfletos de papel.`,
      `• Localizador de Lojas: Encontre rotas, horários de abertura e telefones de todas as unidades perto de você.`,
      `• Leitor de Preço por Código de Barras: Escaneie qualquer produto nas prateleiras para conferir o preço na hora.`,
      `• Cashback e Pontos: Acumule saldo em compras selecionadas e resgate em novos produtos.`
    ],
    whatsNew: (name) => [
      `🛍️ Novidades da versão do ${name}:`,
      `• Ativador de descontos com 1 toque: economize ainda mais rápido no caixa.`,
      `• Folhetos de ofertas digitais com zoom suave e navegação rápida entre categorias.`,
      `• Melhorias no leitor de código de barras para leitura mesmo em locais com pouca luz.`
    ],
    features: (name) => [
      { title: 'Descontos no Caixa', desc: 'Ativação direta no app com desconto imediato pelo CPF.', icon: 'Percent' },
      { title: 'Encartes Digitais', desc: 'Folhetos atualizados semanalmente com as melhores promoções.', icon: 'BookOpen' },
      { title: 'Leitor de Preço', desc: 'Escaneie o código de barras para saber o valor na hora.', icon: 'Scan' },
      { title: 'Lojas Próximas', desc: 'Rotas e horários de funcionamento em tempo real.', icon: 'Store' }
    ],
    sampleReviews: (name) => [
      {
        id: 'rev-shop-1',
        author: 'Marilene Santos',
        avatarColor: 'bg-emerald-600',
        rating: 5,
        date: '28 de outubro de 2026',
        device: 'Samsung Galaxy A34',
        content: `Economizo toda semana com o ${name}! As ofertas exclusivas dão um desconto excelente na hora do pagamento, só colocar o CPF e o preço cai na tela do caixa.`,
        helpfulCount: 420,
        developerResponse: {
          date: '29 de outubro de 2026',
          content: `Ficamos muito contentes com a sua economia, Marilene! Nosso compromisso diário é trazer sempre o melhor preço para sua casa.`
        }
      },
      {
        id: 'rev-shop-2',
        author: 'Antonio Carlos F.',
        avatarColor: 'bg-blue-600',
        rating: 5,
        date: '22 de outubro de 2026',
        device: 'Motorola Moto G84',
        content: `O encarte digital no celular é maravilhoso, não preciso mais daqueles papéis amassados. Atualiza certinho com as ofertas da minha cidade.`,
        helpfulCount: 184
      }
    ]
  },

  communication: {
    category: 'Comunicação',
    rating: 4.7,
    ratingCount: '18 mi avaliações',
    ratingCountNumber: 18400000,
    downloads: '1 bi+',
    downloadsNumber: 1000000000,
    contentRating: '10',
    contentRatingNotes: ['Classificação 10 Anos', 'Interação de usuários online'],
    tags: ['Comunicação', 'Mensagens instantâneas', 'Chamadas de voz e vídeo HD', 'Grupos e canais', 'Criptografia de ponta a ponta'],
    developerSuffix: 'Communications Technologies LLC',
    installButtonText: 'Instalar',
    logoIconSymbol: 'sparkles',
    logoBgColor: '#0284c7',
    descriptionShort: (name) =>
      `Conecte-se instantaneamente com amigos e família através de mensagens, chamadas de vídeo em alta definição e grupos seguros no app ${name}.`,
    descriptionFull: (name) => [
      `Simples, confiável e privado: o aplicativo ${name} conecta você às pessoas mais importantes da sua vida onde quer que você esteja.`,
      `Envie mensagens de texto, áudios cristalinos, fotos em alta resolução e realize chamadas de voz e vídeo totalmente gratuitas mesmo em conexões móveis lentas.`,
      `💬 RECURSOS PRINCIPAIS DO ${name.toUpperCase()}:`,
      `• Criptografia de Ponta a Ponta: Apenas você e a pessoa com quem está conversando podem ler ou ouvir o que é enviado.`,
      `• Chamadas em Grupo em HD: Reúna até 32 pessoas na mesma chamada de vídeo com estabilidade total.`,
      `• Canais e Comunidades: Participe de canais temáticos e fique por dentro das novidades dos seus criadores favoritos.`,
      `• Mensagens que Desaparecem: Mais privacidade para suas conversas confidenciais com timers automáticos.`,
      `• Envio de Arquivos Pesados: Compartilhe documentos, vídeos e arquivos de até 2 GB sem perda de qualidade.`
    ],
    whatsNew: (name) => [
      `📲 O que há de novo no ${name}:`,
      `• Qualidade HD automática para envio de fotos e vídeos curtos.`,
      `• Nova barra de reações rápidas com emojis personalizados.`,
      `• Otimizações de sincronização para inicialização instantânea ao receber notificações.`
    ],
    features: (name) => [
      { title: 'Segurança Total', desc: 'Criptografia de ponta a ponta em todas as conversas.', icon: 'Shield' },
      { title: 'Vídeo em HD', desc: 'Chamadas nítidas mesmo em conexões 3G e 4G.', icon: 'Video' },
      { title: 'Grupos & Canais', desc: 'Comunique-se com milhares de pessoas simultaneamente.', icon: 'Users' },
      { title: 'Backup Automático', desc: 'Histórico preservado na nuvem com restauração rápida.', icon: 'Cloud' }
    ],
    sampleReviews: (name) => [
      {
        id: 'rev-comm-1',
        author: 'Larissa Coutinho',
        avatarColor: 'bg-sky-600',
        rating: 5,
        date: '31 de outubro de 2026',
        device: 'Samsung Galaxy S22',
        content: `Essencial no meu dia a dia! As chamadas de vídeo não caem, o envio de fotos na qualidade original é perfeito e o aplicativo não gasta muita bateria.`,
        helpfulCount: 654
      }
    ]
  },

  streaming: {
    category: 'Entretenimento',
    rating: 4.8,
    ratingCount: '3,9 mi avaliações',
    ratingCountNumber: 3920000,
    downloads: '100 mi+',
    downloadsNumber: 100000000,
    contentRating: '12',
    contentRatingNotes: ['Classificação 12 Anos', 'Linguagem imprópria leve'],
    tags: ['Entretenimento', 'Filmes e séries', 'Música e áudio', 'Streaming em 4K', 'Modo offline', 'Sem anúncios'],
    developerSuffix: 'Media & Entertainment Group Corp.',
    installButtonText: 'Assistir',
    logoIconSymbol: 'sparkles',
    logoBgColor: '#e11d48',
    descriptionShort: (name) =>
      `Assista a produções exclusivas, séries aclamadas, filmes em alta definição e ouça seus conteúdos favoritos online e offline no app ${name}.`,
    descriptionFull: (name) => [
      `O melhor do entretenimento está reunido no aplicativo ${name}! Acesse um catálogo gigantesco de filmes, documentários, séries premiadas e músicas a qualquer momento.`,
      `Transmita direto na Smart TV via Chromecast ou baixe seus episódios favoritos para assistir no avião, no trânsito ou onde estiver sem gastar sua franquia de dados.`,
      `🎬 VANTAGENS DO ${name.toUpperCase()}:`,
      `• Resolução 4K Ultra HD com HDR e som surround cinematográfico.`,
      `• Downloads Ilimitados para maratonar sem internet.`,
      `• Perfis Individuais para toda a família com recomendações personalizadas.`,
      `• Sem Interrupções: Assista sem pausas ou anúncios incômodos.`
    ],
    whatsNew: (name) => [
      `🍿 Novidades da versão do ${name}:`,
      `• Player redesenhado com avanço rápido de 10 segundos por toque duplo.`,
      `• Compatibilidade aprimorada com espelhamento para Smart TVs Android e Google TV.`,
      `• Downloads em segundo plano mais velozes.`
    ],
    features: (name) => [
      { title: 'Qualidade 4K', desc: 'Imagens cinematográficas nítidas com cores vibrantes.', icon: 'Tv' },
      { title: 'Modo Offline', desc: 'Baixe episódios completos para assistir sem conexão.', icon: 'Download' },
      { title: 'Perfis Familiares', desc: 'Recomendações customizadas para cada pessoa.', icon: 'User' },
      { title: 'Sem Anúncios', desc: 'Reprodução contínua sem interrupções indesejadas.', icon: 'Sparkles' }
    ],
    sampleReviews: (name) => [
      {
        id: 'rev-stream-1',
        author: 'Felipe Nogueira',
        avatarColor: 'bg-red-600',
        rating: 5,
        date: '29 de outubro de 2026',
        device: 'Google Pixel 8',
        content: `Catálogo excelente e o player é o mais rápido de todos. O modo offline salvou minha viagem de avião!`,
        helpfulCount: 290
      }
    ]
  },

  education: {
    category: 'Educação',
    rating: 4.9,
    ratingCount: '920 mil avaliações',
    ratingCountNumber: 920000,
    downloads: '50 mi+',
    downloadsNumber: 50000000,
    contentRating: 'Livre',
    contentRatingNotes: ['Classificação Livre'],
    tags: ['Educação', 'Aprendizado interativo', 'Cursos online', 'Idiomas', 'Gamificação', 'Certificados'],
    developerSuffix: 'EdTech Global Learning Inc.',
    installButtonText: 'Começar',
    logoIconSymbol: 'sparkles',
    logoBgColor: '#16a34a',
    descriptionShort: (name) =>
      `Aprenda no seu ritmo com aulas dinâmicas, exercícios interativos, exercícios práticos e conquiste novas habilidades com o app ${name}.`,
    descriptionFull: (name) => [
      `Descubra uma nova maneira de aprender com o ${name}! Projetado por especialistas pedagógicos para tornar os estudos prazerosos, práticos e consistentes no seu dia a dia.`,
      `Dedique apenas 10 a 15 minutos diários com lições gamificadas, testes rápidos de memorização e acompanhe sua evolução através de gráficos de desempenho.`,
      `📚 DESTAQUES DO ${name.toUpperCase()}:`,
      `• Lições Curtas e Focadas: Perfeito para estudar no intervalo do trabalho ou nos momentos livres.`,
      `• Metodologia Comprovada: Fixação duradoura de conteúdo através de repetição espaçada.`,
      `• Certificados Digitais: Conclua os módulos e emita certificados para enriquecer seu currículo.`,
      `• Modo Offline: Baixe lições completas para continuar aprendendo sem gastar internet.`
    ],
    whatsNew: (name) => [
      `🎓 Novidades da versão do ${name}:`,
      `• Novo sistema de metas diárias personalizadas.`,
      `• Módulo de revisão inteligente com inteligência artificial para reforçar pontos fracos.`,
      `• Desafios semanais com a comunidade de estudantes.`
    ],
    features: (name) => [
      { title: 'Gamificado', desc: 'Ganhe pontos, suba de nível e mantenha sua ofensiva diária.', icon: 'Award' },
      { title: 'Aulas Rápidas', desc: 'Módulos objetivos de 10 minutos para estudar em qualquer lugar.', icon: 'Clock' },
      { title: 'Certificados', desc: 'Emissão de comprovante de conclusão reconhecido.', icon: 'FileText' },
      { title: 'Modo Offline', desc: 'Estude mesmo sem sinal de internet no celular.', icon: 'Download' }
    ],
    sampleReviews: (name) => [
      {
        id: 'rev-edu-1',
        author: 'Ana Clara Rezende',
        avatarColor: 'bg-green-600',
        rating: 5,
        date: '30 de outubro de 2026',
        device: 'Motorola Moto G54',
        content: `Metodologia fantástica! Estou usando o ${name} há 3 meses todo dia e meu progresso foi surpreendente. As explicações são claras e diretas.`,
        helpfulCount: 412
      }
    ]
  },

  fitness: {
    category: 'Saúde e Fitness',
    rating: 4.8,
    ratingCount: '410 mil avaliações',
    ratingCountNumber: 410000,
    downloads: '10 mi+',
    downloadsNumber: 10000000,
    contentRating: 'Livre',
    contentRatingNotes: ['Classificação Livre'],
    tags: ['Saúde e fitness', 'Treinos em casa', 'Contador de calorias', 'Plano alimentar', 'Estatísticas corporais', 'Monitoramento'],
    developerSuffix: 'Health & Wellness Technologies Co.',
    installButtonText: 'Treinar agora',
    logoIconSymbol: 'sparkles',
    logoBgColor: '#ea580c',
    descriptionShort: (name) =>
      `Transforme sua saúde, acompanhe seus treinos, queime calorias e atinja suas metas de condicionamento físico com o aplicativo ${name}.`,
    descriptionFull: (name) => [
      `Tenha um personal trainer no seu bolso com o app ${name}! Criado para quem deseja perder peso, ganhar massa muscular ou melhorar a disposição física com rotinas guiadas em vídeo.`,
      `Planos de treino adaptados tanto para quem treina em casa sem equipamentos quanto para quem frequenta academia.`,
      `💪 O QUE VOCÊ TEM NO ${name.toUpperCase()}:`,
      `• Treinos em Vídeo HD: Instrutores demonstrando a postura correta para evitar lesões.`,
      `• Contador de Passos e Calorias: Sincronização automática com sensores do celular e smartwatches.`,
      `• Registro de Evolução: Acompanhe peso, medidas corporais e fotos comparativas em gráficos claros.`,
      `• Lembrete de Hidratação: Notificações inteligentes para beber água ao longo do dia.`
    ],
    whatsNew: (name) => [
      `🏃‍♂️ Novidades da versão do ${name}:`,
      `• Nova série de treinos curtos de 15 minutos para queima intensa de calorias.`,
      `• Integração direta com relógios inteligentes Wear OS.`,
      `• Gráficos semanais de desempenho redesenhados e mais intuitivos.`
    ],
    features: (name) => [
      { title: 'Treinos Guiados', desc: 'Vídeos com demonstração da postura ideal para cada exercício.', icon: 'Play' },
      { title: 'Sem Equipamentos', desc: 'Opções completas para treinar em casa usando o peso do corpo.', icon: 'Home' },
      { title: 'Gráficos de Peso', desc: 'Visualize seu progresso físico dia a dia com metas claras.', icon: 'TrendingUp' },
      { title: 'Lembretes de Água', desc: 'Mantenha sua hidratação perfeita com alertas discretos.', icon: 'Droplets' }
    ],
    sampleReviews: (name) => [
      {
        id: 'rev-fit-1',
        author: 'Thiago Valente',
        avatarColor: 'bg-orange-600',
        rating: 5,
        date: '28 de outubro de 2026',
        device: 'Samsung Galaxy Watch & S23',
        content: `App sensacional! Os treinos são muito bem divididos e fáceis de seguir. Já perdi 4 kg no primeiro mês seguindo a rotina do ${name}.`,
        helpfulCount: 318
      }
    ]
  },

  tools: {
    category: 'Ferramentas',
    rating: 4.7,
    ratingCount: '780 mil avaliações',
    ratingCountNumber: 780000,
    downloads: '50 mi+',
    downloadsNumber: 50000000,
    contentRating: 'Livre',
    contentRatingNotes: ['Classificação Livre'],
    tags: ['Ferramentas', 'Otimização', 'Gerenciador de arquivos', 'Limpeza de memória', 'Economia de bateria', 'Utilitários'],
    developerSuffix: 'Software Utilities & Tools Lab',
    installButtonText: 'Instalar',
    logoIconSymbol: 'package',
    logoBgColor: '#0891b2',
    descriptionShort: (name) =>
      `Aumente o desempenho do seu Android, gerencie arquivos com facilidade e libere espaço de armazenamento com o utilitário ${name}.`,
    descriptionFull: (name) => [
      `Mantenha seu smartphone sempre rápido, limpo e seguro com o ${name}! O utilitário definitivo desenvolvido para otimizar a memória RAM, limpar arquivos temporários e organizar suas pastas.`,
      `Leve, seguro e sem permissões abusivas, o ${name} identifica arquivos duplicados, fotos borradas e cachês acumulados para devolver gigabytes de espaço livre no seu celular.`,
      `⚡ RECURSOS DO ${name.toUpperCase()}:`,
      `• Limpeza Inteligente com 1 Toque: Remova cachê inútil sem apagar suas fotos ou conversas importantes.`,
      `• Gerenciador de Arquivos Rápido: Localize downloads, documentos em PDF, músicas e APKs com rapidez.`,
      `• Monitor de Bateria: Identifique aplicativos que consomem carga em segundo plano.`,
      `• Cofre de Privacidade: Proteja seus arquivos mais sensíveis com senha e biometria.`
    ],
    whatsNew: (name) => [
      `🛠️ Novidades da versão do ${name}:`,
      `• Algoritmo de limpeza 40% mais veloz na varredura de arquivos temporários.`,
      `• Compatibilidade aprimorada com Android 14 e Android 15.`,
      `• Modo noturno automático baseado no sistema.`
    ],
    features: (name) => [
      { title: 'Limpeza 1-Toque', desc: 'Libere gigabytes de espaço excluindo resíduos com segurança.', icon: 'Trash2' },
      { title: 'Mais Bateria', desc: 'Economize energia suspendendo tarefas desnecessárias.', icon: 'BatteryCharging' },
      { title: 'Gerenciador Leve', desc: 'Organize fotos, vídeos e documentos de forma instantânea.', icon: 'Folder' },
      { title: 'Cofre Secreto', desc: 'Proteja fotos e arquivos privados com biometria facial.', icon: 'Lock' }
    ],
    sampleReviews: (name) => [
      {
        id: 'rev-tool-1',
        author: 'Danilo Pacheco',
        avatarColor: 'bg-cyan-600',
        rating: 5,
        date: '27 de outubro de 2026',
        device: 'Motorola Moto G73',
        content: `Liberou mais de 8 GB de arquivos temporários e fotos duplicadas no meu aparelho logo no primeiro uso. O ${name} é leve e direto ao ponto!`,
        helpfulCount: 240
      }
    ]
  }
};

/**
 * Detect topic based on app name keywords
 */
export function detectTopicKey(name: string): string {
  if (!name || !name.trim()) return 'generic';
  
  const norm = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // Finance / Banks
  if (
    /banco|bank|finan|pix|pagamento|cartao|invest|wallet|carteira|cripto|crypto|bitcoin|moeda|emprestimo|nubank|inter|itau|bradesco|santander|caixa|picpay|c6|mercado pago|pagbank|stone|credito/.test(
      norm
    )
  ) {
    return 'finance';
  }

  // Food / Delivery
  if (
    /food|comida|burger|burguer|pizza|lanche|restaurante|delivery|entrega|ifood|rappi|aiqfome|ze delivery|ze|hamburguer|sushi|acai|mcdonald|bebida|prato/.test(
      norm
    )
  ) {
    return 'food';
  }

  // Games
  if (
    /game|jogo|play|free fire|roblox|gta|fifa|battle|tiro|fps|rpg|brawl|craft|minecraft|subway|surfer|clash|war|corrida|race|pixel|moba|pubg|anime game|esporte game|aventura/.test(
      norm
    )
  ) {
    return 'games';
  }

  // Shopping / Market / E-commerce
  if (
    /mercado|supermercado|atacado|atacadista|assai|atacadao|carrefour|loja|shop|shopee|shein|compras|varejo|magalu|amazon|mercado livre|oferta|desconto|outlet|magazine|preco baixo/.test(
      norm
    )
  ) {
    return 'shopping';
  }

  // Social / Chat
  if (
    /social|chat|zap|whats|whatsapp|insta|instagram|face|facebook|tiktok|kwai|telegram|discord|mensagem|conversa|reels|stories/.test(
      norm
    )
  ) {
    return 'communication';
  }

  // Streaming / Music / Movies
  if (
    /music|musica|som|audio|spotify|deezer|stream|filme|serie|cinema|tv|netflix|prime|disney|hbo|max|youtube|podcast|radio/.test(
      norm
    )
  ) {
    return 'streaming';
  }

  // Education / Languages / Books
  if (
    /curso|escola|estudo|aprender|idioma|ingles|english|duolingo|educa|aula|livro|leitura|biblia|concurso|faculdade|vestibular/.test(
      norm
    )
  ) {
    return 'education';
  }

  // Health & Fitness
  if (
    /fit|fitness|treino|saude|dieta|gym|academia|corrida|smart fit|caloria|peso|meditacao|sono|exercicio|musculacao/.test(
      norm
    )
  ) {
    return 'fitness';
  }

  // Tools & Cleaner & Utilities
  if (
    /tool|ferramenta|clean|cleaner|booster|antivirus|vpn|proxy|wifi|bateria|speed|calc|calculadora|pdf|arquivo|gerenciador|otimizador/.test(
      norm
    )
  ) {
    return 'tools';
  }

  return 'generic';
}

/**
 * Generate full topic-specific synchronized app info & reviews
 */
export function generateAppTopicData(
  appName: string,
  existingApp?: Partial<AppInfo>
): Partial<AppInfo> & { reviews?: Review[] } {
  const cleanName = appName.trim() || 'Meu Aplicativo';
  const topicKey = detectTopicKey(cleanName);
  
  // Clean domain & package name
  const safeIdPart = cleanName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 20) || 'app';

  if (TOPICS[topicKey]) {
    const topic = TOPICS[topicKey];
    const devName = `${cleanName} ${topic.developerSuffix}`;

    return {
      name: cleanName,
      category: topic.category,
      developer: devName,
      developerEmail: `suporte@${safeIdPart}.com.br`,
      developerWebsite: `https://www.${safeIdPart}.com.br`,
      developerAddress: `Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100`,
      id: `br.com.${safeIdPart}.app`,
      rating: topic.rating,
      ratingCount: topic.ratingCount,
      ratingCountNumber: topic.ratingCountNumber,
      downloads: topic.downloads,
      downloadsNumber: topic.downloadsNumber,
      contentRating: topic.contentRating,
      contentRatingNotes: topic.contentRatingNotes,
      tags: topic.tags,
      descriptionShort: topic.descriptionShort(cleanName),
      descriptionFull: topic.descriptionFull(cleanName),
      whatsNew: topic.whatsNew(cleanName),
      features: topic.features(cleanName),
      installButtonText: topic.installButtonText || 'Instalar',
      logoMode: topic.logoPreset ? 'preset' : existingApp?.logoMode || 'preset',
      logoPreset: topic.logoPreset || existingApp?.logoPreset,
      logoIconSymbol: topic.logoIconSymbol || 'sparkles',
      reviews: topic.sampleReviews(cleanName)
    };
  }

  // Generic fallback with high quality tailored stats
  const devName = `${cleanName} Soluções Digitais Ltda.`;
  return {
    name: cleanName,
    category: 'Produtividade',
    developer: devName,
    developerEmail: `suporte@${safeIdPart}.com.br`,
    developerWebsite: `https://www.${safeIdPart}.com.br`,
    developerAddress: `Av. Faria Lima, 2200 - Pinheiros, São Paulo - SP`,
    id: `com.${safeIdPart}.app`,
    rating: 4.8,
    ratingCount: '480 mil avaliações',
    ratingCountNumber: 480200,
    downloads: '10 mi+',
    downloadsNumber: 10000000,
    contentRating: 'Livre',
    contentRatingNotes: ['Classificação Livre', 'Uso sem anúncios'],
    tags: [
      cleanName,
      'Produtividade',
      'Inovação',
      'Aplicativo Oficial',
      'Desempenho Rápido',
      'Android',
      'Design Moderno'
    ],
    descriptionShort: `Aproveite toda a praticidade, recursos avançados e navegação fluida no aplicativo oficial do ${cleanName}.`,
    descriptionFull: [
      `Descubra uma nova experiência completa e otimizada com o ${cleanName}, desenvolvido para garantir máxima produtividade, estabilidade e praticidade no seu dia a dia.`,
      `Com uma interface elegante e moderna, o ${cleanName} entrega tudo o que você precisa em segundos com segurança total e sem travamentos.`,
      `⭐ RECURSOS EM DESTAQUE DO ${cleanName.toUpperCase()}:`,
      `• Desempenho Ágil: Carregamento instantâneo com menor consumo de memória e bateria.`,
      `• Interface Intuitiva: Design pensado para facilitar seu acesso a todas as ferramentas essenciais.`,
      `• Segurança e Privacidade: Seus dados protegidos com os mais altos padrões de criptografia.`,
      `• Notificações Inteligentes: Receba avisos no momento certo sem sobrecarregar sua tela.`
    ],
    whatsNew: [
      `🚀 Novidades da versão do ${cleanName}:`,
      `• Otimizações gerais de estabilidade e carregamento mais veloz.`,
      `• Suporte aprimorado para as versões mais recentes do sistema Android.`,
      `• Correções pontuais e refinamentos visuais.`
    ],
    features: [
      { title: 'Velocidade', desc: 'Resposta imediata e navegação ultrarrápida.', icon: 'Zap' },
      { title: 'Fácil de Usar', desc: 'Interface limpa, moderna e descomplicada.', icon: 'Smile' },
      { title: 'Segurança', desc: 'Proteção de ponta a ponta para seus dados.', icon: 'ShieldCheck' },
      { title: 'Economia', desc: 'Baixo consumo de bateria e de plano de dados.', icon: 'Battery' }
    ],
    installButtonText: 'Instalar',
    reviews: [
      {
        id: 'rev-gen-1',
        author: 'Marcelo Ribeiro',
        avatarColor: 'bg-emerald-600',
        rating: 5,
        date: '31 de outubro de 2026',
        device: 'Samsung Galaxy S24',
        content: `Excelente aplicativo! O ${cleanName} superou minhas expectativas. É muito rápido, direto ao ponto e não trava em momento algum.`,
        helpfulCount: 340,
        developerResponse: {
          date: '1 de novembro de 2026',
          content: `Muito obrigado Marcelo! Estamos constantemente atualizando o ${cleanName} para entregar a melhor experiência possível.`
        }
      },
      {
        id: 'rev-gen-2',
        author: 'Juliana Castro',
        avatarColor: 'bg-indigo-600',
        rating: 5,
        date: '28 de outubro de 2026',
        device: 'Motorola Edge 50',
        content: `Simplesmente perfeito. O design do ${cleanName} é lindo e muito intuitivo. Parabéns aos desenvolvedores!`,
        helpfulCount: 172
      },
      {
        id: 'rev-gen-3',
        author: 'Renato Silveira',
        avatarColor: 'bg-blue-600',
        rating: 4,
        date: '22 de outubro de 2026',
        device: 'Xiaomi 13T Pro',
        content: `Muito bom e estável. Cumpre tudo o que promete com muita fluidez.`,
        helpfulCount: 88
      }
    ]
  };
}

/**
 * Sanitizes and normalizes any AppInfo object, filling in missing array properties
 * (descriptionFull, whatsNew, tags, reviews, etc.) to prevent runtime map errors.
 */
export function sanitizeAppInfo(raw: any): AppInfo {
  if (!raw || typeof raw !== 'object') {
    return generateAppTopicData('Assaí Atacadista') as AppInfo;
  }
  const cleanName = typeof raw.name === 'string' && raw.name.trim() ? raw.name.trim() : 'Aplicativo';
  const defaults = generateAppTopicData(cleanName, raw);

  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : (defaults.id || 'com.app.default'),
    name: cleanName,
    developer: typeof raw.developer === 'string' && raw.developer ? raw.developer : (defaults.developer || 'Desenvolvedor Oficial'),
    developerEmail: typeof raw.developerEmail === 'string' ? raw.developerEmail : (defaults.developerEmail || ''),
    developerWebsite: typeof raw.developerWebsite === 'string' ? raw.developerWebsite : (defaults.developerWebsite || ''),
    developerAddress: typeof raw.developerAddress === 'string' ? raw.developerAddress : (defaults.developerAddress || ''),
    privacyPolicyUrl: typeof raw.privacyPolicyUrl === 'string' ? raw.privacyPolicyUrl : (defaults.privacyPolicyUrl || ''),
    category: typeof raw.category === 'string' && raw.category ? raw.category : (defaults.category || 'Produtividade'),
    tags: Array.isArray(raw.tags) && raw.tags.length > 0 ? raw.tags : (defaults.tags || ['Apps']),
    rating: typeof raw.rating === 'number' && !isNaN(raw.rating) ? raw.rating : (defaults.rating || 4.6),
    ratingCount: typeof raw.ratingCount === 'string' && raw.ratingCount ? raw.ratingCount : (defaults.ratingCount || '380 mil avaliações'),
    ratingCountNumber: typeof raw.ratingCountNumber === 'number' && !isNaN(raw.ratingCountNumber) ? raw.ratingCountNumber : (defaults.ratingCountNumber || 380000),
    downloads: typeof raw.downloads === 'string' && raw.downloads ? raw.downloads : (defaults.downloads || '10 mi+'),
    downloadsNumber: typeof raw.downloadsNumber === 'number' && !isNaN(raw.downloadsNumber) ? raw.downloadsNumber : (defaults.downloadsNumber || 10000000),
    contentRating: typeof raw.contentRating === 'string' && raw.contentRating ? raw.contentRating : (defaults.contentRating || 'Livre'),
    contentRatingNotes: Array.isArray(raw.contentRatingNotes) ? raw.contentRatingNotes : (defaults.contentRatingNotes || ['Classificação Livre']),
    containsAds: Boolean(raw.containsAds),
    inAppPurchases: Boolean(raw.inAppPurchases),
    inAppPriceRange: typeof raw.inAppPriceRange === 'string' ? raw.inAppPriceRange : (defaults.inAppPriceRange || 'Gratuito'),
    version: typeof raw.version === 'string' && raw.version ? raw.version : '1.0.0',
    updatedDate: typeof raw.updatedDate === 'string' && raw.updatedDate ? raw.updatedDate : 'Recente',
    size: typeof raw.size === 'string' && raw.size ? raw.size : '45 MB',
    requiredAndroid: typeof raw.requiredAndroid === 'string' && raw.requiredAndroid ? raw.requiredAndroid : 'Android 7.0 ou superior',
    descriptionShort: typeof raw.descriptionShort === 'string' && raw.descriptionShort ? raw.descriptionShort : (defaults.descriptionShort || 'Aplicativo oficial.'),
    descriptionFull: Array.isArray(raw.descriptionFull) && raw.descriptionFull.length > 0 
      ? raw.descriptionFull 
      : typeof raw.descriptionFull === 'string'
      ? [raw.descriptionFull]
      : (defaults.descriptionFull || ['Aplicativo oficial otimizado para o seu dispositivo.']),
    whatsNew: Array.isArray(raw.whatsNew) && raw.whatsNew.length > 0
      ? raw.whatsNew
      : typeof raw.whatsNew === 'string'
      ? [raw.whatsNew]
      : (defaults.whatsNew || ['Melhorias de desempenho e estabilidade nesta versão.']),
    features: Array.isArray(raw.features) ? raw.features : (defaults.features || []),
    logoMode: raw.logoMode || defaults.logoMode || 'preset',
    logoPreset: raw.logoPreset || defaults.logoPreset,
    customLogoUrl: raw.customLogoUrl,
    logoIconSymbol: raw.logoIconSymbol || defaults.logoIconSymbol || 'sparkles',
    logoBgColor: raw.logoBgColor || defaults.logoBgColor,
    installButtonText: typeof raw.installButtonText === 'string' && raw.installButtonText.trim() ? raw.installButtonText.trim() : (defaults.installButtonText || 'Instalar'),
    apkFileName: raw.apkFileName,
    apkFileSize: raw.apkFileSize,
    apkUrl: raw.apkUrl,
    apkSourceType: raw.apkSourceType,
    uploadedApkData: raw.uploadedApkData,
    reviews: Array.isArray(raw.reviews) && raw.reviews.length > 0 ? raw.reviews : defaults.reviews
  };
}
