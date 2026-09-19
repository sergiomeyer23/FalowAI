# Falow AI

**Your Personal AI English Teacher**

Falow é um ambiente pessoal de aprendizagem de inglês. O produto não é um SaaS, não possui planos, preços, comunidade, perfis públicos ou leaderboard. A única persona pedagógica é **Falow**; Grammar, Speaking, Listening, Reading, Writing, Vocabulary e Professional English são modos de ensino do mesmo professor.

## Estado atual

Este primeiro vertical slice transforma o workspace vazio em uma base executável e real:

- dashboard pessoal com perfil CEFR, Falow Level, XP, streak e missão diária;
- skill mastery separado por habilidade;
- exercícios reais de grammar, vocabulary, reading e listening com resposta, correção, explicação e alternativa natural;
- writing lab funcional para uma atualização profissional, com sinais explícitos de tarefa, organização e registro (sem fingir correção semântica quando não há IA conectada);
- XP calculado por um `XPService`/learning engine com anti-farming;
- memória local de erros recorrentes e recomendações baseadas no sinal mais fraco;
- avaliação inicial curta que atualiza o perfil CEFR e registra histórico;
- speaking lab com reconhecimento de fala nativo do navegador e feedback baseado no transcript;
- TTS pelo `SpeechSynthesis` do navegador;
- progresso, biblioteca pedagógica e configurações pessoais;
- backend Spring Boot preparado para PostgreSQL, Flyway, JWT, AI/STT/TTS providers e testes de regras críticas;
- prompts versionados fora do código.

A instalação frontend inicial guarda o estado de aprendizagem no `localStorage` para permitir testar o fluxo sem depender de credenciais ou de um banco remoto. O contrato do backend já está separado para a migração da persistência local para PostgreSQL no próximo estágio; não há respostas de IA fictícias escondidas no fluxo.

## Arquitetura

```text
falow-ai/
├── frontend/                 # Next.js App Router + TypeScript + Tailwind
│   ├── app/                  # Overview, practice, speaking, progress, assessment...
│   ├── components/           # Shell, logo, ícones e elementos de UI
│   ├── hooks/                # Estado persistente do aluno no modo local
│   └── lib/                  # tipos, conteúdo inicial e learning engine
├── backend/                  # Modular monolith Spring Boot
│   ├── src/main/java/com/falow/
│   │   ├── auth/             # JWT + password hashing + personal user
│   │   ├── ai/               # AIProvider
│   │   ├── recommendation/  # RecommendationEngine
│   │   ├── speech/           # STT/TTS contracts
│   │   └── xp/               # XP, levels e avaliação stateless
│   └── src/main/resources/
│       ├── db/migration/     # Flyway / PostgreSQL
│       └── prompts/          # prompts versionados
└── docker-compose.yml        # PostgreSQL local
```

### Decisões importantes

- `CEFR` não é derivado apenas de XP. A avaliação e as evidências por skill são distintas do nível gamificado.
- XP é calculado em um único serviço, com decaimento para repetições e recompensa menor para tentativa incorreta.
- A recomendação inicial usa regras transparentes. IA não é usada para resolver tudo.
- O speaking lab não inventa pronúncia: ele só relata sinais observáveis no transcript e deixa explícito quando a API de voz não está disponível.
- Chaves de provedores ficam apenas no backend, via `.env`.
- Assets próprios são SVG inline, leves e sem dependência de CDN.

## Requisitos

- Node.js 20+
- npm 10+
- Java 11+
- Maven 3.8+
- Docker (opcional, para PostgreSQL)

## Configuração local

```bash
cp .env.example .env
npm install --prefix frontend
```

Para apenas explorar a interface e os fluxos locais:

```bash
npm run dev
# http://localhost:3000
```

O primeiro acesso começa com um perfil de trabalho de exemplo para que o dashboard tenha contexto. O nome, progresso e estado podem ser alterados/resetados em **Settings**. Esse seed é local, não é uma resposta falsa de IA.

