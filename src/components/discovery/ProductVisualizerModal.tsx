import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wand2, X, Download, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { generateProductImage } from '../../services/imageService';

interface ProductVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  description: string;
  title: string;
}

export function ProductVisualizerModal({ isOpen, onClose, description, title }: ProductVisualizerModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && description && !imageUrl) {
      handleGenerate();
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const url = await generateProductImage(description);
      setImageUrl(url);
    } catch (err) {
      console.error(err);
      setError("Failed to visualize this product. Our creative engine is busy.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="absolute top-4 right-4 z-10">
            <button 
              onClick={onClose}
              className="p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-black" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative aspect-square bg-zinc-100 flex items-center justify-center overflow-hidden">
              {isGenerating ? (
                <div className="text-center p-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full mx-auto mb-4"
                  />
                  <p className="text-[10px] uppercase font-black text-red-500 tracking-widest">Rendering Vision...</p>
                </div>
              ) : imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-center p-8 text-zinc-400">
                   <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                   <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">
                     {error || "Visual not available"}
                   </p>
                </div>
              )}
            </div>

            <div className="p-8 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-red-500/10 text-[9px] font-black uppercase tracking-[0.2em] mb-4 text-red-500">
                  <Wand2 className="w-3 h-3" />
                  Imagen Visualizer
                </div>
                <h3 className="text-2xl font-black tracking-tighter text-black mb-4">{title}</h3>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed mb-6">
                  {description}
                </p>
              </div>

              <div className="space-y-4">
                {imageUrl && (
                  <Button variant="primary" className="w-full gap-2" onClick={() => window.open(imageUrl)}>
                    <Download className="w-4 h-4" />
                    Download Concept
                  </Button>
                )}
                <Button 
                   variant="secondary" 
                  className="w-full gap-2" 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  <RefreshCw className={isGenerating ? "animate-spin w-4 h-4" : "w-4 h-4"} />
                  Re-imagine
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
