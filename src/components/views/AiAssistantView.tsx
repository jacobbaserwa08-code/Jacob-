import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, Send, Bot, User, RefreshCw, Lightbulb, Hammer } from 'lucide-react';

export const AiAssistantView: React.FC = () => {
  const { products, sales, currency } = useStore();

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    { sender: 'user' | 'ai'; text: string; time: string }[]
  >([
    {
      sender: 'ai',
      text: `Bonjour ! Je suis le conseiller virtuel IA de **Quincaillerie vie nouvelle**.\n\nJe peux vous aider à estimer les quantités de matériaux pour des projets (maçonnerie, électricité, plomberie, peinture), analyser vos niveaux de stock ou recommander vos réapprovisionnements.\n\nComment puis-je vous aider aujourd'hui ?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const quickPrompts = [
    'Recommande les réapprovisionnements prioritaires selon le stock restant actuel',
    'Combien de ciment, sable et gravier pour couler une dalle béton de 15m² ?',
    'Quels câbles et disjoncteurs pour une installation électrique 3 chambres ?',
    'Conseils pratiques pour booster les ventes en quincaillerie ce mois-ci'
  ];

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || prompt;
    if (!textToSend.trim() || loading) return;

    const userMsgTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: textToSend, time: userMsgTime }
    ]);

    if (!customPrompt) setPrompt('');
    setLoading(true);

    try {
      // Prepare Store Context
      const storeContext = {
        productsSummary: products.map((p) => ({
          name: p.name,
          category: p.category,
          stockRemaining: p.stockQuantity,
          minStock: p.minStockLevel,
          sellingPrice: p.sellingPrice,
          unit: p.unit
        })),
        lowStockItems: products.filter((p) => p.stockQuantity <= p.minStockLevel)
      };

      const response = await fetch('/api/ai/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          context: storeContext
        })
      });

      const data = await response.json();
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (data.advice) {
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', text: data.advice, time: aiTime }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: `Désolé, je n'ai pas pu générer de réponse. (${data.error || 'Erreur serveur'})`,
            time: aiTime
          }
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Erreur de connexion avec l'IA Quincaillerie. Assurez-vous que la clé d'API Gemini est configurée.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-slate-800" />
            <span>Assistant IA Gemini 2.5</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 uppercase font-sans tracking-tight">
            Conseiller IA Quincaillerie
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Estimations de projets BTP, recommandations de réapprovisionnement et conseil technique.
          </p>
        </div>
      </div>

      {/* Quick Suggestions Pills */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
          <Lightbulb className="w-3.5 h-3.5 mr-1 text-slate-600" />
          Questions Fréquentes / Suggestions
        </p>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              className="text-xs bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-lg px-3 py-1.5 text-left font-medium transition-colors shadow-xs flex items-center space-x-1.5"
            >
              <Hammer className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span>{qp}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4 min-h-[350px] max-h-[500px] overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white font-medium rounded-tr-none'
                  : 'bg-slate-50 text-slate-800 border border-slate-200/60 rounded-tl-none whitespace-pre-wrap'
              }`}
            >
              <div>{msg.text}</div>
              <div
                className={`text-[10px] text-right font-sans ${
                  msg.sender === 'user' ? 'text-slate-400' : 'text-slate-400'
                }`}
              >
                {msg.time}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-slate-600 font-medium p-2">
            <RefreshCw className="w-4 h-4 animate-spin text-slate-800" />
            <span>Réflexion et calcul de l'IA Quincaillerie...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Posez votre question (ex: Combien de tubes PVC pour 3 salles de bain ?)"
          className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !prompt.trim()}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs flex items-center space-x-1.5 transition-colors disabled:opacity-50 shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Envoyer</span>
        </button>
      </div>
    </div>
  );
};
