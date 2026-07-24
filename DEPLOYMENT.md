# 🚀 SEGi CRM - Guia de Deployment

## Production Checklist

### ✅ Pré-Deployment

- [ ] Todas as variáveis de ambiente configuradas
- [ ] Database backup testado
- [ ] SSL certificate obtido (Let's Encrypt)
- [ ] Domínio DNS configurado
- [ ] Servidor preparado (Docker + Docker Compose)

### ✅ Build & Test

- [ ] `npm run build` (backend) sem erros
- [ ] `npm run build` (frontend) sem erros
- [ ] `npm test` (se houver testes)
- [ ] Verificação manual de features críticas

### ✅ Deployment

- [ ] Docker images buildadas
- [ ] Docker Compose testado localmente
- [ ] Database migrations rodadas
- [ ] Nginx configurado
- [ ] SSL certificates instalados
- [ ] Monitoring configurado

---

## 📋 Passo a Passo

### 1. Prepare o Servidor

```bash
# SSH no servidor
ssh root@seu-servidor.com

# Atualize sistema
sudo apt update && sudo apt upgrade -y

# Instale dependências
sudo apt install -y curl git

# Instale Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instale Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Clone Repositório

```bash
cd /opt
sudo git clone https://github.com/seu-username/segi-crm.git
cd segi-crm
```

### 3. Configure Environment

```bash
# Backend
cat > .env << EOF
DATABASE_URL=postgresql://segi_user:SenhaForte123@postgres:5432/segi_crm
REDIS_URL=redis://redis:6379
JWT_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
PORT=3000
EOF

# Frontend
cat > apps/web/.env.local << EOF
NEXT_PUBLIC_API_URL=https://api.segi-crm.com
EOF
```

### 4. Build Docker Images

```bash
# Build do backend
docker-compose build api

# Build do frontend
docker-compose build web
```

### 5. Inicie Serviços

```bash
# Inicie tudo
docker-compose up -d

# Verifique status
docker-compose ps

# Veja logs
docker-compose logs -f
```

### 6. Migrations & Setup

```bash
# Execute migrations
docker-compose exec api npx prisma migrate deploy

# Seed data (opcional)
docker-compose exec api npm run seed
```

### 7. Configure Nginx

```bash
# Crie arquivo de configuração
sudo tee /etc/nginx/sites-available/segi-crm > /dev/null << EOF
upstream backend {
    server localhost:3000;
}

upstream frontend {
    server localhost:3001;
}

server {
    listen 80;
    server_name segi-crm.com www.segi-crm.com;
    
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name segi-crm.com www.segi-crm.com;
    
    ssl_certificate /etc/letsencrypt/live/segi-crm.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/segi-crm.com/privkey.pem;
    
    # Segurança
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # API
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Ative site
sudo ln -s /etc/nginx/sites-available/segi-crm /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Teste configuração
sudo nginx -t

# Reinicie Nginx
sudo systemctl restart nginx
```

### 8. SSL Certificate

```bash
# Instale Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenha certificado
sudo certbot certonly --nginx -d segi-crm.com -d www.segi-crm.com

# Auto-renovação
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### 9. Monitoring & Backups

```bash
# Crie script de backup
cat > /opt/segi-crm/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/segi-crm"
mkdir -p $BACKUP_DIR
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Backup database
docker-compose exec -T postgres pg_dump -U segi_user segi_crm | gzip > $BACKUP_DIR/db_$TIMESTAMP.sql.gz

# Backup files (se houver uploads)
tar czf $BACKUP_DIR/uploads_$TIMESTAMP.tar.gz uploads/

# Limpa backups antigos (> 30 dias)
find $BACKUP_DIR -type f -mtime +30 -delete
EOF

chmod +x /opt/segi-crm/backup.sh

# Cron job (diário às 2AM)
echo "0 2 * * * /opt/segi-crm/backup.sh" | sudo crontab -
```

### 10. Verificações Finais

```bash
# Teste API
curl https://api.segi-crm.com/api/health

# Teste Frontend
curl https://segi-crm.com/

# Verifique logs
docker-compose logs api | tail -20
docker-compose logs web | tail -20

# Teste login
# Abra https://segi-crm.com no navegador e teste login
```

---

## 🔍 Troubleshooting

### API não responde
```bash
# Verifique se container está rodando
docker-compose ps

# Veja logs
docker-compose logs api

# Reinicie
docker-compose restart api
```

### Frontend não carrega
```bash
# Verifique cache
sudo systemctl restart nginx

# Limpe browser cache
# Ctrl + Shift + Delete no navegador
```

### Database connection error
```bash
# Verifique se Postgres está rodando
docker-compose ps

# Veja logs do banco
docker-compose logs postgres

# Tente reconectar
docker-compose restart postgres
```

### SSL certificate issue
```bash
# Renova manualmente
sudo certbot renew

# Verifica data de expiração
sudo certbot certificates
```

---

## 📊 Monitoramento

### Health Check

```bash
# Crie script de health check
cat > /opt/segi-crm/health-check.sh << 'EOF'
#!/bin/bash

# Verifica API
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.segi-crm.com/api/health)
if [ $API_STATUS -ne 200 ]; then
    echo "ALERTA: API retornou status $API_STATUS"
    # Envia email ou Slack
fi

# Verifica Frontend
WEB_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://segi-crm.com/)
if [ $WEB_STATUS -ne 200 ]; then
    echo "ALERTA: Frontend retornou status $WEB_STATUS"
    # Envia email ou Slack
fi

# Verifica espaço em disco
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "ALERTA: Disco em $DISK_USAGE%"
fi
EOF

chmod +x /opt/segi-crm/health-check.sh

# Adiciona ao cron (a cada 5 minutos)
echo "*/5 * * * * /opt/segi-crm/health-check.sh" | sudo crontab -
```

### Logs

```bash
# Veja logs em tempo real
docker-compose logs -f

# Apenas API
docker-compose logs -f api

# Apenas Frontend
docker-compose logs -f web

# Apenas Database
docker-compose logs -f postgres
```

---

## 🔐 Segurança

### Firewall

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Fail2Ban

```bash
# Instale
sudo apt install fail2ban

# Configure SSH
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### Environment Variables

```bash
# Nunca commite .env
echo ".env" >> .gitignore

# Use valores seguros para production
JWT_SECRET=<gere com openssl>
DATABASE_PASSWORD=<senha forte>
REDIS_PASSWORD=<senha forte>
```

---

## 📈 Performance

### Database Optimization

```bash
# Conecte ao database
docker-compose exec postgres psql -U segi_user segi_crm

# Cria índices
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_phone ON leads(phone);
CREATE INDEX idx_leads_score ON leads(lead_score DESC);
CREATE INDEX idx_opportunities_stage ON opportunities(stage);
CREATE INDEX idx_journeys_active ON journeys(is_active);

# Analisa query plans
EXPLAIN ANALYZE SELECT * FROM leads WHERE email = 'test@example.com';
```

### Redis Caching

```bash
# Verifique memory
docker-compose exec redis redis-cli info memory

# Limpe cache se necessário
docker-compose exec redis redis-cli FLUSHALL
```

### Nginx Caching

```bash
# Adicione ao nginx.conf
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m;

location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    proxy_cache my_cache;
    proxy_cache_valid 200 1d;
}
```

---

## 🔄 Atualizações

### Atualizar código

```bash
# Pull latest
git pull origin main

# Build images
docker-compose build

# Migrate database
docker-compose exec api npx prisma migrate deploy

# Restart
docker-compose up -d
```

### Rollback (se problema)

```bash
# Volta para versão anterior
git revert HEAD

# Rebuild
docker-compose build

# Restart
docker-compose up -d
```

---

## 📞 Contato & Suporte

### Logs úteis

```bash
# Salve logs para análise
docker-compose logs > logs_$(date +%Y%m%d).txt

# Envie para suporte
```

### Status Page

Crie `/opt/segi-crm/status.html` para monitoramento público.

---

## ✅ Checklist Pós-Deploy

- [ ] API respondendo em `/api/health`
- [ ] Frontend carregando
- [ ] Login funcionando
- [ ] Dashboard mostrando dados
- [ ] Leads list carregando
- [ ] Oportunidades kanban
- [ ] Agenda funcionando
- [ ] WhatsApp testado
- [ ] Meta webhook testado
- [ ] Backups agendados
- [ ] Monitoramento ativo
- [ ] SSL certificado válido
- [ ] Firewall configurado

---

**Deployment Completo! 🎉**

Sistema está pronto para produção.
