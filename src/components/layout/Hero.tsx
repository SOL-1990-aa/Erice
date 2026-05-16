import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import { Sparkles, ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none overflow-hidden opacity-50">
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[60%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[20%] right-[20%] w-[40%] h-[60%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>

      <div className="relative container mx-auto px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-morphism border-red-500/30 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 text-red-600"
        >
          <Sparkles className="w-3 h-3" />
          Powered by Gemini AI
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.95] text-black"
        >
          Discover Brands, <span className="text-gradient">Fashion</span> & Research
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto text-zinc-600 text-lg md:text-xl font-medium leading-relaxed mb-12"
        >
          Erce Explorer intelligently organizes fashion labels, textile houses, 
          and educational research into one seamless AI-powered ecosystem.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" className="w-full sm:w-auto gap-2">
            Explore Now
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="lg" className="w-full sm:w-auto">
            View Analytics
          </Button>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
