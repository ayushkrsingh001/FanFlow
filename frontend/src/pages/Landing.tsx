import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, MessageSquare, ArrowRight, ShieldCheck, Zap, Activity, Building, Globe, Mail } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { setRole } = useAppStore();

  const handleRoleSelect = (role: 'fan' | 'volunteer') => {
    setRole(role);
    navigate(role === 'fan' ? '/fan' : '/ops');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <header>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo-nav.webp" alt="FanFlow AI" width="183" height="40" className="h-10 mix-blend-multiply object-contain" fetchPriority="high" />
        </div>
        <div className="hidden md:flex items-center gap-8 text-[#334155] text-sm font-medium">
          <a href="#features" className="hover:text-[#16A34A] transition-colors">Features</a>
          <a href="#solutions" className="hover:text-[#16A34A] transition-colors">Solutions</a>
          <a href="#about" className="hover:text-[#16A34A] transition-colors">About</a>
          <a href="#contact" className="hover:text-[#16A34A] transition-colors">Contact</a>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="text-sm font-medium text-[#334155] hover:text-[#16A34A] transition-colors"
          >
            Login
          </button>
          <button 
            onClick={() => handleRoleSelect('fan')}
            className="btn-enterprise btn-primary px-4 py-2 text-sm"
          >
            Get Started
          </button>
        </div>
      </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F0FDF4] border border-[#BBF7D0] rounded-full text-xs font-semibold text-[#166534] mb-6">
            <ShieldCheck size={14} className="text-[#16A34A]" />
            Official FIFA World Cup 2026 Companion
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#0F172A] leading-tight mb-6">
            Smart Stadium <br />Intelligence Platform
          </h1>
          <p className="text-lg text-[#64748B] mb-10 max-w-lg leading-relaxed">
            FanFlow AI provides real-time crowd pulse monitoring, dynamic multilingual wayfinding, and operational insights to scale stadium operations efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="btn-enterprise btn-primary px-6 py-3 flex items-center justify-center gap-2"
            >
              Access Dashboard <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => handleRoleSelect('fan')}
              className="btn-enterprise btn-secondary px-6 py-3 flex items-center justify-center"
            >
              View Fan Demo
            </button>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="relative">
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 w-full aspect-video flex flex-col relative overflow-hidden shadow-enterprise">
            {/* Mock Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <LayoutDashboard size={20} className="text-[#64748B]" />
                <span className="font-semibold text-[#0F172A]">Operations Overview</span>
              </div>
              <div className="text-xs text-[#64748B]">Live Status: <span className="text-[#16A34A] font-medium">Optimal</span></div>
            </div>
            
            {/* Mock Content */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 flex flex-col justify-center">
                <span className="text-xs text-[#64748B] mb-1 uppercase font-semibold tracking-wider">Gate C Activity</span>
                <span className="text-2xl font-bold text-[#0F172A]">Moderate</span>
              </div>
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 flex flex-col justify-center">
                <span className="text-xs text-[#64748B] mb-1 uppercase font-semibold tracking-wider">Active Queries</span>
                <span className="text-2xl font-bold text-[#16A34A]">1,248</span>
              </div>
            </div>
            <div className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
               <div className="h-full flex items-center justify-center">
                 <Activity className="text-[#16A34A] opacity-30" size={48} />
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="bg-white border-t border-[#E5E7EB] py-24">
        <div className="max-w-[1200px] mx-auto px-8 w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Platform Capabilities</h2>
            <p className="text-[#64748B] max-w-2xl mx-auto">Built for scale, security, and seamless integration with existing stadium infrastructure.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white border border-[#E2E8F0] rounded-lg p-8 group cursor-pointer shadow-enterprise"
            >
              <div className="w-12 h-12 bg-[#F0FDF4] rounded-lg flex items-center justify-center mb-6 text-[#16A34A]">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Multilingual Intelligence</h3>
              <p className="text-[#64748B] text-sm leading-relaxed mb-4">
                Real-time contextual translation and culturally-aware wayfinding for global attendees.
              </p>
              <div className="flex items-center text-[#16A34A] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ArrowRight size={16} className="ml-1" />
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white border border-[#E2E8F0] rounded-lg p-8 group cursor-pointer shadow-enterprise"
            >
              <div className="w-12 h-12 bg-[#EFF6FF] rounded-lg flex items-center justify-center mb-6 text-[#2563EB]">
                <Activity size={24} />
              </div>
              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Live Crowd Pulse</h3>
              <p className="text-[#64748B] text-sm leading-relaxed mb-4">
                Aggregate user intents spatially to predict and prevent bottlenecks before they occur.
              </p>
              <div className="flex items-center text-[#16A34A] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ArrowRight size={16} className="ml-1" />
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white border border-[#E2E8F0] rounded-lg p-8 group cursor-pointer shadow-enterprise"
            >
              <div className="w-12 h-12 bg-[#FFFBEB] rounded-lg flex items-center justify-center mb-6 text-[#F59E0B]">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Automated Briefings</h3>
              <p className="text-[#64748B] text-sm leading-relaxed mb-4">
                Generate real-time, actionable shift briefings for staff based on live data trends.
              </p>
              <div className="flex items-center text-[#16A34A] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ArrowRight size={16} className="ml-1" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="bg-[#F8FAFC] border-t border-[#E5E7EB] py-24">
        <div className="max-w-[1200px] mx-auto px-8 w-full text-center">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Tailored Solutions</h2>
            <p className="text-[#64748B] max-w-2xl mx-auto">Providing customized operational excellence for major global events.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <div className="flex gap-6 items-start">
              <div className="w-14 h-14 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl flex items-center justify-center flex-shrink-0 text-[#16A34A]">
                <Users size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">For Fans</h3>
                <p className="text-[#64748B] leading-relaxed">
                  Enhance the matchday experience with seamless navigation, accessibility options, and instant answers to facility questions, ensuring fans never miss a moment of the action.
                </p>
              </div>
            </div>
            
            <div className="flex gap-6 items-start">
              <div className="w-14 h-14 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl flex items-center justify-center flex-shrink-0 text-[#2563EB]">
                <Building size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">For Operations</h3>
                <p className="text-[#64748B] leading-relaxed">
                  Empower staff and security with real-time heatmaps, intent tracking, and AI-driven shift briefings that adapt to crowd flow dynamically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white border-t border-[#E5E7EB] py-24">
        <div className="max-w-[1200px] mx-auto px-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#0F172A] mb-6">About FanFlow AI</h2>
              <p className="text-[#64748B] text-lg leading-relaxed mb-6">
                Developed specifically for high-capacity sporting events, FanFlow AI bridges the gap between spectator experience and operational command. 
              </p>
              <p className="text-[#64748B] text-lg leading-relaxed">
                By processing thousands of fan intents simultaneously without relying on active internet connectivity for core knowledge, we ensure reliability even in congested stadium networks.
              </p>
              <div className="mt-8 flex gap-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
                  <Globe className="text-[#16A34A]" size={18} /> Global Scale
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
                  <ShieldCheck className="text-[#16A34A]" size={18} /> Data Secure
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-enterprise">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg flex items-center justify-center">
                  <span className="text-[#16A34A] font-bold text-xl">26</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#0F172A]">Ready for 2026</h3>
                  <p className="text-sm text-[#64748B]">Supporting all 16 host cities</p>
                </div>
              </div>
              <ul className="space-y-4 text-sm text-[#64748B]">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></div>
                  North American Infrastructure
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></div>
                  Multi-language Support (EN, ES, FR)
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></div>
                  Offline-first Knowledge Base
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-[#F8FAFC] border-t border-[#E5E7EB] py-24 text-center">
        <div className="max-w-3xl mx-auto px-8 w-full">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-6">Ready to upgrade your stadium?</h2>
          <p className="text-[#64748B] mb-10 text-lg">
            Contact our enterprise team to schedule a live demonstration or request deployment details for your venue.
          </p>
          <a href="mailto:contact@fanflow.ai" className="inline-flex items-center gap-2 btn-enterprise btn-primary px-8 py-4 text-lg">
            <Mail size={20} /> Contact Sales
          </a>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] py-8 text-center text-sm text-[#64748B]">
        <p>&copy; 2026 FanFlow AI Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
