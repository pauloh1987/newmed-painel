-- =============================================================================
-- NEWMED — carga inicial do catálogo e do banner da página inicial
--
-- Traz do site atual: as 26 categorias (em 5 grupos), os 147 produtos com nome,
-- foto e a descrição que já existia (33 produtos têm descrição; os demais ficam
-- em branco para serem preenchidos pelo painel) e um banner inicial.
--
-- As fotos ficam em /public/img/produtos (já otimizadas) e as descrições estão em Markdown.
-- É seguro rodar mais de uma vez: o que já existe (mesmo endereço/slug) é ignorado.
-- =============================================================================

insert into public.categories (name, slug, segment, sort_order) values
  ('Aparelhos de Pressão Digital', 'aparelhos-de-pressao-digital', 'diagnostico', 10),
  ('Cardiotocógrafos', 'cardiotocografos', 'diagnostico', 20),
  ('Detectores Fetais', 'detectores-fetais', 'diagnostico', 30),
  ('Eletrocardiógrafos', 'eletrocardiografos', 'diagnostico', 40),
  ('Monitor Dopler Vascular', 'monitor-dopler-vascular', 'diagnostico', 50),
  ('Monitores', 'monitores', 'diagnostico', 60),
  ('Sensores de Oximetria', 'sensores-de-oximetria', 'diagnostico', 70),
  ('Tensiômetros e Estetoscópios', 'tensiometros-e-estetoscopios', 'diagnostico', 80),
  ('Cardioversores', 'cardioversores', 'emergencia', 10),
  ('Desfibrilador Externo Automático (DEA)', 'desfibrilador-externo-automatico-dea', 'emergencia', 20),
  ('Desfibriladores', 'desfibriladores', 'emergencia', 30),
  ('Pás Adesivas', 'pas-adesivas', 'emergencia', 40),
  ('Material de Resgate — APH', 'material-de-resgate-aph', 'emergencia', 50),
  ('Aspiradores Cirúrgicos', 'aspiradores-cirurgicos', 'respiratoria', 10),
  ('Inaladores e Nebulizadores', 'inaladores-e-nebulizadores', 'respiratoria', 20),
  ('Oxigenação', 'oxigenacao', 'respiratoria', 30),
  ('Baterias', 'baterias', 'acessorios', 10),
  ('Braçadeiras', 'bracadeiras', 'acessorios', 20),
  ('Cabos de ECG 05 Vias', 'cabos-de-ecg-05-vias', 'acessorios', 30),
  ('Cabos de ECG 10 Vias', 'cabos-de-ecg-10-vias', 'acessorios', 40),
  ('Conectores PNI', 'conectores-pni', 'acessorios', 50),
  ('Conjunto de Peras e Cardioclips', 'conjunto-de-peras-e-cardioclips', 'acessorios', 60),
  ('Papéis para Eletrocardiógrafo', 'papeis-para-eletrocardiografo', 'acessorios', 70),
  ('Papéis para Ultrassonografia', 'papeis-para-ultrassonografia', 'acessorios', 80),
  ('Balanças', 'balancas', 'mobiliario', 10),
  ('Carrinhos', 'carrinhos', 'mobiliario', 20)
on conflict (slug) do nothing;

