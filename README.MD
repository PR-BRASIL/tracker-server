# Sistema de Ranking e Patentes para Jogadores

## Visão Geral

O sistema implementa uma API para rastrear o desempenho de jogadores em um jogo, calcular rankings e atribuir patentes com base nas pontuações. A plataforma utiliza uma arquitetura em camadas seguindo princípios de Clean Architecture, com MongoDB como armazenamento persistente.

## Arquitetura

O sistema é estruturado em quatro camadas principais:

1. **Domain Layer** - Contém as regras de negócio e interfaces centrais
2. **Data Layer** - Implementa a lógica de acesso a dados
3. **Presentation Layer** - Gerencia requisições HTTP e eventos
4. **Infrastructure Layer** - Lida com detalhes técnicos como conexão com MongoDB

## Componentes Principais

### Sistema de Patentes

O sistema atribui patentes aos jogadores com base em suas pontuações:

| Patente  | Pontuação Mínima | Pontuação Máxima |
| -------- | ---------------- | ---------------- |
| Recruta  | 0                | 999              |
| Soldado  | 1.000            | 2.499            |
| Cabo     | 2.500            | 4.999            |
| Sargento | 5.000            | 9.999            |
| Tenente  | 10.000           | 19.999           |
| Capitão  | 20.000           | 34.999           |
| Major    | 35.000           | 49.999           |
| Coronel  | 50.000           | 74.999           |
| General  | 75.000           | 99.999           |
| Marechal | 100.000+         | -                |

As patentes são determinadas dinamicamente a partir do banco de dados ou, no caso de falha, através dos valores padrão acima.

### Rastreamento de Usuários

O sistema captura e armazena as seguintes métricas para cada jogador:

- Nome do jogador
- Hash exclusivo
- Endereço IP
- Pontuação total (score)
- Número de eliminações (kills)
- Número de mortes (deaths)
- Pontuação de trabalho em equipe (teamWorkScore)
- Tempo de jogo (opcional)

### Recursos Especiais

1. **Hora do Bônus Brasileiro**: Entre 7h e 14h (fuso horário de São Paulo), as pontuações dos jogadores são duplicadas como incentivo.

2. **Mecanismos de Fallback**: O sistema possui alternativas para situações em que o banco de dados não está disponível.

3. **Limitação de Taxa**: Implementa proteção contra excesso de requisições (20 solicitações a cada 20 segundos).

4. **Busca Flexível**: Suporte para localizar jogadores por nome ou hash com correspondência parcial.

## Fluxo de Operação

1. Os dados do jogo são recebidos pelo sistema através de eventos
2. As pontuações dos jogadores são calculadas (com possível bônus de horário)
3. Os dados são persistidos no MongoDB
4. Os endpoints da API permitem consultar estatísticas de jogadores e rankings
5. As patentes são atribuídas dinamicamente com base nas pontuações atualizadas

## Endpoints da API

A API disponibiliza endpoints sob o prefixo `/api`, incluindo:

- Consulta de dados do jogador por nome ou hash
- Informações de patente e classificação
- Estatísticas detalhadas do jogador

## Implementação Técnica

O sistema é construído com Node.js e Express, utiliza MongoDB para persistência de dados e segue princípios de Programação Orientada a Objetos e Design Patterns para manter o código organizado e extensível.
