'use client';

import { useState } from 'react';
import { WhatsAppConfig as WhatsAppConfigType } from '@/hooks/useWhatsApp';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface WhatsAppConfigProps {
  config: WhatsAppConfigType | null;
  onUpdateConfig: (data: Partial<WhatsAppConfigType>) => Promise<void>;
  onTestConnection: () => Promise<void>;
}

export default function WhatsAppConfig({
  config,
  onUpdateConfig,
  onTestConnection,
}: WhatsAppConfigProps) {
  const [apiKey, setApiKey] = useState(config?.apiKey || '');
  const [businessName, setBusinessName] = useState(config?.businessName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateConfig({
        apiKey,
        businessName,
      });
      setMessage({ type: 'success', text: 'Configuração salva com sucesso!' });
    } catch {
      setMessage({ type: 'error', text: 'Erro ao salvar configuração' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      await onTestConnection();
      setMessage({ type: 'success', text: 'Conexão testada com sucesso!' });
    } catch {
      setMessage({ type: 'error', text: 'Erro ao testar conexão' });
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
              {config?.isActive ? '✓ WhatsApp Conectado' : '✕ WhatsApp Desconectado'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {config?.phoneNumber ? `Número: ${config.phoneNumber}` : 'Nenhum número configurado'}
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

      {/* Config Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Configuração UAZAPI</h2>

        <div className="space-y-4">
          {/* API Key */}
          <div>
            <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-2">
              API Key UAZAPI
            </label>
            <input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Sua API Key..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
            />
            <p className="text-xs text-gray-600 mt-2">
              Obtém em <a href="https://uazapi.com" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">uazapi.com</a>
            </p>
          </div>

          {/* Business Name */}
          <div>
            <label htmlFor="business-name" className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Negócio
            </label>
            <input
              id="business-name"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="ex: Escola Gastronômica"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-600 mt-2">
              Nome que aparecerá nas mensagens
            </p>
          </div>

          {/* Current Phone */}
          {config?.phoneNumber && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700">Número Cadastrado</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">{config.phoneNumber}</p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
            <h3 className="font-semibold text-green-900 mb-2">Como usar UAZAPI:</h3>
            <ol className="text-sm text-green-800 space-y-1">
              <li>1. Crie conta em <a href="https://uazapi.com" className="underline" target="_blank" rel="noopener noreferrer">uazapi.com</a></li>
              <li>2. Conecte sua conta WhatsApp Business</li>
              <li>3. Copie sua API Key</li>
              <li>4. Cole aqui e teste conexão</li>
              <li>5. Comece a enviar mensagens!</li>
            </ol>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={isSaving || !apiKey || !businessName}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isSaving ? 'Salvando...' : 'Salvar Configuração'}
          </button>
          <button
            onClick={handleTest}
            disabled={isTesting || !config?.isActive}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isTesting ? 'Testando...' : 'Testar Conexão'}
          </button>
        </div>
      </div>

      {/* Recursos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recursos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Automações</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Mensagens ao criar lead</li>
              <li>✓ Follow-up automático</li>
              <li>✓ Confirmação de agendamento</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Templates</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Pré-configurados</li>
              <li>✓ Personalizáveis</li>
              <li>✓ Com variáveis dinâmicas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
