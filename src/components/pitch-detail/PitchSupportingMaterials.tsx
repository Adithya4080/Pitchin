import { useState } from 'react';
import { FileText, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

interface Material {
  url: string;
  type: 'image' | 'file';
  name: string;
}

interface PitchSupportingMaterialsProps {
  materials: Material[];
}

export function PitchSupportingMaterials({ materials }: PitchSupportingMaterialsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!materials.length) return null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {materials.map((material, index) => (
          <div
            key={index}
            className={cn(
              "relative rounded-lg overflow-hidden border border-border bg-muted/50",
              material.type === 'image' && "cursor-pointer hover:opacity-90 transition-opacity"
            )}
            onClick={() => material.type === 'image' && setSelectedImage(material.url)}
          >
            {material.type === 'image' ? (
              <div className="aspect-square">
                <img
                  src={material.url}
                  alt={material.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <a
                href={material.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 hover:bg-muted transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <FileText className="h-8 w-8 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium truncate">{material.name}</span>
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
