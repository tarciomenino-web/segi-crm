'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import MetaWebhookConfig from '@/components/integrations/MetaWebhookConfig';
import WebhookLogs from '@/components/integrations/WebhookLogs';
import { useWebhookConfig } from '@/hooks/useWebhookConfig';

export default function IntegrationsPage() {
  const router = useRouter();
  const { config, logs, loading, error, createConfig, updateConfig, generateVerifyToken, testWebhook } =
    useWebhookConfig();
  const [activeTab, setActiveTab] = useState<'meta' | 'logs' | 'status'>('meta');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }
  }, [router]);

  const successfulLeads = logs.filter((l) => l.status === 'success').length;
  const failedLeads = logs.filter((l) => l.status === 'failed').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integrações</h1>
          <p className="mt-2 text-gray-600">
            Configure webhooks para receber leads automaticamente
          </p>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg shadow p-4">
            <p className="text-red-800">⚠️ {error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-600 font-medium">Status</p>
            <p className={`text-2xl font-bold mt-1 ${config?.isActive ? 'text-green-600' : 'text-gray-600'}`}>
              {config?.isActive ? '✓ Ativo' : '✕ Inativo'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-600 font-medium">Leads Recebidos</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{config?.webhookCount || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-600 font-medium">Sucessos</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{successfulLeads}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-600 font-medium">Falhas</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{failedLeads}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('meta')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'meta'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Meta Lead Ads
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'status'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Status
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'logs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Logs ({logs.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Carregando configurações...</p>
          </div>
        ) : activeTab === 'meta' ? (
          <MetaWebhookConfig
            config={config}
            onCreateConfig={createConfig}
            onUpdateConfig={updateConfig}
            onGenerateToken={generateVerifyToken}
            onTestWebhook={testWebhook}
          />
        ) : activeTab === 'status' ? (
          <div className="space-y-6">
            {/* Webhook URL */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuração do Webhook</h2>

              {config ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL do Webhook
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={config.webhookUrl}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(config.webhookUrl)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        Copiar
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Use esta URL ao configurar o webhook no Meta Business Manager
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verify Token
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        readOnly
                        value={config.verifyToken}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(config.verifyToken)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        Copiar
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Token de verificação para validar webhooks
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Como configurar no Meta:</h3>
                    <ol className="text-sm text-blue-800 space-y-1">
                      <li>1. Vá para <a href="https://business.facebook.com" className="underline" target="_blank" rel="noopener noreferrer">business.facebook.com</a></li>
                      <li>2. Selecione sua conta de anúncios</li>
                      <li>3. Vá para "Leads Forms" / "Formulários de Leads"</li>
                      <li>4. Clique em "Settings" / "Configurações"</li>
                      <li>5. Cole a URL do webhook acima</li>
                      <li>6. Cole o Verify Token acima</li>
                      <li>7. Salve e teste a conexão</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Nenhuma configuração encontrada</p>
              )}
            </div>
          </div>
        ) : (
          <WebhookLogs logs={logs} />
        )}
      </div>
    </DashboardLayout>
  );
}
