import { toast } from "sonner";

const MAX_SIZE_MB = 5;

export default function useUploadPreview() {  

  const uploadPreview = async (files: FileList | null, cb: (data: string[])=> void ) => {   

    if (!files) {      
      toast.error("Invalid file list");
      return null;
    }

    const urls = await Promise.all(Array.from(files).map(file => {
      if (file.size > MAX_SIZE_MB * (1024 * 1024)) {
        toast.error(`Image size must be ${MAX_SIZE_MB} MB or less`);
        throw new Error(`Image size must be ${MAX_SIZE_MB} MB or less`);
      }
      return URL.createObjectURL(file);
    }));


    cb(urls);
  };

  return uploadPreview;
}
