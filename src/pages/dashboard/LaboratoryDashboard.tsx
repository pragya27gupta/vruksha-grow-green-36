import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { 
  FlaskConical, 
  FileCheck, 
  Upload, 
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Microscope,
  TestTube,
  ClipboardCheck,
  Eye,
  Play,
  Calendar,
  Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, ComposedChart } from 'recharts';
import { toast } from '@/hooks/use-toast';

interface LabSample {
  id: string;
  batchId: string;
  cropSpecies: string;
  submittedBy: string;
  receivedDate: string;
  status: 'pending' | 'testing' | 'completed';
  testResults?: QualityTest;
}

interface QualityTest {
  id: string;
  moistureContent: number;
  pesticideResidue: number;
  dnaBarcodeResult: string;
  overallStatus: 'pass' | 'fail' | 'warning';
  notes?: string;
  certificateUrl?: string;
  testDate: string;
}

const LaboratoryDashboard = () => {
  const { t } = useTranslation();
  const [selectedSample, setSelectedSample] = useState<LabSample | null>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isStartTestingOpen, setIsStartTestingOpen] = useState(false);
  
  const [samples, setSamples] = useState<LabSample[]>([
    {
      id: 'LS001',
      batchId: 'B001',
      cropSpecies: 'Turmeric',
      submittedBy: 'Processor ABC',
      receivedDate: '2024-01-15T10:30:00Z',
      status: 'pending'
    },
    {
      id: 'LS002',
      batchId: 'B002',
      cropSpecies: 'Ashwagandha',
      submittedBy: 'Processor XYZ',
      receivedDate: '2024-01-14T14:20:00Z',
      status: 'completed',
      testResults: {
        id: 'QT001',
        moistureContent: 8.5,
        pesticideResidue: 0.02,
        dnaBarcodeResult: 'Confirmed: Withania somnifera',
        overallStatus: 'pass',
        testDate: '2024-01-16T16:00:00Z',
        notes: 'All parameters within acceptable limits'
      }
    }
  ]);

  const [testForm, setTestForm] = useState({
    sampleId: '',
    moistureContent: '',
    pesticideResidue: '',
    dnaBarcodeResult: '',
    notes: '',
    certificate: null as File | null
  });

  const testThresholds = {
    moistureContent: { min: 5, max: 12 },
    pesticideResidue: { max: 0.05 }
  };

  const handleSubmitTest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!testForm.sampleId || !testForm.moistureContent || !testForm.pesticideResidue) {
      toast({
        title: "Error",
        description: "Please fill in all required test parameters",
        variant: "destructive"
      });
      return;
    }

    // Validate against thresholds
    const moisture = parseFloat(testForm.moistureContent);
    const pesticide = parseFloat(testForm.pesticideResidue);
    
    let status: 'pass' | 'fail' | 'warning' = 'pass';
    
    if (moisture < testThresholds.moistureContent.min || moisture > testThresholds.moistureContent.max) {
      status = 'warning';
    }
    
    if (pesticide > testThresholds.pesticideResidue.max) {
      status = 'fail';
    }

    toast({
      title: "Success",
      description: `Test results recorded with status: ${status.toUpperCase()}`,
      variant: status === 'fail' ? 'destructive' : 'default'
    });

    setTestForm({
      sampleId: '',
      moistureContent: '',
      pesticideResidue: '',
      dnaBarcodeResult: '',
      notes: '',
      certificate: null
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      testing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    };
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTestStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTestForm({ ...testForm, certificate: file });
      toast({
        title: "Certificate selected",
        description: `Selected: ${file.name}`
      });
    }
  };

  const handleViewDetails = (sample: LabSample) => {
    setSelectedSample(sample);
    setIsViewDetailsOpen(true);
  };

  const handleStartTesting = (sample: LabSample) => {
    setSelectedSample(sample);
    setIsStartTestingOpen(true);
  };

  const handleDownloadCertificate = (sample: LabSample) => {
    // Simulate certificate download
    const link = document.createElement('a');
    link.href = '/placeholder-certificate.pdf'; // This would be the actual certificate URL
    link.download = `Certificate_${sample.id}_${sample.batchId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Certificate Downloaded",
      description: `Quality certificate for sample ${sample.id} has been downloaded.`
    });
  };

  const handleUpdateSampleStatus = (sampleId: string, status: 'pending' | 'testing' | 'completed') => {
    setSamples(prev => prev.map(sample => 
      sample.id === sampleId ? { ...sample, status } : sample
    ));
    
    toast({
      title: "Status Updated",
      description: `Sample ${sampleId} status updated to ${status}`
    });
  };

  // Mock data for testing timeline chart
  const testingTimelineData = [
    { month: 'Jan', testsCompleted: 45, averageDays: 2.1 },
    { month: 'Feb', testsCompleted: 52, averageDays: 1.9 },
    { month: 'Mar', testsCompleted: 38, averageDays: 2.3 },
    { month: 'Apr', testsCompleted: 61, averageDays: 2.0 },
    { month: 'May', testsCompleted: 48, averageDays: 2.2 },
    { month: 'Jun', testsCompleted: 55, averageDays: 1.8 },
  ];

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2 leading-tight">{t('laboratoryPortal')}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Conduct quality tests, validate standards, and issue certificates
          </p>
        </div>

        <Tabs defaultValue="samples" className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto scrollbar-hide">
            <TabsList className="grid w-full grid-cols-3 min-w-[320px]">
              <TabsTrigger value="samples" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
                <TestTube className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">{t('pendingSamples')}</span>
                <span className="xs:hidden">Samples</span>
              </TabsTrigger>
              <TabsTrigger value="upload-test" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
                <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">{t('qualityTest')}</span>
                <span className="xs:hidden">Test</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
                <FlaskConical className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Analytics</span>
                <span className="xs:hidden">Data</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="samples">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h2 className="text-xl sm:text-2xl font-semibold">{t('pendingSamples')}</h2>
                <Badge variant="outline">{samples.length} samples</Badge>
              </div>

              <div className="grid gap-4">
                {samples.map((sample) => (
                  <Card key={sample.id}>
                    <CardContent className="p-3 sm:p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base sm:text-lg truncate">Sample {sample.id}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground break-words">
                            {sample.cropSpecies} • Batch: {sample.batchId} • By: {sample.submittedBy}
                          </p>
                        </div>
                        {getStatusBadge(sample.status)}
                      </div>

                      {sample.testResults && (
                        <div className="bg-muted/50 rounded-lg p-3 sm:p-4 mb-4">
                          <div className="flex items-center gap-2 mb-3">
                            {getTestStatusIcon(sample.testResults.overallStatus)}
                            <h4 className="font-medium text-sm sm:text-base">Test Results</h4>
                            <Badge variant={sample.testResults.overallStatus === 'pass' ? 'default' : 'destructive'}>
                              {sample.testResults.overallStatus.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                            <div>
                              <span className="font-medium">Moisture Content:</span>
                              <div className="flex items-center gap-2">
                                <span>{sample.testResults.moistureContent}%</span>
                                {sample.testResults.moistureContent >= testThresholds.moistureContent.min && 
                                 sample.testResults.moistureContent <= testThresholds.moistureContent.max ? (
                                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                                ) : (
                                  <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
                                )}
                              </div>
                            </div>
                            <div>
                              <span className="font-medium">Pesticide Residue:</span>
                              <div className="flex items-center gap-2">
                                <span>{sample.testResults.pesticideResidue} ppm</span>
                                {sample.testResults.pesticideResidue <= testThresholds.pesticideResidue.max ? (
                                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                                ) : (
                                  <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                                )}
                              </div>
                            </div>
                            <div className="sm:col-span-2 lg:col-span-1">
                              <span className="font-medium">DNA Barcode:</span>
                              <div className="break-words">{sample.testResults.dnaBarcodeResult}</div>
                            </div>
                          </div>
                          
                          {sample.testResults.notes && (
                            <p className="text-xs sm:text-sm text-muted-foreground mt-3 italic">
                              "{sample.testResults.notes}"
                            </p>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDetails(sample)}
                          className="flex items-center gap-2 text-xs"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">View Details</span>
                          <span className="sm:hidden">View</span>
                        </Button>
                        {sample.status === 'completed' ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDownloadCertificate(sample)}
                            className="flex items-center gap-2 text-xs"
                          >
                            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Download Certificate</span>
                            <span className="sm:hidden">Download</span>
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleStartTesting(sample)}
                            className="flex items-center gap-2 text-xs"
                          >
                            <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Start Testing</span>
                            <span className="sm:hidden">Start</span>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upload-test">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Microscope className="h-4 w-4 sm:h-5 sm:w-5" />
                  {t('qualityTest')} Results
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Upload test results and validate against quality thresholds
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={handleSubmitTest} className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="sampleId">Select Sample *</Label>
                    <Select
                      value={testForm.sampleId}
                      onValueChange={(value) => setTestForm({ ...testForm, sampleId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sample to test" />
                      </SelectTrigger>
                      <SelectContent>
                        {samples.filter(s => s.status !== 'completed').map((sample) => (
                          <SelectItem key={sample.id} value={sample.id}>
                            Sample {sample.id} - {sample.cropSpecies} (Batch: {sample.batchId})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="moistureContent">{t('moistureContent')} (%) *</Label>
                      <Input
                        id="moistureContent"
                        type="number"
                        step="0.1"
                        value={testForm.moistureContent}
                        onChange={(e) => setTestForm({ ...testForm, moistureContent: e.target.value })}
                        placeholder="8.5"
                      />
                      <p className="text-xs text-muted-foreground">
                        Acceptable range: {testThresholds.moistureContent.min}% - {testThresholds.moistureContent.max}%
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pesticideResidue">{t('pesticideResidue')} (ppm) *</Label>
                      <Input
                        id="pesticideResidue"
                        type="number"
                        step="0.001"
                        value={testForm.pesticideResidue}
                        onChange={(e) => setTestForm({ ...testForm, pesticideResidue: e.target.value })}
                        placeholder="0.02"
                      />
                      <p className="text-xs text-muted-foreground">
                        Maximum allowed: {testThresholds.pesticideResidue.max} ppm
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dnaBarcodeResult">{t('dnaBarcodeTest')} Result</Label>
                    <Input
                      id="dnaBarcodeResult"
                      value={testForm.dnaBarcodeResult}
                      onChange={(e) => setTestForm({ ...testForm, dnaBarcodeResult: e.target.value })}
                      placeholder="Confirmed: Scientific species name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="certificate">{t('labCertificate')} (PDF/Image)</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="certificate"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleCertificateUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('certificate')?.click()}
                        className="flex items-center gap-2"
                      >
                        <FileCheck className="h-4 w-4" />
                        Upload Certificate
                      </Button>
                      {testForm.certificate && (
                        <span className="text-sm text-muted-foreground">
                          {testForm.certificate.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Test Notes</Label>
                    <Textarea
                      id="notes"
                      value={testForm.notes}
                      onChange={(e) => setTestForm({ ...testForm, notes: e.target.value })}
                      placeholder="Additional observations and comments..."
                      rows={3}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button type="submit" className="flex items-center gap-2 justify-center">
                      <ClipboardCheck className="h-4 w-4" />
                      Submit Test Results
                    </Button>
                    <Button type="button" variant="outline" className="justify-center">
                      Save as Draft
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-4 sm:gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Card>
                  <CardHeader className="pb-2 p-3 sm:p-4">
                    <CardDescription className="text-xs sm:text-sm">Samples Tested</CardDescription>
                    <CardTitle className="text-2xl sm:text-3xl">156</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2 p-3 sm:p-4">
                    <CardDescription className="text-xs sm:text-sm">Pass Rate</CardDescription>
                    <CardTitle className="text-2xl sm:text-3xl">94.2%</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2 p-3 sm:p-4">
                    <CardDescription className="text-xs sm:text-sm">Avg Test Time</CardDescription>
                    <CardTitle className="text-2xl sm:text-3xl">2.1d</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2 p-3 sm:p-4">
                    <CardDescription className="text-xs sm:text-sm">Pending Tests</CardDescription>
                    <CardTitle className="text-2xl sm:text-3xl">8</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">Quality Distribution</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Test results breakdown by status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Pass
                        </span>
                        <span>147 (94.2%)</span>
                      </div>
                      <Progress value={94.2} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          Warning
                        </span>
                        <span>6 (3.8%)</span>
                      </div>
                      <Progress value={3.8} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          Fail
                        </span>
                        <span>3 (1.9%)</span>
                      </div>
                      <Progress value={1.9} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">Testing Timeline</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Monthly testing volume and average completion time
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <div className="w-full overflow-hidden">
                      <ChartContainer
                        config={{
                          testsCompleted: {
                            label: "Tests Completed",
                            color: "hsl(var(--primary))",
                          },
                          averageDays: {
                            label: "Average Days",
                            color: "hsl(var(--secondary))",
                          },
                        }}
                        className="h-[250px] sm:h-[300px] w-full"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={testingTimelineData} margin={{ left: -20, right: 0, top: 5, bottom: 5 }}>
                            <XAxis dataKey="month" fontSize={12} />
                            <YAxis yAxisId="left" fontSize={12} />
                            <YAxis yAxisId="right" orientation="right" fontSize={12} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar yAxisId="left" dataKey="testsCompleted" fill="var(--color-testsCompleted)" />
                            <Line 
                              yAxisId="right" 
                              type="monotone" 
                              dataKey="averageDays" 
                              stroke="var(--color-averageDays)" 
                              strokeWidth={2}
                              dot={{ fill: "var(--color-averageDays)" }}
                            />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* View Details Modal */}
        <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">Sample Details - {selectedSample?.id}</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                Comprehensive sample information and test history
              </DialogDescription>
            </DialogHeader>
            
            {selectedSample && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="text-sm font-medium">Batch ID</Label>
                    <p className="text-sm text-muted-foreground">{selectedSample.batchId}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Crop Species</Label>
                    <p className="text-sm text-muted-foreground">{selectedSample.cropSpecies}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Submitted By</Label>
                    <p className="text-sm text-muted-foreground">{selectedSample.submittedBy}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Received Date</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedSample.receivedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Current Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedSample.status)}</div>
                  </div>
                </div>

                {selectedSample.testResults && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <TestTube className="h-4 w-4" />
                      Test Results
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div>
                        <Label>Moisture Content</Label>
                        <p className="flex items-center gap-2">
                          {selectedSample.testResults.moistureContent}%
                          {selectedSample.testResults.moistureContent >= testThresholds.moistureContent.min && 
                           selectedSample.testResults.moistureContent <= testThresholds.moistureContent.max ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          )}
                        </p>
                      </div>
                      <div>
                        <Label>Pesticide Residue</Label>
                        <p className="flex items-center gap-2">
                          {selectedSample.testResults.pesticideResidue} ppm
                          {selectedSample.testResults.pesticideResidue <= testThresholds.pesticideResidue.max ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <Label>DNA Barcode Result</Label>
                        <p>{selectedSample.testResults.dnaBarcodeResult}</p>
                      </div>
                      {selectedSample.testResults.notes && (
                        <div className="col-span-2">
                          <Label>Test Notes</Label>
                          <p className="text-muted-foreground italic">"{selectedSample.testResults.notes}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>
                    Close
                  </Button>
                  {selectedSample.status === 'completed' && (
                    <Button onClick={() => handleDownloadCertificate(selectedSample)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Start Testing Modal */}
        <Dialog open={isStartTestingOpen} onOpenChange={setIsStartTestingOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">Start Testing - {selectedSample?.id}</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                Begin quality testing process for this sample
              </DialogDescription>
            </DialogHeader>
            
            {selectedSample && (
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Sample Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div>
                      <span className="font-medium">Crop:</span> {selectedSample.cropSpecies}
                    </div>
                    <div>
                      <span className="font-medium">Batch:</span> {selectedSample.batchId}
                    </div>
                    <div>
                      <span className="font-medium">Received:</span> {new Date(selectedSample.receivedDate).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Submitted by:</span> {selectedSample.submittedBy}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Testing Checklist</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Sample received and logged</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Initial visual inspection completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Moisture content analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Pesticide residue testing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">DNA barcoding verification</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <AlertTriangle className="h-4 w-4 inline mr-2" />
                    Estimated completion time: 2-3 business days
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsStartTestingOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      if (selectedSample) {
                        handleUpdateSampleStatus(selectedSample.id, 'testing');
                        setIsStartTestingOpen(false);
                      }
                    }}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Begin Testing
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LaboratoryDashboard;