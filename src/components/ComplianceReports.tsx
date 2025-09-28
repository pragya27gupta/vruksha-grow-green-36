import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Calendar, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export const ComplianceReports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const reportData = {
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
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Compliance Reports
          </h2>
          <p className="text-muted-foreground">Comprehensive compliance monitoring and reporting</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
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
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
          <div className="space-y-4">
            {reportData.recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="font-mono text-xs">{report.id}</Badge>
                    <Badge variant={report.status === 'Completed' ? 'secondary' : report.status === 'In Progress' ? 'default' : 'outline'}>
                      {report.status}
                    </Badge>
                    <Badge variant={report.severity === 'High' ? 'destructive' : report.severity === 'Medium' ? 'default' : 'secondary'}>
                      {report.severity}
                    </Badge>
                  </div>
                  <h4 className="font-semibold">{report.title}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{report.type}</span>
                    <span>•</span>
                    <span>{report.date}</span>
                    <span>•</span>
                    <span className={`font-medium ${report.violations > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {report.violations} violations
                    </span>
                    <span>•</span>
                    <span className={`font-medium ${report.complianceScore >= 90 ? 'text-green-600' : report.complianceScore >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {report.complianceScore}% compliance
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Reporting Trends</CardTitle>
          <CardDescription>Monthly compliance reporting and violation trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-4">
            {reportData.trends.monthlyReports.map((month, index) => (
              <div key={month.month} className="text-center">
                <div className="relative mb-2">
                  <div className="h-24 flex items-end justify-center">
                    <div 
                      className="w-8 bg-primary rounded-t" 
                      style={{ height: `${(month.reports / 25) * 100}%` }}
                    ></div>
                  </div>
                  <div className="h-16 flex items-end justify-center mt-1">
                    <div 
                      className="w-6 bg-red-500 rounded-t" 
                      style={{ height: `${(month.violations / 6) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-xs font-medium">{month.month}</p>
                <p className="text-xs text-muted-foreground">{month.reports}R / {month.violations}V</p>
              </div>
            ))}
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