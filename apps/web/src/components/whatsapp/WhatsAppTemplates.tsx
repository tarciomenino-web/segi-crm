'use client';

import { useState } from 'react';
import { WhatsAppTemplate } from '@/hooks/useWhatsApp';
import { Trash2, X } from 'lucide-react';

interface WhatsAppTemplatesProps {
  templates: WhatsAppTemplate[];
  isCreating: boolean;
  onCreateTemplate: (template: Partial<WhatsAppTemplate>) => Promise<void>;
  onDeleteTemplate: (id: string) => Promise<void>;
  onCloseCreate: () => void;
}

const categories = [
  { value: 'greeting' as const, label: 'Saudação', icon: '👋' },
  { value: 'follow_up' as const, label: 'Follow-up', icon: '📞' },
  { value: 'reminder' as const, label: 'Lembrete', icon: '🔔' },
  { value: 'feedback' as const, label: 'Feedback', icon: '⭐' },
  { value: 'custom' as const, label: 'Personalizado', icon: '✏️' },
];

export default function WhatsAppTemplates({
  templates,
  isCreating,
  onCreateTemplate,
  onDeleteTemplate,
  onCloseCreate,
}: WhatsAppTemplatesProps) {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'greeting' | 'follow_up' | 'reminder' | 'feedback' | 'custom'>('custom');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleCreate = async () => {
    if (!name || !content) {
      alert('Preencha nome e conteúdo');
      return;
    }

    setIsSaving(true);
    try {
      await onCreateTemplate({
        name,
        content,
        category,
        description,
        variables: extractVariables(content),
        active: true,
      });

      setName('');
      setContent('');
      setCategory('custom');
      setDescription('');
      onCloseCreate();
    } finally {
      setIsSaving(false);
    }
  };

  const extractVariables = (text: string): string[] => {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = text.match(regex) || [];
    return matches.map((m) => m.replace(/[{}]/g, ''));
  };

  return (
    <div className="space-y-6">
      {/* Templates List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Templates Disponíveis</h2>

        {templates.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-lg font-semibold text-gray-900">Nenhum template criado</p>
            <p className="text-gray-600 mt-2">
              Clique em "Novo Template" para começar
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`rounded-lg shadow p-6 border-l-4 transition-all ${
                  template.active
                    ? 'bg-white border-l-green-500 hover:shadow-lg'
                    : 'bg-gray-50 border-l-gray-400'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                  </div>
                  <button
                    onClick={() => onDeleteTemplate(template.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Category */}
                <div className="mb-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      template.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {categories.find((c) => c.value === template.category)?.icon}
                    {categories.find((c) => c.value === template.category)?.label}
                  </span>
                </div>

                {/* Content */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{template.content}</p>
                </div>

                {/* Variables */}
                {template.variables.length > 0 && (
                  <div className="text-xs text-gray-600">
                    <p className="font-semibold mb-1">Variáveis:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.map((v) => (
                        <span
                          key={v}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-mono text-xs"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Criar */}
      {isCreating && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onCloseCreate}
          >
            {/* Modal */}
            <div
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-gray-900">Novo Template</h2>
                <button onClick={onCloseCreate} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nome do Template
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ex: Bem-vindo ao Lead"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Descrição
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="ex: Mensagem inicial para novos leads"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Conteúdo da Mensagem
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Olá {{nome}}! Bem-vindo à Escola {{escola_nome}}. Seus dados: {{email}}"
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    Use {{variável}} para adicionar campos dinâmicos
                  </p>
                </div>

                {/* Preview */}
                {content && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-xs text-gray-600 font-semibold mb-2">Pré-visualização:</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{content}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-gray-200 sticky bottom-0 bg-gray-50">
                <button
                  onClick={onCloseCreate}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  disabled={isSaving || !name || !content}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Criando...' : 'Criar Template'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
