import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wand2, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { generateProductImage } from '../../services/imageService';

export function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const url = await generateProductImage(prompt);
      setGeneratedImageUrl(url);
    } catch (err: any) {
      console.error("Imagen Error:", err);
      setError("Failed to generate image. Please try a different prompt.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="py-20 bg-zinc-950/50 relative overflow-hidden" id="fashion-lab">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-morphism border-red-500/30 text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-red-500">
            <Wand2 className="w-3 h-3" />
            AI Fashion Lab
          </div>
          <h2 className="text-5xl font-black tracking-tighter mb-6 text-black">Infinite Design <span className="text-red-500">Creation</span></h2>
          <p className="text-zinc-600 font-medium max-w-xl mx-auto">
            Use Imagen intelligence to generate unique fashion concepts, textile patterns, and luxury aesthetics in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="glass-card p-8 border-red-500/10">
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">Prompt Intelligence</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Minimalist silk gown inspired by French architecture..."
                className="w-full h-32 bg-black/5 border border-black/10 rounded-xl p-4 text-sm font-medium focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all resize-none text-black placeholder:text-zinc-400"
              />
              <div className="mt-6 flex gap-4">
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !prompt.trim()}
                  variant="primary"
                  className="flex-1 gap-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Visualizing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      Generate Vision
                    </>
                  )}
                </Button>
              </div>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center gap-2 text-xs text-red-500 font-bold"
                >
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {['Floral Patterns', 'Cyberpunk Streetwear', 'Sustainable Silks', 'Gothic Couture'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setPrompt(prev => prev + ' ' + preset)}
                  className="p-4 rounded-xl glass-morphism border-black/5 text-[10px] uppercase font-black text-zinc-500 hover:text-red-500 hover:border-red-500/30 transition-all text-left"
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="relative aspect-square">
            <div className={cn(
              "absolute inset-0 rounded-3xl border border-black/5 bg-black/5 overflow-hidden shadow-2xl",
              !generatedImageUrl && "flex items-center justify-center p-12 text-center"
            )}>
              <AnimatePresence mode="wait">
                {generatedImageUrl ? (
                  <motion.div
                    key="image"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group h-full"
                  >
                    <img 
                      src={generatedImageUrl} 
                      alt="Generated fashion concept" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <Button variant="glass" size="sm" onClick={() => window.open(generatedImageUrl)}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="w-16 h-16 bg-black/10 rounded-full mx-auto flex items-center justify-center">
                      <Wand2 className="w-8 h-8 text-zinc-300" />
                    </div>
                    <div>
                      <h4 className="text-zinc-400 font-black text-xs uppercase tracking-widest mb-1">Waiting for Seed</h4>
                      <p className="text-[10px] text-zinc-500 font-medium">Input your design parameters to begin</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {isGenerating && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full mx-auto mb-4"
                    />
                    <p className="text-[10px] uppercase font-black text-red-500 tracking-widest">Architecting Pixels...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
