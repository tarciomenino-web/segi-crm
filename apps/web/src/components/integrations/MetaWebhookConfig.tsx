'use client';

import { useState } from 'react';
import { WebhookConfig } from '@/hooks/useWebhookConfig';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface MetaWebhookConfigProps {
  config: WebhookConfig | null;
  onCreateConfig: (provider: string, data: Partial<WebhookConfig>) => Promise<WebhookConfig>;
  onUpdateConfig: (id: string, data: Partial<WebhookConfig>) => Promise<void>;
  onGenerateToken: () => Promise<string>;
  onTestWebhook: () => Promise<void>;
}

export default function MetaWebhookConfig({
  config,
  onCreateConfig,
  onUpdateConfig,
  onGenerateToken,
  onTestWebhook,
}: MetaWebhookConfigProps) {
  const [pageId, setPageId] = useState(config?.pageId || '');
  const [leadFormId, setLeadFormId] = useState(config?.leadFormId || '');
  const [accessToken, setAccessToken] = useState(config?.accessToken || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (config?.id) {
        await onUpdateConfig(config.id, {
          pageId,
          leadFormId,
          accessToken,
        });
        setMessage({ type: 'success', text: 'Configuração salva com sucesso!' });
      } else {
        await onCreateConfig('meta', {
          pageId,
          leadFormId,
          accessToken,
          isActive: true,
        });
        setMessage({ type: 'success', text: 'Configuração criada com sucesso!' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro ao salvar configuração' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateToken = async () => {
    setIsGenerating(true);
    try {
      const token = await onGenerateToken();
      setMessage({ type: 'success', text: 'Token gerado! Copie: ' + token });
    } catch {
      setMessage({ type: 'error', text: 'Erro ao gerar token' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      await onTestWebhook();
      setMessage({ type: 'success', text: 'Webhook testado com sucesso!' });
    } catch {
      setMessage({ type: 'error', text: 'Erro ao testar webhook' });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status */}
      <div className={`rounded-lg shadow p-6 border-l-4 ${
        config?.isActive
          ? 'bg-green-50 border-l-green-500'
          : 'bg-yellow-50 border-l-yellow-500'
      }`}>
        <div className="flex items-center gap-3">
          {config?.isActive ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <AlertCircle className="w-6 h-6 text-yellow-600" />
          )}
          <div>
            <h2 className="font-semibold text-gray-900">
              {config?.isActive ? '✓ Webhook Ativo' : '✕ Webhook Inativo'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {config?.lastWebhookReceived
                ? `Último webhook recebido: ${new Date(config.lastWebhookReceived).toLocaleString('pt-BR')}`
                : 'Nenhum webhook recebido ainda'}
            </p>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`rounded-lg p-4 ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          <p className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </p>
        </div>
      )}

      {/* Formulário */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Configuração Meta Lead Ads</h2>

        <div className="space-y-4">
          {/* Page ID */}
          <div>
            <label htmlFor="page-id" className="block text-sm font-medium text-gray-700 mb-2">
              Page ID
            </label>
            <input
              id="page-id"
              type="text"
              value={pageId}
              onChange={(e) => setPageId(e.target.value)}
              placeholder="123456789"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-600 mt-2">
              ID da página do Facebook
            </p>
          </div>

          {/* Lead Form ID */}
          <div>
            <label htmlFor="form-id" className="block text-sm font-medium text-gray-700 mb-2">
              Lead Form ID
            </label>
            <input
              id="form-id"
              type="text"
              value={leadFormId}
              onChange={(e) => setLeadFormId(e.target.value)}
              placeholder="987654321"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-600 mt-2">
              ID do formulário de leads do Meta
            </p>
          </div>

          {/* Access Token */}
          <div>
            <label htmlFor="access-token" className="block text-sm font-medium text-gray-700 mb-2">
              Access Token
            </label>
            <input
              id="access-token"
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="eaaxxxxxxxxx"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
            <p className="text-xs text-gray-600 mt-2">
              Token de acesso do Meta (EAAB...)
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <h3 className="font-semibold text-blue-900 mb-2">Como obter as credenciais:</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Acesse <a href="https://developers.facebook.com" className="underline" target="_blank" rel="noopener noreferrer">developers.facebook.com</a></li>
              <li>2. Vá para "My Apps" → Selecione seu app</li>
              <li>3. Copie o Access Token da sua app</li>
              <li>4. No Business Manager, copie o Page ID e Form ID</li>
            </ol>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={isSaving || !pageId || !leadFormId || !accessToken}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isSaving ? 'Salvando...' : 'Salvar Configuração'}
          </button>
          <button
            onClick={handleTest}
            disabled={isTesting || !config?.isActive}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isTesting ? 'Testando...' : 'Testar Webhook'}
          </button>
          <button
            onClick={handleGenerateToken}
            disabled={isGenerating}
            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Gerando...' : 'Gerar Token'}
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recursos</h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-gray-700">
            <span className="text-green-600">✓</span>
            Recebe leads automaticamente do Meta Ads
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <span className="text-green-600">✓</span>
            Cria leads no sistema automaticamente
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <span className="text-green-600">✓</span>
            Rastreia tentativas de sincronização
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <span className="text-green-600">✓</span>
            Detecta leads duplicados
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <span className="text-green-600">✓</span>
            Dispara automações ao receber lead
          </li>
        </ul>
      </div>
    </div>
  );
}
