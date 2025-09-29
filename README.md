
# 📘 Saam - Sistema de Gestão de Produtos

Este projeto foi desenvolvido como parte de um **desafio técnico** para a vaga de **Desenvolvedor Júnior – Foco em IA** na **Saam Auditoria**.

O sistema é composto por:
- **Backend:** API REST em **Java Spring Boot**, com autenticação JWT e persistência em PostgreSQL.  
- **Frontend:** Interface web em **React + Vite**, para login e gerenciamento de produtos.  
- **Infraestrutura:** Orquestração de serviços via **Docker Compose**.  
- **IA:** Inteligência Artificial aplicada durante todo o processo de desenvolvimento.

> **Objetivo do desafio:** Criar um sistema completo com **login**, **cadastro de produtos**, autenticação segura e containers totalmente configurados.

---

## 📂 Estrutura do Projeto

```
Saam/
├── backend/               # API em Java Spring Boot
│   ├── src/main/java/com/saam/backend
│   ├── src/main/resources/application.properties
│   ├── .env               # Configurações específicas do backend
│   └── Dockerfile
│
├── frontend/              # Interface Web em React + Vite
│   ├── src/
│   ├── .env               # Configurações específicas do frontend
│   └── Dockerfile
│
├── devops/                # Infraestrutura e automação
│   └── .env               # Variáveis globais (Docker e N8N)
│
├── docker-compose.yml     # Orquestração dos containers
└── README.md
```

---

## ⚙️ Configuração de Variáveis de Ambiente

O projeto utiliza **três arquivos `.env` separados**, cada um com responsabilidade clara.  
> **Atenção:** Todos os exemplos usam **valores fictícios** para segurança.

### 1️⃣ Frontend – `frontend/.env`
```env
REACT_PORT=3000
VITE_API_URL=http://localhost:5000/api
```

---

### 2️⃣ Backend – `backend/.env`
```env
# Perfil ativo do Spring
SPRING_PROFILES_ACTIVE=development

# Porta interna do backend
SERVER_PORT=5000

# Banco de dados
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/meu_banco
SPRING_DATASOURCE_USERNAME=usuario_exemplo
SPRING_DATASOURCE_PASSWORD=senha_segura_123

# Configuração JWT
JWT_SECRET=chave_super_secreta_aleatoria
JWT_EXPIRATION=3600000

# Webhooks do N8N
N8N_WEBHOOK_URL=https://meu-n8n-cloud/webhook/relatorios
N8N_WEBHOOK_WELCOME_URL=https://meu-n8n-cloud/webhook/welcome

# Logging
LOGGING_LEVEL_ORG_SPRINGFRAMEWORK_WEB=DEBUG
LOGGING_LEVEL_COM_SAAM_BACKEND=DEBUG
```

---

### 3️⃣ DevOps – `devops/.env`
```env
# Timezone padrão
TZ=America/Sao_Paulo

# Banco de Dados
POSTGRES_DB=meu_banco
POSTGRES_USER=usuario_exemplo
POSTGRES_PASSWORD=senha_segura_123

# Backend
SPRING_PORT=5000
SPRING_PROFILES_ACTIVE=development

# JWT
JWT_SECRET=chave_super_secreta_aleatoria
JWT_EXPIRATION=3600000

# Webhooks N8N (opcional)
N8N_WEBHOOK_URL=https://meu-n8n-cloud/webhook/relatorios
N8N_WEBHOOK_WELCOME_URL=https://meu-n8n-cloud/webhook/welcome

# Frontend
REACT_PORT=3000
```

---

## 🐳 Rodando com Docker Compose

Com os `.env` configurados, você pode rodar toda a stack com **um único comando**.

### 1. Subir containers
Na raiz do projeto:
```bash
docker compose up --build
```

### 2. Serviços disponíveis
| Serviço      | Porta | URL de Acesso |
|--------------|-------|--------------|
| **Frontend** | 3000  | http://localhost:3000 |
| **Backend**  | 5000  | http://localhost:5000/api |
| **PostgreSQL** | 5432 | localhost:5432 |

### 3. Parar containers
```bash
docker compose down
```

### 4. Visualizar logs
```bash
docker compose logs -f
```

---

## 🖥 Rodando Manualmente (sem Docker)

### Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```
API disponível em: [http://localhost:5000/api](http://localhost:5000/api)

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Aplicação disponível em: [http://localhost:3000](http://localhost:3000)

### Banco de Dados isolado
```bash
docker run --name saam_postgres   -e POSTGRES_DB=meu_banco   -e POSTGRES_USER=usuario_exemplo   -e POSTGRES_PASSWORD=senha_segura_123   -p 5432:5432   -d postgres:15
```

---

## 🧠 Uso de Inteligência Artificial no Projeto

A IA foi aplicada em diversas etapas do desenvolvimento, trazendo **agilidade e otimização**:

| Etapa           | Como a IA foi utilizada |
|-----------------|--------------------------|
| **Planejamento** | Criação de diagramas e definição inicial da arquitetura. |
| **Backend**      | Automação na criação de DTOs, serviços e endpoints. |
| **Frontend**     | Geração de componentes e otimização de UX responsiva. |
| **DevOps**       | Criação inicial de Dockerfiles e ajustes no `docker-compose.yml`. |
| **Documentação** | Geração do README e organização das instruções técnicas. |

---

## 🚀 Funcionalidades Principais

1. **Login seguro via JWT**  
2. **CRUD completo de produtos** (cadastrar, listar, editar e excluir).  
3. **Containers integrados** via Docker Compose.

---

## 📜 Scripts Úteis

| Comando                     | Descrição |
|-----------------------------|-----------|
| `docker compose up --build` | Subir containers com rebuild |
| `docker compose down`       | Parar containers |
| `docker compose logs -f`    | Acompanhar logs em tempo real |
| `./mvnw spring-boot:run`    | Rodar backend manualmente |
| `npm run dev`               | Rodar frontend manualmente |

---

## 📌 Tecnologias Utilizadas

| Camada        | Tecnologias |
|---------------|------------|
| **Frontend**  | React + Vite, Zustand, Tailwind CSS |
| **Backend**   | Java 17, Spring Boot, Spring Security, JWT, Hibernate |
| **Banco**     | PostgreSQL 15 |
| **Containers**| Docker, Docker Compose |
| **Integrações** | N8N |
| **IA**        | ChatGPT, GitHub Copilot |

---

## 🗺 Arquitetura Geral

```
[Frontend - React] <--> [Backend - Spring Boot] <--> [PostgreSQL]
                                    |
                                    v
                               [N8N Cloud]
```

---

## 📄 Conclusão

Este projeto demonstra habilidades em:
- **Desenvolvimento fullstack moderno** (React + Spring Boot).  
- **Boas práticas DevOps**, com ambientes configuráveis via múltiplos `.env`.  
- **Integração de IA no ciclo de desenvolvimento**, otimizando entregas.  
- **Solução completa**, atendendo aos requisitos do desafio técnico.
