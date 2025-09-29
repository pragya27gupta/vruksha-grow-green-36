import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Calendar, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const ComplianceReports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [reportData, setReportData] = useState({
    summary: {
      totalReports: 156,
      violationsFound: 23,
      pendingReviews: 8,
      complianceRate: 85.3,
      avgResponseTime: '3.2 days',
      criticalIssues: 5
    },
    recentReports: [
      {
        id: 'RPT-2024-021',
        title: 'Organic Certification Audit - GreenHarvest Farms',
        type: 'Scheduled Inspection',
        date: '2024-01-15',
        status: 'Completed',
        severity: 'Medium',
        violations: 2,
        complianceScore: 82
      },
      {
        id: 'RPT-2024-020',
        title: 'Pesticide Usage Investigation - Fresh Valley Co.',
        type: 'Complaint Investigation',
        date: '2024-01-14',
        status: 'In Progress',
        severity: 'High',
        violations: 4,
        complianceScore: 65
      },
      {
        id: 'RPT-2024-019',
        title: 'Traceability System Audit - Organic Plus Ltd',
        type: 'Random Inspection',
        date: '2024-01-13',
        status: 'Under Review',
        severity: 'Low',
        violations: 0,
        complianceScore: 95
      },
      {
        id: 'RPT-2024-018',
        title: 'Labeling Compliance Check - Nature\'s Best',
        type: 'Follow-up Inspection',
        date: '2024-01-12',
        status: 'Completed',
        severity: 'Medium',
        violations: 1,
        complianceScore: 88
      }
    ],
    trends: {
      monthlyReports: [
        { month: 'Aug', reports: 12, violations: 3 },
        { month: 'Sep', reports: 15, violations: 4 },
        { month: 'Oct', reports: 18, violations: 5 },
        { month: 'Nov', reports: 22, violations: 3 },
        { month: 'Dec', reports: 19, violations: 6 },
        { month: 'Jan', reports: 23, violations: 2 }
      ]
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = () => {
    toast({
      title: "Exporting Reports",
      description: `Generating ${selectedPeriod} compliance reports for ${selectedCategory === 'all' ? 'all categories' : selectedCategory}. Download will start shortly.`,
    });
    
    // Generate comprehensive CSV data
    setTimeout(() => {
      const csvHeaders = [
        'Report ID',
        'Title',
        'Type',
        'Date',
        'Status',
        'Severity',
        'Violations',
        'Compliance Score',
        'Entity',
        'Inspector',
        'Follow-up Required',
        'Financial Impact',
        'Corrective Actions',
        'Completion Date'
      ];
      
      const csvData = reportData.recentReports.map(report => [
        report.id,
        report.title,
        report.type,
        report.date,
        report.status,
        report.severity,
        report.violations,
        `${report.complianceScore}%`,
        report.title.split(' - ')[1] || 'N/A',
        'Dr. Sarah Johnson',
        report.violations > 0 ? 'Yes' : 'No',
        report.violations > 0 ? `$${report.violations * 5000}` : '$0',
        report.violations > 0 ? 'Required within 30 days' : 'None',
        report.status === 'Completed' ? report.date : 'Pending'
      ]);
      
      const csvContent = [
        csvHeaders.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      const summaryData = `
COMPLIANCE REPORTS SUMMARY
Generated: ${new Date().toLocaleString()}
Period: ${selectedPeriod}
Category: ${selectedCategory}

Total Reports: ${reportData.summary.totalReports}
Violations Found: ${reportData.summary.violationsFound}
Compliance Rate: ${reportData.summary.complianceRate}%
Average Response Time: ${reportData.summary.avgResponseTime}
Critical Issues: ${reportData.summary.criticalIssues}

DETAILED REPORTS:
${csvContent}
      `;
      
      const blob = new Blob([summaryData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `compliance-reports-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }, 2000);
  };

  const handleDownloadReport = (reportId: string, reportTitle: string) => {
    toast({
      title: "Downloading Report",
      description: `Preparing download for ${reportTitle}`,
    });
    // Simulate download
    setTimeout(() => {
      const reportData = `Report ID: ${reportId}\nTitle: ${reportTitle}\nGenerated: ${new Date().toLocaleDateString()}\n\nDetailed compliance report content...`;
      const link = document.createElement('a');
      link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportData);
      link.download = `${reportId}-${reportTitle.replace(/\s+/g, '-')}.txt`;
      link.click();
    }, 1500);
  };

  const handleViewDetails = (reportId: string) => {
    toast({
      title: "Opening Report Details",
      description: `Loading detailed view for report ${reportId}`,
    });
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    setIsLoading(true);
    
    toast({
      title: "Filter Updated",
      description: `Loading ${period} compliance reports...`,
    });
    
    // Simulate data filtering
    setTimeout(() => {
      const multiplier = period === 'weekly' ? 0.25 : period === 'quarterly' ? 3 : 1;
      setReportData(prev => ({
        ...prev,
        summary: {
          ...prev.summary,
          totalReports: Math.floor(prev.summary.totalReports * multiplier),
          violationsFound: Math.floor(prev.summary.violationsFound * multiplier),
          pendingReviews: Math.floor(prev.summary.pendingReviews * multiplier)
        }
      }));
      setIsLoading(false);
      toast({
        title: "Reports Updated",
        description: `Now showing ${period} compliance data`,
      });
    }, 1500);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setIsLoading(true);
    
    toast({
      title: "Category Filter Applied", 
      description: `Filtering reports for ${category === 'all' ? 'all categories' : category}...`,
    });
    
    // Simulate category filtering
    setTimeout(() => {
      const filteredReports = reportData.recentReports.filter(report => {
        if (category === 'all') return true;
        if (category === 'organic') return report.title.toLowerCase().includes('organic');
        if (category === 'pesticide') return report.title.toLowerCase().includes('pesticide');
        if (category === 'labeling') return report.title.toLowerCase().includes('label');
        if (category === 'traceability') return report.title.toLowerCase().includes('trace');
        return true;
      });
      
      setReportData(prev => ({
        ...prev,
        recentReports: filteredReports
      }));
      setIsLoading(false);
      toast({
        title: "Filter Applied",
        description: `Showing ${filteredReports.length} reports for ${category}`,
      });
    }, 1000);
  };


  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
            Compliance Reports
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">Comprehensive compliance monitoring and reporting</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="organic">Organic Certification</SelectItem>
                <SelectItem value="pesticide">Pesticide Usage</SelectItem>
                <SelectItem value="labeling">Product Labeling</SelectItem>
                <SelectItem value="traceability">Traceability</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="gap-2 w-full sm:w-auto" onClick={handleExport}>
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total Reports
            </CardDescription>
            <CardTitle className="text-2xl">{reportData.summary.totalReports}</CardTitle>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              +12% vs last month
            </div>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Violations Found
            </CardDescription>
            <CardTitle className="text-2xl text-red-600">{reportData.summary.violationsFound}</CardTitle>
            <div className="flex items-center gap-1 text-xs text-red-600">
              <TrendingUp className="h-3 w-3" />
              +18% vs last month
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              Pending Reviews
            </CardDescription>
            <CardTitle className="text-2xl text-yellow-600">{reportData.summary.pendingReviews}</CardTitle>
            <div className="flex items-center gap-1 text-xs text-yellow-600">
              <TrendingDown className="h-3 w-3" />
              -25% vs last week
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Compliance Rate
            </CardDescription>
            <CardTitle className="text-2xl text-green-600">{reportData.summary.complianceRate}%</CardTitle>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              +3.2% vs last month
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Avg Response Time
            </CardDescription>
            <CardTitle className="text-xl">{reportData.summary.avgResponseTime}</CardTitle>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingDown className="h-3 w-3" />
              -0.8 days improved
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Critical Issues
            </CardDescription>
            <CardTitle className="text-2xl text-red-600">{reportData.summary.criticalIssues}</CardTitle>
            <div className="flex items-center gap-1 text-xs text-red-600">
              <TrendingUp className="h-3 w-3" />
              +2 from last week
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Compliance Reports</CardTitle>
          <CardDescription>Latest inspection reports and their findings</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading reports...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {reportData.recentReports.map((report) => (
              <div key={report.id} className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-3 sm:p-4 border rounded-lg hover:bg-accent/50 transition-colors gap-3 lg:gap-4">
                <div className="flex-1 space-y-2 lg:space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">{report.id}</Badge>
                    <Badge variant={report.status === 'Completed' ? 'secondary' : report.status === 'In Progress' ? 'default' : 'outline'}>
                      {report.status}
                    </Badge>
                    <Badge variant={report.severity === 'High' ? 'destructive' : report.severity === 'Medium' ? 'default' : 'secondary'}>
                      {report.severity}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm sm:text-base break-words">{report.title}</h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <span>{report.type}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{report.date}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className={`font-medium ${report.violations > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {report.violations} violations
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className={`font-medium ${report.complianceScore >= 90 ? 'text-green-600' : report.complianceScore >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {report.complianceScore}% compliance
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleDownloadReport(report.id, report.title)} className="w-full sm:w-auto">
                    <Download className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Download</span>
                    <span className="sm:hidden">Download</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(report.id)} className="w-full sm:w-auto">
                    <span className="hidden sm:inline">View Details</span>
                    <span className="sm:hidden">Details</span>
                  </Button>
                </div>
              </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Reporting Trends</CardTitle>
          <CardDescription>Monthly compliance reporting and violation trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="grid grid-cols-6 gap-2 sm:gap-4 min-w-[400px]">
              {reportData.trends.monthlyReports.map((month, index) => (
                <div key={month.month} className="text-center">
                  <div className="relative mb-2">
                    <div className="h-16 sm:h-24 flex items-end justify-center">
                      <div 
                        className="w-6 sm:w-8 bg-primary rounded-t" 
                        style={{ height: `${(month.reports / 25) * 100}%` }}
                      ></div>
                    </div>
                    <div className="h-12 sm:h-16 flex items-end justify-center mt-1">
                      <div 
                        className="w-4 sm:w-6 bg-red-500 rounded-t" 
                        style={{ height: `${(month.violations / 6) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs font-medium">{month.month}</p>
                  <p className="text-xs text-muted-foreground">{month.reports}R / {month.violations}V</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span>Reports</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Violations</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};