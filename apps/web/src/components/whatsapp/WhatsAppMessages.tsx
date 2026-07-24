'use client';

import { useState } from 'react';
import { WhatsAppMessage, WhatsAppTemplate } from '@/hooks/useWhatsApp';
import { Send } from 'lucide-react';

interface WhatsAppMessagesProps {
  messages: WhatsAppMessage[];
  onSendMessage: (leadId: string, message: string, templateId?: string) => Promise<void>;
  onSendTemplate: (leadId: string, templateId: string, variables: Record<string, string>) => Promise<void>;
  templates: WhatsAppTemplate[];
}

export default function WhatsAppMessages({
  messages,
  onSendMessage,
  onSendTemplate,
  templates,
}: WhatsAppMessagesProps) {
  const [leadId, setLeadId] = useState('');
  const [messageText, setMessageText] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const selectedTemplateData = templates.find((t) => t.id === selectedTemplate);

  const handleSendMessage = async () => {
    if (!leadId || !messageText) {
      setMessage({ type: 'error', text: 'Preencha lead e mensagem' });
      return;
    }

    setIsSending(true);
    try {
      await onSendMessage(leadId, messageText);
      setLeadId('');
      setMessageText('');
      setMessage({ type: 'success', text: 'Mensagem enviada!' });
    } catch {
      setMessage({ type: 'error', text: 'Erro ao enviar mensagem' });
    } finally {
      setIsSending(false);
    }
  };

  const handleSendTemplate = async () => {
    if (!leadId || !selectedTemplate) {
      setMessage({ type: 'error', text: 'Selecione lead e template' });
      return;
    }

    setIsSending(true);
    try {
      await onSendTemplate(leadId, selectedTemplate, templateVariables);
      setLeadId('');
      setSelectedTemplate('');
      setTemplateVariables({});
      setMessage({ type: 'success', text: 'Template enviado!' });
    } catch {
      setMessage({ type: 'error', text: 'Erro ao enviar template' });
    } finally {
      setIsSending(false);
    }
  };

  const sentCount = messages.filter((m) => m.status === 'sent' || m.status === 'delivered').length;
  const failedCount = messages.filter((m) => m.status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-600 font-medium">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{messages.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-600 font-medium">Enviadas</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{sentCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-600 font-medium">Falhas</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{failedCount}</p>
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

      {/* Enviar Mensagem */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Enviar Mensagem</h2>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 pb-4">
          <button
            onClick={() => setSelectedTemplate('')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              !selectedTemplate
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Mensagem Livre
          </button>
          <button
            onClick={() => setMessageText('')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              selectedTemplate
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Usar Template
          </button>
        </div>

        <div className="space-y-4">
          {/* Lead ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID do Lead
            </label>
            <input
              type="text"
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              placeholder="ID ou telefone do lead"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {!selectedTemplate ? (
            <>
              {/* Mensagem Livre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-600 mt-2">
                  {messageText.length} caracteres
                </p>
              </div>

              <button
                onClick={handleSendMessage}
                disabled={isSending || !leadId || !messageText}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                {isSending ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </>
          ) : (
            <>
              {/* Template */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Selecione um template...</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Variables */}
              {selectedTemplateData?.variables.map((variable) => (
                <div key={variable}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {variable}
                  </label>
                  <input
                    type="text"
                    value={templateVariables[variable] || ''}
                    onChange={(e) =>
                      setTemplateVariables({
                        ...templateVariables,
                        [variable]: e.target.value,
                      })
                    }
                    placeholder={`Valor para ${variable}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              ))}

              {/* Preview */}
              {selectedTemplateData && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-xs text-gray-600 font-semibold mb-2">Pré-visualização:</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedTemplateData.content.replace(
                      /\{\{(\w+)\}\}/g,
                      (_, variable) => templateVariables[variable] || `{{${variable}}}`
                    )}
                  </p>
                </div>
              )}

              <button
                onClick={handleSendTemplate}
                disabled={isSending || !leadId || !selectedTemplate}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                {isSending ? 'Enviando...' : 'Enviar Template'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Histórico */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Histórico de Mensagens</h2>
        </div>

        {messages.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            Nenhuma mensagem enviada
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {messages.map((msg) => (
              <div key={msg.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{msg.leadName}</p>
                    <p className="text-xs text-gray-600 font-mono">{msg.leadPhone}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      msg.status === 'sent' || msg.status === 'delivered'
                        ? 'bg-green-100 text-green-700'
                        : msg.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {msg.status === 'sent'
                      ? '✓ Enviada'
                      : msg.status === 'delivered'
                        ? '✓✓ Entregue'
                        : msg.status === 'pending'
                          ? '⏳ Pendente'
                          : '✕ Falha'}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{msg.content}</p>
                <p className="text-xs text-gray-500">
                  {new Date(msg.createdAt).toLocaleString('pt-BR')}
                </p>
                {msg.error && (
                  <p className="text-xs text-red-600 mt-1">Erro: {msg.error}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
