# 📘 Documentação do Backend — SaamApp

> **Versão OpenAPI:** 3.1.0 • **Servidor:** `http://localhost:5000` • **Base path:** `/api`  
> Todas as rotas documentadas abaixo já incluem o prefixo `/api`.

---

## 1) Arquitetura (essencial)
```
src/main/java/com/saam/backend
├─ BackendApplication.java
├─ config/SecurityConfig.java
├─ security/jwt/
│  ├─ JwtAuthenticationFilter.java
│  └─ JwtUtil.java
├─ shared/responses/
│  ├─ ApiResponse.java
│  └─ ErrorResponseDTO.java
├─ auth/
│  ├─ application/{dto,usecases}
│  ├─ domain/{entities,enums,repositories}
│  ├─ infrastructure/persistence/{JpaUserRepository,UserPersistenceAdapter}.java
│  └─ interfaces/{controllers,docs}
├─ products/
│  ├─ application/{dto,usecases,validators}
│  ├─ domain/{entities,repositories}
│  ├─ infrastructure/persistence/{JpaProductRepository,ProductPersistenceAdapter}.java
│  └─ interfaces/{controllers,docs}
└─ n8n/interfaces/{controllers,docs}
```
**Padrão:** camadas desacopladas (application/domain/infrastructure/interfaces), JWT no filtro, handlers de erro padronizados.

---

## 2) Autenticação (`/auth`)

### 2.1 POST `/auth/register` — Registrar usuário
**Body (CreateRequestDTO):**
```json
{
  "username": "João Silva",
  "email": "joao@email.com",
  "password": "Senha@123",
  "role": "USER"
}
```
**Validações-chave:**
- `email`: formato válido
- `password`: mínimo 6, deve conter **letra, número e caractere especial** (`^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$`)

**201 Created (CreateResponseDTO):**
```json
{
  "id": "c2a7c1c6-4e6e-4c1d-9b90-5cb2e3c3cd74",
  "username": "João Silva",
  "email": "joao@email.com",
  "role": "USER",
  "active": true,
  "token": "jwt-token"
}
```
**Erros:** `400` (dados inválidos) • `409` (e-mail já cadastrado)

---

### 2.2 POST `/auth/login` — Autenticar e gerar JWT
**Body (LoginRequestDTO):**
```json
{ "email": "user@gmail.com", "password": "123456" }
```
**200 (LoginResponseDTO dentro de ApiResponse):**
```json
{
  "status": 200,
  "message": "Login realizado com sucesso.",
  "data": {
    "id": "4ade8288-6e03-47b4-ab8d-016e84847355",
    "username": "User Test",
    "email": "user@gmail.com",
    "role": "USER",
    "active": true,
    "token": "eyJhbGciOiJIUzI1NiJ9..."
  },
  "timestamp": "2025-09-27T07:05:32.235068181"
}
```
**Erros:** `401` (credenciais inválidas/senha incorreta) • `404` (usuário não encontrado)

---

### 2.3 GET `/auth/validate` — Validar JWT
**Header obrigatório:**
```
Authorization: Bearer {token}
```
**200 (ApiResponse):**
```json
{
  "status": 200,
  "message": "Token válido",
  "data": "Usuário autenticado: user@gmail.com | Role: USER",
  "timestamp": "2025-09-27T07:25:00"
}
```
**Erros:** `401` (token inválido/expirado) • `403` (sem permissão)

---

## 3) Produtos (`/products`)

### 3.1 GET `/products` — Listar com paginação
**Query params (opcional):**
- `page` (default `0`), `size` (default `10`)

**200 (PaginatedResponseDTO):**
```json
{
  "content": [
    {
      "id": 1,
      "name": "Notebook Dell Inspiron",
      "description": "Notebook Dell com processador i7 e 16GB de RAM",
      "price": 5500,
      "quantity": 10
    },
    {
      "id": 2,
      "name": "Mouse Gamer Razer",
      "description": "Mouse Gamer RGB com 8 botões programáveis",
      "price": 350,
      "quantity": 50
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 2,
  "totalPages": 1,
  "last": true
}
```

---

### 3.2 POST `/products` — Criar produto
**Body (ProductRequestDTO):**
```json
{
  "name": "Notebook Dell Inspiron",
  "description": "Notebook Dell com processador i7 e 16GB de RAM",
  "price": 5500,
  "quantity": 10
}
```
**Regras:** `name` (3–100), `description` (5–255), `price >= 0`, `quantity >= 0`  
**201/200 (ProductResponseDTO):**
```json
{
  "id": 1,
  "name": "Notebook Dell Inspiron",
  "description": "Notebook Dell com processador i7 e 16GB de RAM",
  "price": 5500,
  "quantity": 10
}
```
**Erros:** `400` (dados inválidos) • `409` (produto já existe)

