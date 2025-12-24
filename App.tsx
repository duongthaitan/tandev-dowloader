
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Download, 
  Link2, 
  Youtube, 
  Instagram, 
  Facebook, 
  Music, 
  Video,
  Plus,
  ArrowRight,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';
import { analyzeMediaUrl } from './geminiService';
import { MediaMetadata, DownloadHistory, Platform, MediaFormat } from './types';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<MediaMetadata | null>(null);
  const [history, setHistory] = useState<DownloadHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showShortcutInfo, setShowShortcutInfo] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const performAnalysis = useCallback(async (targetUrl: string) => {
    if (!targetUrl.trim()) return;
    setLoading(true);
    setError(null);
    setMetadata(null);

    try {
      const data = await analyzeMediaUrl(targetUrl);
      setMetadata(data);
      
      const newEntry: DownloadHistory = {
        id: Math.random().toString(36).substr(2, 9),
        url: targetUrl,
        title: data.title,
        platform: data.platform,
        timestamp: Date.now()
      };
      setHistory(prev => {
        const filtered = prev.filter(h => h.url !== targetUrl);
        const updated = [newEntry, ...filtered].slice(0, 10);
        localStorage.setItem('download_history', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      const errorMsg = 'Lỗi: Link không hợp lệ hoặc máy chủ bận.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedUrl = params.get('url');
    if (sharedUrl) {
      const decodedUrl = decodeURIComponent(sharedUrl);
      setUrl(decodedUrl);
      performAnalysis(decodedUrl);
    }
    const saved = localStorage.getItem('download_history');
    if (saved) setHistory(JSON.parse(saved));
  }, [performAnalysis]);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    performAnalysis(url);
  };

  const handleDownload = (format: MediaFormat) => {
    setDownloadingId(format.id);
    // Giả lập quá trình chuẩn bị tệp
    setTimeout(() => {
      setDownloadingId(null);
      try {
        const element = document.createElement("a");
        const file = new Blob([`Tandev.foto Content: ${format.quality}`], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `tandev_${metadata?.title.replace(/[^a-z0-9]/gi, '_') || 'video'}_${format.quality}.${format.ext}`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        showToast(`Bắt đầu tải ${format.quality} thành công!`);
      } catch (e) {
        showToast("Lỗi khi tạo tệp tải xuống.", "error");
      }
    }, 1000);
  };

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case 'youtube': return <Youtube size={18} />;
      case 'instagram': return <Instagram size={18} />;
      case 'facebook': return <Facebook size={18} />;
      case 'tiktok': return <Video size={18} />;
      default: return <Link2 size={18} />;
    }
  };

  const videoFormats = metadata?.formats.filter(f => f.type === 'video') || [];
  const audioFormats = metadata?.formats.filter(f => f.type === 'audio') || [];

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white font-['Inter'] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b-[3px] border-black px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href = window.location.origin}>
          <div className="w-10 h-10 bg-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
            <Download className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-[900] tracking-tighter uppercase leading-none">Tandev Loader</h1>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mt-1 italic">Tandev.foto</p>
          </div>
        </div>
        
        <button onClick={() => setShowShortcutInfo(true)} className="flex items-center gap-2 px-5 py-2.5 border-[3px] border-black font-[900] text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none">
          <Smartphone size={16} />
          <span className="hidden sm:inline">Phím tắt iOS</span>
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        {!metadata && (
          <section className="mb-16 text-center lg:text-left">
            <h2 className="text-6xl md:text-9xl font-[900] tracking-tighter mb-8 uppercase leading-[0.85]">
              Pure <br /> Download <span className="text-zinc-200">Tool.</span>
            </h2>
          </section>
        )}

        {/* Search Form */}
        <form onSubmit={handleAnalyze} className="mb-20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input 
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="DÁN LINK CỦA BẠN TẠI ĐÂY..."
                className="w-full bg-white border-[3px] border-black p-6 text-lg transition-all outline-none rounded-none font-black placeholder:text-zinc-200 focus:shadow-[10px_10px_0px_rgba(0,0,0,1)]"
              />
              <Link2 className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-200" size={24} />
            </div>
            <button 
              type="submit"
              disabled={loading || !url}
              className="bg-black text-white px-12 py-6 font-[900] uppercase tracking-widest hover:bg-zinc-800 disabled:bg-zinc-100 transition-all shadow-[10px_10px_0px_rgba(0,0,0,0.1)] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>PHÂN TÍCH <ArrowRight size={20}/></>}
            </button>
          </div>
        </form>

        {/* Analysis Results */}
        {metadata && (
          <div className="animate-brutal">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
              {/* Thumbnail */}
              <div className="lg:col-span-5 xl:col-span-4">
                <div className="bg-white border-[3px] border-black p-2 shadow-[12px_12px_0px_rgba(0,0,0,1)]">
                  <div className="aspect-square bg-zinc-100 relative overflow-hidden border-[2px] border-black">
                    <img src={metadata.thumbnail} alt={metadata.title} className="w-full h-full object-cover" />
                    <div className="absolute top-0 right-0 bg-black text-white p-3 border-l-[2px] border-b-[2px] border-black">
                      {getPlatformIcon(metadata.platform)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Formats */}
              <div className="lg:col-span-7 xl:col-span-8">
                <div className="mb-8">
                  <h3 className="text-3xl md:text-5xl font-[900] uppercase leading-none tracking-tighter mb-3">
                    {metadata.title}
                  </h3>
                  <div className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400">
                    BY {metadata.author} • {metadata.platform}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Video */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 border-b-2 border-black pb-2">
                      <Video size={18} strokeWidth={3} />
                      <h4 className="text-[12px] font-[900] uppercase tracking-[0.3em]">Video</h4>
                    </div>
                    <div className="space-y-3">
                      {videoFormats.map((f) => (
                        <button 
                          key={f.id}
                          onClick={() => handleDownload(f)}
                          className="w-full flex items-center justify-between p-5 border-[3px] border-black bg-white hover:bg-black hover:text-white transition-all group active:translate-y-1"
                        >
                          <div className="text-left">
                            <div className="text-[16px] font-[900] uppercase tracking-tighter leading-none">{f.quality}</div>
                            <div className="text-[9px] font-bold uppercase tracking-widest mt-1 opacity-50 group-hover:opacity-100">
                              {f.ext} {f.size ? `• ${f.size}` : ''}
                            </div>
                          </div>
                          {downloadingId === f.id ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Audio */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 border-b-2 border-black pb-2">
                      <Music size={18} strokeWidth={3} />
                      <h4 className="text-[12px] font-[900] uppercase tracking-[0.3em]">Audio</h4>
                    </div>
                    <div className="space-y-3">
                      {audioFormats.map((f) => (
                        <button 
                          key={f.id}
                          onClick={() => handleDownload(f)}
                          className="w-full flex items-center justify-between p-5 border-[3px] border-black bg-white hover:bg-black hover:text-white transition-all group active:translate-y-1"
                        >
                          <div className="text-left">
                            <div className="text-[16px] font-[900] uppercase tracking-tighter leading-none">{f.quality}</div>
                            <div className="text-[9px] font-bold uppercase tracking-widest mt-1 opacity-50 group-hover:opacity-100">
                              {f.ext}
                            </div>
                          </div>
                          {downloadingId === f.id ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State / Features */}
        {!metadata && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-10 border-[3px] border-black bg-white shadow-[8px_8px_0px_rgba(0,0,0,1)]">
               <h5 className="text-[13px] font-black uppercase mb-4 tracking-widest">No Ads.</h5>
               <p className="text-[11px] text-zinc-500 font-bold leading-relaxed uppercase tracking-wider">Trải nghiệm tải xuống sạch sẽ, không quảng cáo, không chuyển hướng.</p>
            </div>
            <div className="p-10 border-[3px] border-black bg-white shadow-[8px_8px_0px_rgba(0,0,0,1)]">
               <h5 className="text-[13px] font-black uppercase mb-4 tracking-widest">Universal.</h5>
               <p className="text-[11px] text-zinc-500 font-bold leading-relaxed uppercase tracking-wider">Hỗ trợ tất cả các mạng xã hội phổ biến nhất hiện nay.</p>
            </div>
            <div className="p-10 border-[3px] border-black bg-white shadow-[8px_8px_0px_rgba(0,0,0,1)] lg:col-span-1 md:col-span-2">
               <h5 className="text-[13px] font-black uppercase mb-4 tracking-widest">Tandev.foto.</h5>
               <p className="text-[11px] text-zinc-500 font-bold leading-relaxed uppercase tracking-wider">Công cụ được phát triển bởi Tandev. Phục vụ nhu cầu tải media nhanh.</p>
            </div>
          </div>
        )}
      </main>

      <footer className="px-10 py-16 text-center border-t-[3px] border-black bg-white">
          <p className="text-[11px] font-black uppercase tracking-[0.5em] text-black">
            © 2024 - 2025 BY TANDEV.FOTO
          </p>
      </footer>

      {/* Floating Notification System */}
      {toast && (
        <div 
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] min-w-[320px] p-5 border-[4px] shadow-[15px_15px_0px_rgba(0,0,0,0.1)] flex items-center justify-between animate-brutal
            ${toast.type === 'success' ? 'bg-black text-white border-green-500' : 'bg-white text-red-600 border-red-600'}`}
        >
          <div className="flex items-center gap-4">
            {toast.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            <span className="text-[11px] font-black uppercase tracking-widest">{toast.msg}</span>
          </div>
          <button onClick={() => setToast(null)} className="ml-4 opacity-50 hover:opacity-100">
            <X size={18} />
          </button>
        </div>
      )}

      {/* iOS Shortcut Modal */}
      {showShortcutInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-white/95 ios-blur" onClick={() => setShowShortcutInfo(false)} />
          <div className="relative w-full max-w-lg bg-white border-[8px] border-black p-10 shadow-[24px_24px_0px_rgba(0,0,0,1)] animate-brutal">
            <div className="flex justify-between items-start mb-10">
              <h3 className="text-5xl font-[900] tracking-tighter uppercase italic leading-[0.8]">IOS<br/>TANDEV</h3>
              <button onClick={() => setShowShortcutInfo(false)} className="p-2 border-[3px] border-black hover:bg-black hover:text-white transition-all">
                <X size={24} strokeWidth={3} />
              </button>
            </div>
            
            <div className="space-y-8 mb-10">
              <div>
                <h5 className="font-black text-[10px] uppercase mb-2 tracking-widest text-zinc-400">Endpoint URL</h5>
                <div className="bg-zinc-50 p-4 border-[2px] border-black text-[11px] break-all font-black select-all">
                  {window.location.origin}/?url=
                </div>
              </div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase leading-relaxed tracking-wider">
                Dán URL này vào hành động "Mở URL" trong Phím tắt iPhone, thêm biến "Shortcut Input" vào cuối cùng để tự động hóa việc tải.
              </p>
            </div>

            <button 
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/?url=`);
                showToast("Đã sao chép Base URL!");
                setShowShortcutInfo(false);
              }}
              className="w-full bg-black text-white py-6 font-black text-[12px] uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all shadow-[8px_8px_0px_rgba(0,0,0,0.1)]"
            >
              Sao chép Base URL
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
