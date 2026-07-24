'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import WhatsAppConfig from '@/components/whatsapp/WhatsAppConfig';
import WhatsAppTemplates from '@/components/whatsapp/WhatsAppTemplates';
import WhatsAppMessages from '@/components/whatsapp/WhatsAppMessages';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import { Plus } from 'lucide-react';

export default function WhatsAppPage() {
  const router = useRouter();
  const {
    config,
    templates,
    messages,
    loading,
    error,
    updateConfig,
    sendMessage,
    sendTemplate,
    createTemplate,
    deleteTemplate,
    testConnection,
  } = useWhatsApp();
  const [activeTab, setActiveTab] = useState<'config' | 'templates' | 'messages'>('config');
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
      return;
    }
  }, [router]);

  const sentMessages = messages.filter((m) => m.status === 'sent' || m.status === 'delivered').length;
  const failedMessages = messages.filter((m) => m.status === 'failed').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">WhatsApp</h1>
            <p className="mt-2 text-gray-600">
              Envie mensagens e automações via WhatsApp com UAZAPI
            </p>
          </div>
          {activeTab === 'templates' && (
            <button
              onClick={() => setIsCreatingTemplate(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Novo Template
            </button>
          )}
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
            <p className="text-xs text-gray-600 font-medium">Mensagens</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{messages.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-600 font-medium">Enviadas</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{sentMessages}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-600 font-medium">Templates</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{templates.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'config'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Configuração
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'templates'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Templates ({templates.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'messages'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Mensagens ({messages.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Carregando WhatsApp...</p>
          </div>
        ) : activeTab === 'config' ? (
          <WhatsAppConfig config={config} onUpdateConfig={updateConfig} onTestConnection={testConnection} />
        ) : activeTab === 'templates' ? (
          <WhatsAppTemplates
            templates={templates}
            isCreating={isCreatingTemplate}
            onCreateTemplate={createTemplate}
            onDeleteTemplate={deleteTemplate}
            onCloseCreate={() => setIsCreatingTemplate(false)}
          />
        ) : (
          <WhatsAppMessages
            messages={messages}
            onSendMessage={sendMessage}
            onSendTemplate={sendTemplate}
            templates={templates}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
