import { motion } from 'motion/react';
import { ArrowUpRight, Tag } from 'lucide-react';
import { EntityDiscovery } from '../../types';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

interface EntityCardProps {
  entity: EntityDiscovery;
  index: number;
}

export function EntityCard({ entity, index }: EntityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group relative h-full overflow-hidden glass-card p-6 flex flex-col justify-between"
    >
      <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
        <img
          src={entity.imageUrl}
          alt={entity.name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] uppercase tracking-widest font-semibold border border-white/10">
            {entity.category}
          </span>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 45 }}
            className="p-2 rounded-full glass-morphism cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
          </motion.div>
        </div>

        <h3 className="text-2xl font-bold tracking-tight mb-2 group-hover:text-red-500 transition-colors text-black">
          {entity.name}
        </h3>
        <p className="text-sm text-zinc-600 line-clamp-2 leading-relaxed font-medium">
          {entity.summary}
        </p>
      </div>

      <div className="relative z-10 pt-4">
        <div className="flex flex-wrap gap-2 mb-6">
          {entity.tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 text-[10px] text-red-500 font-mono font-bold">
              <Tag className="w-3 h-3 opacity-70" />
              {tag}
            </span>
          ))}
        </div>
        <Button variant="glass" size="sm" className="w-full justify-between group/btn">
          Explore Details
          <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
}
