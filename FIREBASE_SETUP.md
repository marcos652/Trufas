# 🔥 Como configurar o Firebase

## 1. Criar projeto no Firebase

1. Acesse https://console.firebase.google.com/
2. Clique em **"Adicionar projeto"**
3. Dê um nome (ex: `trufaria-vitrine`)
4. Desative o Google Analytics (opcional)
5. Clique em **"Criar projeto"**

## 2. Adicionar aplicativo Web

1. Na tela do projeto, clique no ícone **`</>`** (Web)
2. Dê um nome (ex: `trufa-web`)
3. Copie as credenciais que aparecerem

## 3. Criar o arquivo `.env`

Na pasta do projeto, crie um arquivo chamado `.env` (sem extensão):

```env
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc123
```

## 4. Ativar o Firestore

1. No menu lateral do Firebase, vá em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Escolha **"Modo de teste"** (para começar — proteja depois!)
4. Escolha a região mais próxima (ex: `us-east1`)

## 5. Criar usuário Admin no Firebase Auth

1. No menu lateral, vá em **"Authentication"**
2. Clique em **"Primeiros passos"**
3. Em **"Método de login"**, ative **E-mail/senha**
4. Vá na aba **"Usuários"** e clique em **"Adicionar usuário"**
5. Adicione seu email e senha de admin

## 6. Regras do Firestore (recomendado após testes)

No console do Firebase > Firestore > Regras, configure:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Qualquer um pode LER trufas
    match /truffles/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 7. Rodar o projeto

```bash
npm run dev
```

Acesse:
- **Vitrine:** http://localhost:5173/
- **Admin:** http://localhost:5173/admin/login
