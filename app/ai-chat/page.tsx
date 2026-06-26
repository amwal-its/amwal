"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Bot } from 'lucide-react';

export default function AIChatPage() {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Halo! Saya AI Amwal, asisten cerdas Anda. Ada yang bisa saya bantu terkait wakaf, zakat, atau instrumen keuangan syariah lainnya?',
      time: '10:00'
    }
  ]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    // Add user message
    const newMsg = {
      id: messages.length + 1,
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMsg]);
    setInputText('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'ai',
        text: 'Wakaf produktif adalah pengelolaan harta benda wakaf untuk kegiatan yang bernilai ekonomis. Keuntungannya nanti digunakan untuk hal-hal yang sesuai dengan tujuan wakaf.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative flex flex-col w-full border-x border-gray-100 shadow-xs">
      <div className="bg-white px-4 py-3 flex items-center sticky top-0 z-10 border-b border-gray-100 shadow-sm">
        <button onClick={() => router.back()} className="mr-3 text-gray-600 hover:text-amwal-secondary-teal transition cursor-pointer">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amwal-secondary-teal to-amwal-secondary-green text-white flex items-center justify-center mr-2">
            <Bot size={16} />
          </div>
          <div>
            <h1 className="font-bold text-sm text-gray-800">Tanya AI Amwal</h1>
            <p className="text-[10px] text-amwal-secondary-teal font-medium">Online</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && (
              <div className="w-6 h-6 rounded-full bg-amwal-secondary-teal/10 text-amwal-secondary-teal flex flex-col items-center justify-center mr-2 mt-1 shrink-0">
                <Bot size={14} />
              </div>
            )}
            
            <div className={`max-w-[80%] rounded-2xl p-3 ${
              msg.sender === 'user' 
                ? 'bg-amwal-secondary-teal text-white rounded-tr-sm' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border-t border-gray-200 p-3">
        <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 relative">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ketik pertanyaan Anda..." 
            className="flex-1 bg-transparent text-sm outline-none text-gray-800"
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="w-8 h-8 bg-amwal-secondary-teal text-white rounded-full flex items-center justify-center hover:bg-amwal-secondary-teal/90 transition disabled:bg-gray-400 cursor-pointer"
          >
            <Send size={14} className={inputText.trim() ? 'ml-0.5' : ''}/>
          </button>
        </div>
      </div>
    </div>
  );
}