---

### 3.3 GET `/products/{id}` — Buscar por ID
**200 (ProductResponseDTO):**
```json
{
  "id": 1,
  "name": "Notebook Dell Inspiron",
  "description": "Notebook Dell com processador i7 e 16GB de RAM",
  "price": 5500,
  "quantity": 10
}
```
**Erro:** `404` (produto não encontrado)

---

### 3.4 PUT `/products/{id}` — Atualizar produto
**Body (ProductRequestDTO):**
```json
{
  "name": "Notebook Dell Inspiron Plus",
  "description": "Notebook Dell atualizado com processador i9",
  "price": 7500,
  "quantity": 5
}
```
**200 (ProductResponseDTO):**
```json
{
  "id": 1,
  "name": "Notebook Dell Inspiron Plus",
  "description": "Notebook Dell atualizado com processador i9",
  "price": 7500,
  "quantity": 5
}
```
**Erros:** `404` (não encontrado) • `409` (nome duplicado)

---

### 3.5 DELETE `/products/{id}` — Remover produto
**204 No Content**  
**Erro:** `404` (não encontrado)

---

## 4) Integração N8N (`/reports`)

### 4.1 POST `/reports/welcome` — Mensagem de boas-vindas
**Header:** `Authorization: Bearer {token}` (obrigatório)  
**Body (WelcomePayload):**
```json
{ "name": "Maria Oliveira", "email": "maria.oliveira@empresa.com" }
```
**200:**
```json
{ "message": "Mensagem de boas-vindas enviada para maria.oliveira@empresa.com", "status": "success" }
```
**Erro:** `502` (falha ao contactar n8n)

---

### 4.2 POST `/reports/generate` — Geração de relatório
**Header:** `Authorization: Bearer {token}` (opcional)  
**Body (ReportPayload):**
```json
{
  "type": "sales",
  "format": "PDF",
  "email": "usuario@empresa.com",
  "token": "jwt-token-opcional",
  "name": "João Silva",
  "totalProdutos": 25,
  "valorTotal": 12350.75,
  "startDate": "2025-09-01",
  "endDate": "2025-09-27"
}
```
**200:**
```json
{ "message": "Relatório gerado e enviado para o e-mail usuario@empresa.com", "status": "success" }
```
**Erro:** `502` (serviço indisponível/timeout)

---

## 5) Esquemas (DTOs) — resumo do essencial
- **CreateRequestDTO**: `{ username:string(3..50), email:email, password:regex(com letra+número+especial), role:string }`
- **CreateResponseDTO**: `{ id:uuid, username, email, role, active:boolean, token:string }`
- **LoginRequestDTO**: `{ email:email, password:string }`
- **LoginResponseDTO**: `{ id:uuid, username, email, role, active, token }`
- **ProductRequestDTO**: `{ name(3..100), description(5..255), price:number>=0, quantity:int>=0 }`
- **ProductResponseDTO**: `{ id:int64, name, description, price:number, quantity:int, createdAt:date-time }`
- **PaginatedResponseDTO**: `{ content:[], page:int, size:int, totalElements:int64, totalPages:int, last:boolean }`
- **ReportPayload**: `{ type, format, email, token?, name, totalProdutos:int, valorTotal:number, startDate, endDate, products?: ProductResponseDTO[] }`
- **WelcomePayload**: `{ name, email }`
- **ApiResponse**: `{ status:int, message:string, data:any, timestamp:date-time }`
- **ErrorResponseDTO**: `{ timestamp, status:int, error, message, path }`
- **ApiError (n8n)**: `{ status:int, error, message }`

---

## 6) Convenções e Segurança
- **Autenticação:** JWT no header `Authorization: Bearer {token}`
- **Paginação padrão:** `page=0`, `size=10`
- **Data:** `YYYY-MM-DD` • **DateTime:** ISO-8601
- **Moeda/numérico:** `price` é `number` (enviar **ponto** para decimais).

---

## 7) cURL Rápido
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login   -H "Content-Type: application/json"   -d '{"email":"user@gmail.com","password":"123456"}'

# Listar produtos (página 0, 10 itens)
curl "http://localhost:5000/api/products?page=0&size=10"

# Criar produto
curl -X POST http://localhost:5000/api/products   -H "Content-Type: application/json"   -d '{"name":"Notebook","description":"i7 16GB RAM","price":5500,"quantity":10}'
```