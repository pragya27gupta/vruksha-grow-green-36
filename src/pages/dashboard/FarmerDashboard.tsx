import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Camera, 
  MapPin, 
  Clock, 
  Mic, 
  Upload, 
  Plus, 
  Eye,
  Calendar,
  Weight,
  Package
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface HarvestRecord {
  id: string;
  cropSpecies: string;
  weight: number;
  quantity: number;
  location: string;
  timestamp: string;
  photo?: string;
  notes?: string;
  status: 'recorded' | 'verified' | 'processed';
}

const FarmerDashboard = () => {
  const { t } = useTranslation();
  const [harvestForm, setHarvestForm] = useState({
    cropSpecies: '',
    weight: '',
    quantity: '',
    location: '',
    notes: '',
    photo: null as File | null
  });
  
  const [isListening, setIsListening] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [harvests, setHarvests] = useState<HarvestRecord[]>([
    {
      id: '1',
      cropSpecies: 'Turmeric',
      weight: 25.5,
      quantity: 100,
      location: 'Field A, Village Xyz',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'verified',
      notes: 'High quality organic turmeric'
    },
    {
      id: '2',
      cropSpecies: 'Ashwagandha',
      weight: 15.2,
      quantity: 75,
      location: 'Field B, Village Xyz',
      timestamp: '2024-01-14T14:20:00Z',
      status: 'processed',
      notes: 'Premium grade roots'
    }
  ]);

  const cropOptions = [
    { value: 'Turmeric', icon: '🌱', color: 'bg-brand-yellow/20 text-brand-yellow border-brand-yellow/30' },
    { value: 'Ashwagandha', icon: '🌿', color: 'bg-brand-green/20 text-brand-green border-brand-green/30' },
    { value: 'Tulsi', icon: '🍃', color: 'bg-trust-organic/20 text-trust-organic border-trust-organic/30' },
    { value: 'Neem', icon: '🌱', color: 'bg-brand-green-light/20 text-brand-green-light border-brand-green-light/30' },
    { value: 'Aloe Vera', icon: '🌿', color: 'bg-trust-quality/20 text-trust-quality border-trust-quality/30' },
    { value: 'Ginger', icon: '🫚', color: 'bg-brand-orange/20 text-brand-orange border-brand-orange/30' },
    { value: 'Cardamom', icon: '🌱', color: 'bg-trust-verified/20 text-trust-verified border-trust-verified/30' },
    { value: 'Black Pepper', icon: '⚫', color: 'bg-muted/40 text-muted-foreground border-muted/60' },
    { value: 'Cinnamon', icon: '🟤', color: 'bg-brand-red/20 text-brand-red border-brand-red/30' },
    { value: 'Clove', icon: '🌰', color: 'bg-brand-black/10 text-brand-black border-brand-black/20' },
    { value: 'Fenugreek', icon: '🌱', color: 'bg-brand-yellow/20 text-brand-yellow border-brand-yellow/30' },
    { value: 'Cumin', icon: '🌾', color: 'bg-brand-orange/20 text-brand-orange border-brand-orange/30' },
    { value: 'Coriander', icon: '🌿', color: 'bg-brand-green/20 text-brand-green border-brand-green/30' },
    { value: 'Fennel', icon: '🌱', color: 'bg-brand-green-light/20 text-brand-green-light border-brand-green-light/30' },
    { value: 'Mustard', icon: '🌼', color: 'bg-brand-yellow/20 text-brand-yellow border-brand-yellow/30' }
  ];

  const handleSubmitHarvest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!harvestForm.cropSpecies || !harvestForm.weight || !harvestForm.quantity) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newHarvest: HarvestRecord = {
      id: Date.now().toString(),
      cropSpecies: harvestForm.cropSpecies,
      weight: parseFloat(harvestForm.weight),
      quantity: parseInt(harvestForm.quantity),
      location: harvestForm.location || 'Auto-detected location',
      timestamp: new Date().toISOString(),
      status: 'recorded',
      notes: harvestForm.notes
    };

    setHarvests([newHarvest, ...harvests]);
    setHarvestForm({
      cropSpecies: '',
      weight: '',
      quantity: '',
      location: '',
      notes: '',
      photo: null
    });

    toast({
      title: "Success",
      description: "Harvest record created successfully!"
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setHarvestForm({
            ...harvestForm,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          });
          toast({
            title: "Location captured",
            description: "GPS coordinates have been auto-filled"
          });
        },
        (error) => {
          toast({
            title: "Location error",
            description: "Unable to get current location",
            variant: "destructive"
          });
        }
      );
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHarvestForm({ ...harvestForm, photo: file });
      toast({
        title: "Photo selected",
        description: `Selected: ${file.name}`
      });
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
      toast({
        title: "Camera started",
        description: "Position your camera to take the photo"
      });
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera",
        variant: "destructive"
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `harvest-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setHarvestForm({ ...harvestForm, photo: file });
            toast({
              title: "Photo captured!",
              description: "Photo has been captured successfully"
            });
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Not Supported",
        description: "Voice input not supported in this browser",
        variant: "destructive"
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Speak your notes clearly"
      });
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setHarvestForm({ 
        ...harvestForm, 
        notes: harvestForm.notes + (harvestForm.notes ? ' ' : '') + transcript 
      });
      toast({
        title: "Voice captured",
        description: `Added: "${transcript}"`
      });
    };

    recognition.onerror = (event) => {
      toast({
        title: "Voice Error",
        description: "Could not capture voice input",
        variant: "destructive"
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const generateCertificate = async (harvest: HarvestRecord) => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(40, 120, 40);
    pdf.text('VrukshaChain Certificate', 20, 30);
    
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Harvest Authenticity Certificate', 20, 45);
    
    // Certificate content
    pdf.setFontSize(12);
    pdf.text(`Certificate ID: VC-${harvest.id}`, 20, 65);
    pdf.text(`Issue Date: ${new Date().toLocaleDateString()}`, 20, 75);
    
    pdf.text('HARVEST DETAILS:', 20, 95);
    pdf.text(`Crop Species: ${harvest.cropSpecies}`, 30, 105);
    pdf.text(`Weight: ${harvest.weight} kg`, 30, 115);
    pdf.text(`Quantity: ${harvest.quantity} units`, 30, 125);
    pdf.text(`Location: ${harvest.location}`, 30, 135);
    pdf.text(`Harvest Date: ${new Date(harvest.timestamp).toLocaleDateString()}`, 30, 145);
    pdf.text(`Status: ${harvest.status.toUpperCase()}`, 30, 155);
    
    if (harvest.notes) {
      pdf.text('Notes:', 30, 170);
      const splitNotes = pdf.splitTextToSize(harvest.notes, 150);
      pdf.text(splitNotes, 30, 180);
    }
    
    // Footer
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text('This certificate is digitally generated and verifies the authenticity', 20, 250);
    pdf.text('of the harvest record in the VrukshaChain traceability system.', 20, 260);
    
    // QR Code placeholder
    pdf.rect(150, 200, 40, 40);
    pdf.text('QR Code', 165, 225);
    
    // Save the PDF
    pdf.save(`VrukshaChain-Certificate-${harvest.id}.pdf`);
    
    toast({
      title: "Certificate Downloaded",
      description: `Certificate for ${harvest.cropSpecies} has been downloaded`
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      recorded: 'bg-brand-blue/20 text-brand-blue border-brand-blue/30',
      verified: 'bg-trust-verified/20 text-trust-verified border-trust-verified/30',
      processed: 'bg-brand-green/20 text-brand-green border-brand-green/30'
    };
    return (
      <Badge className={`${variants[status as keyof typeof variants]} border`} variant="outline">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 space-y-6">
        {/* Enhanced Header Section */}
         <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-green via-brand-green-light to-trust-organic p-6 md:p-8 shadow-elegant">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%23ffffff%27 fill-opacity=%270.1%27%3E%3Ccircle cx=%277%27 cy=%277%27 r=%272%27/%3E%3Ccircle cx=%2727%27 cy=%277%27 r=%272%27/%3E%3Ccircle cx=%2747%27 cy=%277%27 r=%272%27/%3E%3Ccircle cx=%277%27 cy=%2727%27 r=%272%27/%3E%3Ccircle cx=%2727%27 cy=%2727%27 r=%272%27/%3E%3Ccircle cx=%2747%27 cy=%2727%27 r=%272%27/%3E%3Ccircle cx=%277%27 cy=%2747%27 r=%272%27/%3E%3Ccircle cx=%2727%27 cy=%2747%27 r=%272%27/%3E%3Ccircle cx=%2747%27 cy=%2747%27 r=%272%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 leading-tight">
                  {t('farmerPortal')}
                </h1>
                <p className="text-white/90 text-sm sm:text-base">
                  Record harvests, track quality, build supply chain credibility
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { label: 'Total Harvests', value: harvests.length.toString(), icon: Package },
                { label: 'Verified', value: harvests.filter(h => h.status === 'verified').length.toString(), icon: Calendar },
                { label: 'Processed', value: harvests.filter(h => h.status === 'processed').length.toString(), icon: Weight },
                { label: 'Quality Score', value: '95%', icon: Eye }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
                  <stat.icon className="h-5 w-5 text-white mx-auto mb-1" />
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Tabs defaultValue="new-harvest" className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto scrollbar-hide">
            <TabsList className="grid w-full grid-cols-3 min-w-[320px]">
              <TabsTrigger value="new-harvest" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">{t('newHarvest')}</span>
                <span className="xs:hidden">New</span>
              </TabsTrigger>
              <TabsTrigger value="past-harvests" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">{t('pastHarvests')}</span>
                <span className="xs:hidden">Past</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Analytics</span>
                <span className="xs:hidden">Data</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="new-harvest">
            <Card className="border-0 shadow-card bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-r from-brand-green to-trust-organic rounded-xl">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-brand-green to-trust-organic bg-clip-text text-transparent">
                    {t('recordHarvest')}
                  </span>
                </CardTitle>
                <CardDescription className="text-base">
                  Capture harvest details with auto GPS and timestamp validation
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <form onSubmit={handleSubmitHarvest} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="cropSpecies" className="text-base font-medium flex items-center gap-2">
                        <Package className="h-4 w-4 text-brand-green" />
                        {t('cropSpecies')} *
                      </Label>
                      <Select
                        value={harvestForm.cropSpecies}
                        onValueChange={(value) => setHarvestForm({ ...harvestForm, cropSpecies: value })}
                      >
                        <SelectTrigger className="h-12 bg-background/50 border-2 border-muted hover:border-brand-green/50 transition-all">
                          <SelectValue placeholder="Select crop/species" />
                        </SelectTrigger>
                        <SelectContent className="bg-background/95 backdrop-blur-md">
                          {cropOptions.map((crop) => (
                            <SelectItem key={crop.value} value={crop.value} className="py-3">
                              <div className="flex items-center gap-3 py-1">
                                <span className="text-xl">{crop.icon}</span>
                                <span className="font-medium">{crop.value}</span>
                                <Badge className={`ml-auto text-xs ${crop.color}`} variant="outline">
                                  Premium
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="weight" className="text-base font-medium flex items-center gap-2">
                        <Weight className="h-4 w-4 text-brand-orange" />
                        {t('weight')} (kg) *
                      </Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        value={harvestForm.weight}
                        onChange={(e) => setHarvestForm({ ...harvestForm, weight: e.target.value })}
                        placeholder="25.5"
                        className="h-12 bg-background/50 border-2 border-muted hover:border-brand-orange/50 focus:border-brand-orange transition-all text-lg"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="quantity" className="text-base font-medium flex items-center gap-2">
                        <Package className="h-4 w-4 text-trust-quality" />
                        {t('quantity')} (units) *
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={harvestForm.quantity}
                        onChange={(e) => setHarvestForm({ ...harvestForm, quantity: e.target.value })}
                        placeholder="100"
                        className="h-12 bg-background/50 border-2 border-muted hover:border-trust-quality/50 focus:border-trust-quality transition-all text-lg"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="location" className="text-base font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-brand-red" />
                        {t('location')}
                      </Label>
                      <div className="flex gap-3">
                        <Input
                          id="location"
                          value={harvestForm.location}
                          onChange={(e) => setHarvestForm({ ...harvestForm, location: e.target.value })}
                          placeholder="Will auto-fill with GPS"
                          className="h-12 bg-background/50 border-2 border-muted hover:border-brand-red/50 focus:border-brand-red transition-all text-lg"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon" 
                          onClick={getCurrentLocation} 
                          className="shrink-0 h-12 w-12 border-2 border-brand-red/30 hover:border-brand-red hover:bg-brand-red/10"
                        >
                          <MapPin className="h-5 w-5 text-brand-red" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="photo" className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-muted-foreground" />
                      {t('photoUpload')}
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={startCamera}
                        className="flex items-center gap-2 h-10 sm:h-11"
                      >
                        <Camera className="h-4 w-4" />
                        <span className="text-sm">📸 Take Photo</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const fileInput = document.createElement('input');
                          fileInput.type = 'file';
                          fileInput.accept = 'image/*';
                          fileInput.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) handlePhotoUpload({ target: { files: [file] } } as any);
                          };
                          fileInput.click();
                        }}
                        className="flex items-center gap-2 h-10 sm:h-11"
                      >
                        <Upload className="h-4 w-4" />
                        <span className="text-sm">📁 Upload Photo</span>
                      </Button>
                    </div>
                  </div>
                  
                  {harvestForm.photo && (
                    <div className="text-sm text-muted-foreground p-2 bg-muted rounded-md">
                      ✅ {harvestForm.photo.name}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="flex items-center gap-2">
                      <Mic className="h-4 w-4 text-muted-foreground" />
                      {t('notes')} (Optional)
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="notes"
                        value={harvestForm.notes}
                        onChange={(e) => setHarvestForm({ ...harvestForm, notes: e.target.value })}
                        placeholder="Add any additional notes about the harvest..."
                        rows={3}
                        className="resize-none"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={startVoiceInput}
                        disabled={isListening}
                        className="absolute bottom-2 right-2 h-8 w-8 p-0"
                      >
                        <Mic className={`h-4 w-4 ${isListening ? 'text-red-500 animate-pulse' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                    <Button type="submit" className="flex items-center gap-2 h-11">
                      <Package className="h-4 w-4" />
                      {t('recordHarvest')}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setHarvestForm({
                          cropSpecies: '',
                          weight: '',
                          quantity: '',
                          location: '',
                          notes: '',
                          photo: null
                        });
                      }}
                      className="h-11"
                    >
                      Clear Form
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="past-harvests">
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-gradient-to-r from-muted/50 to-accent/10 p-4 rounded-xl">
                <div>
                  <h2 className="text-2xl font-semibold bg-gradient-to-r from-brand-green to-trust-verified bg-clip-text text-transparent">
                    {t('pastHarvests')}
                  </h2>
                  <p className="text-muted-foreground">Your harvest history and certifications</p>
                </div>
                <Badge variant="outline" className="bg-background/50 border-brand-green/30 text-brand-green">
                  {harvests.length} records
                </Badge>
              </div>

              <div className="grid gap-6">
                {harvests.map((harvest) => {
                  const cropOption = cropOptions.find(c => c.value === harvest.cropSpecies);
                  return (
                    <Card key={harvest.id} className="border-0 shadow-card bg-card/50 backdrop-blur-sm hover:shadow-trust transition-all duration-300 hover:scale-[1.02]">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-r from-brand-green/20 to-trust-organic/20 rounded-2xl border border-brand-green/30">
                              <span className="text-2xl">{cropOption?.icon || '🌱'}</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-xl text-foreground">{harvest.cropSpecies}</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <span className="inline-block w-2 h-2 bg-brand-green rounded-full"></span>
                                ID: {harvest.id}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(harvest.status)}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                          <div className="flex items-center gap-3 p-3 bg-brand-orange/10 rounded-xl border border-brand-orange/20">
                            <Weight className="h-5 w-5 text-brand-orange" />
                            <div>
                              <div className="font-semibold text-brand-orange">{harvest.weight} kg</div>
                              <div className="text-xs text-muted-foreground">Weight</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-trust-quality/10 rounded-xl border border-trust-quality/20">
                            <Package className="h-5 w-5 text-trust-quality" />
                            <div>
                              <div className="font-semibold text-trust-quality">{harvest.quantity}</div>
                              <div className="text-xs text-muted-foreground">Units</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-brand-red/10 rounded-xl border border-brand-red/20">
                            <MapPin className="h-5 w-5 text-brand-red" />
                            <div>
                              <div className="font-semibold text-brand-red text-sm truncate">{harvest.location}</div>
                              <div className="text-xs text-muted-foreground">Location</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-brand-blue/10 rounded-xl border border-brand-blue/20">
                            <Clock className="h-5 w-5 text-brand-blue" />
                            <div>
                              <div className="font-semibold text-brand-blue text-sm">
                                {new Date(harvest.timestamp).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-muted-foreground">Date</div>
                            </div>
                          </div>
                        </div>

                        {harvest.notes && (
                          <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-brand-green">
                            <p className="text-sm text-muted-foreground italic">
                              "{harvest.notes}"
                            </p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-muted">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              toast({ title: "Details", description: `Viewing details for harvest ${harvest.id}` });
                            }}
                            className="flex items-center gap-2 hover:bg-brand-green/10 hover:border-brand-green/50"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => generateCertificate(harvest)}
                            className="flex items-center gap-2 hover:bg-trust-verified/10 hover:border-trust-verified/50"
                          >
                            <Package className="h-4 w-4" />
                            Download Certificate
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-muted/50 to-accent/10 p-4 rounded-xl">
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-brand-green to-trust-verified bg-clip-text text-transparent">
                  Analytics Dashboard
                </h2>
                <p className="text-muted-foreground">Track your farming performance and growth</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-trust-organic/20 to-brand-green/10 border-trust-organic/30 hover:shadow-trust transition-all">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-trust-organic font-medium flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Total Harvests
                    </CardDescription>
                    <CardTitle className="text-3xl font-bold text-trust-organic">{harvests.length}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">+2 this month</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-trust-verified/20 to-brand-green-light/10 border-trust-verified/30 hover:shadow-trust transition-all">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-trust-verified font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Verified Records
                    </CardDescription>
                    <CardTitle className="text-3xl font-bold text-trust-verified">
                      {harvests.filter(h => h.status === 'verified').length}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">100% verified rate</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-brand-orange/20 to-brand-red/10 border-brand-orange/30 hover:shadow-trust transition-all">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-brand-orange font-medium flex items-center gap-2">
                      <Weight className="h-4 w-4" />
                      Total Weight
                    </CardDescription>
                    <CardTitle className="text-3xl font-bold text-brand-orange">
                      {harvests.reduce((sum, h) => sum + h.weight, 0).toFixed(1)} kg
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">Across all crops</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-trust-quality/20 to-brand-blue/10 border-trust-quality/30 hover:shadow-trust transition-all">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-trust-quality font-medium flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Quality Score
                    </CardDescription>
                    <CardTitle className="text-3xl font-bold text-trust-quality">95%</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">Excellent quality</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-card bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-brand-green" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {harvests.slice(0, 3).map((harvest) => (
                      <div key={harvest.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="p-2 bg-brand-green/20 rounded-lg">
                          <Package className="h-4 w-4 text-brand-green" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{harvest.cropSpecies}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(harvest.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        {getStatusBadge(harvest.status)}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-card bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-trust-verified" />
                      Crop Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(
                        harvests.reduce((acc, h) => {
                          acc[h.cropSpecies] = (acc[h.cropSpecies] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([crop, count]) => {
                        const cropOption = cropOptions.find(c => c.value === crop);
                        const percentage = (count / harvests.length) * 100;
                        return (
                          <div key={crop} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{cropOption?.icon || '🌱'}</span>
                                <span className="font-medium text-sm">{crop}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">{count} ({percentage.toFixed(0)}%)</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-brand-green to-trust-verified h-2 rounded-full transition-all duration-500" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-background border rounded-xl p-6 max-w-lg w-full shadow-glow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Take Photo</h3>
                <Button variant="outline" size="sm" onClick={stopCamera}>
                  Close
                </Button>
              </div>
              
              <div className="relative mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 bg-muted rounded-lg object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={capturePhoto} className="flex-1 bg-gradient-to-r from-brand-green to-trust-verified">
                  <Camera className="h-4 w-4 mr-2" />
                  Capture Photo
                </Button>
                <Button variant="outline" onClick={stopCamera}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;