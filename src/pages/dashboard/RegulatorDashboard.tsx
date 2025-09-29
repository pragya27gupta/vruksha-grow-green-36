import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, AlertTriangle, CheckCircle, BarChart3, Download, Calendar, Send, FileText, RefreshCw } from 'lucide-react';
import { ComplianceReports } from '@/components/ComplianceReports';
import { RegulatoryAnalytics } from '@/components/RegulatoryAnalytics';
import { toast } from '@/hooks/use-toast';

const RegulatorDashboard = () => {
  const { t } = useTranslation();
  const [violations, setViolations] = useState([
    { id: 'V-2024-001', entity: 'GreenHarvest Farms Pvt Ltd', type: 'Pesticide Usage', severity: 'High', date: '2024-01-15', status: 'Active' },
    { id: 'V-2024-002', entity: 'Organic Valley Co.', type: 'Certification Fraud', severity: 'Critical', date: '2024-01-14', status: 'Under Review' },
    { id: 'V-2024-003', entity: 'Fresh Foods Ltd', type: 'Labeling Mismatch', severity: 'Medium', date: '2024-01-13', status: 'Active' },
    { id: 'V-2024-004', entity: 'Nature\'s Best Inc', type: 'Traceability Gap', severity: 'High', date: '2024-01-12', status: 'Resolved' },
  ]);
  const [dashboardData, setDashboardData] = useState({
    activeViolations: 7,
    complianceRate: 94.2,
    pendingReviews: 18,
    totalAudits: 1247
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  console.log('RegulatorDashboard component rendered');

  const handleScheduleInspection = (formData?: any) => {
    if (formData) {
      // Simulate scheduling with form data
      const newInspection = {
        id: `INS-${Date.now()}`,
        entity: formData.entity,
        type: formData.type,
        date: formData.date,
        inspector: formData.inspector
      };
      
      toast({
        title: "Inspection Scheduled Successfully",
        description: `${formData.type} inspection for ${formData.entity} scheduled on ${formData.date}`,
      });
      
      // Update pending reviews count
      setDashboardData(prev => ({
        ...prev,
        pendingReviews: prev.pendingReviews + 1
      }));
    } else {
      toast({
        title: "Inspection Scheduled",
        description: "New compliance inspection has been scheduled for next week.",
      });
    }
  };

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "Compliance summary report is being generated. Download will start shortly.",
    });
    
    // Generate comprehensive report data
    setTimeout(() => {
      const reportData = `
REGULATORY COMPLIANCE SUMMARY REPORT
Generated: ${new Date().toLocaleString()}

=== OVERVIEW ===
Active Violations: ${dashboardData.activeViolations}
Compliance Rate: ${dashboardData.complianceRate}%
Pending Reviews: ${dashboardData.pendingReviews}
Total Audits: ${dashboardData.totalAudits}

=== RECENT VIOLATIONS ===
${violations.map(v => `
${v.id}: ${v.entity}
Type: ${v.type}
Severity: ${v.severity}
Status: ${v.status}
Date: ${v.date}
`).join('')}

=== RECOMMENDATIONS ===
1. Increase inspection frequency for high-risk entities
2. Implement automated compliance monitoring
3. Enhance training programs for critical violations
4. Review and update regulatory standards

=== STATISTICAL ANALYSIS ===
Monthly Trend: Violations increased by 15% from last month
Critical Issues: Require immediate attention
Compliance Improvement: Focus on pesticide usage regulations

This report contains confidential regulatory information.
      `;
      
      const blob = new Blob([reportData], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `regulatory-compliance-report-${new Date().toISOString().split('T')[0]}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    }, 2000);
  };

  const handleIssueAlert = (alertData?: any) => {
    if (alertData) {
      // Send targeted alert
      toast({
        title: "Alert Issued Successfully",
        description: `${alertData.type} alert sent to ${alertData.recipients} regarding: ${alertData.subject}`,
        variant: "default"
      });
      
      // Simulate sending email/notifications
      setTimeout(() => {
        toast({
          title: "Alert Delivery Confirmed",
          description: `Alert delivered to ${alertData.recipients}. Response tracking activated.`,
        });
      }, 3000);
    } else {
      toast({
        title: "Alert Issued",
        description: "Compliance alert has been sent to all registered entities.",
        variant: "default"
      });
    }
  };

  const handleViewViolationDetails = (violationId: string) => {
    const violation = violations.find(v => v.id === violationId);
    if (violation) {
      // Generate detailed violation report
      const detailsData = `
VIOLATION DETAILS REPORT
Violation ID: ${violation.id}
Generated: ${new Date().toLocaleString()}

=== BASIC INFORMATION ===
Entity: ${violation.entity}
Violation Type: ${violation.type}
Severity Level: ${violation.severity}
Current Status: ${violation.status}
Date Reported: ${violation.date}

=== DETAILED DESCRIPTION ===
Location: Farm premises and processing facility
Inspector: Dr. Sarah Johnson, Senior Compliance Officer
Inspection Date: ${violation.date}
Weather Conditions: Clear, 24°C

=== VIOLATION SPECIFICS ===
${violation.type === 'Pesticide Usage' ? `
- Unauthorized use of banned pesticide: Carbofuran
- Application rate exceeded permitted limits by 40%
- Missing application records for last 3 months
- No proper protective equipment observed
- Contamination detected in soil samples
` : violation.type === 'Certification Fraud' ? `
- False organic certification claims on product labels
- Use of synthetic fertilizers while claiming organic status
- Falsified inspection reports from previous quarter
- Misleading marketing materials distributed to consumers
` : violation.type === 'Labeling Mismatch' ? `
- Product labels do not match actual contents
- Missing allergen warnings on processed foods
- Incorrect nutritional information displayed
- No traceability codes on packaging
` : `
- Incomplete supply chain documentation
- Missing batch tracking information
- No QR code implementation for products
- Unable to trace products back to source farms
`}

=== EVIDENCE COLLECTED ===
- Photographic evidence: 15 images
- Soil/product samples: 8 samples collected
- Document analysis: 12 documents reviewed
- Witness statements: 3 statements recorded

=== CORRECTIVE ACTIONS REQUIRED ===
1. Immediate cessation of violating practices
2. Submit corrective action plan within 15 days
3. Re-training of all staff members
4. Third-party verification audit required
5. Financial penalty: $15,000 - $50,000 (pending review)

=== FOLLOW-UP SCHEDULE ===
- Initial response due: ${new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}
- Follow-up inspection: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
- Compliance verification: ${new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString()}

=== REGULATORY REFERENCES ===
- Food Safety Modernization Act Section 204
- Organic Foods Production Act
- Federal Insecticide, Fungicide, and Rodenticide Act
- Good Agricultural Practices Guidelines

This document contains confidential regulatory information.
Contact: regulatory@foodsafety.gov | Emergency: 1-800-FDA-1088
      `;
      
      toast({
        title: "Generating Detailed Report",
        description: `Compiling comprehensive violation details for ${violationId}`,
      });
      
      setTimeout(() => {
        const blob = new Blob([detailsData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `violation-details-${violationId}-${new Date().toISOString().split('T')[0]}.txt`;
        link.click();
        URL.revokeObjectURL(url);
        
        toast({
          title: "Violation Details Downloaded",
          description: `Complete violation report for ${violationId} has been downloaded`,
        });
      }, 2000);
    }
  };

  const handleRefreshData = () => {
    setIsRefreshing(true);
    toast({
      title: "Refreshing Data",
      description: "Updating compliance dashboard with latest information...",
    });
    
    // Simulate data refresh
    setTimeout(() => {
      // Update dashboard data with random variations
      setDashboardData(prev => ({
        activeViolations: Math.max(1, prev.activeViolations + Math.floor(Math.random() * 3 - 1)),
        complianceRate: Math.min(100, Math.max(80, prev.complianceRate + (Math.random() * 4 - 2))),
        pendingReviews: Math.max(0, prev.pendingReviews + Math.floor(Math.random() * 5 - 2)),
        totalAudits: prev.totalAudits + Math.floor(Math.random() * 10)
      }));
      
      setIsRefreshing(false);
      toast({
        title: "Data Refreshed",
        description: "Dashboard updated with latest compliance data",
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2 leading-tight">{t('regulatorPortal')}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Monitor compliance, review violations, and ensure regulatory standards
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="gap-2 w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>

        <Tabs defaultValue="compliance" className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto scrollbar-hide">
            <TabsList className="grid w-full grid-cols-3 min-w-[320px]">
              <TabsTrigger value="compliance" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">{t('complianceDashboard')}</span>
                <span className="xs:hidden">Compliance</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">{t('complianceReports')}</span>
                <span className="xs:hidden">Reports</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Analytics</span>
                <span className="xs:hidden">Data</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="compliance">
            <div className="grid gap-6">
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-red-500">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Active Violations
                    </CardDescription>
                    <CardTitle className="text-3xl text-red-600">{dashboardData.activeViolations}</CardTitle>
                    <p className="text-xs text-muted-foreground">+2 from last month</p>
                  </CardHeader>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Compliance Rate
                    </CardDescription>
                    <CardTitle className="text-3xl text-green-600">{dashboardData.complianceRate.toFixed(1)}%</CardTitle>
                    <p className="text-xs text-muted-foreground">-2.6% from last month</p>
                  </CardHeader>
                </Card>
                <Card className="border-l-4 border-l-yellow-500">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-yellow-500" />
                      Pending Reviews
                    </CardDescription>
                    <CardTitle className="text-3xl text-yellow-600">{dashboardData.pendingReviews}</CardTitle>
                    <p className="text-xs text-muted-foreground">+6 from last week</p>
                  </CardHeader>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                      Total Audits
                    </CardDescription>
                    <CardTitle className="text-3xl text-blue-600">{dashboardData.totalAudits.toLocaleString()}</CardTitle>
                    <p className="text-xs text-muted-foreground">+47 this month</p>
                  </CardHeader>
                </Card>
              </div>

              {/* Recent Violations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Recent Violations
                  </CardTitle>
                  <CardDescription>Critical violations requiring immediate attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {violations.map((violation) => (
                      <div key={violation.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg hover:bg-accent/50 transition-colors gap-3 sm:gap-4">
                        <div className="flex-1 space-y-2 sm:space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="font-mono text-xs">{violation.id}</Badge>
                            <Badge variant={violation.severity === 'Critical' ? 'destructive' : violation.severity === 'High' ? 'default' : 'secondary'}>
                              {violation.severity}
                            </Badge>
                            <Badge variant={violation.status === 'Active' ? 'destructive' : violation.status === 'Under Review' ? 'default' : 'secondary'}>
                              {violation.status}
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-sm sm:text-base break-words">{violation.entity}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">{violation.type} • {violation.date}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleViewViolationDetails(violation.id)} className="w-full sm:w-auto">
                          <span className="hidden sm:inline">View Details</span>
                          <span className="sm:hidden">Details</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Calendar className="h-5 w-5" />
                          Schedule Inspection
                        </CardTitle>
                        <CardDescription>Plan new compliance inspections</CardDescription>
                      </CardHeader>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Schedule New Inspection</DialogTitle>
                      <DialogDescription>Create a new compliance inspection for an entity</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Entity Name</label>
                        <Input id="entity" placeholder="Enter entity name" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Inspection Type</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select inspection type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="routine">Routine Inspection</SelectItem>
                            <SelectItem value="complaint">Complaint Investigation</SelectItem>
                            <SelectItem value="follow-up">Follow-up Inspection</SelectItem>
                            <SelectItem value="random">Random Audit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Inspection Date</label>
                        <Input type="date" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Assigned Inspector</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select inspector" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dr-johnson">Dr. Sarah Johnson</SelectItem>
                            <SelectItem value="mr-smith">Mr. David Smith</SelectItem>
                            <SelectItem value="ms-brown">Ms. Emily Brown</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        onClick={() => handleScheduleInspection({
                          entity: 'Selected Entity',
                          type: 'Routine Inspection',
                          date: new Date().toLocaleDateString(),
                          inspector: 'Dr. Sarah Johnson'
                        })} 
                        className="w-full"
                      >
                        Schedule Inspection
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleGenerateReport}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5" />
                      Generate Report
                    </CardTitle>
                    <CardDescription>Create compliance summary reports</CardDescription>
                  </CardHeader>
                </Card>

                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Send className="h-5 w-5" />
                          Issue Alert
                        </CardTitle>
                        <CardDescription>Send compliance alerts to entities</CardDescription>
                      </CardHeader>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Issue Compliance Alert</DialogTitle>
                      <DialogDescription>Send alert notification to entities</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Alert Type</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select alert type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="warning">Warning Notice</SelectItem>
                            <SelectItem value="violation">Violation Alert</SelectItem>
                            <SelectItem value="update">Regulatory Update</SelectItem>
                            <SelectItem value="emergency">Emergency Notice</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Recipients</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select recipients" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Registered Entities</SelectItem>
                            <SelectItem value="high-risk">High-Risk Entities</SelectItem>
                            <SelectItem value="specific">Specific Entities</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Subject</label>
                        <Input placeholder="Enter alert subject" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Message</label>
                        <Textarea placeholder="Enter alert message..." rows={3} />
                      </div>
                      <Button 
                        onClick={() => handleIssueAlert({
                          type: 'Warning Notice',
                          recipients: 'All Registered Entities',
                          subject: 'New Compliance Requirements'
                        })} 
                        className="w-full"
                      >
                        Send Alert
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Compliance Reports Test</h3>
              <ComplianceReports />
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Analytics Test</h3>
              <RegulatoryAnalytics />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RegulatorDashboard;