import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Shield,
  Users,
  MapPin,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const RegulatoryAnalytics: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const handleRefresh = () => {
    toast({
      title: "Refreshing Analytics",
      description: "Loading latest regulatory analytics data...",
    });
  };

  const handleExport = () => {
    toast({
      title: "Exporting Analytics",
      description: `Generating analytics report for ${selectedTimeframe} timeframe. Download will start shortly.`,
    });
    // Simulate export
    setTimeout(() => {
      const data = `Regulatory Analytics Export - ${new Date().toLocaleDateString()}\nTimeframe: ${selectedTimeframe}\nRegion: ${selectedRegion}\n\nTotal Entities: 3,847\nCompliance Rate: 89.3%\nActive Inspections: 156`;
      const link = document.createElement('a');
      link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(data);
      link.download = `regulatory-analytics-${selectedTimeframe}-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    }, 2000);
  };

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
    toast({
      title: "Timeframe Updated",
      description: `Showing analytics for ${timeframe} period`,
    });
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    toast({
      title: "Region Filter Applied",
      description: `Filtering analytics for ${region === 'all' ? 'all regions' : region}`,
    });
  };

  const analyticsData = {
    overview: {
      totalEntities: 3847,
      activeInspections: 156,
      complianceRate: 89.3,
      avgResponseTime: 2.8,
      criticalViolations: 12,
      improvementRate: 15.2
    },
    complianceByCategory: [
      { category: 'Organic Certification', compliance: 92.5, total: 1245, violations: 93 },
      { category: 'Pesticide Usage', compliance: 87.2, total: 2156, violations: 276 },
      { category: 'Labeling Standards', compliance: 94.1, total: 3201, violations: 189 },
      { category: 'Traceability Systems', compliance: 85.7, total: 1876, violations: 268 },
      { category: 'Storage & Handling', compliance: 91.3, total: 2543, violations: 221 },
      { category: 'Documentation', compliance: 88.9, total: 3102, violations: 344 }
    ],
    regionalData: [
      { region: 'North India', entities: 1247, compliance: 91.2, violations: 89, inspections: 45 },
      { region: 'South India', entities: 986, compliance: 88.7, violations: 112, inspections: 38 },
      { region: 'West India', entities: 823, compliance: 87.1, violations: 106, inspections: 32 },
      { region: 'East India', entities: 691, compliance: 90.5, violations: 66, inspections: 28 },
      { region: 'Central India', entities: 445, compliance: 86.3, violations: 61, inspections: 18 }
    ],
    trendsData: {
      monthly: [
        { month: 'Jul', compliance: 86.2, violations: 45, inspections: 23 },
        { month: 'Aug', compliance: 87.1, violations: 42, inspections: 28 },
        { month: 'Sep', compliance: 88.3, violations: 38, inspections: 31 },
        { month: 'Oct', compliance: 87.9, violations: 41, inspections: 26 },
        { month: 'Nov', compliance: 89.1, violations: 35, inspections: 29 },
        { month: 'Dec', compliance: 89.3, violations: 32, inspections: 33 }
      ]
    },
    violationTypes: [
      { type: 'Improper Pesticide Use', count: 89, severity: 'High', trend: '+12%' },
      { type: 'Missing Documentation', count: 76, severity: 'Medium', trend: '-8%' },
      { type: 'Labeling Inaccuracy', count: 65, severity: 'Medium', trend: '+5%' },
      { type: 'Certification Fraud', count: 23, severity: 'Critical', trend: '+15%' },
      { type: 'Storage Violations', count: 45, severity: 'Medium', trend: '-3%' },
      { type: 'Traceability Gaps', count: 38, severity: 'High', trend: '+7%' }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
            Regulatory Analytics
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">Comprehensive compliance analytics and insights</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Select value={selectedTimeframe} onValueChange={handleTimeframeChange}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
              <SelectItem value="2years">2 Years</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedRegion} onValueChange={handleRegionChange}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="north">North India</SelectItem>
              <SelectItem value="south">South India</SelectItem>
              <SelectItem value="west">West India</SelectItem>
              <SelectItem value="east">East India</SelectItem>
              <SelectItem value="central">Central India</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} className="flex-1 sm:flex-none">
              <RefreshCw className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Refresh</span>
              <span className="sm:hidden">Refresh</span>
            </Button>
            <Button size="sm" onClick={handleExport} className="flex-1 sm:flex-none">
              <Download className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Entities
            </CardDescription>
            <CardTitle className="text-2xl">{analyticsData.overview.totalEntities.toLocaleString()}</CardTitle>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              +156 this month
            </div>
          </CardHeader>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              Active Inspections
            </CardDescription>
            <CardTitle className="text-2xl text-blue-600">{analyticsData.overview.activeInspections}</CardTitle>
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <TrendingUp className="h-3 w-3" />
              +23 this week
            </div>
          </CardHeader>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Compliance Rate
            </CardDescription>
            <CardTitle className="text-2xl text-green-600">{analyticsData.overview.complianceRate}%</CardTitle>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              +1.2% vs last month
            </div>
          </CardHeader>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Avg Response Time
            </CardDescription>
            <CardTitle className="text-2xl">{analyticsData.overview.avgResponseTime} days</CardTitle>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingDown className="h-3 w-3" />
              -0.3 days improved
            </div>
          </CardHeader>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Critical Violations
            </CardDescription>
            <CardTitle className="text-2xl text-red-600">{analyticsData.overview.criticalViolations}</CardTitle>
            <div className="flex items-center gap-1 text-xs text-red-600">
              <TrendingUp className="h-3 w-3" />
              +3 from last week
            </div>
          </CardHeader>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Improvement Rate
            </CardDescription>
            <CardTitle className="text-2xl text-green-600">{analyticsData.overview.improvementRate}%</CardTitle>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              +2.1% vs last quarter
            </div>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="compliance" className="space-y-6">
        <div className="overflow-x-auto scrollbar-hide">
          <TabsList className="grid w-full grid-cols-4 min-w-[320px]">
            <TabsTrigger value="compliance" className="text-xs sm:text-sm px-2 sm:px-3">
              <span className="hidden sm:inline">Compliance by Category</span>
              <span className="sm:hidden">Compliance</span>
            </TabsTrigger>
            <TabsTrigger value="regional" className="text-xs sm:text-sm px-2 sm:px-3">
              <span className="hidden sm:inline">Regional Analysis</span>
              <span className="sm:hidden">Regional</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="text-xs sm:text-sm px-2 sm:px-3">
              <span className="hidden sm:inline">Trends & Patterns</span>
              <span className="sm:hidden">Trends</span>
            </TabsTrigger>
            <TabsTrigger value="violations" className="text-xs sm:text-sm px-2 sm:px-3">
              <span className="hidden sm:inline">Violation Types</span>
              <span className="sm:hidden">Violations</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Rate by Category</CardTitle>
              <CardDescription>Performance across different compliance categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.complianceByCategory.map((category, index) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <h4 className="font-medium text-sm sm:text-base">{category.category}</h4>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                        <span className="text-muted-foreground">{category.total} entities</span>
                        <span className="text-red-600">{category.violations} violations</span>
                        <Badge variant={category.compliance >= 90 ? 'secondary' : category.compliance >= 80 ? 'default' : 'destructive'}>
                          {category.compliance}%
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${category.compliance >= 90 ? 'bg-green-500' : category.compliance >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${category.compliance}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regional">
          <Card>
            <CardHeader>
              <CardTitle>Regional Compliance Analysis</CardTitle>
              <CardDescription>Compliance metrics across different regions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {analyticsData.regionalData.map((region) => (
                  <div key={region.region} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base">{region.region}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">{region.entities} registered entities</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:gap-6 text-xs sm:text-sm">
                      <div className="text-center">
                        <p className="font-medium text-green-600">{region.compliance}%</p>
                        <p className="text-xs text-muted-foreground">Compliance</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-red-600">{region.violations}</p>
                        <p className="text-xs text-muted-foreground">Violations</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-blue-600">{region.inspections}</p>
                        <p className="text-xs text-muted-foreground">Inspections</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Trends</CardTitle>
              <CardDescription>Monthly compliance rate and violation trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Chart visualization */}
                <div className="overflow-x-auto scrollbar-hide">
                  <div className="grid grid-cols-6 gap-2 sm:gap-4 p-3 sm:p-4 border rounded-lg min-w-[400px]">
                    {analyticsData.trendsData.monthly.map((month, index) => (
                      <div key={month.month} className="text-center">
                        <div className="relative mb-3 sm:mb-4">
                          <div className="h-20 sm:h-32 flex items-end justify-center">
                            <div 
                              className="w-6 sm:w-8 bg-green-500 rounded-t" 
                              style={{ height: `${(month.compliance / 100) * (window.innerWidth < 640 ? 80 : 128)}px` }}
                            ></div>
                          </div>
                          <div className="absolute bottom-0 right-0 h-12 sm:h-20 flex items-end">
                            <div 
                              className="w-3 sm:w-4 bg-red-500 rounded-t" 
                              style={{ height: `${(month.violations / 50) * (window.innerWidth < 640 ? 48 : 80)}px` }}
                            ></div>
                          </div>
                        </div>
                        <p className="text-xs font-medium">{month.month}</p>
                        <p className="text-xs text-green-600">{month.compliance}%</p>
                        <p className="text-xs text-red-600">{month.violations}V</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Legend */}
                <div className="flex justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Compliance Rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Violations</span>
                  </div>
                </div>

                {/* Key Insights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        Best Month
                      </CardTitle>
                      <p className="text-2xl font-bold text-green-600">Nov 2024</p>
                      <p className="text-xs text-muted-foreground">89.1% compliance rate</p>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-500" />
                        Most Violations
                      </CardTitle>
                      <p className="text-2xl font-bold text-red-600">Jul 2024</p>
                      <p className="text-xs text-muted-foreground">45 total violations</p>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        Avg Improvement
                      </CardTitle>
                      <p className="text-2xl font-bold text-blue-600">+0.5%</p>
                      <p className="text-xs text-muted-foreground">monthly compliance growth</p>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="violations">
          <Card>
            <CardHeader>
              <CardTitle>Violation Types Analysis</CardTitle>
              <CardDescription>Most common violation types and their trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.violationTypes.map((violation, index) => (
                  <div key={violation.type} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg hover:bg-accent/50 transition-colors gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                      <div className="text-center">
                        <p className="text-xl sm:text-2xl font-bold">{index + 1}</p>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm sm:text-base break-words">{violation.type}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <Badge variant={violation.severity === 'Critical' ? 'destructive' : violation.severity === 'High' ? 'default' : 'secondary'}>
                            {violation.severity}
                          </Badge>
                          <span className={`text-xs sm:text-sm font-medium ${violation.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'}`}>
                            {violation.trend} vs last period
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xl sm:text-2xl font-bold">{violation.count}</p>
                      <p className="text-xs text-muted-foreground">total cases</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};