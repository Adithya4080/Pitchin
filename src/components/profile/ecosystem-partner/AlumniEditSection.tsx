 import { useState } from 'react';
 import { Plus, Trash2, GripVertical, ExternalLink, Upload, X } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Textarea } from '@/components/ui/textarea';
 import { Card, CardContent } from '@/components/ui/card';
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
  import { toast } from 'sonner';
 import type { AlumniStartupEntry } from './types';
 
 interface AlumniEditSectionProps {
   alumni: AlumniStartupEntry[];
   onChange: (alumni: AlumniStartupEntry[]) => void;
   userId?: string;
   isMobile?: boolean;
 }
 
 const STATUS_OPTIONS: AlumniStartupEntry['status_tag'][] = [
   'Alumni',
   'Unicorn',
   'Public Company',
   'Acquired',
 ];
 
 export function AlumniEditSection({ alumni, onChange, userId, isMobile = false }: AlumniEditSectionProps) {
   const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
 
   const handleAddAlumni = () => {
     const newAlumni: AlumniStartupEntry = {
       startup_name: '',
       logo_url: '',
       short_description: '',
       status_tag: 'Alumni',
       external_link: '',
     };
     onChange([...alumni, newAlumni]);
   };
 
   const handleRemoveAlumni = (index: number) => {
     const updated = alumni.filter((_, i) => i !== index);
     onChange(updated);
   };
 
   const handleUpdateAlumni = (index: number, field: keyof AlumniStartupEntry, value: string | undefined) => {
     const updated = alumni.map((item, i) => {
       if (i === index) {
         return { ...item, [field]: value };
       }
       return item;
     });
     onChange(updated);
   };
 
   const handleLogoUpload = async (index: number, file: File) => {
     if (!userId) return;
     
     if (file.size > 2 * 1024 * 1024) {
       toast.error('Logo must be less than 2MB');
       return;
     }
     setUploadingIndex(index);
      try {
        const fileExt = file.name.split('.').pop();
        const filePath = `${userId}/alumni-${Date.now()}-${index}.${fileExt}`;
        
        // File upload: store as base64 until backend storage is configured
        const publicUrl = URL.createObjectURL(file)
        
        handleUpdateAlumni(index, 'logo_url', publicUrl);
        toast.success('Logo uploaded successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to upload logo');
      } finally {
        setUploadingIndex(null);
      }
   };
 
   const handleRemoveLogo = (index: number) => {
     handleUpdateAlumni(index, 'logo_url', '');
   };
 
   return (
     <div className="space-y-6">
       <div className="flex items-center justify-between">
         <div>
           <h3 className="text-base font-semibold text-foreground">Startups & Alumni</h3>
           <p className="text-sm text-muted-foreground mt-1">
             Showcase notable startups supported by your organization.
           </p>
         </div>
         <Button onClick={handleAddAlumni} size="sm" variant="outline">
           <Plus className="h-4 w-4 mr-1.5" />
           Add
         </Button>
       </div>
 
       {alumni.length === 0 ? (
         <Card className="border-dashed">
           <CardContent className="py-8 text-center">
             <p className="text-sm text-muted-foreground mb-3">
               No alumni entries yet. Add your first startup.
             </p>
             <Button onClick={handleAddAlumni} size="sm" variant="outline">
               <Plus className="h-4 w-4 mr-1.5" />
               Add Startup
             </Button>
           </CardContent>
         </Card>
       ) : (
         <div className="space-y-4">
           {alumni.map((item, index) => (
             <Card key={index} className="border-border/50">
               <CardContent className="p-4">
                 <div className="flex items-start gap-3">
                   <div className="flex-shrink-0 pt-2">
                     <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                   </div>
                   
                   <div className="flex-1 space-y-4">
                     {/* Logo Upload */}
                     <div>
                       <Label className="text-sm">Logo</Label>
                       <div className="mt-1.5">
                         {item.logo_url ? (
                           <div className="relative inline-block">
                             <img 
                               src={item.logo_url} 
                               alt="Logo" 
                               className="h-16 w-auto max-w-[120px] object-contain rounded border border-border bg-muted/30 p-2"
                             />
                             <Button
                               variant="destructive"
                               size="icon"
                               className="absolute -top-2 -right-2 h-6 w-6"
                               onClick={() => handleRemoveLogo(index)}
                             >
                               <X className="h-3 w-3" />
                             </Button>
                           </div>
                         ) : (
                           <label className="flex items-center justify-center w-24 h-16 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/30 transition-colors">
                             <input
                               type="file"
                               accept="image/*"
                               className="hidden"
                               onChange={(e) => {
                                 const file = e.target.files?.[0];
                                 if (file) handleLogoUpload(index, file);
                               }}
                               disabled={uploadingIndex === index}
                             />
                             {uploadingIndex === index ? (
                               <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                             ) : (
                               <Upload className="h-5 w-5 text-muted-foreground" />
                             )}
                           </label>
                         )}
                       </div>
                     </div>
 
                     {/* Startup Name */}
                     <div>
                       <Label className="text-sm">Startup Name *</Label>
                       <Input
                         value={item.startup_name}
                         onChange={(e) => handleUpdateAlumni(index, 'startup_name', e.target.value)}
                         placeholder="e.g., Stripe"
                         className="mt-1.5"
                       />
                     </div>
 
                     {/* Description */}
                     <div>
                       <Label className="text-sm">Short Description</Label>
                       <Textarea
                         value={item.short_description || ''}
                         onChange={(e) => handleUpdateAlumni(index, 'short_description', e.target.value)}
                         placeholder="Brief description of the startup (1-2 lines)"
                         rows={2}
                         className="mt-1.5 resize-none"
                         maxLength={150}
                       />
                       <p className="text-xs text-muted-foreground mt-1">
                         {(item.short_description || '').length}/150 characters
                       </p>
                     </div>
 
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {/* Status Tag */}
                       <div>
                         <Label className="text-sm">Status</Label>
                         <Select
                           value={item.status_tag || ''}
                           onValueChange={(value) => handleUpdateAlumni(index, 'status_tag', value as AlumniStartupEntry['status_tag'])}
                         >
                           <SelectTrigger className="mt-1.5">
                             <SelectValue placeholder="Select status" />
                           </SelectTrigger>
                           <SelectContent>
                             {STATUS_OPTIONS.map((status) => (
                               <SelectItem key={status} value={status || ''}>
                                 {status}
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                       </div>
 
                       {/* External Link */}
                       <div>
                         <Label className="text-sm">Website URL</Label>
                         <div className="relative mt-1.5">
                           <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <Input
                             value={item.external_link || ''}
                             onChange={(e) => handleUpdateAlumni(index, 'external_link', e.target.value)}
                             placeholder="https://..."
                             className="pl-9"
                           />
                         </div>
                       </div>
                     </div>
                   </div>
 
                   <Button
                     variant="ghost"
                     size="icon"
                     onClick={() => handleRemoveAlumni(index)}
                     className="flex-shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                   >
                     <Trash2 className="h-4 w-4" />
                   </Button>
                 </div>
               </CardContent>
             </Card>
           ))}
         </div>
       )}
 
       <p className="text-xs text-muted-foreground text-center">
         Selected alumni showcased by the organization.
       </p>
     </div>
   );
 }