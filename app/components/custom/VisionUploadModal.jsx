"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Eye, UploadCloud, Sparkles, RefreshCw, Image as ImageIcon, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function VisionUploadModal({ isOpen, onClose, onGeneratedCode }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file (PNG, JPG, WEBP)");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setImagePreview(uploadEvent.target.result);
        setImageBase64(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSynthesize = async () => {
    if (!imageBase64) {
      toast.error("Please upload a wireframe sketch or UI screenshot first");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/ml/vision-to-code", {
        imageBase64,
        additionalPrompt: instructions,
      });

      if (res.data?.files) {
        onGeneratedCode(res.data.files);
        toast.success("✨ Wireframe successfully synthesized into React code!");
        onClose();
      } else {
        toast.error("Could not parse vision result");
      }
    } catch (err) {
      console.error("Vision synthesis error:", err);
      toast.error("Failed to synthesize wireframe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-slate-900 border border-slate-800 text-slate-100 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                Vision Wireframe-to-Code (Multi-Modal ML)
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs mt-0.5">
                Upload a hand-drawn sketch, paper wireframe, or UI screenshot to synthesize it into React.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Dropzone */}
          {!imagePreview ? (
            <label className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition bg-slate-950/60 group">
              <UploadCloud className="w-10 h-10 text-slate-500 group-hover:text-cyan-400 mb-3 transition" />
              <p className="text-sm font-semibold text-white">Click or drag & drop wireframe image</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP sketches supported</p>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <img src={imagePreview} alt="Wireframe Preview" className="max-h-60 w-full object-contain p-2" />
              <button
                onClick={() => {
                  setImagePreview(null);
                  setImageBase64(null);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/90 text-slate-400 hover:text-white border border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Extra Instructions */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Additional Instructions (Optional)
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Add dark neon theme with animated interactive cards..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={handleSynthesize}
            disabled={loading || !imageBase64}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:opacity-95 text-white font-semibold text-xs transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Multi-Modal Neural Vision Analyzing Sketch...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Synthesize Wireframe into React Code
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