insert into public.products (name, slug, segment, category_id, description, images, for_sale, for_rent, active)
select v.name, v.slug, v.segment::public.segment, c.id, nullif(v.description, ''), array[v.image], true, false, v.active
from (values
  ('Aparelho de Pressão Digital de Braço DBP-1319', 'aparelho-de-pressao-digital-de-braco-dbp-1319', 'diagnostico', 'aparelhos-de-pressao-digital', 'Aparelho de Pressão Arterial Digital Automático de BRAÇO

Modelo: DBP-1319

Medidor de pressão sistólica e diastólica com insuflação e desinsuflação automáticas.

Tela ampla com números grandes. Melhor visualização do resultado.

Resultado Preciso e Confiável. Possui sistema que apresenta a média dos últimos 3 testes, indicador de classificação de risco da OMS, e detecção de pulsação irregular.

Silencioso, e fácil de usar.

Possui 120 memórias divididas em 2 grupos, podendo ser usado por mais de uma pessoa.

Desligamento automático e detecção de bateria fraca.

Braçadeira livre de Látex.

Acompanha estojo para transporte e pilhas.

Embalagem contém:

01 Aparelho de Pressão Arterial Digital Automático 01 Braçadeira Adulto livre de látex 01 Estojo para transporte 04 pilhas AA 01 Manual de instruções', '/img/produtos/aparelhos-de-pressao-digital/aparelho-de-pressao-digital-de-braco-dbp-1319.webp', true),
  ('Aparelho de Pressão Digital de Braço MA 100', 'aparelho-de-pressao-digital-de-braco-ma-100', 'diagnostico', 'aparelhos-de-pressao-digital', '', '/img/produtos/aparelhos-de-pressao-digital/aparelho-de-pressao-digital-de-braco-ma-100.webp', true),
  ('Aparelho de Pressão Digital de Pulso GP 400', 'aparelho-de-pressao-digital-de-pulso-gp-400', 'diagnostico', 'aparelhos-de-pressao-digital', '', '/img/produtos/aparelhos-de-pressao-digital/aparelho-de-pressao-digital-de-pulso-gp-400.webp', true),
  ('Aparelho de Pressão Digital de Pulso LP200', 'aparelho-de-pressao-digital-de-pulso-lp200', 'diagnostico', 'aparelhos-de-pressao-digital', '', '/img/produtos/aparelhos-de-pressao-digital/aparelho-de-pressao-digital-de-pulso-lp200.webp', true),
  ('Aparelho de Pressão de Digital de Braço BSP11', 'aparelho-de-pressao-de-digital-de-braco-bsp11', 'diagnostico', 'aparelhos-de-pressao-digital', '', '/img/produtos/aparelhos-de-pressao-digital/aparelho-de-pressao-de-digital-de-braco-bsp11.webp', true),
  ('Cardiotocógrafo Edan F3 - Gemelar', 'cardiotocografo-edan-f3-gemelar', 'diagnostico', 'cardiotocografos', 'COM UM DESIGN ELEGANTE, TELA DE 5,6″ COLORIDA, O MONITOR FETAL EDAN GEMELAR F3 (CARDIOTOCÓGRAFO) ATENDE AS NECESSIDADES DE UM DEPARTAMENTO DE OBSTETRÍCIA SEJA EM AMBIENTE CLÍNICO OU HOSPITALAR. O EDAN F3 É LEVE E DE FÁCIL TRANSPORTE, OFERECE UM EXTENSO CONJUNTO DE PARÂMETROS DE MONITORAMENTO, TAIS COMO: FHR, TOCO E MOVIMENTO FETAL . COM TRANSDUTORES FHR E TOCO IPX8, PROTEGIDO CONTRA OS DEFEITOS DE IMERSÃO CONTÍNUA EM ÁGUA.

MULTI-DISPLAY

ALTERNANDO ENTRE TRÊS MODOS DE EXIBIÇÃO, O USUÁRIO PODE ESCOLHER O MAIS ADEQUADO PARA O USO CLÍNICO.

FLUXO DE TRABALHO SIMPLES

TECLAS E BOTÕES QUE FORNECEM VÁRIOS ATALHOS PARA LOCALIZAR A MELHOR FUNÇÃO PARA O USO CLÍNICO. O BOTÃO “START” DEVE SER CONFIGURADO PARA AS INFORMAÇÕES DE IMPRESSÕES DO PACIENTE. ISTO PODE AJUDAR O MÉDICO A SIMPLIFICAR O FLUXO DE TRABALHO E TRABALHAR APENAS COM UM BOTÃO.

REGISTRO NA ANVISA: 80047300573', '/img/produtos/cardiotocografos/cardiotocografo-edan-f3-gemelar.webp', true),
  ('Monitor Fetal Cardiotocógrafo Hi bebe BT 350E Md', 'monitor-fetal-cardiotocografo-hi-bebe-bt-350e-md', 'diagnostico', 'cardiotocografos', '', '/img/produtos/cardiotocografos/monitor-fetal-cardiotocografo-hi-bebe-bt-350e-md.webp', true),
  ('Detector Fetal Portátil Fd 200A', 'detector-fetal-portatil-fd-200a', 'diagnostico', 'detectores-fetais', '', '/img/produtos/detectores-fetais/detector-fetal-portatil-fd-200a.webp', true),
  ('Detector Fetal Portátil Fd 200B', 'detector-fetal-portatil-fd-200b', 'diagnostico', 'detectores-fetais', '', '/img/produtos/detectores-fetais/detector-fetal-portatil-fd-200b.webp', true),
  ('Detector Fetal Portátil Fd 200C', 'detector-fetal-portatil-fd-200c', 'diagnostico', 'detectores-fetais', '', '/img/produtos/detectores-fetais/detector-fetal-portatil-fd-200c.webp', true),
  ('Detector Fetal de Mesa DF7000D', 'detector-fetal-de-mesa-df7000d', 'diagnostico', 'detectores-fetais', '', '/img/produtos/detectores-fetais/detector-fetal-de-mesa-df7000d.webp', true),
  ('Detector Fetal de Mesa DF7000S', 'detector-fetal-de-mesa-df7000s', 'diagnostico', 'detectores-fetais', '', '/img/produtos/detectores-fetais/detector-fetal-de-mesa-df7000s.webp', true),
  ('Detector Fetal de Mesa Fd 300D', 'detector-fetal-de-mesa-fd-300d', 'diagnostico', 'detectores-fetais', '', '/img/produtos/detectores-fetais/detector-fetal-de-mesa-fd-300d.webp', true),
  ('Eletrocardiógrafo Ecafix ECG 12S PC', 'eletrocardiografo-ecafix-ecg-12s-pc', 'diagnostico', 'eletrocardiografos', 'ELETROCARDIÓGRAFO DIGITAL COMPUTADORIZADO

Descrição:

Aparelho médico-hospitalar para avaliação elétrica da atividade cardíaca (potenciais elétricos) e da sua condução, registrada em gráficos.

Características básicas:

- Destinado ao uso com computadores portáteis ou de mesa;
- Executar a aquisição simultânea de 12 derivações;
- Imprimir o traçado de ECG em múltiplos formatos: Compacto, estendido, horizontal ou vertical (paisagem e retrato) via impressora convencional do PC, em preto e branco ou colorido, a qualquer momento, em formato A4;
- Armazenamento de dados dos pacientes e exames realizados;
- Conexão para comunicação e alimentação do módulo ao computador via cabo tipo USB;
- Leve, portátil, ágil e de fácil manuseio;

Desempenho do Software:

Monitoração do ECG em tempo real (pré-teste);

Leitura e visualização do ECG em tempo real;

Medidas rápidas e eficientes através de cursores eletrônicos;

Impressão em formato A4 e em 12 canais das 12 derivações adquiridas simultaneamente, em múltiplos formatos (Compacto, estendido, horizontal ou vertical - paisagem e retrato), colorida e em preto e branco, em impressora virtual ou convencional compatível com o Windows.

Impressão, conjunta aos traçados das derivações de ECG, dos dados fornecidos, da instituição, do paciente, da execução do exame (velocidade, filtros, ganho, frequência, data e hora), do laudo médico e do Cartão do Paciente;

Com banco de frases e cartão do paciente;

De rápida instalação e fácil utilização, podendo ser instalado em diversos computadores;

Possibilita gravar os exames de ECG no HD do computador, juntamente com os dados da instituição, do paciente e do eletrocardiograma efetuado.

Envia manual e automaticamente exames e laudos pela Internet para serem analisados a distância;

Funciona em notebooks e desktops, estando conectados em rede ou não;

Salvamento e exportação de exames, de forma manual e automática, em arquivos no formato PDF, compatíveis com softwares agregadores de imagens (ex: Word, Powerpoint e outros programas utilizados em Consultórios, que trabalhem com importação) e aplicativos de Internet;

Atualização gratuita e de fácil acesso via internet.', '/img/produtos/eletrocardiografos/eletrocardiografo-ecafix-ecg-12s-pc.webp', true),
  ('Eletrocardiógrafo Ecafix ECG 12S Plus', 'eletrocardiografo-ecafix-ecg-12s-plus', 'diagnostico', 'eletrocardiografos', 'Leve, portátil, de fácil operação, com seleção das derivações e funções através de teclado de membrana e indicação dos comandos, QRS e falta de papel por meio de LEDs luminosos.

Registro de 03 canais, com a captação simultânea das 12 derivações, por impressora com cabeça térmica de alta resolução de 8 dots/mm, imprimindo sequencialmente, em 04 grupos de 03 derivações (DI-Dll-Dlll, aVR-aVL-aVF, V1-V2-V3, V4-V5-V6), nos modos Manual e Automático.

Impressão em papel termo sensível com 80mm de largura por 30m de comprimento (possibilitando a obtenção de até 60 exames), com a Identificação de data/ hora, derivações, freqüência cardíaca, ganho (sensibilidade), velocidade do traçado, filtros acionados e campo específico para os dados do paciente.

Possui display gráfico LCD para visualização do traçado de ECG selecionado, derivação, data, hora, frequência cardíaca em tempo real, detecção do QRS e eletrodo solto.

Possui memória interna, permitindo a reimpressão do último exame por intermédio da função Cópia.

Construído com tecnologia digital de processamento de sinais, com frequência de amostragem de 1920Hz, possui circuito com amplificador de entrada flutuante, protegido contra descarga de desfibrilador, eletrocautério e equipamentos cirúrgicos de alta frequência, ajuste de ganho em 3 níveis (N/2, N, 2N), velocidade de registro de 25 ou 50 mm/s.

Detecção de eletrodo solto, detecção e rejeição a pulsos de marca-passo na contagem da frequência cardíaca, filtros contra interferências de rede elétrica (60Hz) e tremor muscular (35Hz).

Alimentação por rede elétrica bivolt 110/220V, 50/60Hz, com seleção chaveada automática, fonte de alimentação incorporada, bateria interna recarregável (com autonomia de 2 horas em uso normal ou aproximadamente 30 exames).

Peso: 2.4 kg.

Dimensões: Altura 8.5cm x Largura 25cm x Comprimento 31cm', '/img/produtos/eletrocardiografos/eletrocardiografo-ecafix-ecg-12s-plus.webp', true),
  ('Eletrocardiógrafo Ecafix ECG 6 Plus', 'eletrocardiografo-ecafix-ecg-6-plus', 'diagnostico', 'eletrocardiografos', 'Portátil, de 1 canal, com registro por impressora térmica de alta resolução.

Impressão nos modos Manual e Automático para as sete derivações padrão (DI,DII,DIII,aVR,aVL,aVF,V1) com comando manual para as demais 5 derivações (V2,V3,V4,V5,V6).

Identificação das derivações, valor da freqüência cardíaca, data, hora, filtros selecionados, velocidade do traçado e campo para identificação do paciente impressos no papel.

Possui display Alfanumérico LCD para visualização de data, hora, frequência cardíaca em tempo real e a derivação selecionada.

Construído com tecnologia digital de processamento de sinais, possui circuito com amplificador de entrada flutuante, protegido contra descarga de desfibrilador e eletrocautério, ajuste de ganho em 3 níveis (N/2, N, 2N), velocidade de registro de 25 ou 50 mm/s.

Detecção de eletrodo solto, detecção e rejeição a pulsos de marcapasso na contagem da freqüência cardíaca, filtros contra interferências de rede elétrica (60Hz) e tremor muscular (35Hz).

Possui memória interna, permitindo a reimpressão do último exame por intermédio da função "cópia".

Possui conector para entrada de sinal externo, possibilitando o registro de sinais de outro equipamento.

Alimentação por rede elétrica 110/220V, 50/60Hz com seleção automática, bateria interna recarregável.', '/img/produtos/eletrocardiografos/eletrocardiografo-ecafix-ecg-6-plus.webp', true),
  ('Eletrocardiógrafo 03 Canais ECG 300G', 'eletrocardiografo-03-canais-ecg-300g', 'diagnostico', 'eletrocardiografos', 'Eletrocardiógrafo Contec Ecg-300g 3 Canais - 12 Derivações

O ECG de "três canais" ECG300G é um tipo de eletrocardiograma, que faz a amostragem de sinais de ECG de 12 derivações simultaneamente e imprime as formas de onda de ECG com o sistema de impressão térmica.

Suas funções são as seguintes: Gravação e exibição de formas de onda de ECG no modo automático / manual; Automedição e autodiagnóstico dos parâmetros da onda de ECG; Levando o estado de lead off e falta de papel; Alternando vários tipos de linguagens de interface; Gerenciando o banco de dados de casos.

Características 3.5 "TFT cor LCD display mostra o status de trabalho e forma de onda ECG. Verifique a forma de onda antes de imprimir para salvar papel gravado.

12 leva ECG de aquisição simultânea, processador de sinal digital, para obter formas de onda de ECG de maior qualidade através do filtro AC, filtro de linha de base e filtro EMG dos sinais de ECG.

A exposição simultânea de 3/6/12 conduz a forma de onda de ECG, e o estado da modalidade de impressão, sensibilidade, velocidade, filtro etc., para ser fácil para a interpretação.

Inclua modalidades e formato de impressão Multiform, tais como auto 3 \* 4 + 1, auto 3 \* 4, auto 2 \* 6 + 1, auto 2 \* 6, auto 4 \* 3, ritmo 4, ritmo 3, ritmo 2 e etc. manual; o comprimento da impressão da onda pode ser ajustado e a função da impressão periódica está incluída para satisfazer aplicações diferentes.

O instrumento tem a função da autoanálise regular e da auto interpretação do parâmetro da onda de ECG, fornece parâmetros da medida tais como o HR, intervalo de p-R, duração de p, duração de QRS, duração de t, intervalo de q-T, q-TC, eixo de p, eixo de QRS, eixo de t, R (V5), S (v1), R (V5) + S (v1) etc e conclusão de auto interpretação para ajudar a reduzir a abundância do médico e melhorar a eficiência de trabalho.

A fonte de alimentação inclui AC/DC. Este dispositivo inclui built-in de polímero de lítio bateria recarregável. Ele pode esperar por 10 horas, imprimir 260 pedaços de forma de onda de ECG e imprimir 180 minutos continuamente o melhor estado DC para satisfazer a necessidade de pacientes visitantes e exame físico.

Ele tem Build-in de armazenamento com grande capacidade, e pode memória mais de 1000 casos, que é fácil para a revisão médico e estatística.

O chinês da sustentação, inglês, espanhol, turco, polonês, italiano, francês, alemão, Português, Cazaquistão, russo que opera a relação, pode imprimir tais relatórios da língua do acima.', '/img/produtos/eletrocardiografos/eletrocardiografo-03-canais-ecg-300g.webp', true),
  ('Eletrocardiógrafo 12 Canais ECG 1200G', 'eletrocardiografo-12-canais-ecg-1200g', 'diagnostico', 'eletrocardiografos', 'Eletrocardiógrafo Contec de 12 canais com tela touch e laudo interpretativo ECG1200g

O Eletrocardiógrafo de 12 canais é um tipo de eletrocardiógrafo que reúne sinais de ECG de 12 derivações simultaneamente e imprime as formas de onda de

ECG com o sistema de impressão térmica.

Sistema Interpretativo:

Além de medir, também tem função de analisar e diagnosticar automaticamente parâmetros convencionais de ECG para reduzir a carga do médico e melhorar a eficiência do trabalho.

Principais funções:

-Gravação e exibição de formas de onda de ECG de maneira manual / automática;

-Medição e diagnósticos dos parâmetros da forma de onda do ECG automaticamente;

-Falta de eletrodo e falta de papel;

-Sinais de ECG de 12 canais de forma sincronizada;

-Múltiplos formatos de relatório

Características técnicas:

-Display Grande 8 Polegadas Colorido com tela de 800x600 pontos de cor LCD;

-Modo de operação por Touch Screen (toque na tela) ou botões;

-Software com download gratuito compatível com Windows XP/7/8/8.1/10

-Interface em vários idiomas incluindo o português

-Detector de marca passo;

-Transferência de dados;

-Proteção contra descarga de desfibrilador;

-Bateria recarregável com até 3 horas de duração;

-Possui impressão térmica de alta resolução (8 pontos/mm), não necessita de ajuste e com frequência de gravação de até 150Hz;

-Possui conexão para impressão externa;

-Gravação em tempo real (Real-Time) de forma contínua do ECG em 12 canais com exatidão e clareza;

-Indicações dos sinais de derivações, sensibilidade, velocidade do papel, estado do filtro, etc;

-Circuito de proteção com desligamento automático ajustável;

-Memória com banco de dados para armazenamento de mais de 1000 exames.', '/img/produtos/eletrocardiografos/eletrocardiografo-12-canais-ecg-1200g.webp', true),
  ('Monitor Dopler Vascular 7001 Vn', 'monitor-dopler-vascular-7001-vn', 'diagnostico', 'monitor-dopler-vascular', 'DOPPLER VASCULAR PORTÁTIL DF-7001 VN

Modelo portátil, utilizado no diagnóstico e monitorização de pulsações de difícil percepção e baixa pressão sanguínea. Possibilita diagnóstico de trombose venosa profunda, localização de vasos para cateterizarão. Tomada do I.T.B. índice Tornozelo/Braquial, para verificação de doença vascular periférica, auxiliando em diversas cirurgias vasculares. Gabinete e transdutor em material ABS de alto impacto que evita a oxidação e deterioração ao longo do tempo, proporcionando excelente aparência estética, muito mais facilidade de limpeza e higienização, segurança necessária tanto para o médico quanto ao paciente. Alojamento para transdutor fixado na lateral do gabinete. Saída para fone de ouvido ou gravador de som. Registro ANVISA. Todos componentes usados neste produto não são prejudiciais à saúde e podem ser higienizados com produtos assépticos, como álcool doméstico e germicida.', '/img/produtos/monitor-dopler-vascular/monitor-dopler-vascular-7001-vn.webp', true),
  ('Comem Star 8000', 'comem-star-8000', 'diagnostico', 'monitores', '', '/img/produtos/monitores/comem-star-8000.webp', true),
  ('Contec Cms 9000', 'contec-cms-9000', 'diagnostico', 'monitores', '', '/img/produtos/monitores/contec-cms-9000.webp', true),
  ('Monitor Bistos BT770', 'monitor-bistos-bt770', 'diagnostico', 'monitores', '', '/img/produtos/monitores/monitor-bistos-bt770.webp', true),
  ('Sensor de Oximetria Dixtal Adulto Tipo Clip', 'sensor-de-oximetria-dixtal-adulto-tipo-clip', 'diagnostico', 'sensores-de-oximetria', '', '/img/produtos/sensores-de-oximetria/sensor-de-oximetria-dixtal-adulto-tipo-clip.webp', true),
  ('Sensor de Oximetria GE Adulto Tipo Clip', 'sensor-de-oximetria-ge-adulto-tipo-clip', 'diagnostico', 'sensores-de-oximetria', '', '/img/produtos/sensores-de-oximetria/sensor-de-oximetria-ge-adulto-tipo-clip.webp', true),
  ('Sensor de Oximetria Masimo', 'sensor-de-oximetria-masimo', 'diagnostico', 'sensores-de-oximetria', '', '/img/produtos/sensores-de-oximetria/sensor-de-oximetria-masimo.webp', true),
  ('Sensor de Oximetria Mindray Infantil', 'sensor-de-oximetria-mindray-infantil', 'diagnostico', 'sensores-de-oximetria', '', '/img/produtos/sensores-de-oximetria/sensor-de-oximetria-mindray-infantil.webp', true),
  ('Sensor de Oximetria Nellcor Oximax Tipo Soft', 'sensor-de-oximetria-nellcor-oximax-tipo-soft', 'diagnostico', 'sensores-de-oximetria', '', '/img/produtos/sensores-de-oximetria/sensor-de-oximetria-nellcor-oximax-tipo-soft.webp', true),
  ('Estetoscópio Duplo Linha Black', 'estetoscopio-duplo-linha-black', 'diagnostico', 'tensiometros-e-estetoscopios', '', '/img/produtos/tensiometros-e-estetoscopios/estetoscopio-duplo-linha-black.webp', true),
  ('Estetoscópio Duplo Rappaport', 'estetoscopio-duplo-rappaport', 'diagnostico', 'tensiometros-e-estetoscopios', '', '/img/produtos/tensiometros-e-estetoscopios/estetoscopio-duplo-rappaport.webp', true),
  ('Estetoscópio Duplo Simples', 'estetoscopio-duplo-simples', 'diagnostico', 'tensiometros-e-estetoscopios', '', '/img/produtos/tensiometros-e-estetoscopios/estetoscopio-duplo-simples.webp', true),
  ('Estetoscópio Simples', 'estetoscopio-simples', 'diagnostico', 'tensiometros-e-estetoscopios', '', '/img/produtos/tensiometros-e-estetoscopios/estetoscopio-simples.webp', true),
  ('Pera com Válvula', 'pera-com-valvula', 'diagnostico', 'tensiometros-e-estetoscopios', '', '/img/produtos/tensiometros-e-estetoscopios/pera-com-valvula.webp', true),
  ('Tensiômetro Aneróide Adulto', 'tensiometro-aneroide-adulto', 'diagnostico', 'tensiometros-e-estetoscopios', '', '/img/produtos/tensiometros-e-estetoscopios/tensiometro-aneroide-adulto.webp', true),
  ('Tensiômetro Aneróide Adulto Obeso', 'tensiometro-aneroide-adulto-obeso', 'diagnostico', 'tensiometros-e-estetoscopios', '', '/img/produtos/tensiometros-e-estetoscopios/tensiometro-aneroide-adulto-obeso.webp', true),
  ('Tensiômetro Aneróide Adulto com Estetoscópio Simples', 'tensiometro-aneroide-adulto-com-estetoscopio-simples', 'diagnostico', 'tensiometros-e-estetoscopios', '', '/img/produtos/tensiometros-e-estetoscopios/tensiometro-aneroide-adulto-com-estetoscopio-simples.webp', true),
  ('Tensiômetro Aneroide Adulto de Pedestal', 'tensiometro-aneroide-adulto-de-pedestal', 'diagnostico', 'tensiometros-e-estetoscopios', '', '/img/produtos/tensiometros-e-estetoscopios/tensiometro-aneroide-adulto-de-pedestal.webp', true),
  ('Cardioversor Ecafix MDF 04B', 'cardioversor-ecafix-mdf-04b', 'emergencia', 'cardioversores', 'Cardioversor e Desfibrilador bifásico da marca Ecafix-FUNBEC.

Gabinete , portátil, em caixa de material sintético de alto impacto, com alça de transporte e compartimento para a fixação das pás, composto de Monitor (ECG) e Desfibrilador (Bifásico) em uma única unidade.

Alimentação em rede elétrica de 110-220 volts com chaveamento automático e bateria interna recarregável.

Interface USB para acesso de dados e Registrador térmico, em tempo real e para dados gravados (ECG, Eventos e Auto teste).

Monitor , com 03 canais de ECG, 07 derivações, indicação digital da Frequência Cardíaca de 0 a 250 BPM, alarme de bradi e taquicardia com ajuste digital, alarme de eletrodo solto, pré-amplificador flutuante, proteção contra descarga de Desfibrilador, sinal visual e sonoro da onda “R”, monitoração de ECG através do cabo paciente ou através das próprias pás do Desfibrilador, armazenamento de traçados de ECG, teclado de membrana sensível ao toque, congelamento de imagem, tela de cristal líquido (LCD-TFT) com 7 polegadas e com detecção de Marcapasso.

Visualização dos 04 “Eventos” mais recentes e da qualidade no nível de contato entre as pás.

Desfibrilador , bifásico, com circuito detector de impedância e dispositivo de sincronismo com monitor de ECG para cardioversão.

Teclado de membrana com indicação visual para seleção de energia e demais funções.

Jogo de pás (eletrodos de desfibrilação) externas intercambiáveis para uso adulto e infantil.

Possibilidade de utilização de pás internas para uso adulto e infantil, seleção automática da escala de energia (alta ou baixa) de acordo com o jogo de pás utilizado, comandos pelas pás externas de seleção, carga e descarga de energia.

02 escalas com 08 opções de energia selecionáveis (01, 02, 05, 10, 20, 30, 40 e 50 Joules, para desfibrilação interna adulto, interna e externa infantil e 30, 50, 100, 150, 200, 250, 300 e 360 Joules, para desfibrilação externa adulto).

Tempo máximo de carga de 6 segundos.

Circuito de “anula carga” automático, que cancela a energia selecionada após 45 segundos, ou manual, através de tecla no painel.

Comando de “Auto teste” com a checagem de 06 itens, com o armazenamento de até 09 acionamentos.

Teste das pás diretamente no equipamento, com lâmpada néon para indicação do disparo. Capacidade de armazenamento de até 100 eventos.

Bateria interna recarregável com capacidade para ao menos 150 disparos ou 12 horas de monitoração, quando em plena carga.

Impressora (opcional na versão BI) , térmica de alta resolução para registro de ECG, parâmetros de configuração, eventos e auto testes.', '/img/produtos/cardioversores/cardioversor-ecafix-mdf-04b.webp', true),
  ('Cardioversor Ecafix MDF03B', 'cardioversor-ecafix-mdf03b', 'emergencia', 'cardioversores', '1 canal, 7 derivações em monitor com display (LCD)

Seleção até 360 joules (monofásico), sincronismo da onda R para cardioversão

Possibilidade de pás internas e externas (adulto e infantil) - VENDIDO SEPARADAMENTE

Circuito anula carga automático (45s), dispositivo para teste de pás

Tempo de carga (360j): 15s / Bateria interna recarregável

Disponível também nas versões "S" (Parâmetro de oximetria) e "I" (impressora acoplada)

Caixa de material sintético de alto impacto com alça de transporte

Suportes para fixar as pás

Composto de Monitor e Desfibrilador em uma única unidade

Alimentação em rede elétrica de 90/230 volts com chaveamento automático e bateria interna recarregável

MONITOR CARDÍACO:

Monitoração de 01 canal de ECG;

07 derivações;

Indicação da Freqüência Cardíaca digital de 0 a 250 BPM;

Alarme de bradi e taquicardia com ajuste digital;

Alarme de eletrodo solto, pré-amplificador flutuante;

Proteção contra descarga de Desfibrilador;

Sinal sonoro da onda “R”;

Monitoração de ECG através do cabo paciente ou através das próprias pás do Desfibrilador;

Monitoração da saturação de Oximetria - SpO2 (\*Opcional "S");

Impressora térmica de alta resolução para registro de ECG, parâmetros de configuração, e eventos assinalados (\*Opcional "I");

Indicação manual de eventos para impressão (\*Opcional "I");

Uso te papel termo sensível de 58mm x 30m (\*Opcional "I");

Teclado de membrana sensível ao toque. Com imagem congelada, tela de cristal líquido luminosa com 5 polegadas.

DESFIBRILADOR:

Tecla Liga/Desliga de sincronismo com monitor para cardioversão;

Indicação luminosa da onda “R”;

Teclado de membrana com indicação visual (LEDs) para seleção de energia e funções;

Possibilidade de uso de pás internas e externas adulto e infantil, seleção automática das escalas de energia de acordo com a pá utilizada (adulto/infantil externo e adulto/infantil interno);

Escalas para seleção de carga, de 01, 02, 05, 10, 20, 30, 40 e 50 Joules para desfibrilação interna adulto, interna e externa infantil;

De 10, 20, 40, 80, 160, 240, 300 e 360 Joules para desfibrilação externa adulto;

Tempo de carga de 9 a 15 segundos dependendo da carga selecionada;

Circuito anula carga automático que cancela a energia selecionada após 45 segundos ou manual através de tecla no painel;

Teste das pás diretamente no equipamento, com lâmpada néon para indicação do disparo;

Bateria interna recarregável com capacidade para ate 40 disparos ou 2 horas de monitoração, quando', '/img/produtos/cardioversores/cardioversor-ecafix-mdf03b.webp', true),
  ('Desfibrilador Externo Automático Life 400 Plus Futura', 'desfibrilador-externo-automatico-life-400-plus-futura', 'emergencia', 'desfibrilador-externo-automatico-dea', '', '/img/produtos/desfibrilador-externo-automatico-dea/desfibrilador-externo-automatico-life-400-plus-futura.webp', true),
  ('Ion LED Pro - Instramed', 'ion-led-pro-instramed', 'emergencia', 'desfibrilador-externo-automatico-dea', '', '/img/produtos/desfibrilador-externo-automatico-dea/ion-led-pro-instramed.webp', true),
  ('Ionled - Instramed', 'ionled-instramed', 'emergencia', 'desfibrilador-externo-automatico-dea', '', '/img/produtos/desfibrilador-externo-automatico-dea/ionled-instramed.webp', true),
  ('Desfibrilador Ecafix DF03B', 'desfibrilador-ecafix-df03b', 'emergencia', 'desfibriladores', 'Portátil e compacto

Dotado de alça e suporte de pás no próprio gabinete para facilitar o transporte, sincronismo com monitor para cardioversão

Indicação luminosa da onda “R”.Teclado de membrana para seleção de energia e funções com indicação visual

Possibilidade de uso de pás internas e externas adultas e infantis, com seleção automática das escalas de energia de acordo com a pá utilizada (adulto externo, adulto/infantil interno e infantil externo)

Circuito anula carga automático que cancela a energia selecionada após 45 segundos ou através de tecla no painel, descarga acionada por rele selado a gás, para maior segurança e confiabilidade

Teste das pás diretamente no equipamento com lâmpada néon para indicação do disparo. Escalas de 01, 02, 05, 10, 20, 30, 40 e 50 Joules para desfibrilação interna adulto, interna e externa infantil. De 10, 20, 40, 80, 160, 240, 300 e 360 Joules para desfibrilação externa adulto

Tempo de carga de 09 a 15 segundos dependendo da carga selecionada (norma IEC 601.2)

Alimentação: Rede elétrica de 90/230 V, 50/60 Hz e bateria interna recarregável com capacidade para até 40 disparos de 360 Joules.', '/img/produtos/desfibriladores/desfibrilador-ecafix-df03b.webp', true),
  ('Desfibrilador Ecafix DF04-B', 'desfibrilador-ecafix-df04-b', 'emergencia', 'desfibriladores', 'Desfibrilador bifásico da marca Ecafix-FUNBEC.

Gabinete , portátil, em caixa de material sintético de alto impacto, com alça de transporte e compartimento para a fixação das pás.

Alimentação em rede elétrica de 110-220 volts com chaveamento automático e bateria interna recarregável.

Desfibrilador , bifásico, com dispositivo de sincronismo com monitor externo (não incluso) para cardioversão.

Teclado de membrana com indicação visual para seleção de energia e demais funções.

Jogo de pás (eletrodos de desfibrilação) externo intercambiáveis para uso adulto e infantil.

Possibilidade de uso de pás internas adulto ou infantil, seleção automática da escala de energia (alta ou baixa) de acordo com o jogo de pás utilizado, comando pelas pás externas de seleção, carga e descarga da energia.

02 escalas com 08 opções de energia selecionáveis (01, 02, 05, 10, 20, 30, 40 e 50 Joules, para desfibrilação interna adulto, interna e externa infantil e 30, 50, 100, 150, 200, 250, 300 e 360 Joules, para desfibrilação externa adulto).

Tempo máximo de carga de 6 segundos.

Circuito de “anula carga” automático, que cancela a energia selecionada após 45 segundos, ou manual, através de tecla no painel.

Dispositivo de teste das pás diretamente no equipamento, com lâmpada néon para indicação do disparo.

Bateria interna recarregável com capacidade para ao menos 150 disparos, quando em plena carga.', '/img/produtos/desfibriladores/desfibrilador-ecafix-df04-b.webp', true),
  ('Pás Adesivas Cmos Drake - Modelo Novo', 'pas-adesivas-cmos-drake-modelo-novo', 'emergencia', 'pas-adesivas', '', '/img/produtos/pas-adesivas/pas-adesivas-cmos-drake-modelo-novo.webp', true),
  ('Pás Adesivas Cmos Drake Infantil - Modelo Novo', 'pas-adesivas-cmos-drake-infantil-modelo-novo', 'emergencia', 'pas-adesivas', '', '/img/produtos/pas-adesivas/pas-adesivas-cmos-drake-infantil-modelo-novo.webp', true),
  ('Pás Adesivas Instramed', 'pas-adesivas-instramed', 'emergencia', 'pas-adesivas', '', '/img/produtos/pas-adesivas/pas-adesivas-instramed.webp', true),
  ('Pás Adesivas Compatível com DEA Zoll AED Plus', 'pas-adesivas-compativel-com-dea-zoll-aed-plus', 'emergencia', 'pas-adesivas', 'Zoll: séries E, M, R, AED Plus, AED Pro.', '/img/produtos/pas-adesivas/pas-adesivas-compativel-com-dea-zoll-aed-plus.webp', true),
  ('Pás Adesivas Descartáveis Cmos Drake - Modelo Antigo', 'pas-adesivas-descartaveis-cmos-drake-modelo-antigo', 'emergencia', 'pas-adesivas', '', '/img/produtos/pas-adesivas/pas-adesivas-descartaveis-cmos-drake-modelo-antigo.webp', true),
  ('Pás Adesivas Descartáveis para DEA Toth', 'pas-adesivas-descartaveis-para-dea-toth', 'emergencia', 'pas-adesivas', '', '/img/produtos/pas-adesivas/pas-adesivas-descartaveis-para-dea-toth.webp', true),
  ('Pás Adesivas para DEA Mindray', 'pas-adesivas-para-dea-mindray', 'emergencia', 'pas-adesivas', 'Medtronic Physiocontrol, Osatu Bexen, Cardioline, Mindray, Jousing, Stryker.', '/img/produtos/pas-adesivas/pas-adesivas-para-dea-mindray.webp', true),
  ('Pás Adesivas para DEA Nihon Kohden', 'pas-adesivas-para-dea-nihon-kohden', 'emergencia', 'pas-adesivas', 'Nihon Kohden, Instramed.', '/img/produtos/pas-adesivas/pas-adesivas-para-dea-nihon-kohden.webp', true),
  ('Pás Adesivas para DEA Zoll Medical Corp', 'pas-adesivas-para-dea-zoll-medical-corp', 'emergencia', 'pas-adesivas', 'Zoll Medical Corp.', '/img/produtos/pas-adesivas/pas-adesivas-para-dea-zoll-medical-corp.webp', true),
  ('Pás Adesivas para Philips', 'pas-adesivas-para-philips', 'emergencia', 'pas-adesivas', 'Philips HEARTSTART: FR2, FR2+, FR3, MRx, XL, XL+ HEARTSTREAM FORERUNNER,

Heartstart Mrx, Heartstart XL, Heartstart XL+.', '/img/produtos/pas-adesivas/pas-adesivas-para-philips.webp', true),
  ('Colar Cervical de APH', 'colar-cervical-de-aph', 'emergencia', 'material-de-resgate-aph', '', '/img/produtos/material-de-resgate-aph/colar-cervical-de-aph.webp', true),
  ('Jogo de Talas em Eva', 'jogo-de-talas-em-eva', 'emergencia', 'material-de-resgate-aph', '', '/img/produtos/material-de-resgate-aph/jogo-de-talas-em-eva.webp', true),
  ('Prancha em Polietileno', 'prancha-em-polietileno', 'emergencia', 'material-de-resgate-aph', '', '/img/produtos/material-de-resgate-aph/prancha-em-polietileno.webp', true),
  ('Protetor de Cabeça Tipo Head Block', 'protetor-de-cabeca-tipo-head-block', 'emergencia', 'material-de-resgate-aph', '', '/img/produtos/material-de-resgate-aph/protetor-de-cabeca-tipo-head-block.webp', true),
  ('Bomba Vácuo Aspiradora 3 Litros MD300', 'bomba-vacuo-aspiradora-3-litros-md300', 'respiratoria', 'aspiradores-cirurgicos', 'MD300 - BOMBA VÁCUO ASPIRADORA MEDICATE

Com design moderno e portátil o aspirador cirúrgico de sangue e saliva MD300 é indicado para procedimentos cirúrgicos e odontológicos, ideal para uso home care, hospitalar, ambulatorial e clínico.

Projetado para aspiração de líquidos e secreções, pode ser utilizado em pequenas e médias cirurgias, pois utiliza um motor elétrico de alto rendimento com 2 pistões e cabeçote duplo de potência nominal total de 79W ou aprox. 1/10 CV, vácuo de até 25 in Hg e fluxo de ar em torno de 24L/min, proporcionando uma aspiração contínua, suave e silenciosa.

Desenvolvido para oferecer maior segurança ao usuário o MD300 é bivolt automático, possui vacuômetro e regulador e de vácuo, frasco coletor de policarbonato autoclavável com capacidade de 3 litros e tampa com válvula de segurança contra trasbordamento. Além disso, também utiliza um filtro bacterial viral hidrofóbico para proteger o equipamento da entrada de sujeira, líquidos e secreções.

Possui conexão para pedal de acionamento que está disponível como item opcional.

Totalmente portátil tem alça para transporte, mas também oferece como opcional suporte para transporte metálico com rodízios com trava.

Design moderno

Leve e portátil

Válvula de segurança

Contra transbordamento

Frasco coletor de 3L

Autoclavável

Bivolt Automático 127/220V

Pedal de acionamento e suporte com rodízios

Opcionais

Segurança para sua família

Fabricação nacional com Certificação Inmetro

Conteúdo da embalagem:

01 Bomba vácuo aspiradora com alça para transporte 01 Frasco coletor de 3L (autoclavável)

01 Tampa de plástico com válvula de segurança 01 Filtro bacterial viral hidrofóbico 01 Mangueiras de silicone de 2m paciente 01 Mangueiras de silicone vácuo

OPCIONAIS:

01 Suporte metálico com 5 rodízios com trava (adquirido separadamente)

01 Pedal de acionamento (adquirido separadamente)', '/img/produtos/aspiradores-cirurgicos/bomba-vacuo-aspiradora-3-litros-md300.webp', true),
  ('Bomba Vácuo Aspiradora 6 Litros MD600', 'bomba-vacuo-aspiradora-6-litros-md600', 'respiratoria', 'aspiradores-cirurgicos', 'MD600 - BOMBA VÁCUO ASPIRADORA MEDICATE - 6 LITROS

Com design ultramoderno o aspirador cirúrgico de sangue e saliva MD600 é indicado para procedimentos cirúrgicos de pequeno a grande porte, ideal para uso em clínicas e hospitais.

Projetado para aspiração de líquidos e secreções, pode ser utilizado em pequenas, médias e grandes cirurgias, pois utiliza um motor elétrico de alto rendimento com sistema compressor oscilante de potência nominal total de 200W ou aprox. 1/4 CV, vácuo de até 25 in Hg e fluxo de ar em torno de 70L/min, proporcionando uma aspiração contínua, suave e silenciosa.

Desenvolvido para oferecer maior segurança ao usuário o MD600 é bivolt automático, possui vacuômetro e regulador e de vácuo, 2 frascos coletores de policarbonato autoclavável com capacidade de 3 litros cada e tampa com válvula de segurança contra trasbordamento. Além disso, também conta com um filtro bacterial viral hidrofóbico para proteger o equipamento da entrada de sujeira, líquidos e secreções.

Possui pedal de acionamento e suporte para transporte metálico com rodízios com trava.

Design moderno

Leve e portátil

Válvula de segurança

Contra transbordamento

Frascos coletores de 3L

Autoclaváveis

Bivolt 127/220V através de chave seletora

Pedal de acionamento e suporte com rodízios

Opcionais

Segurança

Fabricação nacional com Certificação Inmetro

Conteúdo da embalagem:

01 Bomba vácuo aspiradora com alça para transporte 02 Frascos coletor de 3L (autoclaváveis)

01 Tampa de plástico com válvula de segurança 01 Filtro bacterial viral hidrofóbico 01 Mangueiras de silicone de 2m – paciente 01 Mangueiras de silicone – vácuo 01 Pedal de acionamento 01 Suporte metálico com 5 rodízios com trava', '/img/produtos/aspiradores-cirurgicos/bomba-vacuo-aspiradora-6-litros-md600.webp', true),
  ('Bomba Vácuo Aspiradora MD100 de 1 Litro', 'bomba-vacuo-aspiradora-md100-de-1-litro', 'respiratoria', 'aspiradores-cirurgicos', 'MD100 - BOMBA VÁCUO ASPIRADORA MEDICATE - 1 LITRO

O aspirador cirúrgico de sangue e saliva MD100 é indicado para pequenos procedimentos cirúrgicos e odontológicos, ideal para uso em home care, ambulatórios, consultórios e pequenas clínicas.

Com design moderno, é leve, prático, portátil e de fácil manuseio para otimizar os cuidados com a saúde do paciente.

Possui motor elétrico de 1/10HP, compressor com pistão oscilante, isento de óleo, bivolt 127/220V através de chave seletora, vácuo máximo entre 18 e 21 inHg, vazão de ar livre 15 L/min. Frasco plástico transparente com capacidade de 1 litro com tampa e válvula de segurança contra transbordamento de líquidos.

Design moderno

Leve e portátil

Prático

Fácil manuseio

Frasco coletor de 1L

Graduado

Bivolt 127/220V através de chave seletora

Válvula de segurança

Contra transbordamento

Segurança para sua família

Fabricação nacional com Certificação Inmetro

Conteúdo da embalagem:

01 Bomba vácuo aspiradora 01 Frasco coletor de 1L 01 Tampa de plástico com válvula de segurança 01 Mangueiras de silicone de 2m – paciente 01 Mangueiras de silicone – vácuo', '/img/produtos/aspiradores-cirurgicos/bomba-vacuo-aspiradora-md100-de-1-litro.webp', true),
  ('Bomba a Vácuo Aspiradora com Bateria', 'bomba-a-vacuo-aspiradora-com-bateria', 'respiratoria', 'aspiradores-cirurgicos', 'O aspirador cirúrgico de sangue e saliva MD100BT é leve, prático, portátil e de fácil manuseio. Possui bateria integrada recarregável com autonomia de 2 horas contínuas, carregada.

Possui painel sonoro e luminoso, potenciômetro e vacuômetro para ajuste de sucção preciso. Acompanha tampa com válvula de proteção anti-transbordamento, filtro hidrofóbico e mangueira de silicone com 2m de comprimento.

Bivolt automático, fácil limpeza, não requer manutenção e lubrificantes e baixo consumo de energia elétrica.

Vácuo máximo 580 mmhg ou 22 pol.Hg, vazão de ar livre 25 LPM.

Conteúdo da embalagem:

01 Bomba vácuo aspiradora com Bateria 01 Frasco coletor de 1L 01 Tampa de plástico com válvula de segurança 01 Mangueiras de silicone de 2m – paciente 01 Mangueiras de silicone – vácuo 01 Fonte de Alimentação 01 Manual de Instruções 01 Relação de Assistências Técnicas', '/img/produtos/aspiradores-cirurgicos/bomba-a-vacuo-aspiradora-com-bateria.webp', true),
  ('Espaçador Medicate', 'espacador-medicate', 'respiratoria', 'inaladores-e-nebulizadores', 'ESPAÇADOR BI-VALVULADO MEDICATE

O Espaçador Bi-valvulado Medicate é um dispositivo desenvolvido com design e tecnologia avançadas para aumentar a eficácia dos medicamentos em spray utilizados no tratamento da asma, bronquite, e outras doenças respiratórias. Otimiza a técnica de inalação do medicamento spray através de inalador dosimetrado (MDI), mais conhecidos como bombinhas, pois melhora a coordenação na inspiração do medicamento, diminuindo a deposição na orofaringe e aumentando a deposição pulmonar.

Indicado para uso individual adulto e infantil, pode ser utilizado com máscara ou diretamente no bocal.

Possui câmera com capacidade de 250ml, encaixe universal compatível com a maioria dos medicamentos em spray do mercado e bocal com válvula unidirecional em silicone para evitar desperdício de medicamento.

Portátil, é reutilizável e totalmente lavável, podendo ser desmontado para higienização.

Acompanha 1 máscara com tamanho a sua escolha:

Tamanhos

Comprimento

Largura

Altura

Referência\*

PEQUENA 7,5 cm 4,4 cm 8,6 cm 0 a 3 anos de idade

MÉDIA 8,3 cm 4,9 cm 9,7 cm 3 a 13 anos de idade

GRANDE 9,0 cm 6,0 cm 12,5 cm

Acima de 13 anos

\*A idade informada é apenas uma referência, podendo variar de acordo com o tamanho do rosto do usuário. Por isso, recomendamos que a escolha do tamanho da máscara seja feita a partir das dimensões informadas em cm.

Aumenta a eficiência dos medicamentos

Câmara com capacidade de 250ml

Economia de medicamento

Bocal com válvula unidirecional

Portátil e prático

Leve e fácil de usar

Reutilizável

Totalmente lavável

Design inovador

Pode ser usado com máscara ou diretamente no bocal 3 opções de máscara

Pequena, média ou grande produzidas em PVC atóxico

Conteúdo da embalagem:

01 Espaçador bi-valvulado 01 Máscara (pequena, média OU grande)', '/img/produtos/inaladores-e-nebulizadores/espacador-medicate.webp', true),
  ('Espaçador para Medicamentos', 'espacador-para-medicamentos', 'respiratoria', 'inaladores-e-nebulizadores', 'O espaçador para medicamento em aerosol adulto e infantil G-Tech Clear é um produto desenvolvido com design e tecnologia avançada para aumentar a eficácia dos medicamentos para asma e bronquite. Sua principal função é fazer com que somente a substância ativa chegue até os pulmões, retendo o propelente no interior do espaçador, além de melhor coordenar a inspiração do medicamento. É compatível com todos os dispensadores de medicamentos aerosol. Equipamento de uso individual. Produto também conhecido como bombinha.

Garantia: 90 dias.

Cor: Laranja. Como usar?

1 - Agite a bombinha e encaixe no adaptador.

2 - Coloque o bocal do espaçador na sua boca e expire normalmente.

3 - Pressione a bombinha uma vez para liberar uma dose de medicamento.

4 - Inspire imediatamente, devagar, pela boca.

5 - Remova o espaçador de sua boca.

6 - Segure a respiração durante 5 a 10 segundos (para melhorar a deposição do medicamento). Expire normalmente.

7 - Aguarde 30 segundos. Se o seu médico prescreveu mais de uma dose de medicamento, repita as etapas 1 e 2, com uma dose de cada vez.

8 - Depois de utilizar, remova a bombinha. O espaçador foi projetado para guardar a bombinha em seu interior, caso você queira.

9 - Pode-se adaptar uma máscara (pequena, média ou grande). Peça informações ao seu médico.

10 - O espaçador deve ser limpo uma vez por semana. Separe as duas partes - bocal e corpo.

11 - Lave com água morna (apenas o corpo), usando detergente suave. Passe todas as partes por água limpa, sacuda o excesso de água e deixe secar ao ar.

ITENS INCLUSOS 1 Espaçador para Medicamento em Aerosol Adulto e Infantil G-Tech Clear 1 Máscara Adulto 1 Máscara Infantil.', '/img/produtos/inaladores-e-nebulizadores/espacador-para-medicamentos.webp', true),
  ('Inalador Nebulizador Portátil Air Mesh Colors com Bateria Recarregável, Cabo USB e Fonte de Alimentação', 'inalador-nebulizador-portatil-air-mesh-colors-com-bateria-re', 'respiratoria', 'inaladores-e-nebulizadores', 'CONHEÇA O INALADOR AIR MESH COLORS

Único deste tipo fabricado no BRASIL, o inalador AIR MESH COLORS é super prático para o dia-a-dia, pequeno, fácil de transportar, pode ser utilizado em qualquer lugar, já que possui bateria recarregável.

Indispensável no tratamento de problemas respiratórios o inalador AIR MESH COLORS é portátil, silencioso, compacto e muito fácil de usar. Realiza inalação com o paciente em qualquer posição, inclusive deitado, sem derramar a medicação. Não possui restrição, possibilita o uso de todos os medicamentos líquidos indicados para nebulização, podendo ser utilizado por crianças, adultos e idosos.

A moderna tecnologia Mesh de rede vibratória permite a nebulização de todos os medicamentos de maneira eficaz, silenciosa, com grande volume de névoa e sem desperdício. Fácil de limpar, o inalador possui um sistema de limpeza integrado exclusivo.

Possui timer de desligamento automático e dispensa o uso de copinhos descartáveis, já que o medicamento é colocado diretamente no reservatório. Fácil de limpar, o inalador possui um sistema de limpeza integrado exclusivo.

Para garantir o conforto e segurança do usuário o produto acompanha 2 máscaras (1 adulto e 1 infantil) macias e confortáveis, produzidas em material atóxico com confiabilidade confirmada por testes de biocompatibilidade.

Prático e portátil

Bateria recarregável

Não derrama

Inalação em todas as posições, até deitado

Sem restrição de medicamento

Use qualquer medicamento inalatório líquido

Silencioso

Grande poder de névoa sem fazer barulho

Fácil de limpar

Exclusivo Sistema de limpeza integrado

Segurança para sua família

Fabricação nacional com Certificação Inmetro

Conteúdo da embalagem:

01 Inalador nebulizador rede vibratória COM BATERIA (01 unidade principal e 01 reservatório de medicamento)

01 Máscara adulto 01 Máscara infantil 01 Boquilha 01 Cabo USB 01 Estojo de transporte 01 Fonte de alimentação', '/img/produtos/inaladores-e-nebulizadores/inalador-nebulizador-portatil-air-mesh-colors-com-bateria-re.webp', true),
  ('Inalador Portátil Mesh Mask', 'inalador-portatil-mesh-mask', 'respiratoria', 'inaladores-e-nebulizadores', 'Inalação de forma prática, totalmente silenciosa e sem usar as mãos.

O Mesh Mask da Medicate é pequeno e extremamente leve, pesando apenas 25g.

Ideal para ser usado diretamente no rosto, deixando as mãos livres.

A Técnologia Mesh – Rede Vibratória é eficaz, e não possui restrição aos medicamentos indicados para nebulização.

Acompanha unidade principal/reservatório de medicamentos, cabo USB, 2 máscaras (adulto e infantil), elástico, conector tipo C e bolsa para transporte.

Características Técnicas:

Referência: VP-M12

Modo de Alimentação: 5V DC 1A

Desligamento autom.

Dimensões (CM): 4 x 4 x 5,7cm

Peso: 25 g

Recipiente 8ml

Nº Anvisa: 10332179010

ATENÇÃO: Não possui bateria interna, deve ser usado através de uma conexão USB ou TIPO C (cabo e conectores inclusos)', '/img/produtos/inaladores-e-nebulizadores/inalador-portatil-mesh-mask.webp', true),
  ('Inalador/nebulizador Compressor com Regulagem', 'inalador-nebulizador-compressor-com-regulagem', 'respiratoria', 'inaladores-e-nebulizadores', 'Modelo compressor de uso residencial.

Acompanha exclusivo copo nebulizador com tampa reguladora com ajuste de intensidade da névoa em 3 níveis: intensa moderada e suave.

INCLUSO:

1 máscara adulto e 1 máscara infantil.

Mangueira em PVC atóxico com conector rosca.

Copa nebulizador tipo regulagem.

CARACTERÍSTICAS TÉCNICAS:

Dimensões (cm): 12x18x16

Peso: 1,46kg

Bivolt através de chave seletora

Vazão ar livre: 10l/min.

Motor elétrico: 1/10HP compressor com pistão oscilante

Nº ANVISA: 10332170036', '/img/produtos/inaladores-e-nebulizadores/inalador-nebulizador-compressor-com-regulagem.webp', true),
  ('Nebulizador Hospitalar 4 Saídas Bi-power MD400-BP', 'nebulizador-hospitalar-4-saidas-bi-power-md400-bp', 'respiratoria', 'inaladores-e-nebulizadores', 'MD400BP - NEBULIZADOR HOSPITALAR MEDICATE BI-POWER - 4 SAÍDAS

Ideal para uso em consultórios, clínicas, hospitais, ambulatórios e pronto-socorro, o MD400BP - NEBULIZADOR HOSPITALAR MEDICATE BI-POWER possui design arrojado, é portátil, prático e resistente. Possui válvula de ar com 4 saídas, alça para transporte, suporte para 4 copinhos, bivolt automático (127/220V), isento de óleo, dois motocompressores com pistão oscilante e proteção térmica.

Projetado para atender clínicas e hospitais este equipamento funciona com 2 motores elétricos de alto rendimento que podem ser acionados separadamente, proporcionando assim uma inalação suave e contínua tanto para um único paciente quanto para até quatro pacientes simultaneamente.

Para garantir o conforto e segurança do usuário o produto acompanha 4 kits de nebulização com copo nebulizador turbo (com escala graduada e capacidade para até 10 ml) e 2 máscaras (1 adulto e 1 infantil) macias e confortáveis, produzidas em material atóxico com confiabilidade confirmada por testes de biocompatibilidade.

Totalmente portátil tem alça para transporte, mas também oferece como opcional suporte para transporte metálico com rodízios com trava.

Prático

Válvula de ar com 4 saídas que funcionam simultaneamente

Portátil

Possui alça para transporte

Design arrojado

Suporte para 4 copos

Copo nebulizador Turbo

Graduado e com alto poder de névoa

Suporte com rodízios

Opcional

Segurança para sua família

Fabricação nacional com Certificação Inmetro

Conteúdo da embalagem:

01 Inalador 04 Máscaras adulto 04 Máscaras infantil 04 Copos nebulizadores turbo 04 Mangueiras de ar

OPCIONAL:

01 Suporte com 5 rodízios com trava', '/img/produtos/inaladores-e-nebulizadores/nebulizador-hospitalar-4-saidas-bi-power-md400-bp.webp', true),
  ('Nebulizador Hospitalar 8 Saídas com Suporte MD800', 'nebulizador-hospitalar-8-saidas-com-suporte-md800', 'respiratoria', 'inaladores-e-nebulizadores', 'MD800 - NEBULIZADOR HOSPITALAR MEDICATE - 8 SAÍDAS

Ideal para uso em consultórios, clínicas, hospitais, ambulatórios e pronto-socorro, o MD800 - NEBULIZADOR HOSPITALAR MEDICATE - 8 SAÍDAS possui design arrojado, é portátil, prático e resistente. Possui válvula de ar com 8 saídas, suporte para 8 copinhos, bivolt automático (127/220V), isento de óleo, motocompressor com proteção térmica.

Projetado para atender clínicas e hospitais este equipamento funciona com um motor elétrico de alto rendimento, proporcionando assim uma inalação suave e contínua tanto para um único paciente quanto para até oito pacientes simultaneamente.

Para garantir o conforto e segurança do usuário o produto acompanha 8 kits de nebulização com copo nebulizador turbo (com escala graduada e capacidade para até 10 ml) e 2 máscaras (1 adulto e 1 infantil) macias e confortáveis, produzidas em material atóxico com confiabilidade confirmada por testes de biocompatibilidade.

Totalmente portátil possui suporte para transporte metálico com rodízios com trava.

Prático

Válvula de ar com 8 saídas que funcionam simultaneamente

Portátil

Suporte com rodízios

Design arrojado

Suporte para 8 copos

Copo nebulizador Turbo

Graduado e com alto poder de névoa

Alto rendimento

Melhor custo benefício

Segurança para sua família

Fabricação nacional com Certificação Inmetro

Conteúdo da embalagem:

01 Inalador 08 Máscaras adulto 08 Máscaras infantil 08 Copos nebulizadores turbo 08 Mangueiras de ar 01 Suporte com 5 rodízios com trava', '/img/produtos/inaladores-e-nebulizadores/nebulizador-hospitalar-8-saidas-com-suporte-md800.webp', true),
  ('Nebulizador Turbo MD1000 Azt', 'nebulizador-turbo-md1000-azt', 'respiratoria', 'inaladores-e-nebulizadores', 'MD1000AZT – INALADOR NEBULIZADOR TURBO MEDICATE

O inalador nebulizador MD1000AZT é indicado para nebulização residencial, uso adulto e infantil, de fácil manuseio, acompanha máscaras ultra macias.

O inalador pneumático MD1000AZT é bivolt através de chave seletora, com um compressor de ar comprimido de elevado desempenho aliado a um copinho Turbo de alta performance, garantindo uma nebulização intensa, com maior produção de névoa e menor tempo de nebulização.

O copinho possui escala graduada e não requer uso de copo descartável, além disso, não possui restrição ao uso de nenhum tipo de medicamento.

Para garantir o conforto e segurança do usuário o produto acompanha 2 máscaras (1 adulto e 1 infantil) macias e confortáveis, produzidas em material atóxico com confiabilidade confirmada por testes de biocompatibilidade.

Copinho Turbo

Graduado e com alto poder de névoa

Bivolt através de chave seletora 127V e 220V

Sem restrição de medicamento

Use qualquer remédio inalatório

Segurança para sua família

Fabricação nacional com Certificação Inmetro

Conteúdo da embalagem:

01 Inalador 01 Máscara adulto 01 Máscara infantil 01 Copo nebulizador turbo 01 Mangueira de ar', '/img/produtos/inaladores-e-nebulizadores/nebulizador-turbo-md1000-azt.webp', true),
  ('Circuito Intermed Inter 5', 'circuito-intermed-inter-5', 'respiratoria', 'oxigenacao', '', '/img/produtos/oxigenacao/circuito-intermed-inter-5.webp', true),
  ('Cânulas Guedel', 'canulas-guedel', 'respiratoria', 'oxigenacao', '', '/img/produtos/oxigenacao/canulas-guedel.webp', true),
  ('Filtro Hmef', 'filtro-hmef', 'respiratoria', 'oxigenacao', '', '/img/produtos/oxigenacao/filtro-hmef.webp', true),
  ('Fluxômetro de Ar Comprimido 0-15', 'fluxometro-de-ar-comprimido-0-15', 'respiratoria', 'oxigenacao', '', '/img/produtos/oxigenacao/fluxometro-de-ar-comprimido-0-15.webp', true),
  ('Fluxômetro de Oxigênio 0-15', 'fluxometro-de-oxigenio-0-15', 'respiratoria', 'oxigenacao', '', '/img/produtos/oxigenacao/fluxometro-de-oxigenio-0-15.webp', true),
  ('Fluxômetro de Óxido Nitroso 0-15', 'fluxometro-de-oxido-nitroso-0-15', 'respiratoria', 'oxigenacao', '', '/img/produtos/oxigenacao/fluxometro-de-oxido-nitroso-0-15.webp', true),
  ('Mangueira de Ar Comprimido', 'mangueira-de-ar-comprimido', 'respiratoria', 'oxigenacao', '', '/img/produtos/oxigenacao/mangueira-de-ar-comprimido.webp', true),
  ('Mangueira de Oxigênio', 'mangueira-de-oxigenio', 'respiratoria', 'oxigenacao', '', '/img/produtos/oxigenacao/mangueira-de-oxigenio.webp', true),
  ('Máscara Não Reinalante', 'mascara-nao-reinalante', 'respiratoria', 'oxigenacao', '', '/img/produtos/oxigenacao/mascara-nao-reinalante.webp', true),
  ('Máscara de Venturi', 'mascara-de-venturi', 'respiratoria', 'oxigenacao', '', '/img/produtos/oxigenacao/mascara-de-venturi.webp', true),
  ('Tomadas Duplas', 'tomadas-duplas', 'respiratoria', 'oxigenacao', '', '/img/produtos/oxigenacao/tomadas-duplas.webp', true),
  ('Umidificador de Oxigênio 250 Ml', 'umidificador-de-oxigenio-250-ml', 'respiratoria', 'oxigenacao', '', '/img/produtos/oxigenacao/umidificador-de-oxigenio-250-ml.webp', true),
  ('Válvula de Rede de Oxigênio', 'valvula-de-rede-de-oxigenio', 'respiratoria', 'oxigenacao', '', '/img/produtos/oxigenacao/valvula-de-rede-de-oxigenio.webp', true),
  ('Válvula de Rede de Ar Comprimido', 'valvula-de-rede-de-ar-comprimido', 'respiratoria', 'oxigenacao', '', '/img/produtos/oxigenacao/valvula-de-rede-de-ar-comprimido.webp', true),
  ('Válvula de Rede de Óxido Nitroso', 'valvula-de-rede-de-oxido-nitroso', 'respiratoria', 'oxigenacao', '', '/img/produtos/oxigenacao/valvula-de-rede-de-oxido-nitroso.webp', true),
  ('Bateria Descartável para DEA da Toth', 'bateria-descartavel-para-dea-da-toth', 'acessorios', 'baterias', '', '/img/produtos/baterias/bateria-descartavel-para-dea-da-toth.webp', true),
  ('Bateria para Cardioversor e DEA Cmos Drake', 'bateria-para-cardioversor-e-dea-cmos-drake', 'acessorios', 'baterias', '', '/img/produtos/baterias/bateria-para-cardioversor-e-dea-cmos-drake.webp', true),
  ('Bateria para Cardioversor/ Desfibrilador Ecafix', 'bateria-para-cardioversor-desfibrilador-ecafix', 'acessorios', 'baterias', '', '/img/produtos/baterias/bateria-para-cardioversor-desfibrilador-ecafix.webp', true),
  ('Bateria para DEA Life 400 Plus Futura (Modelo Novo)', 'bateria-para-dea-life-400-plus-futura-modelo-novo', 'acessorios', 'baterias', '', '/img/produtos/baterias/bateria-para-dea-life-400-plus-futura-modelo-novo.webp', true),
  ('Bateria para Desfibrilador Apolus', 'bateria-para-desfibrilador-apolus', 'acessorios', 'baterias', '', '/img/produtos/baterias/bateria-para-desfibrilador-apolus.webp', true),
  ('Bateria para Eletrocardiógrafo Bionet', 'bateria-para-eletrocardiografo-bionet', 'acessorios', 'baterias', '', '/img/produtos/baterias/bateria-para-eletrocardiografo-bionet.webp', true),
  ('Bateria para Eletrocardiógrafo Dixtal', 'bateria-para-eletrocardiografo-dixtal', 'acessorios', 'baterias', '', '/img/produtos/baterias/bateria-para-eletrocardiografo-dixtal.webp', true),
  ('Bateria para Eletrocardiógrafo Edan', 'bateria-para-eletrocardiografo-edan', 'acessorios', 'baterias', '', '/img/produtos/baterias/bateria-para-eletrocardiografo-edan.webp', true),
  ('Bateria para Eletrocardiógrafos Ecafix/ Emai', 'bateria-para-eletrocardiografos-ecafix-emai', 'acessorios', 'baterias', '', '/img/produtos/baterias/bateria-para-eletrocardiografos-ecafix-emai.webp', true),
  ('Bateria para Monitor Dixtal', 'bateria-para-monitor-dixtal', 'acessorios', 'baterias', '', '/img/produtos/baterias/bateria-para-monitor-dixtal.webp', true),
  ('Bateria para Monitor Draguer', 'bateria-para-monitor-draguer', 'acessorios', 'baterias', '', '/img/produtos/baterias/bateria-para-monitor-draguer.webp', true),
  ('Bateria para Monitores/ Cardioversores (Padrão)', 'bateria-para-monitores-cardioversores-padrao', 'acessorios', 'baterias', '', '/img/produtos/baterias/bateria-para-monitores-cardioversores-padrao.webp', true),
  ('Bateria para Oxímetro GE Trusat', 'bateria-para-oximetro-ge-trusat', 'acessorios', 'baterias', '', '/img/produtos/baterias/bateria-para-oximetro-ge-trusat.webp', true),
  ('Pac de Bateria para DEA da Zoll', 'pac-de-bateria-para-dea-da-zoll', 'acessorios', 'baterias', '', '/img/produtos/baterias/pac-de-bateria-para-dea-da-zoll.webp', true),
  ('Braçadeiras de PNI', 'bracadeiras-de-pni', 'acessorios', 'bracadeiras', '', '/img/produtos/bracadeiras/bracadeiras-de-pni.webp', true),
  ('Braçadeira para Aparelho de Pressão Digital Adulto', 'bracadeira-para-aparelho-de-pressao-digital-adulto', 'acessorios', 'bracadeiras', '', '/img/produtos/bracadeiras/bracadeira-para-aparelho-de-pressao-digital-adulto.webp', true),
  ('Braçadeira para Tensiômetr Aneróide Adulto', 'bracadeira-para-tensiometr-aneroide-adulto', 'acessorios', 'bracadeiras', '', '/img/produtos/bracadeiras/bracadeira-para-tensiometr-aneroide-adulto.webp', true),
  ('Cabo Tronco Draguer', 'cabo-tronco-draguer', 'acessorios', 'cabos-de-ecg-05-vias', '', '/img/produtos/cabos-de-ecg-05-vias/cabo-tronco-draguer.webp', true),
  ('Cabo de ECG 05 Vias Bionet BM3', 'cabo-de-ecg-05-vias-bionet-bm3', 'acessorios', 'cabos-de-ecg-05-vias', '', '/img/produtos/cabos-de-ecg-05-vias/cabo-de-ecg-05-vias-bionet-bm3.webp', true),
  ('Cabo de ECG 05 Vias Bionet BM5', 'cabo-de-ecg-05-vias-bionet-bm5', 'acessorios', 'cabos-de-ecg-05-vias', '', '/img/produtos/cabos-de-ecg-05-vias/cabo-de-ecg-05-vias-bionet-bm5.webp', true),
  ('Cabo de ECG 05 Vias Bistos', 'cabo-de-ecg-05-vias-bistos', 'acessorios', 'cabos-de-ecg-05-vias', '', '/img/produtos/cabos-de-ecg-05-vias/cabo-de-ecg-05-vias-bistos.webp', true),
  ('Cabo de ECG 05 Vias Comem/ Prolife', 'cabo-de-ecg-05-vias-comem-prolife', 'acessorios', 'cabos-de-ecg-05-vias', '', '/img/produtos/cabos-de-ecg-05-vias/cabo-de-ecg-05-vias-comem-prolife.webp', true),
  ('Cabo de ECG 05 Vias Dixtal (Padrão)', 'cabo-de-ecg-05-vias-dixtal-padrao', 'acessorios', 'cabos-de-ecg-05-vias', '', '/img/produtos/cabos-de-ecg-05-vias/cabo-de-ecg-05-vias-dixtal-padrao.webp', true),
  ('Cabo de ECG 05 Vias GE Dash', 'cabo-de-ecg-05-vias-ge-dash', 'acessorios', 'cabos-de-ecg-05-vias', '', '/img/produtos/cabos-de-ecg-05-vias/cabo-de-ecg-05-vias-ge-dash.webp', true),
  ('Cabo de ECG 05 Vias GE Datex Ohmeda', 'cabo-de-ecg-05-vias-ge-datex-ohmeda', 'acessorios', 'cabos-de-ecg-05-vias', '', '/img/produtos/cabos-de-ecg-05-vias/cabo-de-ecg-05-vias-ge-datex-ohmeda.webp', true),
  ('Cabo de ECG 05 Vias Philips', 'cabo-de-ecg-05-vias-philips', 'acessorios', 'cabos-de-ecg-05-vias', '', '/img/produtos/cabos-de-ecg-05-vias/cabo-de-ecg-05-vias-philips.webp', true),
  ('Rabicho de ECG 05 Vias Draguer', 'rabicho-de-ecg-05-vias-draguer', 'acessorios', 'cabos-de-ecg-05-vias', '', '/img/produtos/cabos-de-ecg-05-vias/rabicho-de-ecg-05-vias-draguer.webp', true),
  ('Cabo de 10 Vias Edan/ Schiller', 'cabo-de-10-vias-edan-schiller', 'acessorios', 'cabos-de-ecg-10-vias', '', '/img/produtos/cabos-de-ecg-10-vias/cabo-de-10-vias-edan-schiller.webp', true),
  ('Cabo de ECG 10 Vias Bionet', 'cabo-de-ecg-10-vias-bionet', 'acessorios', 'cabos-de-ecg-10-vias', '', '/img/produtos/cabos-de-ecg-10-vias/cabo-de-ecg-10-vias-bionet.webp', true),
  ('Cabo de ECG 10 Vias Compatível com Eletrocardiógrafo Dixtal EP12', 'cabo-de-ecg-10-vias-compativel-com-eletrocardiografo-dixtal', 'acessorios', 'cabos-de-ecg-10-vias', '', '/img/produtos/cabos-de-ecg-10-vias/cabo-de-ecg-10-vias-compativel-com-eletrocardiografo-dixtal.webp', true),
  ('Cabo de ECG 10 Vias Dixtal EP3', 'cabo-de-ecg-10-vias-dixtal-ep3', 'acessorios', 'cabos-de-ecg-10-vias', '', '/img/produtos/cabos-de-ecg-10-vias/cabo-de-ecg-10-vias-dixtal-ep3.webp', true),
  ('Conector de Engate Rápido de Metal BP12', 'conector-de-engate-rapido-de-metal-bp12', 'acessorios', 'conectores-pni', '', '/img/produtos/conectores-pni/conector-de-engate-rapido-de-metal-bp12.webp', true),
  ('Conector para Braçadeira de PNI BP17 (Macho)', 'conector-para-bracadeira-de-pni-bp17-macho', 'acessorios', 'conectores-pni', '', '/img/produtos/conectores-pni/conector-para-bracadeira-de-pni-bp17-macho.webp', true),
  ('Conector para Braçadeira de PNI BP18 (Fêmea)', 'conector-para-bracadeira-de-pni-bp18-femea', 'acessorios', 'conectores-pni', '', '/img/produtos/conectores-pni/conector-para-bracadeira-de-pni-bp18-femea.webp', true),
  ('Conector para Braçadeira de PNI BP22 (Dixtal)', 'conector-para-bracadeira-de-pni-bp22-dixtal', 'acessorios', 'conectores-pni', '', '/img/produtos/conectores-pni/conector-para-bracadeira-de-pni-bp22-dixtal.webp', true),
  ('Conector para Braçadeira de PNI BP51 (Draguer)', 'conector-para-bracadeira-de-pni-bp51-draguer', 'acessorios', 'conectores-pni', '', '/img/produtos/conectores-pni/conector-para-bracadeira-de-pni-bp51-draguer.webp', true),
  ('Conjunto de Cardioclips Adulto', 'conjunto-de-cardioclips-adulto', 'acessorios', 'conjunto-de-peras-e-cardioclips', '', '/img/produtos/conjunto-de-peras-e-cardioclips/conjunto-de-cardioclips-adulto.webp', true),
  ('Conjunto de Cardioclips Infantil', 'conjunto-de-cardioclips-infantil', 'acessorios', 'conjunto-de-peras-e-cardioclips', '', '/img/produtos/conjunto-de-peras-e-cardioclips/conjunto-de-cardioclips-infantil.webp', true),
  ('Peras em Silicone com Precordiais Cromadas', 'peras-em-silicone-com-precordiais-cromadas', 'acessorios', 'conjunto-de-peras-e-cardioclips', '', '/img/produtos/conjunto-de-peras-e-cardioclips/peras-em-silicone-com-precordiais-cromadas.webp', true),
  ('Peras em Silicone com Precordiais Cromadas', 'peras-em-silicone-com-precordiais-cromadas-2', 'acessorios', 'conjunto-de-peras-e-cardioclips', '', '/img/produtos/conjunto-de-peras-e-cardioclips/peras-em-silicone-com-precordiais-cromadas-2.webp', true),
  ('Papeis para Eletrocardiógrafo 210X30', 'papeis-para-eletrocardiografo-210x30', 'acessorios', 'papeis-para-eletrocardiografo', '', '/img/produtos/papeis-para-eletrocardiografo/papeis-para-eletrocardiografo-210x30.webp', true),
  ('Papel para Cardiotocógrafo Bionet FC1400', 'papel-para-cardiotocografo-bionet-fc1400', 'acessorios', 'papeis-para-eletrocardiografo', '', '/img/produtos/papeis-para-eletrocardiografo/papel-para-cardiotocografo-bionet-fc1400.webp', true),
  ('Papel para Cardiotocógrafo Edan F3', 'papel-para-cardiotocografo-edan-f3', 'acessorios', 'papeis-para-eletrocardiografo', '', '/img/produtos/papeis-para-eletrocardiografo/papel-para-cardiotocografo-edan-f3.webp', true),
  ('Papel para Eletrocardiógrafo 50X30', 'papel-para-eletrocardiografo-50x30', 'acessorios', 'papeis-para-eletrocardiografo', '', '/img/produtos/papeis-para-eletrocardiografo/papel-para-eletrocardiografo-50x30.webp', true),
  ('Papel para Eletrocardiógrafo 80X30', 'papel-para-eletrocardiografo-80x30', 'acessorios', 'papeis-para-eletrocardiografo', '', '/img/produtos/papeis-para-eletrocardiografo/papel-para-eletrocardiografo-80x30.webp', true),
  ('Papel para Eletrocardiógrafo Dixtal', 'papel-para-eletrocardiografo-dixtal', 'acessorios', 'papeis-para-eletrocardiografo', '', '/img/produtos/papeis-para-eletrocardiografo/papel-para-eletrocardiografo-dixtal.webp', true),
  ('Papel para Eletrocardiógrafo Eli Mortara 150', 'papel-para-eletrocardiografo-eli-mortara-150', 'acessorios', 'papeis-para-eletrocardiografo', '', '/img/produtos/papeis-para-eletrocardiografo/papel-para-eletrocardiografo-eli-mortara-150.webp', true),
  ('Papeis para Ultrassonografia Sony UPP-110HD', 'papeis-para-ultrassonografia-sony-upp-110hd', 'acessorios', 'papeis-para-ultrassonografia', '', '/img/produtos/papeis-para-ultrassonografia/papeis-para-ultrassonografia-sony-upp-110hd.webp', true),
  ('Papeis para Ultrassonografia Sony UPP-110HG', 'papeis-para-ultrassonografia-sony-upp-110hg', 'acessorios', 'papeis-para-ultrassonografia', '', '/img/produtos/papeis-para-ultrassonografia/papeis-para-ultrassonografia-sony-upp-110hg.webp', true),
  ('Papeis para Ultrassonografia Sony UPP-210HD', 'papeis-para-ultrassonografia-sony-upp-210hd', 'acessorios', 'papeis-para-ultrassonografia', '', '/img/produtos/papeis-para-ultrassonografia/papeis-para-ultrassonografia-sony-upp-210hd.webp', true),
  ('Papeis para Ultrassonografia Sony UPP-210SE', 'papeis-para-ultrassonografia-sony-upp-210se', 'acessorios', 'papeis-para-ultrassonografia', '', '/img/produtos/papeis-para-ultrassonografia/papeis-para-ultrassonografia-sony-upp-210se.webp', true),
  ('Papeis para Ultrassonografia Sony UPP-725', 'papeis-para-ultrassonografia-sony-upp-725', 'acessorios', 'papeis-para-ultrassonografia', '', '/img/produtos/papeis-para-ultrassonografia/papeis-para-ultrassonografia-sony-upp-725.webp', true),
  ('Papeis para Ultrassonografia UPP-110S', 'papeis-para-ultrassonografia-upp-110s', 'acessorios', 'papeis-para-ultrassonografia', '', '/img/produtos/papeis-para-ultrassonografia/papeis-para-ultrassonografia-upp-110s.webp', true),
  ('Balança Antropométrica Digital', 'balanca-antropometrica-digital', 'mobiliario', 'balancas', 'A Balança Eletrônica Adulto W200A possui régua antropométrica com escala de 2,00 m em alumínio anodizado com divisão de 0,5 cm.

Possui display com 6 dígitos em LED e plataforma de 390 x 340 mm.

A balança digital Welmy é homologada pelo INMETRO e aferida pelo IPEM.', '/img/produtos/balancas/balanca-antropometrica-digital.webp', true),
  ('Balança Digital 500KG (Pesa Cadeirantes)', 'balanca-digital-500kg-pesa-cadeirantes', 'mobiliario', 'balancas', '', '/img/produtos/balancas/balanca-digital-500kg-pesa-cadeirantes.webp', true),
  ('Balança Digital Tampo de Vidro', 'balanca-digital-tampo-de-vidro', 'mobiliario', 'balancas', '', '/img/produtos/balancas/balanca-digital-tampo-de-vidro.webp', true),
  ('Balança Pesa Bebê', 'balanca-pesa-bebe', 'mobiliario', 'balancas', '', '/img/produtos/balancas/balanca-pesa-bebe.webp', true),
  ('Balança Pesa Bebê Confort', 'balanca-pesa-bebe-confort', 'mobiliario', 'balancas', '', '/img/produtos/balancas/balanca-pesa-bebe-confort.webp', true),
  ('Carrinho para Desfibrilador/cardioversor CP-200', 'carrinho-para-desfibrilador-cardioversor-cp-200', 'mobiliario', 'carrinhos', 'IDEAL PARA CLÍNICA, CONSULTÓRIO, PRONTO SOCORRO, POSTO MÉDICO, ENFERMARIA, CENTRO CIRÚRGICO E UTI.

FABRICADO COM CHAPAS METÁLICAS.

MONTADO EM ESTRUTURA REFORÇADA EM PINTURA A PÓ DE BASE PLÁSTICA TEXTURIZADA DE ALTA RESISTÊNCIA A ABRASÃO, CORROSÃO E IMPACTO.

POSSUI PRATELEIRA INTERMEDIÁRIA PARA INSTRUMENTOS E ACESSÓRIOS 04 RODÍZIOS DE 4”, COM GIRO DE 360° COM FREIOS NOS FRONTAIS

CESTA PARA ACESSÓRIOS.

DIMENSÕES: ALTURA 92 CM X LARGURA 49 CM X COMPRIMENTO 55 CM

BANDEJA SUPERIOR: 39,5 CM (L) X 36 CM (C)

BANDEJA INFERIOR: 32 CM (L) X 36 CM (C)

EMBALAGEM: 1,07 M (A) X 62 CM (L) X 67 (C)

PESO LÍQUIDO: 17 KG

PESO BRUTO: 18 KG', '/img/produtos/carrinhos/carrinho-para-desfibrilador-cardioversor-cp-200.webp', true),
  ('Carrinho para Eletrocardiógrafo CP-100', 'carrinho-para-eletrocardiografo-cp-100', 'mobiliario', 'carrinhos', '', '/img/produtos/carrinhos/carrinho-para-eletrocardiografo-cp-100.webp', true),
  ('Carro de Emergência CP-1000 T', 'carro-de-emergencia-cp-1000-t', 'mobiliario', 'carrinhos', 'CARRO DE EMERGÊNCIA E PARADA, IDEAL PARA USO HOSPITALAR E EM CLÍNICAS ESPECIALIZADAS;

CONSTRUÍDO EM CHAPA METÁLICA DE AÇO CARBONO, COM TRATAMENTO ANTIFERRUGEM E PINTURA ELETROSTÁTICA TEXTURIZADA EM EPOXI;

TAMPO (MESA) SUPERIOR EM POLÍMERO LISO DIVIDIDO EM 02 MÓDULOS REBAIXADOS;

04 RODÍZIOS GIRATÓRIOS PARA MOVIMENTOS EM 360 GRAUS, SENDO 02 DELES FRONTAIS, DOTADOS DE FREIOS NAS RODAS;

GAVETEIRO COMPOSTO DE 04 GAVETAS, SENDO UMA COM BANDEJA DE 18 DIVISÕES PARA ARMAZENAMENTO MEDICAMENTOS, DUAS PARA CONVENCIONAIS PARA INSTRUMENTOS 01 GRANDE (GAVETÃO) PARA INSTRUMENTOS MAIORES E USO GERAL;

BANDEJA (SUPORTE) COM GIRO LIVRE DE 360 GRAUS, PARA ACOMODAÇÃO DE DESFIBRILADOR/MONITOR OU CARDIOVERSOR;

DOTADO DE CABO DE FORÇA TRIPOLAR DE 2,00 METROS, E 4 TOMADAS (2P+T) DE DISTRIBUIÇÃO PARA ALIMENTAÇÃO DE EQUIPAMENTOS DIVERSOS;

PARA-CHOQUE EMBORRACHADO INSTALADO EM TODA EXTENSÃO DO PERÍMETRO LATERAL;', '/img/produtos/carrinhos/carro-de-emergencia-cp-1000-t.webp', true),
  ('Carro de Emergência com Tampo em INOX', 'carro-de-emergencia-com-tampo-em-inox', 'mobiliario', 'carrinhos', 'ESTRUTURA FABRICADA EM CHAPA DE AÇO;

FECHAMENTOS LATERAIS E TRASEIRO FABRICADOS EM CHAPA DE AÇO;

BANDEJA SUPERIOR FABRICADA EM AÇO CHAPA DE AÇO INOX AISI 304 ESCOVADO;

SUPORTE SUPERIOR COM BANDEJA GIRATÓRIA PARA MONITOR/DESFIBRILADOR FABRICADO EM CHAPA DE AÇO SAE1010;

01 SUPORTE PARA SORO EM AÇO INOX COM REGULAGEM DE ALTURA E 4 GANCHOS EM NYLON;

03 GAVETAS FABRICADAS EM CHAPA DE AÇO SAE1010 COM PUXADORES INJETADOS E COM EXTRAÇÃO ATRAVÉS DE TRILHOS TELESCÓPICOS;

01 GAVETÃO INFERIOR FABRICADO EM CHAPA DE AÇO SAE1010 COM PUXADOR INJETADO E COM EXTRAÇÃO ATRAVÉS DE TRILHOS TELESCÓPICOS;

16 DIVISÓRIAS PARA MEDICAMENTOS NA PRIMEIRA GAVETA;

FILTRO DE LINHA COM 4 PONTOS DE TOMADA;

SUPORTE PARA CILINDRO DE OXIGÊNIO FABRICADO EM CHAPA DE AÇO SAE1010;

TÁBUA DE MASSAGEM CARDÍACA FABRICADA EM POLIPROPILENO;

0 4 RODÍZIOS GIRATÓRIOS DE Ø75MM, SENDO DOIS COM TRAVAS E DOIS SEM TRAVAS;

ACABAMENTO ATRAVÉS DE PINTURA ELETROSTÁTICA A PÓ COM TRATAMENTO ANTICORROSIVO;

1,10M X COMP. 70 CM X LARG. 50 CM.', '/img/produtos/carrinhos/carro-de-emergencia-com-tampo-em-inox.webp', true),
  ('Suporte para Eletrocardiógrafo com Rodízios', 'suporte-para-eletrocardiografo-com-rodizios', 'mobiliario', 'carrinhos', '- Perfis laterais em aço
- Bandeja fabricada em aço
- Cesto em aço
- Acabamento através de ponteiras plasticas
- Puxador em aço
- 4 Rodízios giratórios de Ø 75mm sendo dois com travas
- Acabamento através de pintura eletrostática pó

\*Alt. 800 x Larg. 520 x Prof. 350mm', '/img/produtos/carrinhos/suporte-para-eletrocardiografo-com-rodizios.webp', true)
) as v(name, slug, segment, category_slug, description, image, active)
join public.categories c on c.slug = v.category_slug
on conflict (slug) do nothing;

-- Banner inicial da home (só entra se ainda não houver nenhum banner).
insert into public.banners (title, subtitle, image_url, link_label, link_url, text_position, overlay, sort_order, active)
select
  'Equipamentos médicos e hospitalares para quem não pode parar.',
  'Desde 2009 equipando hospitais, clínicas e serviços de emergência em todo o Brasil, com atendimento técnico especializado e prazos que a sua operação pode confiar.',
  '/img/site/loja-fachada.jpg',
  'Ver catálogo de produtos',
  '/produtos',
  'left',
  'dark',
  0,
  true
where not exists (select 1 from public.banners);
