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
  Package,
  Download
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
    const variants = {
      recorded: 'secondary',
      verified: 'default',
      processed: 'outline'
    };
    return (
      <Badge variant={variants[status as keyof typeof variants] as "default" | "secondary" | "destructive" | "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header Section */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-accent rounded-lg">
              <Package className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {t('farmerPortal')}
              </h1>
              <p className="text-muted-foreground">
                Record harvests and track your production
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Harvests', value: harvests.length.toString(), icon: Package },
              { label: 'Verified', value: harvests.filter(h => h.status === 'verified').length.toString(), icon: Calendar },
              { label: 'Processed', value: harvests.filter(h => h.status === 'processed').length.toString(), icon: Weight },
              { label: 'Quality Score', value: '95%', icon: Eye }
            ].map((stat, idx) => (
              <div key={idx} className="bg-muted/50 rounded-lg p-4 text-center">
                <stat.icon className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <Tabs defaultValue="new-harvest" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="new-harvest" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('newHarvest')}
            </TabsTrigger>
            <TabsTrigger value="past-harvests" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {t('pastHarvests')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new-harvest">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {t('recordHarvest')}
                </CardTitle>
                <CardDescription>
                  Record your harvest details with location and photos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitHarvest} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="cropSpecies">
                        {t('cropSpecies')} *
                      </Label>
                      <Select
                        value={harvestForm.cropSpecies}
                        onValueChange={(value) => setHarvestForm({ ...harvestForm, cropSpecies: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select crop/species" />
                        </SelectTrigger>
                        <SelectContent>
                          {cropOptions.map((crop) => (
                            <SelectItem key={crop.value} value={crop.value}>
                              <div className="flex items-center gap-2">
                                <span>{crop.icon}</span>
                                <span>{crop.value}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight">
                        Weight (kg) *
                      </Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        placeholder="Enter weight in kg"
                        value={harvestForm.weight}
                        onChange={(e) => setHarvestForm({ ...harvestForm, weight: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">
                        Quantity (units) *
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="Enter quantity"
                        value={harvestForm.quantity}
                        onChange={(e) => setHarvestForm({ ...harvestForm, quantity: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="location"
                          placeholder="Enter location or use GPS"
                          value={harvestForm.location}
                          onChange={(e) => setHarvestForm({ ...harvestForm, location: e.target.value })}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={getCurrentLocation}
                        >
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="flex items-center gap-2">
                      <Mic className="h-4 w-4" />
                      Notes
                    </Label>
                    <div className="flex gap-2">
                      <Textarea
                        id="notes"
                        placeholder="Add any additional notes about the harvest..."
                        value={harvestForm.notes}
                        onChange={(e) => setHarvestForm({ ...harvestForm, notes: e.target.value })}
                        className="min-h-[100px]"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={startVoiceInput}
                        disabled={isListening}
                      >
                        <Mic className={`h-4 w-4 ${isListening ? 'text-red-500' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Photo Documentation</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={startCamera}
                        className="flex-1"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Take Photo
                      </Button>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          id="photo-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('photo-upload')?.click()}
                          className="w-full"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Photo
                        </Button>
                      </div>
                    </div>
                    {harvestForm.photo && (
                      <div className="text-sm text-muted-foreground">
                        Photo selected: {harvestForm.photo.name}
                      </div>
                    )}
                  </div>

                  <Button type="submit" className="w-full">
                    Record Harvest
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="past-harvests">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Past Harvests
                </CardTitle>
                <CardDescription>
                  View and manage your previous harvest records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {harvests.map((harvest) => (
                    <div key={harvest.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{harvest.cropSpecies}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(harvest.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        {getStatusBadge(harvest.status)}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Weight</p>
                          <p className="font-medium">{harvest.weight} kg</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Quantity</p>
                          <p className="font-medium">{harvest.quantity} units</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="font-medium text-sm">{harvest.location}</p>
                        </div>
                      </div>
                      
                      {harvest.notes && (
                        <div className="mb-3">
                          <p className="text-sm text-muted-foreground">Notes</p>
                          <p className="text-sm">{harvest.notes}</p>
                        </div>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateCertificate(harvest)}
                      >
                        <Download className="h-4 w-4 mr-2" />
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Take Photo</h3>
              <video ref={videoRef} autoPlay className="w-full rounded-lg mb-4" />
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex gap-2">
                <Button onClick={capturePhoto} className="flex-1">
                  <Camera className="h-4 w-4 mr-2" />
                  Capture
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