import React from 'react';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md', 
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl'
};

export const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  className,
  maxWidth = '7xl'
}) => {
  return (
    <div className={cn("min-h-screen bg-background p-3 sm:p-4 md:p-6", className)}>
      <div className={cn("mx-auto space-y-4 sm:space-y-6", maxWidthClasses[maxWidth])}>
        {children}
      </div>
    </div>
  );
};

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title, 
  subtitle, 
  className 
}) => {
  return (
    <div className={cn("mb-4 sm:mb-6 md:mb-8", className)}>
      <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2 leading-tight">{title}</h1>
      <p className="text-sm sm:text-base text-muted-foreground">{subtitle}</p>
    </div>
  );
};

// Mobile-optimized responsive grid component
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string;
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  cols = { default: 1, sm: 2, md: 3, lg: 4 },
  gap = "gap-4",
  className
}) => {
  const gridClasses = cn(
    "grid",
    gap,
    {
      [`grid-cols-${cols.default}`]: cols.default,
      [`sm:grid-cols-${cols.sm}`]: cols.sm,
      [`md:grid-cols-${cols.md}`]: cols.md,
      [`lg:grid-cols-${cols.lg}`]: cols.lg,
      [`xl:grid-cols-${cols.xl}`]: cols.xl,
    },
    className
  );

  return <div className={gridClasses}>{children}</div>;
};

// Mobile-optimized form layout
interface MobileFormLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileFormLayout: React.FC<MobileFormLayoutProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn("space-y-4 sm:space-y-6", className)}>
      {children}
    </div>
  );
};

// Responsive tab layout with collapsible tabs on mobile
interface ResponsiveTabsProps {
  tabs: Array<{ value: string; label: string; icon?: React.ReactNode }>;
  children: React.ReactNode;
  defaultValue: string;
  className?: string;
}

export const ResponsiveTabs: React.FC<ResponsiveTabsProps> = ({
  tabs,
  children,
  defaultValue,
  className
}) => {
  return (
    <div className={cn("space-y-4 sm:space-y-6", className)}>
      <div className="overflow-x-auto scrollbar-hide">
        <div className={`grid grid-cols-${Math.min(tabs.length, 3)} sm:grid-cols-${Math.min(tabs.length, 4)} gap-2 min-w-fit`}>
          {/* TabsList content would go here */}
        </div>
      </div>
      {children}
    </div>
  );
};

interface AuthLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  showLanguageSelector?: boolean;
  className?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  showBackButton = true,
  showLanguageSelector = true,
  className 
}) => {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-3 sm:p-4",
      className
    )}>
      {showBackButton && (
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10">
          {/* Back button would be rendered here */}
        </div>
      )}
      
      {showLanguageSelector && (
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10">
          {/* Language selector would be rendered here */}
        </div>
      )}
      
      <div className="w-full max-w-md mx-3 sm:mx-4 mt-16 lg:mt-0">
        {children}
      </div>
    </div>
  );
};