### PostgreSQL

```bash
docker compose up -d postgres
```

O Flyway cria o schema inicial ao iniciar o backend. Ajuste `DATABASE_URL`, `DATABASE_USERNAME` e `DATABASE_PASSWORD` se necessário.

### Backend

Antes de iniciar, configure um usuário pessoal e um segredo JWT. Gere um hash BCrypt em uma ferramenta confiável ou em um pequeno shell Spring; nunca coloque a senha em texto puro no repositório.

```bash
export FALOW_USERNAME=sergio
export FALOW_PASSWORD_HASH='$2a$10$replace-with-a-real-bcrypt-hash'
export JWT_SECRET='replace-with-at-least-32-random-characters'
cd backend
mvn spring-boot:run
```

Health check:

```bash
curl http://localhost:8080/api/v1/health
```

Login:

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"sergio","password":"your-password"}'
```

## Variáveis de ambiente

Veja `.env.example`. As principais são:

| Variável | Uso |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | URL pública da API usada pelo frontend conectado |
| `DATABASE_URL` | JDBC URL do PostgreSQL |
| `DATABASE_USERNAME` / `DATABASE_PASSWORD` | acesso do backend ao banco |
| `FALOW_USERNAME` | identificador do único aluno |
| `FALOW_PASSWORD_HASH` | senha BCrypt do aluno |
| `JWT_SECRET` | segredo JWT com pelo menos 32 caracteres |
| `AI_PROVIDER` | provedor de IA selecionado no backend |
| `OPENAI_API_KEY` / `OPENAI_MODEL` | credenciais server-side opcionais |
| `CORS_ALLOWED_ORIGINS` | origens permitidas, separadas por vírgula |

## Testes e verificação

```bash
# Type-check do frontend
npm run test --prefix frontend

# Build do frontend
npm run build --prefix frontend

# Testes do backend (com Maven e dependências disponíveis)
cd backend
mvn test
```

Testes já incluídos no backend cobrem anti-farming de XP, progressão de Level e regras de recomendação. O frontend passa por type-check e build de produção.

## Integração de IA e voz

As interfaces são deliberadamente substituíveis:

- `AIProvider`: a aplicação não conhece o SDK de um fornecedor no domínio;
- `SpeechToTextProvider`: pronto para Whisper/Groq ou outro STT;
- `TextToSpeechProvider`: o primeiro adaptador é `SpeechSynthesis` no browser;
- prompts ficam em `backend/src/main/resources/prompts/` e são versionados.

O browser-first speaking flow usa a Web Speech API quando o navegador oferece suporte. Para produção, o próximo estágio deve enviar um `MediaRecorder` curto para o backend, transcrever com um `SpeechToTextProvider`, analisar com contexto selecionado e descartar o áudio quando a retenção não for necessária.

## Roadmap técnico imediato

1. Persistir o estado do vertical slice no backend e substituir gradualmente o localStorage por API autenticada.
2. Criar entidades/repositories para perfil, skills, tentativas, erros, sessões e review items.
3. Adicionar revisão espaçada adaptativa e content registry server-side.
4. Integrar `AIProvider` real com contexto resumido do aluno e validação de JSON estruturado.
5. Implementar MediaRecorder → STT → feedback, retenção configurável de áudio e conversas contínuas.
6. Expandir writing, listening e professional challenges com evidência de produção.
7. Testar fluxos críticos no frontend e no backend antes de polir além do necessário.

## Tamanho do projeto

Dependências instaladas, `.next/` e `backend/target/` não devem ser versionados. O código e os assets próprios são leves; verifique antes de publicar:

```bash
find . -type f -not -path './.git/*' -not -path './frontend/node_modules/*' -not -path './frontend/.next/*' -not -path './backend/target/*' | wc -l
du -sh --exclude=.git --exclude=node_modules --exclude=.next --exclude=target .
```
