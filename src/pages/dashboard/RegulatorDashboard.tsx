import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, CheckCircle, BarChart3, Download } from 'lucide-react';
import { ComplianceReports } from '@/components/ComplianceReports';
import { RegulatoryAnalytics } from '@/components/RegulatoryAnalytics';

const RegulatorDashboard = () => {
  const { t } = useTranslation();

  console.log('RegulatorDashboard component rendered');

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">{t('regulatorPortal')}</h1>
          <p className="text-muted-foreground">
            Monitor compliance, review violations, and ensure regulatory standards
          </p>
        </div>

        <Tabs defaultValue="compliance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {t('complianceDashboard')}
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              {t('complianceReports')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compliance">
            <div className="grid gap-6">
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-red-500">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Active Violations
                    </CardDescription>
                    <CardTitle className="text-3xl text-red-600">7</CardTitle>
                    <p className="text-xs text-muted-foreground">+2 from last month</p>
                  </CardHeader>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Compliance Rate
                    </CardDescription>
                    <CardTitle className="text-3xl text-green-600">94.2%</CardTitle>
                    <p className="text-xs text-muted-foreground">-2.6% from last month</p>
                  </CardHeader>
                </Card>
                <Card className="border-l-4 border-l-yellow-500">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-yellow-500" />
                      Pending Reviews
                    </CardDescription>
                    <CardTitle className="text-3xl text-yellow-600">18</CardTitle>
                    <p className="text-xs text-muted-foreground">+6 from last week</p>
                  </CardHeader>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                      Total Audits
                    </CardDescription>
                    <CardTitle className="text-3xl text-blue-600">1,247</CardTitle>
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
                    {[
                      { id: 'V-2024-001', entity: 'GreenHarvest Farms Pvt Ltd', type: 'Pesticide Usage', severity: 'High', date: '2024-01-15', status: 'Active' },
                      { id: 'V-2024-002', entity: 'Organic Valley Co.', type: 'Certification Fraud', severity: 'Critical', date: '2024-01-14', status: 'Under Review' },
                      { id: 'V-2024-003', entity: 'Fresh Foods Ltd', type: 'Labeling Mismatch', severity: 'Medium', date: '2024-01-13', status: 'Active' },
                      { id: 'V-2024-004', entity: 'Nature\'s Best Inc', type: 'Traceability Gap', severity: 'High', date: '2024-01-12', status: 'Resolved' },
                    ].map((violation) => (
                      <div key={violation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="font-mono text-xs">{violation.id}</Badge>
                            <Badge variant={violation.severity === 'Critical' ? 'destructive' : violation.severity === 'High' ? 'default' : 'secondary'}>
                              {violation.severity}
                            </Badge>
                            <Badge variant={violation.status === 'Active' ? 'destructive' : violation.status === 'Under Review' ? 'default' : 'secondary'}>
                              {violation.status}
                            </Badge>
                          </div>
                          <h4 className="font-semibold mt-2">{violation.entity}</h4>
                          <p className="text-sm text-muted-foreground">{violation.type} • {violation.date}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Shield className="h-5 w-5" />
                      Schedule Inspection
                    </CardTitle>
                    <CardDescription>Plan new compliance inspections</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Download className="h-5 w-5" />
                      Generate Report
                    </CardTitle>
                    <CardDescription>Create compliance summary reports</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <AlertTriangle className="h-5 w-5" />
                      Issue Alert
                    </CardTitle>
                    <CardDescription>Send compliance alerts to entities</CardDescription>
                  </CardHeader>
                </Card>
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