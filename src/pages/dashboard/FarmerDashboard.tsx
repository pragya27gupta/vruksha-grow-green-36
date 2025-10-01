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
import { Progress } from '@/components/ui/progress';
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
  Package,
  Download,
  ChevronRight,
  CheckCircle,
  ArrowLeft,
  Leaf,
  Sprout,
  TreePine,
  HelpCircle
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
  const [currentStep, setCurrentStep] = useState(1);
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

  const totalSteps = 5;

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
    { value: 'Turmeric', icon: '🌱' },
    { value: 'Ashwagandha', icon: '🌿' },
    { value: 'Tulsi', icon: '🍃' },
    { value: 'Neem', icon: '🌱' },
    { value: 'Aloe Vera', icon: '🌿' },
    { value: 'Ginger', icon: '🫚' },
    { value: 'Cardamom', icon: '🌱' },
    { value: 'Black Pepper', icon: '⚫' },
    { value: 'Cinnamon', icon: '🟤' },
    { value: 'Clove', icon: '🌰' },
    { value: 'Fenugreek', icon: '🌱' },
    { value: 'Cumin', icon: '🌾' },
    { value: 'Coriander', icon: '🌿' },
    { value: 'Fennel', icon: '🌱' },
    { value: 'Mustard', icon: '🌼' }
  ];

  const handleSubmitHarvest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!harvestForm.cropSpecies || !harvestForm.weight || !harvestForm.quantity) {
      toast({
        title: "🚫 Missing Information",
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
    setCurrentStep(1);

    toast({
      title: "🎉 Success!",
      description: "Harvest record created successfully! Great work!"
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
    
    pdf.setFontSize(20);
    pdf.text('VrukshaChain Certificate', 20, 30);
    
    pdf.setFontSize(16);
    pdf.text('Harvest Authenticity Certificate', 20, 45);
    
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
    
    pdf.setFontSize(10);
    pdf.text('This certificate is digitally generated and verifies the authenticity', 20, 250);
    pdf.text('of the harvest record in the VrukshaChain traceability system.', 20, 260);
    
    pdf.rect(150, 200, 40, 40);
    pdf.text('QR Code', 165, 225);
    
    pdf.save(`VrukshaChain-Certificate-${harvest.id}.pdf`);
    
    toast({
      title: "Certificate Downloaded",
      description: `Certificate for ${harvest.cropSpecies} has been downloaded`
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      recorded: { variant: 'secondary' as const, color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Clock },
      verified: { variant: 'default' as const, color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      processed: { variant: 'outline' as const, color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Package }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <div className={`inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${config.color} flex-shrink-0`}>
        <Icon className="h-3 w-3 md:h-4 md:w-4" />
        <span className="whitespace-nowrap">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </div>
    );
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Sprout className="h-16 w-16 mx-auto text-green-600" />
              <h2 className="text-2xl font-bold">{t('chooseYourCrop')}</h2>
              <p className="text-muted-foreground">{t('selectCropHelp')}</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {cropOptions.map((crop) => (
                <button
                  key={crop.value}
                  type="button"
                  onClick={() => {
                    setHarvestForm({ ...harvestForm, cropSpecies: crop.value });
                    nextStep();
                  }}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    harvestForm.cropSpecies === crop.value
                      ? 'border-green-500 bg-green-50 shadow-lg'
                      : 'border-gray-200 hover:border-green-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-3xl mb-2">{crop.icon}</div>
                  <div className="font-medium text-sm text-center">{crop.value}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <Weight className="h-16 w-16 mx-auto text-green-600" />
              <h2 className="text-2xl font-bold">{t('measurements')}</h2>
              <p className="text-muted-foreground">{t('measurementsHelp')}</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-lg font-medium">{t('weightInKg')} *</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={harvestForm.weight}
                  onChange={(e) => setHarvestForm({ ...harvestForm, weight: e.target.value })}
                  className="h-16 text-2xl text-center"
                />
              </div>
              
              <div className="space-y-3">
                <Label className="text-lg font-medium">{t('quantityUnits')} *</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={harvestForm.quantity}
                  onChange={(e) => setHarvestForm({ ...harvestForm, quantity: e.target.value })}
                  className="h-16 text-2xl text-center"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <MapPin className="h-16 w-16 mx-auto text-green-600" />
              <h2 className="text-2xl font-bold">{t('locationInfo')}</h2>
              <p className="text-muted-foreground">{t('locationHelp')}</p>
            </div>
            
            <div className="space-y-6">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={getCurrentLocation}
                className="w-full h-16 text-lg border-2 border-green-200 hover:border-green-400"
              >
                <MapPin className="h-6 w-6 mr-3" />
                {t('useGPS')}
              </Button>
              
              <div className="text-center text-muted-foreground">{t('manualEntry')}</div>
              
              <div className="space-y-3">
                <Label className="text-lg font-medium">{t('locationPlaceholder')}</Label>
                <Input
                  placeholder={t('locationPlaceholder')}
                  value={harvestForm.location}
                  onChange={(e) => setHarvestForm({ ...harvestForm, location: e.target.value })}
                  className="h-14 text-lg"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <Camera className="h-16 w-16 mx-auto text-green-600" />
              <h2 className="text-2xl font-bold">{t('documentationStep')}</h2>
              <p className="text-muted-foreground">{t('documentationHelp')}</p>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={startCamera}
                  className="h-24 border-2 border-green-200 hover:border-green-400 flex-col"
                >
                  <Camera className="h-8 w-8 mb-2" />
                  {t('takePhoto')}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => document.getElementById('photo-upload')?.click()}
                  className="h-24 border-2 border-green-200 hover:border-green-400 flex-col"
                >
                  <Upload className="h-8 w-8 mb-2" />
                  {t('uploadFromDevice')}
                </Button>
              </div>
              
              {harvestForm.photo && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-800">{t('photoAttached')}: {harvestForm.photo.name}</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <Label className="text-lg font-medium flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  {t('notes')} ({t('optional')})
                </Label>
                <div className="flex gap-3">
                  <Textarea
                    placeholder={t('notesPlaceholder')}
                    value={harvestForm.notes}
                    onChange={(e) => setHarvestForm({ ...harvestForm, notes: e.target.value })}
                    className="min-h-[120px] text-lg"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={startVoiceInput}
                    disabled={isListening}
                    className="h-16 w-16 flex-shrink-0"
                  >
                    <Mic className={`h-6 w-6 ${isListening ? 'text-red-500 animate-pulse' : ''}`} />
                  </Button>
                </div>
              </div>
              
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <CheckCircle className="h-16 w-16 mx-auto text-green-600" />
              <h2 className="text-2xl font-bold">{t('reviewSubmit')}</h2>
              <p className="text-muted-foreground">{t('reviewHelp')}</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-green-700">{t('crop')}</Label>
                  <p className="font-medium text-lg">{harvestForm.cropSpecies}</p>
                </div>
                <div>
                  <Label className="text-sm text-green-700">{t('weight')}</Label>
                  <p className="font-medium text-lg">{harvestForm.weight} {t('kg')}</p>
                </div>
                <div>
                  <Label className="text-sm text-green-700">{t('quantity')}</Label>
                  <p className="font-medium text-lg">{harvestForm.quantity} {t('units')}</p>
                </div>
                <div>
                  <Label className="text-sm text-green-700">{t('location')}</Label>
                  <p className="font-medium text-lg">{harvestForm.location || t('notSpecified')}</p>
                </div>
              </div>
              
              {harvestForm.notes && (
                <div>
                  <Label className="text-sm text-green-700">{t('notes')}</Label>
                  <p className="text-sm">{harvestForm.notes}</p>
                </div>
              )}
              
              {harvestForm.photo && (
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">{t('photoAttached')}</span>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-green-100">
          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="p-3 md:p-4 bg-green-100 rounded-xl flex-shrink-0">
              <Leaf className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-3xl font-bold text-gray-900 truncate">
                🌱 {t('farmerPortal')}
              </h1>
              <p className="text-gray-600 text-sm md:text-lg line-clamp-2">
                {t('simpleHarvestRecording')}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
            {[
              { label: t('totalHarvests'), value: harvests.length.toString(), icon: Package, color: 'bg-blue-100 text-blue-600' },
              { label: t('verified'), value: harvests.filter(h => h.status === 'verified').length.toString(), icon: CheckCircle, color: 'bg-green-100 text-green-600' },
              { label: 'Total Weight', value: `${harvests.reduce((sum, h) => sum + h.weight, 0).toFixed(1)} kg`, icon: Weight, color: 'bg-yellow-100 text-yellow-600' },
              { label: t('qualityScore'), value: '95%', icon: Eye, color: 'bg-purple-100 text-purple-600' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-3 md:p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <stat.icon className={`h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 md:mb-3 ${stat.color}`} />
                <div className="text-xl md:text-3xl font-bold text-gray-900 mb-1 truncate">{stat.value}</div>
                <div className="text-xs md:text-sm text-gray-600 font-medium truncate">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <Tabs defaultValue="new-harvest" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-14 md:h-16 bg-white border border-green-200 rounded-2xl p-1.5 md:p-2">
            <TabsTrigger value="new-harvest" className="flex items-center gap-1 md:gap-2 h-10 md:h-12 text-xs md:text-lg font-medium rounded-xl data-[state=active]:bg-green-100 data-[state=active]:text-green-700 px-2 md:px-3">
              <Plus className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
              <span className="truncate">{t('newHarvest')}</span>
            </TabsTrigger>
            <TabsTrigger value="past-harvests" className="flex items-center gap-1 md:gap-2 h-10 md:h-12 text-xs md:text-lg font-medium rounded-xl data-[state=active]:bg-green-100 data-[state=active]:text-green-700 px-2 md:px-3">
              <Eye className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
              <span className="truncate">{t('pastHarvests')}</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1 md:gap-2 h-10 md:h-12 text-xs md:text-lg font-medium rounded-xl data-[state=active]:bg-green-100 data-[state=active]:text-green-700 px-2 md:px-3">
              <Calendar className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
              <span className="truncate">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new-harvest">
            <Card className="bg-white border-2 border-green-100 rounded-2xl shadow-sm">
              <CardHeader className="text-center pb-2">
                <div className="flex items-center justify-between mb-4">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="lg"
                      onClick={prevStep}
                      className="text-gray-600"
                    >
                      <ArrowLeft className="h-5 w-5 mr-2" />
                      Back
                    </Button>
                  )}
                  <div className="flex-1" />
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                  <Progress value={(currentStep / totalSteps) * 100} className="h-3" />
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmitHarvest} className="min-h-[400px]">
                  {renderStepContent()}
                  
                  <div className="mt-8 flex gap-4">
                    {currentStep < totalSteps ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        size="lg"
                        className="w-full h-14 text-lg bg-green-600 hover:bg-green-700"
                        disabled={
                          (currentStep === 1 && !harvestForm.cropSpecies) ||
                          (currentStep === 2 && (!harvestForm.weight || !harvestForm.quantity))
                        }
                      >
                        Continue
                        <ChevronRight className="h-5 w-5 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full h-14 text-lg bg-green-600 hover:bg-green-700"
                        disabled={!harvestForm.cropSpecies || !harvestForm.weight || !harvestForm.quantity}
                      >
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Submit Harvest
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="past-harvests">
            <Card className="bg-white border-2 border-green-100 rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
                  <Eye className="h-7 w-7 text-green-600" />
                  📚 Past Harvests
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  View and manage your previous harvest records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {harvests.map((harvest) => (
                    <div key={harvest.id} className="bg-white border-2 border-gray-200 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-2 mb-4 flex-wrap md:flex-nowrap">
                        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                          <div className="p-2 md:p-3 bg-green-100 rounded-lg flex-shrink-0">
                            <Package className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-base md:text-xl text-gray-900 truncate">{harvest.cropSpecies}</h3>
                            <p className="text-gray-600 text-sm md:font-medium">
                              {new Date(harvest.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(harvest.status)}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6 mb-4">
                        <div className="text-center p-3 md:p-4 bg-gray-50 rounded-lg">
                          <Weight className="h-5 w-5 md:h-6 md:w-6 text-gray-600 mx-auto mb-2" />
                          <p className="text-xs md:text-sm text-gray-600 font-medium">Weight</p>
                          <p className="font-bold text-sm md:text-lg text-gray-900 truncate">{harvest.weight} kg</p>
                        </div>
                        <div className="text-center p-3 md:p-4 bg-gray-50 rounded-lg">
                          <Package className="h-5 w-5 md:h-6 md:w-6 text-gray-600 mx-auto mb-2" />
                          <p className="text-xs md:text-sm text-gray-600 font-medium">Quantity</p>
                          <p className="font-bold text-sm md:text-lg text-gray-900 truncate">{harvest.quantity} units</p>
                        </div>
                        <div className="text-center p-3 md:p-4 bg-gray-50 rounded-lg col-span-2 md:col-span-1">
                          <MapPin className="h-5 w-5 md:h-6 md:w-6 text-gray-600 mx-auto mb-2" />
                          <p className="text-xs md:text-sm text-gray-600 font-medium">Location</p>
                          <p className="font-bold text-xs md:text-sm text-gray-900 break-words line-clamp-2">{harvest.location}</p>
                        </div>
                      </div>
                      
                      {harvest.notes && (
                        <div className="mb-4 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs md:text-sm text-blue-700 font-medium mb-1">Notes</p>
                          <p className="text-sm md:text-base text-blue-800 break-words">{harvest.notes}</p>
                        </div>
                      )}
                      
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => generateCertificate(harvest)}
                        className="w-full h-10 md:h-12 border-2 border-green-200 hover:border-green-400 text-green-700 hover:text-green-800 text-sm md:text-base"
                      >
                        <Download className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                        Download Certificate
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Analytics Dashboard
                </CardTitle>
                <CardDescription>
                  Track your farming progress and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
                  <div className="p-4 border rounded-lg text-center">
                    <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <div className="text-2xl font-bold">{harvests.length}</div>
                    <div className="text-sm text-muted-foreground">Total Harvests</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Weight className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <div className="text-2xl font-bold">
                      {harvests.reduce((sum, h) => sum + h.weight, 0).toFixed(1)} kg
                    </div>
                    <div className="text-sm text-muted-foreground">Total Weight</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Eye className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <div className="text-2xl font-bold">
                      {harvests.filter(h => h.status === 'verified').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Verified Records</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <div className="text-2xl font-bold">95%</div>
                    <div className="text-sm text-muted-foreground">Quality Score</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Recent Activity</h3>
                  <div className="space-y-2">
                    {harvests.slice(0, 3).map((harvest) => (
                      <div key={harvest.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{harvest.cropSpecies}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(harvest.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        {getStatusBadge(harvest.status)}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="text-center mb-4">
                <Camera className="h-12 w-12 mx-auto text-green-600 mb-2" />
                <h3 className="text-2xl font-bold text-gray-900">📸 Take Photo</h3>
                <p className="text-gray-600">Position your camera to capture the harvest</p>
              </div>
              <video ref={videoRef} autoPlay className="w-full rounded-xl mb-6 border-2 border-gray-200" />
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex gap-3">
                <Button 
                  onClick={capturePhoto} 
                  size="lg"
                  className="flex-1 h-14 bg-green-600 hover:bg-green-700 text-lg"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Capture
                </Button>
                <Button 
                  variant="outline" 
                  onClick={stopCamera}
                  size="lg"
                  className="h-14 px-6 border-2"
                >
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